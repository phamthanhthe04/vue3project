import { BaseRepository } from '../base/BaseRepository'

export class CandidateRepository extends BaseRepository {
  constructor(httpClient) {
    super(httpClient, '/api/candidates')
  }
}
