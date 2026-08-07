class HttpClient {
  constructor(baseHeaders = {}) {
    this.baseHeaders = {
      'Content-Type': 'application/json',
      ...baseHeaders,
    }
  }

  getToken() {
    return localStorage.getItem('aff_token')
  }

  buildHeaders(customHeaders = {}) {
    const headers = { ...this.baseHeaders, ...customHeaders }
    const token = this.getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    return headers
  }

  async request(method, url, { body, headers } = {}) {
    const response = await fetch(url, {
      method,
      headers: this.buildHeaders(headers),
      body: body ? JSON.stringify(body) : undefined,
    })

    let data = null
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      data = await response.json()
    }

    return {
      data,
      status: response.status,
      headers: response.headers,
      ok: response.ok,
    }
  }

  get(url, options) {
    return this.request('GET', url, options)
  }

  post(url, options) {
    return this.request('POST', url, options)
  }

  put(url, options) {
    return this.request('PUT', url, options)
  }

  patch(url, options) {
    return this.request('PATCH', url, options)
  }

  delete(url, options) {
    return this.request('DELETE', url, options)
  }
}

export const httpClient = new HttpClient()
