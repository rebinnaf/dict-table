import type { DirectusTranslation } from './translations'

export interface QueryParams {
  page?: string
  limit?: string
  search?: string
}

export interface DirectusResponse {
  data: DirectusTranslation[]
  meta: {
    total_count: number
  }
}
