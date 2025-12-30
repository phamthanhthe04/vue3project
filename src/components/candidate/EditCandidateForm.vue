<template>
  <form class="edit-candidate-form" @submit.prevent="submit">
    <!-- THÔNG TIN CƠ BẢN -->
    <FormSection title="THÔNG TIN CƠ BẢN">
      <div class="form-grid-edit">
        <!-- Avatar uploader bên trái, nhỏ hơn -->
        <div class="avatar-section-edit">
          <AvatarUploader
            v-model="local.avatar"
            :avatarText="local.avatarText"
            :avatarColor="local.avatarColor"
            @update:meta="
              (meta) => {
                if (meta.avatarText !== undefined) local.avatarText = meta.avatarText
                if (meta.avatarColor !== undefined) local.avatarColor = meta.avatarColor
              }
            "
          />
        </div>

        <!-- Các trường chính bên phải, chiếm nhiều không gian hơn -->
        <div class="form-fields-edit">
          <MSInput v-model="local.fullName" label="Họ và tên" required />

          <FormRow layout="split">
            <MSDateInput v-model="local.dateOfBirth" label="Ngày sinh" />
            <MSSelect v-model="local.gender" :options="genderOptions" label="Giới tính" />
          </FormRow>

          <FormRow layout="split">
            <MSSelect v-model="local.source" :options="sourceOptions" label="Nguồn ứng viên" />
            <MSDateInput v-model="local.dateApplied" label="Ngày ứng tuyển" required />
          </FormRow>

          <FormRow layout="split">
            <MSSelect v-model="local.area" :options="areaOptions" label="Khu vực" />
            <MSInput v-model="local.recruiter" label="Nhân sự khai thác" />
          </FormRow>

          <MSInput v-model="local.collaborator" label="Cộng tác viên" />
        </div>
      </div>
    </FormSection>

    <!-- THÔNG TIN LIÊN HỆ -->
    <FormSection title="THÔNG TIN LIÊN HỆ">
      <div class="contact-fields">
        <MSInput v-model="local.phone" label="Số điện thoại" />
        <MSInput v-model="local.email" label="Email" />
        <MSInput v-model="local.address" label="Địa chỉ" />
        <MSInput v-model="local.skype" label="Skype" />
        <MSInput v-model="local.facebook" label="Facebook" />
        <MSInput v-model="local.zalo" label="Zalo" />
        <MSInput v-model="local.linkedinOther" label="LinkedIn / Khác" />
      </div>
    </FormSection>

    <!-- HỌC VẤN -->
    <FormSection title="HỌC VẤN">
      <MSInput
        v-model="local.educationLevel"
        label="Trình độ đào tạo"
        list="education-levels-edit"
      />
      <datalist id="education-levels-edit">
        <option v-for="opt in educationLevelOptions" :key="opt.value" :value="opt.label" />
      </datalist>
      <MSInput v-model="local.educationPlace" label="Nơi đào tạo" />
      <MSInput v-model="local.major" label="Chuyên ngành" />
    </FormSection>

    <!-- KINH NGHIỆM LÀM VIỆC -->
    <FormSection title="KINH NGHIỆM LÀM VIỆC">
      <MSInput v-model="local.recentWorkplace" label="Nơi làm việc gần đây" />
      <MSInput v-model="local.workplace" label="Nơi làm việc" />
      <FormRow layout="split">
        <MSInput v-model="local.workPeriodFrom" label="Từ" placeholder="MM/yyyy" />
        <MSInput v-model="local.workPeriodTo" label="Đến" placeholder="MM/yyyy" />
      </FormRow>
      <MSInput v-model="local.jobTitle" label="Vị trí công việc" />
      <label class="form-label">Mô tả công việc</label>
      <textarea v-model="local.jobDescription" class="form-textarea" rows="4" />
    </FormSection>

    <!-- TRƯỜNG TÙY CHỈNH -->
    <div class="form-link-wrapper">
      <a href="#" class="form-link-blue" @click.prevent>+ Thêm trường tùy chỉnh</a>
    </div>
  </form>
</template>

<script setup>
import { watch } from 'vue'
import AvatarUploader from '@/components/common/AvatarUploader.vue'
import FormSection from '@/components/common/FormSection.vue'
import FormRow from '@/components/controls/form/FormRow.vue'
import { MSInput, MSSelect, MSDateInput } from '@/components/controls/ms-input'
import { useCandidateForm } from '@/composables/useCandidateForm'
import {
  getEnumOptions,
  GenderLabel,
  AreaLabel,
  CandidateSourceLabel,
  EducationLevelLabel,
} from '@/utils/enums'

const props = defineProps({
  modelValue: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const { form, populate, reset, validate, preparePayload } = useCandidateForm()
const local = form

const genderOptions = getEnumOptions(GenderLabel)
const areaOptions = getEnumOptions(AreaLabel)
const sourceOptions = getEnumOptions(CandidateSourceLabel)
const educationLevelOptions = getEnumOptions(EducationLevelLabel)

watch(
  () => props.modelValue,
  (v) => {
    if (v) populate(v)
    else reset()
  },
  { immediate: true },
)

function submit() {
  if (!validate()) return
  emit('save', preparePayload())
}

function onCancel() {
  emit('cancel')
}

defineExpose({ submit, reset, onCancel })
</script>

<style scoped>
@import '../../assets/css/base-form.css';

.edit-candidate-form {
  display: block;
}

.form-grid-edit {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.avatar-section-edit {
  flex-shrink: 0;
  width: 120px;
}

.form-fields-edit {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  max-width: 450px;
}

.contact-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

/* Cap contact inputs within each column */
.contact-fields > * {
  max-width: 450px;
}

.form-link-wrapper {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.form-link-blue {
  color: #2196f3;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
}

.form-link-blue:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .form-grid-edit {
    flex-direction: column;
  }

  .contact-fields {
    grid-template-columns: 1fr;
  }
}

/* Cap section content width */
:deep(.form-section-body) {
  max-width: 450px;
}

/* Ensure two-input rows fit within container */
:deep(.form-section-body) .form-row {
  max-width: 100%;
  width: 100%;
}
</style>
