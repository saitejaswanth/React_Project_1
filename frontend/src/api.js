const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })

  if (!response.ok) {
    let message = `Request failed: ${response.status}`
    try {
      const data = await response.json()
      message = data.error || message
    } catch {}
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

export const api = {
  getDecks: () => request('/decks'),
  getDeck: (id) => request(`/decks/${id}`),
  generateDeck: (payload) =>
    request('/decks/generate', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  createDeck: (payload) =>
    request('/decks', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  deleteDeck: (id) =>
    request(`/decks/${id}`, { method: 'DELETE' }),
  getQuiz: (id) => request(`/decks/${id}/quiz`),
  saveScore: (id, payload) =>
    request(`/decks/${id}/scores`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  getScores: (id) => request(`/decks/${id}/scores`)
}
