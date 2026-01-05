import { HttpClient } from '../services/base/HttpClient'
import { withAuthToken, handleJsonResponse } from './interceptors'

const baseUrl = import.meta.env.VITE_API_BASE_URL || ''

export const httpClient = new HttpClient({ baseUrl })

httpClient.useRequest(withAuthToken)
httpClient.useResponse(handleJsonResponse)
