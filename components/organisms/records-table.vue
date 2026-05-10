<template>
  <div class="rounded-xl bg-white p-6 shadow-sm">
    <h3 class="mb-4 text-lg font-semibold text-text-primary">
      {{ title }}
    </h3>
    <div v-if="records.length === 0" class="py-8 text-center text-text-secondary">
      {{ emptyLabel }}
    </div>
    <div v-else class="space-y-4">
      <div v-for="record in records" :key="record.id" class="rounded-lg border border-border-light p-4">
        <div class="mb-2 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-text-primary">{{ record.date }}</span>
            <span v-if="record.sessionId" class="text-xs text-text-secondary">({{ record.sessionId }})</span>
          </div>
        </div>

        <!-- 標準評価 -->
        <div v-if="hasStandardEvaluations(record)" class="mb-3">
          <h5 class="mb-2 text-xs font-medium text-text-secondary">{{ $t('evaluations.standard.title') }}</h5>
          <div class="grid grid-cols-3 gap-2 text-sm">
            <div v-if="record.standardEvaluations.rom !== null && record.standardEvaluations.rom !== undefined">
              <span class="text-text-secondary">ROM:</span>
              <span class="ml-1 text-text-primary">{{ record.standardEvaluations.rom }}°</span>
            </div>
            <div v-if="record.standardEvaluations.mmt !== null && record.standardEvaluations.mmt !== undefined">
              <span class="text-text-secondary">MMT:</span>
              <span class="ml-1 text-text-primary">{{ record.standardEvaluations.mmt }}</span>
            </div>
            <div v-if="record.standardEvaluations.vas !== null && record.standardEvaluations.vas !== undefined">
              <span class="text-text-secondary">VAS:</span>
              <span class="ml-1 text-text-primary">{{ record.standardEvaluations.vas }}</span>
            </div>
            <div v-if="record.standardEvaluations.nrs !== null && record.standardEvaluations.nrs !== undefined">
              <span class="text-text-secondary">NRS:</span>
              <span class="ml-1 text-text-primary">{{ record.standardEvaluations.nrs }}</span>
            </div>
            <div v-if="record.standardEvaluations.tug !== null && record.standardEvaluations.tug !== undefined">
              <span class="text-text-secondary">{{ $t('evaluations.standard.tug') }}:</span>
              <span class="ml-1 text-text-primary"
                >{{ record.standardEvaluations.tug }}{{ $t('evaluations.standard.tugUnit') }}</span
              >
            </div>
            <div
              v-if="
                record.standardEvaluations.tenMeterWalk !== null &&
                record.standardEvaluations.tenMeterWalk !== undefined
              "
            >
              <span class="text-text-secondary">{{ $t('evaluations.standard.tenMeterWalk') }}:</span>
              <span class="ml-1 text-text-primary"
                >{{ record.standardEvaluations.tenMeterWalk }}{{ $t('evaluations.standard.tenMeterWalkUnit') }}</span
              >
            </div>
            <div
              v-if="
                record.standardEvaluations.sixMinuteWalk !== null &&
                record.standardEvaluations.sixMinuteWalk !== undefined
              "
            >
              <span class="text-text-secondary">{{ $t('evaluations.standard.sixMinuteWalk') }}:</span>
              <span class="ml-1 text-text-primary"
                >{{ record.standardEvaluations.sixMinuteWalk }}{{ $t('evaluations.standard.sixMinuteWalkUnit') }}</span
              >
            </div>
            <div
              v-if="
                record.standardEvaluations.barthelIndex !== null &&
                record.standardEvaluations.barthelIndex !== undefined
              "
            >
              <span class="text-text-secondary">{{ $t('evaluations.standard.barthelIndex') }}:</span>
              <span class="ml-1 text-text-primary">{{ record.standardEvaluations.barthelIndex }}</span>
            </div>
            <div
              v-if="
                record.standardEvaluations.bergBalanceScale !== null &&
                record.standardEvaluations.bergBalanceScale !== undefined
              "
            >
              <span class="text-text-secondary">{{ $t('evaluations.standard.bergBalanceScale') }}:</span>
              <span class="ml-1 text-text-primary">{{ record.standardEvaluations.bergBalanceScale }}</span>
            </div>
          </div>
        </div>

        <!-- カスタム評価 -->
        <div v-if="record.customEvaluations.length > 0" class="mb-3">
          <h5 class="mb-2 text-xs font-medium text-text-secondary">{{ $t('evaluations.custom.title') }}</h5>
          <div class="space-y-1 text-sm">
            <div v-for="custom in record.customEvaluations" :key="custom.id">
              <span class="text-text-secondary">{{ custom.name }}:</span>
              <span class="ml-1 text-text-primary"
                >{{ custom.value }}{{ custom.unit !== 'none' ? custom.unit : '' }}</span
              >
            </div>
          </div>
        </div>

        <!-- 備考 -->
        <div v-if="record.note" class="text-sm text-text-secondary">
          {{ record.note }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { PatientRecord, StandardEvaluations } from '~/types'

  interface Props {
    records: PatientRecord[]
    title: string
    emptyLabel: string
  }

  defineProps<Props>()

  const hasStandardEvaluations = (record: PatientRecord): boolean => {
    const std: StandardEvaluations = record.standardEvaluations
    return (
      (std.rom !== null && std.rom !== undefined) ||
      (std.mmt !== null && std.mmt !== undefined) ||
      (std.vas !== null && std.vas !== undefined) ||
      (std.nrs !== null && std.nrs !== undefined) ||
      (std.tug !== null && std.tug !== undefined) ||
      (std.tenMeterWalk !== null && std.tenMeterWalk !== undefined) ||
      (std.sixMinuteWalk !== null && std.sixMinuteWalk !== undefined) ||
      (std.barthelIndex !== null && std.barthelIndex !== undefined) ||
      (std.bergBalanceScale !== null && std.bergBalanceScale !== undefined)
    )
  }
</script>
