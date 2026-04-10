// AdminPilot – API Helper
// OCR: Vercel Edge Function
// Berechnung: Client-seitig (see calculateBenefits.js)

export async function triggerOCR(base64, mediaType, fileName) {
  const res = await fetch('/api/ocr-analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64, media_type: mediaType, file_name: fileName }),
  });
  return res.json();
}
