// Turns "2026-10-19T00:37:35.137Z" into a readable date like "10/19/2026"
export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString();
}
