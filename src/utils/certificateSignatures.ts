import { jsPDF } from 'jspdf';

export type CertificateSignatureId = 'muneeb-khan-slanted-2';

export interface CertificateSignaturePreset {
  id: CertificateSignatureId;
  name: string;
  signerTitleLeft: string;
  inkColorHex: string;
  inkColorRgb: [number, number, number];
  /** SVG path(s) in a 190x48 viewBox */
  svgPathsLeft: Array<{ d: string; strokeWidth?: number }>;
}

/**
 * Permanent Certificate Signature (Selected Style #3: Intertwined MK Monogram for Muneeb Khan)
 */
export const PERMANENT_CERTIFICATE_SIGNATURE: CertificateSignaturePreset = {
  id: 'muneeb-khan-slanted-2',
  name: 'Muneeb Khan — Intertwined MK Monogram',
  signerTitleLeft: 'Signed on behalf of Food Science Portal',
  inkColorHex: '#0F2547',
  inkColorRgb: [15, 37, 71],
  svgPathsLeft: [
    {
      // Intertwined M + K loop at start followed by fast compressed wave & long tail
      d: 'M 18 37 C 16 22, 25 8, 28 24 C 30 33, 36 8, 40 24 C 43 35, 32 42, 48 22 C 56 12, 52 6, 49 36 C 51 24, 62 15, 55 26 C 51 31, 61 35, 67 27 C 71 22, 74 32, 79 27 C 83 23, 87 32, 92 26 C 97 19, 95 33, 102 28 C 107 24, 112 31, 118 28 C 125 25, 132 30, 142 29 C 154 28, 168 32, 178 28',
      strokeWidth: 2.1
    },
    {
      // Double-loop executive underline
      d: 'M 164 24 C 174 38, 122 46, 32 41 C 20 40, 26 34, 92 37 C 132 39, 158 38, 174 36',
      strokeWidth: 1.4
    }
  ]
};

export function getSavedCertificateSignatureId(): CertificateSignatureId {
  return 'muneeb-khan-slanted-2';
}

export function getSavedCustomSignatureDataUrl(): string {
  return '';
}

/**
 * Draws the permanent Muneeb Khan (#3 Intertwined MK Monogram) signature
 * onto a jsPDF document above the signature line at `(leftX, sigBaseY)`.
 */
export function drawPermanentMuneebSignatureStrokeOnly(
  doc: jsPDF,
  leftX: number,
  sigBaseY: number
): void {
  doc.setDrawColor(15, 37, 71);
  doc.setLineWidth(0.56);
  doc.lines(
    [
      [-0.5, -4.0, 1.9, -7.8, 2.7, -3.5],
      [0.5, 2.4, 2.1, -4.3, 3.2, 0.0],
      [0.8, 3.0, -2.1, 4.8, 2.1, -0.5],
      [2.1, -2.7, 1.1, -4.3, 0.3, 3.8],
      [0.5, -3.2, 3.5, -5.6, 1.6, -2.7],
      [-1.1, 1.3, 1.6, 2.4, 3.2, 0.3],
      [1.1, -1.3, 1.9, 1.3, 3.2, 0.0],
      [1.1, -1.1, 2.1, 1.3, 3.5, -0.3],
      [1.3, -1.9, 0.8, 1.9, 2.7, 0.5],
      [1.3, -1.1, 2.7, 0.8, 4.3, 0.0],
      [1.9, -0.8, 3.8, 0.5, 6.4, 0.3],
      [3.2, -0.3, 7.0, 0.8, 9.6, -0.3]
    ],
    leftX + 4.0,
    sigBaseY - 2.2
  );
  doc.setLineWidth(0.4);
  doc.lines(
    [
      [2.7, 3.8, -11.2, 5.9, -35.4, 4.5],
      [-3.2, -0.3, -1.6, -1.9, 16.0, -1.1],
      [10.7, 0.5, 17.6, 0.3, 22.0, -0.3]
    ],
    leftX + 43.0,
    sigBaseY - 5.6
  );
}

/**
 * Draws the permanent Muneeb Khan (#3 Intertwined MK Monogram) signature
 * along with its baseline and caption onto the course certificate PDF.
 */
export function drawSignaturePresetOnPdf(
  doc: jsPDF,
  _presetId: CertificateSignatureId,
  leftX: number,
  sigBaseY: number,
  _customImageUrl?: string
): void {
  drawPermanentMuneebSignatureStrokeOnly(doc, leftX, sigBaseY);

  doc.setDrawColor(210, 222, 234);
  doc.setLineWidth(0.45);
  doc.line(leftX, sigBaseY, leftX + 52, sigBaseY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(45, 55, 72);
  doc.text('Signed on behalf of Food Science Portal', leftX + 26, sigBaseY + 4.5, {
    align: 'center'
  });
}
