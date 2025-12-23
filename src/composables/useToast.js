import { ref } from 'vue'

const toastInstance = ref(null)

export function useToast() {
  const setInstance = (instance) => {
    toastInstance.value = instance
  }

  const success = (message, duration = 3000) => {
    if (!toastInstance.value) {
      console.warn('Toast instance not found. Make sure ToastNotification is mounted.')
      return
    }
    toastInstance.value.success(message, duration)
  }

  const error = (message, duration = 3000) => {
    if (!toastInstance.value) {
      console.warn('Toast instance not found. Make sure ToastNotification is mounted.')
      return
    }
    toastInstance.value.error(message, duration)
  }

  const warning = (message, duration = 3000) => {
    if (!toastInstance.value) {
      console.warn('Toast instance not found. Make sure ToastNotification is mounted.')
      return
    }
    toastInstance.value.warning(message, duration)
  }

  const info = (message, duration = 3000) => {
    if (!toastInstance.value) {
      console.warn('Toast instance not found. Make sure ToastNotification is mounted.')
      return
    }
    toastInstance.value.info(message, duration)
  }

  return {
    setInstance,
    success,
    error,
    warning,
    info,
  }
}
