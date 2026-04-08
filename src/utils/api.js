// AdminPilot – API Helper (calls Vercel Serverless Functions)

export async function triggerOCR(documentId, applicationId) {
  const res = await fetch('/api/ocr-analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_id: documentId, application_id: applicationId }),
  });
  return res.json();
}

export async function calculateBenefits(applicationId) {
  const res = await fetch('/api/calculate-benefits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ application_id: applicationId }),
  });
  return res.json();
}
