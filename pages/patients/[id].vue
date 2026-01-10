<template>
  <div class="space-y-6">
    <!-- 患者プロフィール -->
    <OrganismsPatientProfileCard
      v-if="patient"
      :patient="patient"
      :title="$t('patients.detail.profile.title')"
      :code-label="$t('patients.detail.profile.code')"
      :name-label="$t('patients.detail.profile.name')"
      :age-label="$t('patients.detail.profile.age')"
      :gender-label="$t('patients.detail.profile.gender')"
      :diagnosis-label="$t('patients.detail.profile.diagnosis')"
      :start-date-label="$t('patients.detail.profile.startDate')"
      :notes-label="$t('patients.detail.profile.notes')"
    />

    <!-- 今日の記録フォーム -->
    <OrganismsRecordForm
      :form="form"
      :submitting="submitting"
      :title="$t('patients.detail.todayRecord.title')"
      :date-label="$t('patients.detail.todayRecord.date')"
      :notes-label="$t('patients.detail.todayRecord.notes')"
      :submit-label="$t('patients.detail.todayRecord.submit')"
      :submitting-label="$t('patients.detail.todayRecord.submitting')"
      @submit="handleSubmit"
      @update:form="updateForm"
    />

    <!-- 過去記録 -->
    <div v-if="recordsData" class="space-y-6">
      <!-- グラフ表示 -->
      <OrganismsRecordsChart
        :records="recordsData.records"
        :title="$t('patients.detail.history.title')"
        :empty-label="$t('patients.detail.history.empty')"
      />

      <!-- 記録一覧 -->
      <OrganismsRecordsTable
        :records="recordsData.records"
        :title="$t('patients.detail.history.listTitle')"
        :empty-label="$t('patients.detail.history.empty')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'default',
  })

  const { t } = useI18n()
  const route = useRoute()
  const patientId = route.params.id as string

  // 患者情報を取得
  const { data: patient } = usePatient(patientId)

  // 記録を取得
  const { data: recordsData, createRecord } = usePatientRecords(patientId)

  // フォーム
  const { form, resetForm, validateForm } = useRecordForm()

  const submitting = ref(false)

  const updateForm = (updatedForm: typeof form) => {
    Object.assign(form, updatedForm)
  }

  const handleSubmit = async () => {
    const validationError = validateForm()
    if (validationError) {
      alert(validationError)
      return
    }

    submitting.value = true
    const result = await createRecord(form)

    if (result.success) {
      resetForm()
      alert(t('patients.detail.todayRecord.success'))
    } else {
      alert(`${t('patients.detail.todayRecord.error')}: ${result.error}`)
    }
    submitting.value = false
  }
</script>
