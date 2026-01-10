<template>
  <div class="mb-6 flex items-center gap-4">
    <div class="flex-1">
      <input
        :model-value="modelValue"
        type="text"
        :placeholder="placeholder"
        class="w-full rounded-xl border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    modelValue: string
    placeholder?: string
  }

  defineProps<Props>()

  defineEmits<{
    'update:modelValue': [value: string]
  }>()
</script>
