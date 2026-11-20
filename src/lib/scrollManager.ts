export const MAIN_SCROLL_ELEMENT_ID = 'fsp-main-scroll';

const savedScrollPositions = new Map<string, number>();

export function getMainScrollElement(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  return document.getElementById(MAIN_SCROLL_ELEMENT_ID);
}

export function getPortalScrollTop(): number {
  const el = getMainScrollElement();
  if (el && el.scrollHeight > el.clientHeight + 2) {
    return el.scrollTop;
  }
  if (typeof window !== 'undefined') {
    return window.scrollY || document.documentElement.scrollTop || 0;
  }
  return 0;
}

export function setPortalScrollTop(top: number, smooth = false): void {
  const target = Math.max(0, Math.round(top));
  const behavior: ScrollBehavior = smooth ? 'smooth' : 'auto';
  const el = getMainScrollElement();
  if (el) {
    if (smooth && typeof el.scrollTo === 'function') {
      el.scrollTo({ top: target, behavior });
    } else {
      el.scrollTop = target;
    }
  }
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: target, behavior });
  }
}

export function savePortalScroll(key: string, explicitTop?: number): void {
  const top = typeof explicitTop === 'number' ? explicitTop : getPortalScrollTop();
  savedScrollPositions.set(key, Math.max(0, Math.round(top)));
}

export function getSavedPortalScroll(key: string): number {
  return savedScrollPositions.get(key) ?? 0;
}

export function clearPortalScroll(key: string): void {
  savedScrollPositions.delete(key);
}

export function restorePortalScroll(key: string): void {
  const saved = savedScrollPositions.get(key);
  if (typeof saved !== 'number' || saved <= 0) return;

  const apply = () => setPortalScrollTop(saved, false);

  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(() => {
      apply();
      window.requestAnimationFrame(() => {
        apply();
      });
    });
    // One short follow-up pass in case lazy-loaded cards expand layout height slightly after mount
    window.setTimeout(apply, 90);
  } else {
    apply();
  }
}
