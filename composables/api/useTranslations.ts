export function useTranslations() {
  const items = ref<Translation[]>([])
  const total = ref(0)
  const count = ref(0)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchTranslations(query: Record<string, string | number>) {
    loading.value = true
    error.value = null

    try {
      const { data } = await useFetch('/api/translations', {
        query,
        server: false,
        onResponseError({ response }) {
          throw new Error(response._data?.message || 'Failed to load translations.')
        },
      })

      if (data.value) {
        items.value = data.value.items
        total.value = data.value.total
        count.value = data.value.count
      }
    }
    catch (err: any) {
      error.value = err
    }
    finally {
      loading.value = false
    }
  }

  return { items, total, count, loading, error, fetchTranslations }
}
