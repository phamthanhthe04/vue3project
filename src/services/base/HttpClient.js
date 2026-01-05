// Lightweight HTTP client with basic interceptors and JSON helpers
export class HttpClient {
  constructor({ baseUrl = '' } = {}) {
    this.baseUrl = baseUrl
    this.requestInterceptors = []
    this.responseInterceptors = []
  }

  useRequest(interceptor) {
    this.requestInterceptors.push(interceptor)
  }

  useResponse(interceptor) {
    this.responseInterceptors.push(interceptor)
  }

  async request(path, options = {}) {
    const initial = { ...options }
    let ctx = { url: this.baseUrl + path, options: initial }

    for (const interceptor of this.requestInterceptors) {
      ctx = (await interceptor(ctx)) || ctx
    }

    const response = await fetch(ctx.url, ctx.options)
    let handled = response

    for (const interceptor of this.responseInterceptors) {
      handled = (await interceptor(handled)) || handled
    }

    return handled
  }

  async get(path, options = {}) {
    return this.request(path, { ...options, method: 'GET' })
  }

  async post(path, body, options = {}) {
    return this.request(path, {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      body: JSON.stringify(body),
    })
  }

  async put(path, body, options = {}) {
    return this.request(path, {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      body: JSON.stringify(body),
    })
  }

  async delete(path, options = {}) {
    return this.request(path, { ...options, method: 'DELETE' })
  }
}
