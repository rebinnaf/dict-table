import type { DirectusTranslation } from './translations'

export interface QueryParams {
  page?: string
  limit?: string
  sort?: string
  search?: string
  date_start: string
  date_end: string
}

export interface DirectusResponse {
  data: DirectusTranslation[]
  meta: {
    filter_count: number
    total_count: number
  }
}
