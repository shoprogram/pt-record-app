<template>
  <div v-if="patient" class="rounded-xl bg-white p-6 shadow-sm">
    <h3 class="mb-4 text-lg font-semibold text-text-primary">
      {{ title }}
    </h3>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <p class="mb-1 text-sm text-text-secondary">
          {{ codeLabel }}
        </p>
        <p class="text-base font-medium text-text-primary">
          {{ patient.code }}
        </p>
      </div>
      <div>
        <p class="mb-1 text-sm text-text-secondary">
          {{ nameLabel }}
        </p>
        <p class="text-base font-medium text-text-primary">
          {{ patient.name }}
        </p>
      </div>
      <div>
        <p class="mb-1 text-sm text-text-secondary">
          {{ ageLabel }}
        </p>
        <p class="text-base font-medium text-text-primary">{{ patient.age }}歳</p>
      </div>
      <div>
        <p class="mb-1 text-sm text-text-secondary">
          {{ genderLabel }}
        </p>
        <p class="text-base font-medium text-text-primary">
          {{ patient.gender }}
        </p>
      </div>
      <div>
        <p class="mb-1 text-sm text-text-secondary">
          {{ diagnosisLabel }}
        </p>
        <p class="text-base font-medium text-text-primary">
          {{ patient.diagnosis }}
        </p>
      </div>
      <div>
        <p class="mb-1 text-sm text-text-secondary">
          {{ startDateLabel }}
        </p>
        <p class="text-base font-medium text-text-primary">
          {{ patient.startDate }}
        </p>
      </div>
      <div v-if="patient.height">
        <p class="mb-1 text-sm text-text-secondary">身長</p>
        <p class="text-base font-medium text-text-primary">{{ patient.height }}cm</p>
      </div>
      <div v-if="patient.weight">
        <p class="mb-1 text-sm text-text-secondary">体重</p>
        <p class="text-base font-medium text-text-primary">{{ patient.weight }}kg</p>
      </div>
      <div v-if="patient.medicalHistory" class="col-span-2">
        <p class="mb-1 text-sm text-text-secondary">既往歴・服薬</p>
        <p class="text-base text-text-primary">
          {{ patient.medicalHistory }}
        </p>
      </div>
      <div v-if="patient.notes" class="col-span-2">
        <p class="mb-1 text-sm text-text-secondary">
          {{ notesLabel }}
        </p>
        <p class="text-base text-text-primary">
          {{ patient.notes }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Patient } from '~/types'

  interface Props {
    patient: Patient | null
    title: string
    codeLabel: string
    nameLabel: string
    ageLabel: string
    genderLabel: string
    diagnosisLabel: string
    startDateLabel: string
    notesLabel: string
  }

  defineProps<Props>()
</script>
