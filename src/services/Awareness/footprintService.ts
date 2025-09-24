import { API_BASE_URL } from '@env';

export async function fetchFootprintHistory(userId?: string) {
  let url = `${API_BASE_URL}/api/carbon-footprint/history`;
  if (userId) url += `?userId=${encodeURIComponent(userId)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch history');
  const data = await res.json();
  return data.history;
}
