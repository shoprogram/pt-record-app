<template>
  <div class="rounded-xl bg-white p-6 shadow-sm">
    <table class="w-full">
      <thead>
        <tr class="bg-header-bg">
          <th
            v-for="column in columns"
            :key="column.key"
            class="border-b border-border-light px-4 py-3 text-left text-sm font-semibold text-text-primary"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="patient in patients"
          :key="patient.id"
          class="cursor-pointer transition-colors hover:bg-blue-50"
          @click="$emit('row-click', patient.id)"
        >
          <td class="border-b border-border-light px-4 py-3 text-sm text-text-primary">
            {{ patient.code }}
          </td>
          <td class="border-b border-border-light px-4 py-3 text-sm text-text-primary">
            {{ patient.name }}
          </td>
          <td class="border-b border-border-light px-4 py-3 text-sm text-text-secondary">{{ patient.age }}歳</td>
          <td class="border-b border-border-light px-4 py-3 text-sm text-text-secondary">
            {{ patient.gender }}
          </td>
          <td class="border-b border-border-light px-4 py-3 text-sm text-text-secondary">
            {{ patient.diagnosis }}
          </td>
          <td class="border-b border-border-light px-4 py-3 text-sm text-text-secondary">
            {{ patient.lastVisitDate }}
          </td>
          <td class="border-b border-border-light px-4 py-3 text-sm">
            <button class="text-primary hover:underline" @click.stop="$emit('row-click', patient.id)">
              {{ viewDetailLabel }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import type { Patient } from '~/types'

  interface Props {
    patients: Patient[]
    columns: Array<{ key: string; label: string }>
    viewDetailLabel: string
  }

  defineProps<Props>()

  defineEmits<{
    'row-click': [patientId: string]
  }>()
</script>
