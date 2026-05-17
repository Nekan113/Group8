const TOKEN_KEY = 'ttt_token';

class HttpHelper {
  static getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  static setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  static removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  static _buildHeaders(extra = {}) {
    const headers = { 'Content-Type': 'application/json', ...extra };
    const token = HttpHelper.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  static async _parseResponse(res) {
    const contentType = res.headers.get('Content-Type') || '';
    const data = contentType.includes('application/json')
      ? await res.json()
      : await res.text();

    const responseHeaders = {};
    res.headers.forEach((value, key) => { responseHeaders[key] = value; });

    return { data, status: res.status, headers: responseHeaders, ok: res.ok };
  }

  static async get(url, extraHeaders = {}) {
    const res = await fetch(url, {
      method: 'GET',
      headers: HttpHelper._buildHeaders(extraHeaders),
    });
    return HttpHelper._parseResponse(res);
  }

  static async post(url, body = {}, extraHeaders = {}) {
    const res = await fetch(url, {
      method: 'POST',
      headers: HttpHelper._buildHeaders(extraHeaders),
      body: JSON.stringify(body),
    });
    return HttpHelper._parseResponse(res);
  }

  static async postFormData(url, formData) {
    const headers = {};
    const token = HttpHelper.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    return HttpHelper._parseResponse(res);
  }

  static async put(url, body = {}, extraHeaders = {}) {
    const res = await fetch(url, {
      method: 'PUT',
      headers: HttpHelper._buildHeaders(extraHeaders),
      body: JSON.stringify(body),
    });
    return HttpHelper._parseResponse(res);
  }

  static async patch(url, body = {}, extraHeaders = {}) {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: HttpHelper._buildHeaders(extraHeaders),
      body: JSON.stringify(body),
    });
    return HttpHelper._parseResponse(res);
  }

  static async delete(url, extraHeaders = {}) {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: HttpHelper._buildHeaders(extraHeaders),
    });
    return HttpHelper._parseResponse(res);
  }
}

export default HttpHelper;
