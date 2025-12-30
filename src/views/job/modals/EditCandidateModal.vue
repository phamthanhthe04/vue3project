<script setup>
import { ref, computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import CandidateForm from '@/components/candidate/CandidateForm.vue'
import MSButton from '@/components/controls/ms-button/MSButton.vue'
import { useModalDialog } from '@/composables/useModalDialog'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  candidate: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'save'])

// Normalize date fields to dd/MM/yyyy for the form (accepts either dd/MM/yyyy or yyyy-MM-dd)
function normalizeToDisplayDate(dateStr) {
  if (!dateStr) return ''
  if (dateStr.includes('/')) return dateStr // already dd/MM/yyyy
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }
  return dateStr
}

// computed normalized candidate for the form
const normalizedCandidate = computed(() => {
  if (!props.candidate) return null
  return {
    ...props.candidate,
    dateOfBirth: normalizeToDisplayDate(props.candidate.dateOfBirth),
    dateApplied: normalizeToDisplayDate(props.candidate.dateApplied),
  }
})

const { formRef, handleSubmit, submitForm } = useModalDialog((data) => {
  emit('save', data)
})

function onFormSave(payload) {
  // Keep avatar and meta if not changed
  const updated = {
    ...props.candidate,
    ...payload,
    avatar: payload.avatar || props.candidate?.avatar,
    avatarText: payload.avatarText || props.candidate?.avatarText,
    avatarColor: payload.avatarColor || props.candidate?.avatarColor,
  }

  handleSubmit(updated, true).then((result) => {
    if (result) emit('close')
  })
}

// Handle close
const handleClose = () => emit('close')
const handleCancel = () => emit('close')
</script>

<template>
  <BaseModal :show="show" title="Chỉnh sửa thông tin ứng viên" size="xlarge" @close="handleClose">
    <CandidateForm
      :modelValue="normalizedCandidate"
      ref="formRef"
      mode="edit"
      @save="onFormSave"
      @cancel="handleClose"
    />

    <template #footer>
      <MSButton type="secondary" label="Hủy" outline @click="handleCancel" />
      <MSButton type="primary" label="Lưu" @click="submitForm" />
    </template>
  </BaseModal>
</template>

<style scoped>
@import '../../../assets/css/base-modal.css';
@import '../../../assets/css/modal-add-candidate.css';

/* Styles riêng cho edit modal */
.form-section-edit {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.form-section-edit:last-child {
  border-bottom: none;
}

.form-section-title-edit {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 16px 0;
  letter-spacing: 0.5px;
}

.form-edit-infobase {
  display: flex;
  gap: 24px;
}

.form-edit-left {
  width: 80px;
  flex-shrink: 0;
}

.form-edit-right {
  flex: 1;
}

/* Modal-specific avatar size (Edit modal) */
.form-edit-left .avatar-button {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 2px dashed #d9d9d9;
}

.form-edit-left .avatar-button .avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.form-edit-left .avatar-button .avatar-placeholder {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  text-transform: uppercase;
  user-select: none;
}
.form-row-vertical {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row-split-edit {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group-half-edit {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row-horizontal {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.form-row-label-left {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  min-width: 150px;
}

.form-label-horizontal {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  white-space: nowrap;
}

.form-label-horizontal-left {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  min-width: 150px;
  white-space: nowrap;
}

.form-row-horizontal .form-input,
.form-row-horizontal .form-select,
.form-row-horizontal .form-textarea {
  flex: 1;
}

.form-link-action {
  color: #1890ff;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.3s;
  display: inline-flex;
  align-items: center;
  margin-top: 8px;
}

.form-link-action:hover {
  color: #40a9ff;
}

.form-time-range {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.form-time-range .form-input {
  flex: 1;
}

.time-separator {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

/* Avatar Text Display */
.avatar-text-display {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  text-transform: uppercase;
  user-select: none;
}

.btn-avatar-upload.avatar-color-pink {
  background-color: #f50057;
}

.btn-avatar-upload.avatar-color-blue {
  background-color: #2196f3;
}

.btn-avatar-upload.avatar-color-orange {
  background-color: #ff9800;
}

.btn-avatar-upload.avatar-color-cyan {
  background-color: #00bcd4;
}

.btn-avatar-upload.avatar-color-teal {
  background-color: #009688;
}

.btn-avatar-upload.avatar-color-purple {
  background-color: #9c27b0;
}

.btn-avatar-upload.avatar-color-green {
  background-color: #4caf50;
}

/* Hover effect cho avatar text */
.btn-avatar-upload:hover .avatar-text-display {
  opacity: 0.9;
}
</style>
