<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <MoleculesSearchInput
        :model-value="searchQuery"
        :placeholder="$t('patients.list.searchPlaceholder')"
        class="mr-4 flex-1"
        @update:model-value="searchQuery = $event"
      />
      <button
        @click="showCreateModal = true"
        class="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ $t('patients.create.button') }}
      </button>
    </div>

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

    <!-- Create Patient Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">{{ $t('patients.create.title') }}</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleCreatePatient" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700">{{ $t('patients.create.code') }} *</label>
              <input
                v-model="newPatient.code"
                type="text"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700">{{ $t('patients.create.name') }} *</label>
              <input
                v-model="newPatient.name"
                type="text"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700">{{ $t('patients.create.age') }} *</label>
              <input
                v-model.number="newPatient.age"
                type="number"
                required
                min="0"
                max="150"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700">{{ $t('patients.create.gender') }} *</label>
              <select
                v-model="newPatient.gender"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">選択してください</option>
                <option value="男性">男性</option>
                <option value="女性">女性</option>
                <option value="その他">その他</option>
              </select>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">{{ $t('patients.create.diagnosis') }} *</label>
            <input
              v-model="newPatient.diagnosis"
              type="text"
              required
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >{{ $t('patients.create.height') }} (cm)</label
              >
              <input
                v-model.number="newPatient.height"
                type="number"
                min="0"
                step="0.1"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >{{ $t('patients.create.weight') }} (kg)</label
              >
              <input
                v-model.number="newPatient.weight"
                type="number"
                min="0"
                step="0.1"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">{{ $t('patients.create.startDate') }}</label>
            <input
              v-model="newPatient.startDate"
              type="date"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">{{
              $t('patients.create.medicalHistory')
            }}</label>
            <textarea
              v-model="newPatient.medicalHistory"
              rows="2"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">{{ $t('patients.create.notes') }}</label>
            <textarea
              v-model="newPatient.notes"
              rows="2"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div v-if="createError" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {{ createError }}
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              {{ $t('patients.create.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="isCreating"
              class="rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ isCreating ? $t('patients.create.creating') : $t('patients.create.submit') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { usePatients } from '~/composables/usePatients'
  import type { CreatePatientRequest } from '~/types/api/patient'

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

  // Create patient modal
  const showCreateModal = ref(false)
  const isCreating = ref(false)
  const createError = ref('')
  const newPatient = ref<CreatePatientRequest>({
    code: '',
    name: '',
    age: 0,
    gender: '',
    diagnosis: '',
    height: undefined,
    weight: undefined,
    medicalHistory: undefined,
    medications: undefined,
    startDate: undefined,
    notes: undefined,
  })

  const closeModal = () => {
    showCreateModal.value = false
    createError.value = ''
    newPatient.value = {
      code: '',
      name: '',
      age: 0,
      gender: '',
      diagnosis: '',
      height: undefined,
      weight: undefined,
      medicalHistory: undefined,
      medications: undefined,
      startDate: undefined,
      notes: undefined,
    }
  }

  const handleCreatePatient = async () => {
    isCreating.value = true
    createError.value = ''

    try {
      const response = await $fetch('/api/patients', {
        method: 'POST',
        body: newPatient.value,
      })

      if (response.success) {
        closeModal()
        // Refresh the patient list
        await navigateTo(`/patients/${response.patient.id}`)
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'statusCode' in err) {
        const statusCode = (err as { statusCode: number }).statusCode
        if (statusCode === 401) {
          createError.value = '認証が必要です'
        } else if (statusCode === 400) {
          createError.value = (err as { statusMessage?: string }).statusMessage || '入力内容を確認してください'
        } else {
          createError.value = '患者の作成に失敗しました'
        }
      } else {
        createError.value = err instanceof Error ? err.message : '患者の作成に失敗しました'
      }
    } finally {
      isCreating.value = false
    }
  }
</script>
