<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import CandidateForm from '@/components/candidate/CandidateForm.vue'
import MSButton from '@/components/controls/ms-button/MSButton.vue'
import { useModalDialog } from '@/composables/useModalDialog'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'save'])

// Modal helpers
const handleClose = () => emit('close')

// useModalDialog composable
const { formRef, handleSubmit, submitForm, resetAndClose } = useModalDialog((data) => {
  emit('save', data)
})

function onFormSave(payload) {
  // Add mode
  handleSubmit(payload, false).then((result) => {
    if (result) {
      resetAndClose(handleClose)
    }
  })
}

function handleCancel() {
  resetAndClose(handleClose)
}

// Overlay click: close modal
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <BaseModal :show="show" title="Thêm ứng viên" size="xlarge" @close="handleClose">
    <CandidateForm ref="formRef" mode="add" @save="onFormSave" @cancel="handleCancel" />

    <template #footer>
      <MSButton label="Hủy" type="secondary" outline @click="handleCancel" />
      <MSButton label="Lưu" type="primary" @click="submitForm" />
    </template>
  </BaseModal>
</template>

<style scoped>
@import '../../../assets/css/base-modal.css';
@import '../../../assets/css/modal-add-candidate.css';
</style>
