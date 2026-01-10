<template>
  <div>
    <MoleculesSearchInput
      :model-value="searchQuery"
      :placeholder="$t('patients.list.searchPlaceholder')"
      @update:model-value="searchQuery = $event"
    />

    <div v-if="isLoading" class="py-12 text-center text-text-secondary">
      {{ $t('patients.list.loading') }}
    </div>

    <div v-else-if="error" class="py-12 text-center text-red-500">{{ $t('patients.list.error') }}: {{ error }}</div>

    <div v-else-if="!patients || patients.length === 0" class="py-12 text-center text-text-secondary">
      {{ $t('patients.list.empty') }}
    </div>

    <MoleculesPatientTable
      v-else
      :patients="patients"
      :columns="tableColumns"
      :view-detail-label="$t('patients.list.viewDetail')"
      @row-click="handleRowClick"
    />
  </div>
</template>

<script setup lang="ts">
  import { usePatients } from '~/composables/usePatients'

  definePageMeta({
    layout: 'default',
  })

  const { t } = useI18n()
  const searchQuery = ref('')
  const { data, error, isLoading } = usePatients(searchQuery)

  const patients = computed(() => {
    if (!data.value) return null
    return data.value.patients
  })

  const tableColumns = computed(() => [
    { key: 'code', label: t('patients.list.columns.code') },
    { key: 'name', label: t('patients.list.columns.name') },
    { key: 'age', label: t('patients.list.columns.age') },
    { key: 'gender', label: t('patients.list.columns.gender') },
    { key: 'diagnosis', label: t('patients.list.columns.diagnosis') },
    { key: 'lastVisitDate', label: t('patients.list.columns.lastVisitDate') },
    { key: 'action', label: t('patients.list.columns.action') },
  ])

  const handleRowClick = (patientId: string) => {
    navigateTo(`/patients/${patientId}`)
  }
</script>
