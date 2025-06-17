import type { DirectusResponse, QueryParams } from '~/types'

export default defineEventHandler(async (event) => {
  const query = getQuery<QueryParams>(event)

  const page = Number(query.page ?? '1')
  const limit = Math.min(Number(query.limit ?? '10'), 100) // optional max limit
  const offset = (page - 1) * limit
  const search = query.search?.toLowerCase() ?? ''

  const filter = search
    ? {
        _or: [
          { key: { _icontains: search } },
          { translations: { value: { _icontains: search } } },
        ],
      }
    : {}

  const res = await $fetch<DirectusResponse>('https://directus.altura.io/items/translationKeys', {
    params: {
      fields: 'key,updatedAt,translations.languages_code,translations.value',
      limit,
      offset,
      meta: 'total_count',
      filter,
    },
  })

  return {
    items: res.data,
    total: res.meta.total_count,
    page,
    limit,
  }
})
