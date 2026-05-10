<template>
  <div class="rounded-xl bg-white p-6 shadow-sm">
    <h3 class="mb-4 text-lg font-semibold text-text-primary">
      {{ title }}
    </h3>
    <div v-if="records.length === 0" class="py-8 text-center text-text-secondary">
      {{ emptyLabel }}
    </div>
    <div v-else class="space-y-6">
      <!-- VAS -->
      <div v-if="hasVAS">
        <h4 class="mb-3 text-sm font-medium text-text-secondary">{{ $t('evaluations.standard.vasLabel') }}</h4>
        <div class="flex h-32 items-end gap-2">
          <div v-for="record in recordsWithVAS" :key="record.id" class="flex flex-1 flex-col items-center">
            <div
              class="w-full rounded-t bg-primary transition-all"
              :style="{ height: `${((record.standardEvaluations.vas || 0) / 100) * 100}%` }"
            />
            <p class="mt-2 text-xs text-text-secondary">
              {{ formatDate(record.date) }}
            </p>
          </div>
        </div>
      </div>

      <!-- NRS -->
      <div v-if="hasNRS">
        <h4 class="mb-3 text-sm font-medium text-text-secondary">{{ $t('evaluations.standard.nrsLabel') }}</h4>
        <div class="flex h-32 items-end gap-2">
          <div v-for="record in recordsWithNRS" :key="record.id" class="flex flex-1 flex-col items-center">
            <div
              class="w-full rounded-t bg-red-500 transition-all"
              :style="{ height: `${((record.standardEvaluations.nrs || 0) / 10) * 100}%` }"
            />
            <p class="mt-2 text-xs text-text-secondary">
              {{ formatDate(record.date) }}
            </p>
          </div>
        </div>
      </div>

      <!-- ROM -->
      <div v-if="hasROM">
        <h4 class="mb-3 text-sm font-medium text-text-secondary">{{ $t('evaluations.standard.romLabel') }}</h4>
        <div class="flex h-32 items-end gap-2">
          <div v-for="record in recordsWithROM" :key="record.id" class="flex flex-1 flex-col items-center">
            <div
              class="w-full rounded-t bg-green-500 transition-all"
              :style="{ height: `${((record.standardEvaluations.rom || 0) / 360) * 100}%` }"
            />
            <p class="mt-2 text-xs text-text-secondary">
              {{ formatDate(record.date) }}
            </p>
          </div>
        </div>
      </div>

      <!-- MMT -->
      <div v-if="hasMMT">
        <h4 class="mb-3 text-sm font-medium text-text-secondary">{{ $t('evaluations.standard.mmtLabel') }}</h4>
        <div class="flex h-32 items-end gap-2">
          <div v-for="record in recordsWithMMT" :key="record.id" class="flex flex-1 flex-col items-center">
            <div
              class="w-full rounded-t bg-purple-500 transition-all"
              :style="{ height: `${((record.standardEvaluations.mmt || 0) / 5) * 100}%` }"
            />
            <p class="mt-2 text-xs text-text-secondary">
              {{ formatDate(record.date) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Barthel Index -->
      <div v-if="hasBarthel">
        <h4 class="mb-3 text-sm font-medium text-text-secondary">{{ $t('evaluations.standard.barthelIndex') }}</h4>
        <div class="flex h-32 items-end gap-2">
          <div v-for="record in recordsWithBarthel" :key="record.id" class="flex flex-1 flex-col items-center">
            <div
              class="w-full rounded-t bg-blue-500 transition-all"
              :style="{ height: `${((record.standardEvaluations.barthelIndex || 0) / 100) * 100}%` }"
            />
            <p class="mt-2 text-xs text-text-secondary">
              {{ formatDate(record.date) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { PatientRecord } from '~/types'

  interface Props {
    records: PatientRecord[]
    title: string
    emptyLabel: string
  }

  const props = defineProps<Props>()

  const formatDate = (dateString: string): string => {
    const parts = dateString.split('-')
    return parts[2] ?? ''
  }

  const recordsWithVAS = computed(() =>
    props.records.filter((r) => r.standardEvaluations.vas !== null && r.standardEvaluations.vas !== undefined),
  )
  const recordsWithNRS = computed(() =>
    props.records.filter((r) => r.standardEvaluations.nrs !== null && r.standardEvaluations.nrs !== undefined),
  )
  const recordsWithROM = computed(() =>
    props.records.filter((r) => r.standardEvaluations.rom !== null && r.standardEvaluations.rom !== undefined),
  )
  const recordsWithMMT = computed(() =>
    props.records.filter((r) => r.standardEvaluations.mmt !== null && r.standardEvaluations.mmt !== undefined),
  )
  const recordsWithBarthel = computed(() =>
    props.records.filter(
      (r) => r.standardEvaluations.barthelIndex !== null && r.standardEvaluations.barthelIndex !== undefined,
    ),
  )

  const hasVAS = computed(() => recordsWithVAS.value.length > 0)
  const hasNRS = computed(() => recordsWithNRS.value.length > 0)
  const hasROM = computed(() => recordsWithROM.value.length > 0)
  const hasMMT = computed(() => recordsWithMMT.value.length > 0)
  const hasBarthel = computed(() => recordsWithBarthel.value.length > 0)
</script>
