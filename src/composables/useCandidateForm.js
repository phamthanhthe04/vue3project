import { reactive } from 'vue'
import getCurrentDate from '@/utils/getCurrentDate'
import { useFormValidation, candidateValidationSchema } from '@/composables/useFormValidation'

export function useCandidateForm() {
  const form = reactive(createEmpty())

  const { errors, validateForm, clearErrors, getFieldError, hasFieldError } = useFormValidation()

  function createEmpty() {
    return {
      id: null,
      fullName: '',
      dateOfBirth: '',
      gender: null,
      area: null,
      phone: '',
      email: '',
      address: '',
      educationLevel: null,
      educationPlace: '',
      major: '',
      dateApplied: getCurrentDate(),
      source: null,
      recruiter: '',
      collaborator: '',
      recentWorkplace: '',
      workplace: '',
      workPeriodFrom: '',
      workPeriodTo: '',
      jobTitle: '',
      jobDescription: '',
      avatar: '',
      avatarText: '',
      avatarColor: null,
      status: null,
      rating: 0,
    }
  }

  function populate(candidate = {}) {
    Object.assign(form, createEmpty(), candidate)
    // normalize dates if needed here
  }

  function reset() {
    clearErrors()
    Object.assign(form, createEmpty())
  }

  function validate(schema = candidateValidationSchema) {
    // validateForm returns boolean; errors are available via `errors`
    return validateForm(form, schema)
  }

  function setField(field, value) {
    if (Object.prototype.hasOwnProperty.call(form, field)) {
      form[field] = value
    }
  }

  function preparePayload() {
    return {
      ...form,
      workPeriod: { from: form.workPeriodFrom, to: form.workPeriodTo },
    }
  }

  return {
    form,
    populate,
    reset,
    validate,
    preparePayload,
    setField,
    errors,
    getFieldError,
    hasFieldError,
  }
}
