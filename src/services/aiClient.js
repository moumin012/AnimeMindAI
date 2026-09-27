const apiBase = process.env.REACT_APP_API_BASE_URL || '';

/** Calls a StudentOS server, never an LLM provider directly from the client. */
export async function askTutor({ message, context }) {
  const response = await fetch(`${apiBase}/v1/ai/tutor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ message, context }),
  });

  if (!response.ok) {
    let detail = '';
    try { detail = (await response.json()).message || ''; } catch { /* response was not JSON */ }
    throw new Error(detail || `Tutor service returned ${response.status}.`);
  }
  const payload = await response.json();
  if (typeof payload.answer !== 'string') throw new Error('Tutor service returned an invalid response.');
  return payload.answer;
}

export function aiSetupMessage() {
  return apiBase
    ? 'The tutor service could not be reached or declined this request. Check your account, network, and server configuration.'
    : 'AI Tutor is not connected yet. Configure a StudentOS server with REACT_APP_API_BASE_URL; provider keys must remain on that server.';
}
