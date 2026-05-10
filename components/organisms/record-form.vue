<template>
  <div class="rounded-xl bg-white p-6 shadow-sm">
    <h3 class="mb-4 text-lg font-semibold text-text-primary">
      {{ title }}
    </h3>
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- 日付 -->
      <div>
        <label class="mb-2 block text-sm font-medium text-text-primary">
          {{ dateLabel }} <span class="text-red-500">*</span>
        </label>
        <input
          :value="form.date"
          type="date"
          required
          class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          @input="updateDate(($event.target as HTMLInputElement).value)"
        />
      </div>

      <!-- 標準評価 -->
      <div>
        <h4 class="mb-3 text-base font-semibold text-text-primary">{{ $t('evaluations.standard.title') }}</h4>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <!-- ROM -->
            <div>
              <label class="mb-2 block text-sm font-medium text-text-primary">
                {{ $t('evaluations.standard.rom') }}
                <span class="text-xs text-text-secondary">({{ $t('evaluations.standard.romUnit') }})</span>
              </label>
              <input
                :value="form.standardEvaluations.rom ?? ''"
                type="number"
                :min="romMin"
                :max="romMax"
                :placeholder="$t('evaluations.standard.placeholder')"
                class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                @input="
                  updateStandardEvaluation(
                    'rom',
                    ($event.target as HTMLInputElement).value
                      ? Number(($event.target as HTMLInputElement).value)
                      : null,
                  )
                "
              />
            </div>

            <!-- MMT -->
            <div>
              <label class="mb-2 block text-sm font-medium text-text-primary">
                {{ $t('evaluations.standard.mmt') }}
                <span class="text-xs text-text-secondary">({{ $t('evaluations.standard.mmtRange') }})</span>
              </label>
              <input
                :value="form.standardEvaluations.mmt ?? ''"
                type="number"
                :min="mmtMin"
                :max="mmtMax"
                :placeholder="$t('evaluations.standard.placeholder')"
                class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                @input="
                  updateStandardEvaluation(
                    'mmt',
                    ($event.target as HTMLInputElement).value
                      ? Number(($event.target as HTMLInputElement).value)
                      : null,
                  )
                "
              />
            </div>

            <!-- VAS -->
            <div>
              <label class="mb-2 block text-sm font-medium text-text-primary">
                {{ $t('evaluations.standard.vas') }}
                <span class="text-xs text-text-secondary">({{ $t('evaluations.standard.vasRange') }})</span>
              </label>
              <input
                :value="form.standardEvaluations.vas ?? ''"
                type="number"
                :min="vasMin"
                :max="vasMax"
                :placeholder="$t('evaluations.standard.placeholder')"
                class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                @input="
                  updateStandardEvaluation(
                    'vas',
                    ($event.target as HTMLInputElement).value
                      ? Number(($event.target as HTMLInputElement).value)
                      : null,
                  )
                "
              />
            </div>

            <!-- NRS -->
            <div>
              <label class="mb-2 block text-sm font-medium text-text-primary">
                {{ $t('evaluations.standard.nrs') }}
                <span class="text-xs text-text-secondary">({{ $t('evaluations.standard.nrsRange') }})</span>
              </label>
              <input
                :value="form.standardEvaluations.nrs ?? ''"
                type="number"
                :min="nrsMin"
                :max="nrsMax"
                :placeholder="$t('evaluations.standard.placeholder')"
                class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                @input="
                  updateStandardEvaluation(
                    'nrs',
                    ($event.target as HTMLInputElement).value
                      ? Number(($event.target as HTMLInputElement).value)
                      : null,
                  )
                "
              />
            </div>

            <!-- TUG -->
            <div>
              <label class="mb-2 block text-sm font-medium text-text-primary">
                {{ $t('evaluations.standard.tug') }} ({{ $t('evaluations.standard.tugUnit') }})
              </label>
              <input
                :value="form.standardEvaluations.tug ?? ''"
                type="number"
                :min="tugMin"
                :max="tugMax"
                step="0.1"
                :placeholder="$t('evaluations.standard.placeholder')"
                class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                @input="
                  updateStandardEvaluation(
                    'tug',
                    ($event.target as HTMLInputElement).value
                      ? Number(($event.target as HTMLInputElement).value)
                      : null,
                  )
                "
              />
            </div>

            <!-- 10m歩行 -->
            <div>
              <label class="mb-2 block text-sm font-medium text-text-primary">
                {{ $t('evaluations.standard.tenMeterWalk') }} ({{ $t('evaluations.standard.tenMeterWalkUnit') }})
              </label>
              <input
                :value="form.standardEvaluations.tenMeterWalk ?? ''"
                type="number"
                :min="tenMeterWalkMin"
                :max="tenMeterWalkMax"
                step="0.1"
                :placeholder="$t('evaluations.standard.placeholder')"
                class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                @input="
                  updateStandardEvaluation(
                    'tenMeterWalk',
                    ($event.target as HTMLInputElement).value
                      ? Number(($event.target as HTMLInputElement).value)
                      : null,
                  )
                "
              />
            </div>

            <!-- 6分間歩行 -->
            <div>
              <label class="mb-2 block text-sm font-medium text-text-primary">
                {{ $t('evaluations.standard.sixMinuteWalk') }} ({{ $t('evaluations.standard.sixMinuteWalkUnit') }})
              </label>
              <input
                :value="form.standardEvaluations.sixMinuteWalk ?? ''"
                type="number"
                :min="sixMinuteWalkMin"
                :max="sixMinuteWalkMax"
                :placeholder="$t('evaluations.standard.placeholder')"
                class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                @input="
                  updateStandardEvaluation(
                    'sixMinuteWalk',
                    ($event.target as HTMLInputElement).value
                      ? Number(($event.target as HTMLInputElement).value)
                      : null,
                  )
                "
              />
            </div>

            <!-- Barthel Index -->
            <div>
              <label class="mb-2 block text-sm font-medium text-text-primary">
                {{ $t('evaluations.standard.barthelIndex') }} ({{ $t('evaluations.standard.barthelIndexRange') }})
              </label>
              <input
                :value="form.standardEvaluations.barthelIndex ?? ''"
                type="number"
                :min="barthelIndexMin"
                :max="barthelIndexMax"
                :placeholder="$t('evaluations.standard.placeholder')"
                class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                @input="
                  updateStandardEvaluation(
                    'barthelIndex',
                    ($event.target as HTMLInputElement).value
                      ? Number(($event.target as HTMLInputElement).value)
                      : null,
                  )
                "
              />
            </div>

            <!-- Berg Balance Scale -->
            <div>
              <label class="mb-2 block text-sm font-medium text-text-primary">
                {{ $t('evaluations.standard.bergBalanceScale') }} ({{
                  $t('evaluations.standard.bergBalanceScaleRange')
                }})
              </label>
              <input
                :value="form.standardEvaluations.bergBalanceScale ?? ''"
                type="number"
                :min="bergBalanceScaleMin"
                :max="bergBalanceScaleMax"
                :placeholder="$t('evaluations.standard.placeholder')"
                class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                @input="
                  updateStandardEvaluation(
                    'bergBalanceScale',
                    ($event.target as HTMLInputElement).value
                      ? Number(($event.target as HTMLInputElement).value)
                      : null,
                  )
                "
              />
            </div>
          </div>
        </div>
      </div>

      <!-- カスタム評価 -->
      <div>
        <div class="mb-3 flex items-center justify-between">
          <h4 class="text-base font-semibold text-text-primary">{{ $t('evaluations.custom.title') }}</h4>
          <button
            type="button"
            class="rounded-lg border border-primary bg-white px-4 py-2 text-sm text-primary transition-colors hover:bg-blue-50"
            @click="addCustomEvaluation"
          >
            {{ $t('evaluations.custom.add') }}
          </button>
        </div>
        <div v-if="form.customEvaluations.length === 0" class="py-4 text-center text-text-secondary">
          {{ $t('evaluations.custom.empty') }}
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="(custom, index) in form.customEvaluations"
            :key="custom.id"
            class="rounded-lg border border-border-light p-4"
          >
            <div class="mb-3 flex items-center justify-between">
              <span class="text-sm font-medium text-text-primary"
                >{{ $t('evaluations.custom.itemLabel') }} {{ index + 1 }}</span
              >
              <button type="button" class="text-red-500 hover:text-red-700" @click="removeCustomEvaluation(custom.id)">
                {{ $t('evaluations.custom.remove') }}
              </button>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-2 block text-sm font-medium text-text-primary">
                  {{ $t('evaluations.custom.name') }} <span class="text-red-500">*</span>
                </label>
                <input
                  :value="custom.name"
                  type="text"
                  required
                  class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  @input="updateCustomEvaluation(custom.id, 'name', ($event.target as HTMLInputElement).value)"
                />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-text-primary">
                  {{ $t('evaluations.custom.value') }} <span class="text-red-500">*</span>
                </label>
                <input
                  :value="custom.value"
                  type="text"
                  required
                  class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  @input="updateCustomEvaluation(custom.id, 'value', ($event.target as HTMLInputElement).value)"
                />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-text-primary">
                  {{ $t('evaluations.custom.unit') }} <span class="text-red-500">*</span>
                </label>
                <select
                  :value="custom.unit"
                  class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  @change="updateCustomEvaluation(custom.id, 'unit', ($event.target as HTMLSelectElement).value)"
                >
                  <option value="none">{{ $t('evaluations.custom.units.none') }}</option>
                  <option value="degree">{{ $t('evaluations.custom.units.degree') }}</option>
                  <option value="点">{{ $t('evaluations.custom.units.point') }}</option>
                  <option value="秒">{{ $t('evaluations.custom.units.second') }}</option>
                  <option value="m">{{ $t('evaluations.custom.units.meter') }}</option>
                  <option value="回">{{ $t('evaluations.custom.units.times') }}</option>
                  <option value="%">{{ $t('evaluations.custom.units.percent') }}</option>
                </select>
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-text-primary">
                  {{ $t('evaluations.custom.direction') }} <span class="text-red-500">*</span>
                </label>
                <select
                  :value="custom.direction"
                  class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  @change="updateCustomEvaluation(custom.id, 'direction', ($event.target as HTMLSelectElement).value)"
                >
                  <option value="higher_is_better">{{ $t('evaluations.custom.directions.higher') }}</option>
                  <option value="lower_is_better">{{ $t('evaluations.custom.directions.lower') }}</option>
                </select>
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-text-primary">
                  {{ $t('evaluations.custom.min') }}
                </label>
                <input
                  :value="custom.min ?? ''"
                  type="number"
                  :placeholder="$t('evaluations.custom.placeholder.min')"
                  class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  @input="
                    updateCustomEvaluation(
                      custom.id,
                      'min',
                      ($event.target as HTMLInputElement).value
                        ? Number(($event.target as HTMLInputElement).value)
                        : undefined,
                    )
                  "
                />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-text-primary">
                  {{ $t('evaluations.custom.max') }}
                </label>
                <input
                  :value="custom.max ?? ''"
                  type="number"
                  :placeholder="$t('evaluations.custom.placeholder.max')"
                  class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  @input="
                    updateCustomEvaluation(
                      custom.id,
                      'max',
                      ($event.target as HTMLInputElement).value
                        ? Number(($event.target as HTMLInputElement).value)
                        : undefined,
                    )
                  "
                />
              </div>
            </div>
            <div class="mt-4">
              <label class="mb-2 block text-sm font-medium text-text-primary">
                {{ $t('evaluations.custom.note') }}
              </label>
              <textarea
                :value="custom.note ?? ''"
                rows="2"
                class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                @input="updateCustomEvaluation(custom.id, 'note', ($event.target as HTMLTextAreaElement).value)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 備考 -->
      <div>
        <label class="mb-2 block text-sm font-medium text-text-primary">
          {{ notesLabel }}
        </label>
        <textarea
          :value="form.note ?? ''"
          rows="3"
          class="w-full rounded-lg border border-border-light px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          @input="updateNote(($event.target as HTMLTextAreaElement).value)"
        />
      </div>

      <!-- 送信ボタン -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="submitting"
          class="rounded-lg bg-primary px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ submitting ? submittingLabel : submitLabel }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import type { CreateRecordRequest, StandardEvaluations, CustomEvaluation } from '~/types'
  import {
    ROM_MIN,
    ROM_MAX,
    MMT_MIN,
    MMT_MAX,
    VAS_MIN,
    VAS_MAX,
    NRS_MIN,
    NRS_MAX,
    TUG_MIN,
    TUG_MAX,
    TEN_METER_WALK_MIN,
    TEN_METER_WALK_MAX,
    SIX_MINUTE_WALK_MIN,
    SIX_MINUTE_WALK_MAX,
    BARTHEL_INDEX_MIN,
    BARTHEL_INDEX_MAX,
    BERG_BALANCE_SCALE_MIN,
    BERG_BALANCE_SCALE_MAX,
  } from '~/constants/evaluation'

  interface Props {
    form: CreateRecordRequest
    submitting: boolean
    title: string
    dateLabel: string
    notesLabel: string
    submitLabel: string
    submittingLabel: string
    onAddCustomEvaluation?: () => void
    onRemoveCustomEvaluation?: (id: string) => void
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    submit: [form: CreateRecordRequest]
    'update:form': [form: CreateRecordRequest]
  }>()

  const updateDate = (value: string) => {
    const updatedForm: CreateRecordRequest = {
      ...props.form,
      date: value,
    }
    emit('update:form', updatedForm)
  }

  const updateStandardEvaluation = (key: keyof StandardEvaluations, value: number | null) => {
    const updatedForm: CreateRecordRequest = {
      ...props.form,
      standardEvaluations: {
        ...props.form.standardEvaluations,
        [key]: value,
      },
    }
    emit('update:form', updatedForm)
  }

  const updateCustomEvaluation = (id: string, key: keyof CustomEvaluation, value: string | number | undefined) => {
    const updatedCustoms = props.form.customEvaluations.map((custom) => {
      if (custom.id === id) {
        return {
          ...custom,
          [key]: value,
        }
      }
      return custom
    })
    const updatedForm: CreateRecordRequest = {
      ...props.form,
      customEvaluations: updatedCustoms,
    }
    emit('update:form', updatedForm)
  }

  const addCustomEvaluation = () => {
    if (props.onAddCustomEvaluation) {
      props.onAddCustomEvaluation()
    } else {
      const newCustom: CustomEvaluation = {
        id: `custom-${Date.now()}`,
        name: '',
        value: '',
        unit: 'none',
        direction: 'higher_is_better',
      }
      const updatedForm: CreateRecordRequest = {
        ...props.form,
        customEvaluations: [...props.form.customEvaluations, newCustom],
      }
      emit('update:form', updatedForm)
    }
  }

  const removeCustomEvaluation = (id: string) => {
    if (props.onRemoveCustomEvaluation) {
      props.onRemoveCustomEvaluation(id)
    } else {
      const updatedForm: CreateRecordRequest = {
        ...props.form,
        customEvaluations: props.form.customEvaluations.filter((c) => c.id !== id),
      }
      emit('update:form', updatedForm)
    }
  }

  const updateNote = (value: string) => {
    const updatedForm: CreateRecordRequest = {
      ...props.form,
      note: value,
    }
    emit('update:form', updatedForm)
  }

  const handleSubmit = () => {
    emit('submit', props.form)
  }

  // 定数
  const romMin = ROM_MIN
  const romMax = ROM_MAX
  const mmtMin = MMT_MIN
  const mmtMax = MMT_MAX
  const vasMin = VAS_MIN
  const vasMax = VAS_MAX
  const nrsMin = NRS_MIN
  const nrsMax = NRS_MAX
  const tugMin = TUG_MIN
  const tugMax = TUG_MAX
  const tenMeterWalkMin = TEN_METER_WALK_MIN
  const tenMeterWalkMax = TEN_METER_WALK_MAX
  const sixMinuteWalkMin = SIX_MINUTE_WALK_MIN
  const sixMinuteWalkMax = SIX_MINUTE_WALK_MAX
  const barthelIndexMin = BARTHEL_INDEX_MIN
  const barthelIndexMax = BARTHEL_INDEX_MAX
  const bergBalanceScaleMin = BERG_BALANCE_SCALE_MIN
  const bergBalanceScaleMax = BERG_BALANCE_SCALE_MAX
</script>
