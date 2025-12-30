<template>
  <form class="candidate-form" @submit.prevent="submit">
    <!-- THÔNG TIN CƠ BẢN -->
    <FormSection title="THÔNG TIN CƠ BẢN">
      <div class="form-grid">
        <!-- Avatar uploader bên trái -->
        <AvatarUploader
          v-model="local.avatar"
          :avatarText="local.avatarText"
          :avatarColor="local.avatarColor"
          @update:meta="
            (meta) => {
              // cập nhật meta nếu component upload gửi lên
              if (meta.avatarText !== undefined) local.avatarText = meta.avatarText
              if (meta.avatarColor !== undefined) local.avatarColor = meta.avatarColor
            }
          "
        />

        <!-- Các trường chính bên phải -->
        <div class="form-fields">
          <MSInput v-model="local.fullName" label="Họ và tên" required />

          <FormRow layout="split">
            <MSDateInput v-model="local.dateOfBirth" label="Ngày sinh" />
            <MSSelect v-model="local.gender" :options="genderOptions" label="Giới tính" />
          </FormRow>

          <FormRow layout="split">
            <MSSelect v-model="local.source" :options="sourceOptions" label="Nguồn ứng viên" />
            <MSDateInput v-model="local.dateApplied" label="Ngày ứng tuyển" required />
          </FormRow>

          <MSSelect v-model="local.area" :options="areaOptions" label="Khu vực" />

          <FormRow layout="split">
            <MSInput v-model="local.recruiter" label="Nhân sự khai thác" />
            <MSInput v-model="local.collaborator" label="Cộng tác viên" />
          </FormRow>
        </div>
      </div>
    </FormSection>

    <!-- THÔNG TIN LIÊN HỆ -->
    <FormSection title="THÔNG TIN LIÊN HỆ">
      <FormRow layout="full">
        <MSInput v-model="local.phone" label="Số điện thoại" layout="inline" />
        <MSInput v-model="local.email" label="Email" layout="inline" />

        <MSInput v-model="local.address" label="Địa chỉ" layout="inline" />

        <MSInput v-model="local.skype" label="Skype" layout="inline" />
        <MSInput v-model="local.facebook" label="Facebook" layout="inline" />

        <MSInput v-model="local.zalo" label="Zalo" layout="inline" />
        <MSInput v-model="local.linkedinOther" label="LinkedIn / Khác" layout="inline" />
      </FormRow>
    </FormSection>

    <!-- HỌC VẤN -->
    <FormSection title="HỌC VẤN">
      <MSInput v-model="local.educationLevel" label="Trình độ đào tạo" list="education-levels" />
      <datalist id="education-levels">
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

    <!-- TRƯỜNG TÙY CHỈNH (nút + link) -->
    <div class="form-link-wrapper">
      <a href="#" class="form-link-blue" @click.prevent>+ Thêm trường tùy chỉnh</a>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import AvatarUploader from '@/components/common/AvatarUploader.vue'
import FormSection from '@/components/common/FormSection.vue'
import FormRow from '@/components/controls/form/FormRow.vue'
import { MSInput, MSSelect, MSDateInput } from '@/components/controls/ms-input'
import MSButton from '@/components/controls/ms-button/MSButton.vue'
import { useCandidateForm } from '@/composables/useCandidateForm'
import {
  getEnumOptions,
  GenderLabel,
  AreaLabel,
  CandidateSourceLabel,
  EducationLevelLabel,
} from '@/utils/enums'

// Props & emits
const props = defineProps({
  modelValue: { type: Object, default: null },
  mode: { type: String, default: 'add' },
})
const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

// Sử dụng composable form chung
const { form, populate, reset, validate, preparePayload, setField } = useCandidateForm()
const local = form

// Tạo tùy chọn cho select từ enums
const genderOptions = getEnumOptions(GenderLabel)
const areaOptions = getEnumOptions(AreaLabel)
const sourceOptions = getEnumOptions(CandidateSourceLabel)
const educationLevelOptions = getEnumOptions(EducationLevelLabel)

// Đồng bộ props.modelValue vào form
watch(
  () => props.modelValue,
  (v) => {
    if (v) populate(v)
    else reset()
  },
  { immediate: true },
)

// Submit: validate rồi emit payload chuẩn
function submit() {
  if (!validate()) return
  emit('save', preparePayload())
}

function onCancel() {
  emit('cancel')
}

// expose methods cho parent qua ref
defineExpose({ submit, reset, onCancel })
</script>

<style scoped>
@import '../../assets/css/base-form.css';

.candidate-form {
  display: block;
}

.form-grid {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.form-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 18px;
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
  .form-grid {
    flex-direction: column;
  }
}
</style>
