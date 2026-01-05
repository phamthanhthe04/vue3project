// Simple request/response interceptors
export const withAuthToken = async ({ url, options }) => {
  const token = localStorage.getItem('auth_token')
  const headers = token
    ? { ...(options.headers || {}), Authorization: `Bearer ${token}` }
    : options.headers || {}
  return { url, options: { ...options, headers } }
}

export const handleJsonResponse = async (response) => {
  // Pass-through non-OK with parsed error body
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const body = isJson ? await response.json() : null
  if (!response.ok) {
    const error = new Error(body?.message || 'Request failed')
    error.status = response.status
    error.body = body
    throw error
  }
  return body
}
