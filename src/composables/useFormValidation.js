import { ref } from 'vue'
import { VALIDATION_PATTERNS, VALIDATION_MESSAGES } from '@/constants'

/**
 * Composable để xử lý validation form
 * Tránh duplicate validation logic trong mỗi modal
 */
export function useFormValidation() {
  const errors = ref({})

  /**
   * Validate một field đơn lẻ
   */
  const validateField = (fieldName, value, rules) => {
    const fieldErrors = []

    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      fieldErrors.push(rules.requiredMessage || `${fieldName} là bắt buộc`)
    }

    // Pattern validation
    if (rules.pattern && value) {
      if (!rules.pattern.test(value)) {
        fieldErrors.push(rules.patternMessage || `${fieldName} không đúng định dạng`)
      }
    }

    // Custom validator
    if (rules.validator && value) {
      const customError = rules.validator(value)
      if (customError) {
        fieldErrors.push(customError)
      }
    }

    errors.value[fieldName] = fieldErrors
    return fieldErrors.length === 0
  }

  /**
   * Validate toàn bộ form
   */
  const validateForm = (formData, schema) => {
    errors.value = {}
    let isValid = true

    Object.keys(schema).forEach((fieldName) => {
      const value = formData[fieldName]
      const rules = schema[fieldName]

      if (!validateField(fieldName, value, rules)) {
        isValid = false
      }
    })

    return isValid
  }

  /**
   * Clear errors cho một field
   */
  const clearFieldError = (fieldName) => {
    delete errors.value[fieldName]
  }

  /**
   * Clear tất cả errors
   */
  const clearErrors = () => {
    errors.value = {}
  }

  /**
   * Get error message cho một field
   */
  const getFieldError = (fieldName) => {
    return errors.value[fieldName]?.[0] || ''
  }

  /**
   * Check xem field có error không
   */
  const hasFieldError = (fieldName) => {
    return errors.value[fieldName]?.length > 0
  }

  return {
    errors,
    validateField,
    validateForm,
    clearFieldError,
    clearErrors,
    getFieldError,
    hasFieldError,
  }
}

/**
 * Validation schemas có sẵn cho candidate forms
 */
export const candidateValidationSchema = {
  fullName: {
    required: true,
    requiredMessage: 'Vui lòng nhập họ và tên',
  },
  phone: {
    required: true,
    requiredMessage: 'Vui lòng nhập số điện thoại',
    pattern: VALIDATION_PATTERNS.PHONE,
    patternMessage: VALIDATION_MESSAGES.PHONE,
  },
  email: {
    pattern: VALIDATION_PATTERNS.EMAIL,
    patternMessage: VALIDATION_MESSAGES.EMAIL,
  },
  dateApplied: {
    required: true,
    requiredMessage: 'Vui lòng chọn ngày ứng tuyển',
  },
}
