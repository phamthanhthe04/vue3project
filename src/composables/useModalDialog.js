/**
 * useModalDialog - Composable for managing modal state and submission logic
 * Reduces duplication between add/edit modals
 */
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'
import { getAvatarText, getRandomAvatarColor } from '@/utils/avatarHelper'
import { CandidateStatus } from '@/utils/enums'

export function useModalDialog(onSaveCallback) {
  const { success, error } = useToast()

  // Modal state
  const loading = ref(false)
  const errorMessage = ref('')

  // Form ref (to be set by parent component)
  const formRef = ref(null)

  /**
   * Handle modal submission - extract, validate, prepare payload
   * @param {Object} payload - form payload from CandidateForm
   * @param {boolean} isEdit - true for edit, false for add
   * @returns {Promise<Object|null>} - prepared candidate data or null if error
   */
  async function handleSubmit(payload, isEdit = false) {
    if (!payload) {
      error('Dữ liệu biểu mẫu không hợp lệ')
      return null
    }

    loading.value = true
    errorMessage.value = ''

    try {
      // Ensure avatar meta is set
      if (!payload.avatarText) {
        payload.avatarText = getAvatarText(payload.fullName)
      }
      if (!payload.avatarColor) {
        payload.avatarColor = getRandomAvatarColor()
      }

      // Prepare candidate data based on mode (add/edit)
      let candidateData = { ...payload }

      if (!isEdit) {
        // Add mode: include default fields
        candidateData = {
          ...candidateData,
          status: CandidateStatus.SUBMITTED,
          campaign: '',
          position: payload.jobTitle || '',
          job: payload.jobTitle || '',
          referrer: '',
          usingUnit: '',
        }
      }

      // Call parent's save callback
      if (onSaveCallback) {
        await onSaveCallback(candidateData, isEdit)
      }

      success(isEdit ? 'Cập nhật ứng viên thành công!' : 'Thêm ứng viên thành công!')
      return candidateData
    } catch (err) {
      const msg = err?.message || 'Lỗi không xác định'
      error(msg)
      errorMessage.value = msg
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Submit form through the form component
   */
  function submitForm() {
    if (formRef.value?.submit) {
      formRef.value.submit()
    }
  }

  /**
   * Reset form and close modal
   */
  function resetAndClose(onClose) {
    if (formRef.value?.reset) {
      formRef.value.reset()
    }
    errorMessage.value = ''
    if (onClose) {
      onClose()
    }
  }

  return {
    loading,
    errorMessage,
    formRef,
    handleSubmit,
    submitForm,
    resetAndClose,
  }
}
