// Generic repository for CRUD operations
export class BaseRepository {
  constructor(httpClient, resourcePath) {
    this.http = httpClient
    this.resourcePath = resourcePath
  }

  async getAll(params) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : ''
    const res = await this.http.get(`${this.resourcePath}${query}`)
    return res.json()
  }

  async getById(id) {
    const res = await this.http.get(`${this.resourcePath}/${id}`)
    return res.json()
  }

  async create(payload) {
    const res = await this.http.post(`${this.resourcePath}`, payload)
    return res.json()
  }

  async update(id, payload) {
    const res = await this.http.put(`${this.resourcePath}/${id}`, payload)
    return res.json()
  }

  async delete(id) {
    const res = await this.http.delete(`${this.resourcePath}/${id}`)
    return res.json()
  }
}
