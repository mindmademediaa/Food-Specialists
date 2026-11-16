import { useEffect, useState } from 'react';
import { PaymentGatewayConfig } from '../types/hub';

export interface GeoCurrencyState {
  countryCode: string;
  countryName: string;
  currencyCode: string;
  usdToLocalRate: number;
  usdToPkrRate: number;
  isPakistan: boolean;
  isInternational: boolean;
  detectionSource: 'ip' | 'timezone' | 'locale' | 'cache';
  isResolved: boolean;
}

const GEO_CACHE_KEY = 'fsp_geo_location_v1';
const RATES_CACHE_KEY = 'fsp_usd_rates_v1';
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// Comprehensive fallback USD exchange rates (used immediately & if offline/blocked)
export const FALLBACK_USD_RATES: Record<string, number> = {
  USD: 1,
  PKR: 278.5,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.6725,
  SAR: 3.75,
  QAR: 3.64,
  KWD: 0.307,
  OMR: 0.385,
  BHD: 0.376,
  INR: 85.5,
  CAD: 1.39,
  AUD: 1.54,
  NZD: 1.68,
  SGD: 1.34,
  MYR: 4.45,
  TRY: 34.5,
  EGP: 49.5,
  BDT: 119.5,
  IDR: 15800,
  NGN: 1650,
  ZAR: 18.1,
  JPY: 154,
  CNY: 7.24,
  KRW: 1390,
  CHF: 0.88,
  SEK: 10.6,
  NOK: 10.9,
  DKK: 6.88,
  PLN: 4.02,
  BRL: 5.75,
  MXN: 20.1,
  PHP: 58.2,
  LKR: 293,
  NPR: 136.8,
  KES: 129,
  GHS: 16.0,
  MAD: 9.9,
  JOD: 0.709,
  IQD: 1310,
  THB: 34.2,
  VND: 25300,
  HKD: 7.78,
  TWD: 32.3,
  RUB: 98.0,
  UAH: 41.3
};

// Country ISO 3166-1 alpha-2 -> Currency ISO 4217
export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  PK: 'PKR',
  US: 'USD',
  GB: 'GBP',
  UK: 'GBP',
  AE: 'AED',
  SA: 'SAR',
  QA: 'QAR',
  KW: 'KWD',
  OM: 'OMR',
  BH: 'BHD',
  IN: 'INR',
  CA: 'CAD',
  AU: 'AUD',
  NZ: 'NZD',
  SG: 'SGD',
  MY: 'MYR',
  TR: 'TRY',
  EG: 'EGP',
  BD: 'BDT',
  ID: 'IDR',
  NG: 'NGN',
  ZA: 'ZAR',
  JP: 'JPY',
  CN: 'CNY',
  KR: 'KRW',
  CH: 'CHF',
  SE: 'SEK',
  NO: 'NOK',
  DK: 'DKK',
  PL: 'PLN',
  BR: 'BRL',
  MX: 'MXN',
  PH: 'PHP',
  LK: 'LKR',
  NP: 'NPR',
  KE: 'KES',
  GH: 'GHS',
  MA: 'MAD',
  JO: 'JOD',
  IQ: 'IQD',
  TH: 'THB',
  VN: 'VND',
  HK: 'HKD',
  TW: 'TWD',
  RU: 'RUB',
  UA: 'UAH',
  // Eurozone
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  AT: 'EUR',
  IE: 'EUR',
  PT: 'EUR',
  FI: 'EUR',
  GR: 'EUR',
  LU: 'EUR',
  SK: 'EUR',
  SI: 'EUR',
  EE: 'EUR',
  LV: 'EUR',
  LT: 'EUR',
  MT: 'EUR',
  CY: 'EUR',
  HR: 'EUR'
};

const COUNTRY_NAMES: Record<string, string> = {
  PK: 'Pakistan',
  US: 'United States',
  GB: 'United Kingdom',
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia',
  QA: 'Qatar',
  KW: 'Kuwait',
  OM: 'Oman',
  BH: 'Bahrain',
  IN: 'India',
  CA: 'Canada',
  AU: 'Australia',
  NZ: 'New Zealand',
  SG: 'Singapore',
  MY: 'Malaysia',
  DE: 'Germany',
  FR: 'France',
  IT: 'Italy',
  ES: 'Spain',
  NL: 'Netherlands',
  TR: 'Turkey',
  EG: 'Egypt',
  BD: 'Bangladesh',
  ID: 'Indonesia',
  NG: 'Nigeria',
  ZA: 'South Africa',
  JP: 'Japan',
  CN: 'China',
  KR: 'South Korea',
  CH: 'Switzerland'
};

// Timezone -> Country Code hint for instant synchronous detection prior to IP fetch
const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  'Asia/Karachi': 'PK',
  'Asia/Dubai': 'AE',
  'Asia/Riyadh': 'SA',
  'Asia/Qatar': 'QA',
  'Asia/Kuwait': 'KW',
  'Asia/Muscat': 'OM',
  'Asia/Bahrain': 'BH',
  'Asia/Kolkata': 'IN',
  'Asia/Calcutta': 'IN',
  'Asia/Dhaka': 'BD',
  'Asia/Colombo': 'LK',
  'Asia/Kathmandu': 'NP',
  'Asia/Singapore': 'SG',
  'Asia/Kuala_Lumpur': 'MY',
  'Asia/Jakarta': 'ID',
  'Asia/Manila': 'PH',
  'Asia/Bangkok': 'TH',
  'Asia/Ho_Chi_Minh': 'VN',
  'Asia/Tokyo': 'JP',
  'Asia/Seoul': 'KR',
  'Asia/Shanghai': 'CN',
  'Asia/Hong_Kong': 'HK',
  'Asia/Taipei': 'TW',
  'Asia/Amman': 'JO',
  'Asia/Baghdad': 'IQ',
  'Europe/London': 'GB',
  'Europe/Berlin': 'DE',
  'Europe/Paris': 'FR',
  'Europe/Rome': 'IT',
  'Europe/Madrid': 'ES',
  'Europe/Amsterdam': 'NL',
  'Europe/Brussels': 'BE',
  'Europe/Vienna': 'AT',
  'Europe/Dublin': 'IE',
  'Europe/Lisbon': 'PT',
  'Europe/Zurich': 'CH',
  'Europe/Stockholm': 'SE',
  'Europe/Oslo': 'NO',
  'Europe/Copenhagen': 'DK',
  'Europe/Warsaw': 'PL',
  'Europe/Istanbul': 'TR',
  'Europe/Moscow': 'RU',
  'Europe/Kiev': 'UA',
  'Europe/Kyiv': 'UA',
  'Africa/Cairo': 'EG',
  'Africa/Lagos': 'NG',
  'Africa/Johannesburg': 'ZA',
  'Africa/Nairobi': 'KE',
  'Africa/Casablanca': 'MA',
  'Australia/Sydney': 'AU',
  'Australia/Melbourne': 'AU',
  'Australia/Brisbane': 'AU',
  'Australia/Perth': 'AU',
  'Pacific/Auckland': 'NZ',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'America/Edmonton': 'CA',
  'America/Montreal': 'CA',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Los_Angeles': 'US',
  'America/Phoenix': 'US',
  'America/Sao_Paulo': 'BR',
  'America/Mexico_City': 'MX'
};

const ZERO_DECIMAL_CURRENCIES = new Set([
  'PKR',
  'INR',
  'BDT',
  'IDR',
  'NGN',
  'JPY',
  'KRW',
  'VND',
  'LKR',
  'NPR',
  'KES',
  'IQD',
  'PHP',
  'EGP',
  'TRY',
  'TWD',
  'RUB'
]);

const CURRENCY_SYMBOL_OVERRIDES: Record<string, string> = {
  USD: '$',
  GBP: '£',
  EUR: '€',
  INR: '₹',
  JPY: '¥',
  CNY: '¥',
  KRW: '₩',
  TRY: '₺',
  NGN: '₦',
  PHP: '₱',
  THB: '฿',
  VND: '₫',
  PKR: 'Rs.'
};

function detectTimezoneHint(): { countryCode: string; source: 'timezone' | 'locale' } {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TIMEZONE_TO_COUNTRY[tz]) {
      return { countryCode: TIMEZONE_TO_COUNTRY[tz], source: 'timezone' };
    }
    if (tz) {
      if (tz.startsWith('America/')) return { countryCode: 'US', source: 'timezone' };
      if (tz.startsWith('Australia/')) return { countryCode: 'AU', source: 'timezone' };
      if (tz.startsWith('Europe/')) return { countryCode: 'DE', source: 'timezone' };
    }
  } catch {}

  try {
    const lang = (navigator.language || '').toUpperCase();
    const parts = lang.split('-');
    if (parts.length >= 2 && COUNTRY_TO_CURRENCY[parts[1]]) {
      return { countryCode: parts[1], source: 'locale' };
    }
  } catch {}

  // Default fallback if nothing detected yet
  return { countryCode: 'PK', source: 'locale' };
}

function readCachedRates(): Record<string, number> {
  try {
    const raw = localStorage.getItem(RATES_CACHE_KEY);
    if (!raw) return { ...FALLBACK_USD_RATES };
    const parsed = JSON.parse(raw) as { ts?: number; rates?: Record<string, number> };
    if (parsed?.rates && parsed.ts && Date.now() - parsed.ts < CACHE_TTL_MS) {
      return { ...FALLBACK_USD_RATES, ...parsed.rates };
    }
  } catch {}
  return { ...FALLBACK_USD_RATES };
}

function readCachedGeo(): {
  countryCode: string;
  countryName: string;
  currencyCode: string;
} | null {
  try {
    const raw = localStorage.getItem(GEO_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      ts?: number;
      countryCode?: string;
      countryName?: string;
      currencyCode?: string;
    };
    if (parsed?.countryCode && parsed.ts && Date.now() - parsed.ts < CACHE_TTL_MS) {
      const cc = parsed.countryCode.toUpperCase();
      return {
        countryCode: cc,
        countryName: parsed.countryName || COUNTRY_NAMES[cc] || cc,
        currencyCode:
          (parsed.currencyCode || COUNTRY_TO_CURRENCY[cc] || 'USD').toUpperCase()
      };
    }
  } catch {}
  return null;
}

function buildGeoState(
  countryCode: string,
  countryName: string,
  currencyCode: string,
  rates: Record<string, number>,
  detectionSource: GeoCurrencyState['detectionSource'],
  isResolved: boolean
): GeoCurrencyState {
  const cc = (countryCode || 'PK').toUpperCase();
  const isPakistan = cc === 'PK';
  const cur = isPakistan
    ? 'PKR'
    : (currencyCode || COUNTRY_TO_CURRENCY[cc] || 'USD').toUpperCase();
  const effectiveRate = rates[cur] || FALLBACK_USD_RATES[cur] || 1;
  const effectiveCurrency = rates[cur] || FALLBACK_USD_RATES[cur] ? cur : 'USD';
  const pkrRate = rates.PKR || FALLBACK_USD_RATES.PKR;

  return {
    countryCode: cc,
    countryName: countryName || COUNTRY_NAMES[cc] || cc,
    currencyCode: effectiveCurrency,
    usdToLocalRate: effectiveCurrency === 'USD' ? 1 : effectiveRate,
    usdToPkrRate: pkrRate,
    isPakistan,
    isInternational: !isPakistan,
    detectionSource,
    isResolved
  };
}

// Module-level singleton state & subscribers so all components share one fast geolocation lookup
let ratesMap: Record<string, number> = readCachedRates();
let currentGeoState: GeoCurrencyState = (() => {
  const cached = readCachedGeo();
  if (cached) {
    return buildGeoState(
      cached.countryCode,
      cached.countryName,
      cached.currencyCode,
      ratesMap,
      'cache',
      true
    );
  }
  const hint = detectTimezoneHint();
  const cur = COUNTRY_TO_CURRENCY[hint.countryCode] || 'USD';
  return buildGeoState(
    hint.countryCode,
    COUNTRY_NAMES[hint.countryCode] || hint.countryCode,
    cur,
    ratesMap,
    hint.source,
    false
  );
})();

const listeners = new Set<(state: GeoCurrencyState) => void>();
let initStarted = false;

function emitGeoState(next: GeoCurrencyState) {
  currentGeoState = next;
  listeners.forEach((cb) => cb(next));
}

async function fetchWithTimeout(url: string, ms = 4500): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function initializeGeoAndRates() {
  if (initStarted || typeof window === 'undefined') return;
  initStarted = true;

  // 1. Fetch live USD rates if not freshly cached
  const ratesPromise = (async () => {
    try {
      const cachedRaw = localStorage.getItem(RATES_CACHE_KEY);
      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw) as { ts?: number; rates?: Record<string, number> };
        if (parsed?.ts && Date.now() - parsed.ts < CACHE_TTL_MS && parsed.rates) {
          return;
        }
      }
      const res = await fetchWithTimeout('https://open.er-api.com/v6/latest/USD', 5000);
      if (res.ok) {
        const data = (await res.json()) as {
          result?: string;
          rates?: Record<string, number>;
        };
        if (data?.rates && typeof data.rates.PKR === 'number') {
          ratesMap = { ...FALLBACK_USD_RATES, ...data.rates };
          try {
            localStorage.setItem(
              RATES_CACHE_KEY,
              JSON.stringify({ ts: Date.now(), rates: data.rates })
            );
          } catch {}
          emitGeoState(
            buildGeoState(
              currentGeoState.countryCode,
              currentGeoState.countryName,
              currentGeoState.currencyCode,
              ratesMap,
              currentGeoState.detectionSource,
              currentGeoState.isResolved
            )
          );
        }
      }
    } catch {}
  })();

  // 2. Detect visitor's IP country automatically (even if timezone matched, verify via IP once per 12h)
  const geoPromise = (async () => {
    try {
      const cached = readCachedGeo();
      if (cached) {
        emitGeoState(
          buildGeoState(
            cached.countryCode,
            cached.countryName,
            cached.currencyCode,
            ratesMap,
            'cache',
            true
          )
        );
        return;
      }

      // Primary: ipwho.is (HTTPS, CORS-enabled, free, returns country_code + currency.code)
      let detectedCode = '';
      let detectedName = '';
      let detectedCurrency = '';

      try {
        const res1 = await fetchWithTimeout('https://ipwho.is/', 4500);
        if (res1.ok) {
          const d1 = (await res1.json()) as {
            success?: boolean;
            country_code?: string;
            country?: string;
            currency?: { code?: string };
          };
          if (d1?.success !== false && d1?.country_code) {
            detectedCode = d1.country_code.toUpperCase();
            detectedName = d1.country || COUNTRY_NAMES[detectedCode] || detectedCode;
            detectedCurrency = (
              d1.currency?.code ||
              COUNTRY_TO_CURRENCY[detectedCode] ||
              'USD'
            ).toUpperCase();
          }
        }
      } catch {}

      // Secondary fallback: ipapi.co
      if (!detectedCode) {
        try {
          const res2 = await fetchWithTimeout('https://ipapi.co/json/', 4500);
          if (res2.ok) {
            const d2 = (await res2.json()) as {
              country_code?: string;
              country_name?: string;
              currency?: string;
            };
            if (d2?.country_code) {
              detectedCode = d2.country_code.toUpperCase();
              detectedName = d2.country_name || COUNTRY_NAMES[detectedCode] || detectedCode;
              detectedCurrency = (
                d2.currency ||
                COUNTRY_TO_CURRENCY[detectedCode] ||
                'USD'
              ).toUpperCase();
            }
          }
        } catch {}
      }

      if (detectedCode) {
        try {
          localStorage.setItem(
            GEO_CACHE_KEY,
            JSON.stringify({
              ts: Date.now(),
              countryCode: detectedCode,
              countryName: detectedName,
              currencyCode: detectedCurrency
            })
          );
        } catch {}
        emitGeoState(
          buildGeoState(
            detectedCode,
            detectedName,
            detectedCurrency,
            ratesMap,
            'ip',
            true
          )
        );
      } else {
        // Keep timezone/locale detection and mark resolved
        emitGeoState({ ...currentGeoState, isResolved: true });
      }
    } catch {
      emitGeoState({ ...currentGeoState, isResolved: true });
    }
  })();

  await Promise.allSettled([ratesPromise, geoPromise]);
}

export function useGeoCurrency(): GeoCurrencyState {
  const [geo, setGeo] = useState<GeoCurrencyState>(currentGeoState);

  useEffect(() => {
    listeners.add(setGeo);
    // Sync immediately in case another mount updated state
    setGeo(currentGeoState);
    void initializeGeoAndRates();
    return () => {
      listeners.delete(setGeo);
    };
  }, []);

  return geo;
}

export function convertUsdToLocalAmount(
  usdAmount: number,
  geo: GeoCurrencyState
): number {
  const raw = usdAmount * (geo.usdToLocalRate || 1);
  if (ZERO_DECIMAL_CURRENCIES.has(geo.currencyCode)) {
    return Math.round(raw);
  }
  return Number(raw.toFixed(2));
}

export function formatAmountInCurrency(
  amount: number,
  currencyCode: string
): string {
  const code = (currencyCode || 'USD').toUpperCase();
  if (code === 'PKR') {
    return `Rs. ${Math.round(amount).toLocaleString()}`;
  }
  const isZeroDec = ZERO_DECIMAL_CURRENCIES.has(code);
  const rounded = isZeroDec ? Math.round(amount) : Number(amount.toFixed(2));
  const hasFraction = !isZeroDec && Math.abs(rounded - Math.round(rounded)) > 0.001;

  const formattedNum = rounded.toLocaleString('en-US', {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0
  });

  const sym = CURRENCY_SYMBOL_OVERRIDES[code];
  if (sym) {
    return `${sym}${formattedNum}`;
  }
  return `${code} ${formattedNum}`;
}

export function formatUsdClean(usdAmount: number): string {
  const rounded = Number(usdAmount.toFixed(2));
  const hasFraction = Math.abs(rounded - Math.round(rounded)) > 0.001;
  return `$${rounded.toLocaleString('en-US', {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0
  })}`;
}

export function formatUsdConverted(
  usdAmount: number,
  geo: GeoCurrencyState
): {
  localFormatted: string;
  usdFormatted: string;
  localWithUsdHint: string;
  localNumeric: number;
} {
  const localNumeric = convertUsdToLocalAmount(usdAmount, geo);
  const localFormatted = formatAmountInCurrency(localNumeric, geo.currencyCode);
  const usdFormatted = `${formatUsdClean(usdAmount)} USD`;
  const localWithUsdHint =
    geo.currencyCode === 'USD'
      ? formatUsdClean(usdAmount)
      : `${localFormatted} (${formatUsdClean(usdAmount)} USD)`;
  return {
    localFormatted,
    usdFormatted,
    localWithUsdHint,
    localNumeric
  };
}

export interface LocalizedMembershipPricing {
  isPakistan: boolean;
  currencyCode: string;
  countryCode: string;
  countryName: string;
  monthlyFormatted: string;
  yearlyFormatted: string;
  yearlyBaseFormatted: string;
  yearlySavingsFormatted: string;
  discountPct: number;
  monthlyWithUsdHint: string;
  yearlyWithUsdHint: string;
  monthlySubmissionAmount: string;
  yearlySubmissionAmount: string;
  monthlyPlanLabel: string;
  yearlyPlanLabel: string;
  monthlyRs: number;
  yearlyRs: number;
  monthlyUsd: number;
  yearlyUsd: number;
}

export function getLocalizedMembershipPricing(
  gateway: Partial<PaymentGatewayConfig> | undefined,
  geo: GeoCurrencyState
): LocalizedMembershipPricing {
  const monthlyRs = Number(gateway?.monthlyFeeRs) || 100;
  const yearlyRs = Number(gateway?.yearlyFeeRs) || 900;
  const fullYearBaseRs = monthlyRs * 12;
  const pkrDiscountPct =
    fullYearBaseRs > 0
      ? Math.max(0, Math.round(((fullYearBaseRs - yearlyRs) / fullYearBaseRs) * 100))
      : 25;

  if (geo.isPakistan) {
    const savingsRs = Math.max(0, fullYearBaseRs - yearlyRs);
    const monthlyFormatted = `Rs. ${monthlyRs.toLocaleString()}`;
    const yearlyFormatted = `Rs. ${yearlyRs.toLocaleString()}`;
    return {
      isPakistan: true,
      currencyCode: 'PKR',
      countryCode: 'PK',
      countryName: 'Pakistan',
      monthlyFormatted,
      yearlyFormatted,
      yearlyBaseFormatted: `Rs. ${fullYearBaseRs.toLocaleString()}`,
      yearlySavingsFormatted: `Rs. ${savingsRs.toLocaleString()}`,
      discountPct: pkrDiscountPct,
      monthlyWithUsdHint: monthlyFormatted,
      yearlyWithUsdHint: yearlyFormatted,
      monthlySubmissionAmount: `${monthlyFormatted} (1 Month)`,
      yearlySubmissionAmount: `${yearlyFormatted} (1 Year - ${pkrDiscountPct}% OFF)`,
      monthlyPlanLabel: `1 Month (${monthlyFormatted})`,
      yearlyPlanLabel: `1 Year (${yearlyFormatted} - ${pkrDiscountPct}% OFF)`,
      monthlyRs,
      yearlyRs,
      monthlyUsd: Number((gateway?.monthlyFeeUsd) || 1),
      yearlyUsd: Number((gateway?.yearlyFeeUsd) || 9)
    };
  }

  // International pricing: $1 USD / month, 25% OFF on 12 months = $9 USD / year (from $12 USD)
  const monthlyUsd = Number(gateway?.monthlyFeeUsd) || 1;
  const yearlyBaseUsd = Number((monthlyUsd * 12).toFixed(2));
  const yearlyUsd =
    Number(gateway?.yearlyFeeUsd) || Number((yearlyBaseUsd * 0.75).toFixed(2));
  const yearlySavingsUsd = Math.max(
    0,
    Number((yearlyBaseUsd - yearlyUsd).toFixed(2))
  );
  const intlDiscountPct =
    yearlyBaseUsd > 0
      ? Math.max(0, Math.round(((yearlyBaseUsd - yearlyUsd) / yearlyBaseUsd) * 100))
      : 25;

  const mo = formatUsdConverted(monthlyUsd, geo);
  const yr = formatUsdConverted(yearlyUsd, geo);
  const yrBase = formatUsdConverted(yearlyBaseUsd, geo);
  const yrSave = formatUsdConverted(yearlySavingsUsd, geo);

  const monthlySubmissionAmount =
    geo.currencyCode === 'USD'
      ? `${mo.localFormatted} USD (1 Month)`
      : `${mo.localFormatted} (${formatUsdClean(monthlyUsd)} USD · 1 Mo)`.slice(0, 78);

  const yearlySubmissionAmount =
    geo.currencyCode === 'USD'
      ? `${yr.localFormatted} USD (1 Year - ${intlDiscountPct}% OFF)`
      : `${yr.localFormatted} (${formatUsdClean(yearlyUsd)} USD · 1 Yr)`.slice(0, 78);

  return {
    isPakistan: false,
    currencyCode: geo.currencyCode,
    countryCode: geo.countryCode,
    countryName: geo.countryName,
    monthlyFormatted: mo.localFormatted,
    yearlyFormatted: yr.localFormatted,
    yearlyBaseFormatted: yrBase.localFormatted,
    yearlySavingsFormatted: yrSave.localFormatted,
    discountPct: intlDiscountPct,
    monthlyWithUsdHint: mo.localWithUsdHint,
    yearlyWithUsdHint: yr.localWithUsdHint,
    monthlySubmissionAmount,
    yearlySubmissionAmount,
    monthlyPlanLabel: `1 Month (${mo.localWithUsdHint})`.slice(0, 78),
    yearlyPlanLabel: `1 Year (${yr.localWithUsdHint} - ${intlDiscountPct}% OFF)`.slice(0, 78),
    monthlyRs,
    yearlyRs,
    monthlyUsd,
    yearlyUsd
  };
}

export interface LocalizedCertificateFee {
  isPakistan: boolean;
  currencyCode: string;
  formatted: string;
  formattedWithUsdHint: string;
  numericRs: number;
  usdAmount: number;
  submissionAmount: string;
}

export function getLocalizedCertificateFee(
  courseFeeRs: number,
  gateway: Partial<PaymentGatewayConfig> | undefined,
  geo: GeoCurrencyState
): LocalizedCertificateFee {
  const safeRs = Number(courseFeeRs) || 1000;
  if (geo.isPakistan) {
    const formatted = `Rs. ${safeRs.toLocaleString()}`;
    return {
      isPakistan: true,
      currencyCode: 'PKR',
      formatted,
      formattedWithUsdHint: formatted,
      numericRs: safeRs,
      usdAmount: 0,
      submissionAmount: `${formatted} (Certificate Fee)`
    };
  }

  // International pricing: EVERY certificate is $5 USD base converted to visitor's currency
  const certUsd = Number(gateway?.certificateFeeUsd) || 5;
  const conv = formatUsdConverted(certUsd, geo);
  const submissionAmount =
    geo.currencyCode === 'USD'
      ? `${conv.localFormatted} USD (Certificate Fee)`
      : `${conv.localFormatted} (${formatUsdClean(certUsd)} USD · Certificate)`.slice(0, 78);

  return {
    isPakistan: false,
    currencyCode: geo.currencyCode,
    formatted: conv.localFormatted,
    formattedWithUsdHint: conv.localWithUsdHint,
    numericRs: safeRs,
    usdAmount: certUsd,
    submissionAmount
  };
}

export interface LocalizedBundlePricing {
  isPakistan: boolean;
  currencyCode: string;
  actualFormatted: string;
  discountedFormatted: string;
  savingsFormatted: string;
  discountedWithUsdHint: string;
  discountPct: number;
  actualTotalRs: number;
  discountedPriceRs: number;
  savingsRs: number;
  actualTotalUsd: number;
  discountedUsd: number;
  savingsUsd: number;
  submissionAmount: string;
}

export function getLocalizedBundlePricing(
  courses: Array<{ certificateFeeRs?: number }>,
  bundleCount: number,
  gateway: Partial<PaymentGatewayConfig> | undefined,
  geo: GeoCurrencyState
): LocalizedBundlePricing {
  const actualTotalRs = courses.reduce(
    (sum, c) => sum + (Number(c.certificateFeeRs) || 1000),
    0
  );
  const discountedPriceRs =
    bundleCount <= 1 ? actualTotalRs : Math.round(actualTotalRs * 0.75);
  const savingsRs = Math.max(0, actualTotalRs - discountedPriceRs);

  if (geo.isPakistan) {
    const actualFormatted = `Rs. ${actualTotalRs.toLocaleString()}`;
    const discountedFormatted = `Rs. ${discountedPriceRs.toLocaleString()}`;
    const savingsFormatted = `Rs. ${savingsRs.toLocaleString()}`;
    return {
      isPakistan: true,
      currencyCode: 'PKR',
      actualFormatted,
      discountedFormatted,
      savingsFormatted,
      discountedWithUsdHint: discountedFormatted,
      discountPct: bundleCount <= 1 ? 0 : 25,
      actualTotalRs,
      discountedPriceRs,
      savingsRs,
      actualTotalUsd: 0,
      discountedUsd: 0,
      savingsUsd: 0,
      submissionAmount: `${discountedFormatted} (Certificate Fee)`
    };
  }

  // International bundle rule: $5 USD per certificate + 25% OFF on bundles (count > 1)
  const certUsd = Number(gateway?.certificateFeeUsd) || 5;
  const itemCount = Math.max(1, courses.length);
  const actualTotalUsd = Number((itemCount * certUsd).toFixed(2));
  const discountPct = bundleCount <= 1 ? 0 : 25;
  const discountedUsd =
    bundleCount <= 1
      ? actualTotalUsd
      : Number((actualTotalUsd * 0.75).toFixed(2));
  const savingsUsd = Math.max(0, Number((actualTotalUsd - discountedUsd).toFixed(2)));

  const actConv = formatUsdConverted(actualTotalUsd, geo);
  const discConv = formatUsdConverted(discountedUsd, geo);
  const saveConv = formatUsdConverted(savingsUsd, geo);

  const submissionAmount =
    geo.currencyCode === 'USD'
      ? `${discConv.localFormatted} USD (Bundle)`
      : `${discConv.localFormatted} (${formatUsdClean(discountedUsd)} USD · Bundle)`.slice(
          0,
          78
        );

  return {
    isPakistan: false,
    currencyCode: geo.currencyCode,
    actualFormatted: actConv.localFormatted,
    discountedFormatted: discConv.localFormatted,
    savingsFormatted: saveConv.localFormatted,
    discountedWithUsdHint: discConv.localWithUsdHint,
    discountPct,
    actualTotalRs,
    discountedPriceRs,
    savingsRs,
    actualTotalUsd,
    discountedUsd,
    savingsUsd,
    submissionAmount
  };
}

/**
 * Helper for Admin Revenue Ledger:
 * Parses PKR directly when payment is in Rs./PKR, OR detects USD amount (e.g. "$18.75 USD")
 * and converts it to PKR using the current USD->PKR rate so Admin Revenue totals are accurate.
 */
export function parseRevenuePkrFromRequestText(
  amountText?: string,
  notesText?: string,
  usdToPkrRate = FALLBACK_USD_RATES.PKR
): { pkrAmount: number; originalUsd?: number } {
  const combined = `${amountText || ''} ${notesText || ''}`;
  // 1. Check for USD amount (e.g. "$11.25 USD", "$1 USD", "$5 USD")
  const usdMatch = combined.match(/\$\s*(\d+(?:\.\d{1,2})?)\s*USD/i);
  if (usdMatch && usdMatch[1]) {
    const usdVal = Number(usdMatch[1]);
    if (!Number.isNaN(usdVal) && usdVal > 0) {
      return {
        pkrAmount: Math.round(usdVal * (usdToPkrRate || FALLBACK_USD_RATES.PKR)),
        originalUsd: usdVal
      };
    }
  }
  // 2. Otherwise parse Rs. / PKR figure
  const cleanRaw = (amountText || '').replace(/,/g, '');
  const rsMatch =
    cleanRaw.match(/(?:rs\.?|pkr)\s*(\d{2,7})/i) ||
    cleanRaw.match(/\b(\d{2,7})\b/);
  if (rsMatch && rsMatch[1]) {
    const val = Number(rsMatch[1]);
    if (!Number.isNaN(val) && val > 0) {
      return { pkrAmount: val };
    }
  }
  return { pkrAmount: 0 };
}
