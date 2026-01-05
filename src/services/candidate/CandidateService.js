import { BaseService } from '../base/BaseService'

export class CandidateService extends BaseService {
  constructor(repository) {
    super(repository)
  }

  async search(keyword) {
    const params = keyword ? { q: keyword } : undefined
    return this.list(params)
  }
}
