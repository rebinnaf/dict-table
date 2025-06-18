<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'
import { defineProps } from 'vue'

const props = defineProps<{
  error?: string | null
  emptyMessage?: string
  loading?: boolean
}>()

const hasError = !!props.error
</script>

<template>
  <div
    class="flex flex-col justify-center items-center py-10"
    role="status"
    :aria-live="props.loading ? 'polite' : 'assertive'"
  >
    <ProgressSpinner v-if="props.loading" style="width: 3rem; height: 3rem" />

    <Message
      v-if="hasError && !props.loading"
      severity="error"
      icon="pi pi-exclamation-triangle"
      class="max-w-lg mt-4"
    >
      {{ error }}
    </Message>

    <Message
      v-else-if="!props.loading"
      severity="info"
      icon="pi pi-info-circle"
      class="max-w-lg mt-4"
    >
      {{ emptyMessage ?? 'No items found.' }}<br>
      Try adjusting your search or filters.
    </Message>
  </div>
</template>
