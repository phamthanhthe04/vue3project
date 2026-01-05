// Base service providing common business helpers
export class BaseService {
  constructor(repository) {
    this.repository = repository
  }

  async list(params) {
    return this.repository.getAll(params)
  }

  async detail(id) {
    return this.repository.getById(id)
  }

  async create(data) {
    return this.repository.create(data)
  }

  async update(id, data) {
    return this.repository.update(id, data)
  }

  async remove(id) {
    return this.repository.delete(id)
  }
}
