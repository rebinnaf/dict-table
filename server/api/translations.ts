import type { DirectusResponse, QueryParams } from '~/types'

export default defineEventHandler(async (event) => {
  const query = getQuery<QueryParams>(event)

  const page = Number(query.page) > 0 ? Number(query.page) : 1
  const limit = Math.min(Number(query.limit) || 10, 100)
  const offset = (page - 1) * limit
  const search = query.search?.toLowerCase() ?? ''
  const dateStart = query.date_start
  const dateEnd = query.date_end
  const sort = query.sort || 'key'

  const filter: any = {}

  if (search) {
    filter._or = [
      { key: { _icontains: search } },
      { translations: { _some: { value: { _icontains: search } } } },
    ]
  }

  if (dateStart && dateEnd) {
    filter.updatedAt = { _between: [dateStart, dateEnd] }
  }

  try {
    const res = await $fetch<DirectusResponse>(
      'https://directus.altura.io/items/translationKeys',
      {
        params: {
          fields: 'key,updatedAt,translations.languages_code,translations.value',
          limit,
          offset,
          meta: '*',
          filter,
          sort,
        },
      },
    )

    return {
      items: res.data,
      total: res.meta.total_count,
      count: res.meta.filter_count,
      page,
      limit,
    }
  }
  catch (err: any) {
    console.error('Fetch error:', err)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch translations',
    })
  }
})
