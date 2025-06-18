<script setup lang="ts">
import type { TranslationValue } from '~/types/translation'
import { useDebounceFn } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { useTranslations } from '~/composables/api/useTranslations'
import { useFlag } from '~/composables/useFlag'
import { formatDateForQuery, formatDisplayDate } from '~/utils/date'

const { items, total, count, loading, error, fetchTranslations } = useTranslations()

const page = ref(1)
const limit = ref(15)
const search = ref('')
const selectedLanguage = ref('en')

const filters = ref<{
  updatedAt: {
    value: [Date, Date] | null
    matchMode: string
  }
}>({
  updatedAt: { value: null, matchMode: 'custom' },
})

const sortField = ref<string | null>('key')
const sortOrder = ref<number>(1)

const { getFlag, availableLanguages } = useFlag()

// Compose the query object for fetching translations
function buildQuery() {
  const query: Record<string, string | number> = {
    page: page.value,
    limit: limit.value,
    search: search.value,
  }

  if (sortField.value) {
    query.sort = sortOrder.value === 1 ? sortField.value : `-${sortField.value}`
  }

  const range = filters.value.updatedAt.value
  if (range && range[0] && range[1]) {
    query.date_start = formatDateForQuery(range[0])
    query.date_end = formatDateForQuery(range[1])
  }

  return query
}

async function fetchData() {
  await fetchTranslations(buildQuery())
}

const debouncedSearch = useDebounceFn(() => {
  page.value = 1
  fetchData()
}, 400)

function onPageChange(event: any) {
  page.value = event.page + 1
  limit.value = event.rows
  fetchData()
}

function onSort(event: any) {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
  fetchData()
}

function onDateRangeChange(value: [Date, Date] | null) {
  filters.value.updatedAt.value = value
  fetchData()
}

function getTooltipContent(translations: TranslationValue[]) {
  return translations
    .map(t => `${getFlag(t.languages_code)} : ${t.value}`)
    .join('\n')
}

function getTranslationValue(translations: TranslationValue[]): string {
  const match = translations.find(t =>
    t.languages_code.toLowerCase().startsWith(selectedLanguage.value.toLowerCase()),
  )
  return match?.value.trim() || '—'
}

onMounted(fetchData)
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-md">
    <DataTable
      :value="items"
      :loading="loading"
      data-key="key"
      paginator
      :rows="limit"
      :total-records="count"
      :rows-per-page-options="[15, 25, 50]"
      :lazy="true"
      :filters="filters"
      filter-display="menu"
      class="text-sm overflow-x-auto"
      :sort-field="sortField"
      :sort-order="sortOrder"
      @page="onPageChange"
      @sort="onSort"
    >
      <!-- Header -->
      <template #header>
        <div class="flex justify-between items-center gap-4 flex-wrap">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="search"
              placeholder="Search by key or value"
              class="h-10 w-full sm:w-64"
              @input="debouncedSearch"
            />
          </IconField>
          <span class="font-semibold">
            Total {{ total }} Keys
          </span>
        </div>
      </template>

      <template #paginatorstart>
        <span class="text-gray-500 text-sm">
          Page {{ page }} of {{ Math.ceil(count / limit) }}
        </span>
      </template>

      <template #paginatorend>
        <span class="text-gray-500 text-sm">
          {{ count }} Keys
        </span>
      </template>

      <!-- Key -->
      <Column field="key" header="Key" sortable />

      <!-- Translation column -->
      <Column filter-field="translationLang" :show-filter-menu="false">
        <template #header>
          <div class="flex items-center justify-between w-full">
            <span class="p-datatable-column-title">Translation</span>
            <Dropdown
              v-model="selectedLanguage"
              :options="availableLanguages"
              class="w-28 mx-5"
              append-to="body"
            >
              <template #value="{ value }">
                {{ getFlag(value) }} {{ value.toUpperCase() }}
              </template>
              <template #option="{ option }">
                {{ getFlag(option) }} {{ option.toUpperCase() }}
              </template>
            </Dropdown>
          </div>
        </template>

        <template #body="{ data }">
          <div
            v-tooltip="{
              value: getTooltipContent(data.translations),
              class: 'p-2 text-sm whitespace-pre-line',
            }"
            class="truncate max-w-[300px]"
          >
            {{ getTranslationValue(data.translations) }}
          </div>
        </template>
      </Column>

      <!-- Updated At column with calendar filter -->
      <Column
        field="updatedAt"
        header="Last Updated"
        sortable
        filter-field="updatedAt"
        :show-filter-menu="true"
        :show-filter-operator="false"
        :show-apply-button="false"
        :show-clear-button="false"
        :show-filter-match-modes="false"
      >
        <template #body="{ data }">
          {{ formatDisplayDate(data.updatedAt) }}
        </template>

        <template #filter="{ filterModel }">
          <DatePicker
            v-model="filterModel.value"
            selection-mode="range"
            date-format="yy-mm-dd"
            show-icon
            @update:model-value="onDateRangeChange"
          />
        </template>
      </Column>

      <!-- Empty or Error or Loading state -->
      <template #empty>
        <TableStateMessage
          :error="error"
          :loading="loading"
          empty-message="No translation keys found."
        />
      </template>
    </DataTable>
  </div>
</template>
