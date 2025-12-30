import { describe, it, expect } from 'vitest'
import { useCandidateForm } from '@/composables/useCandidateForm'

// Test cho composable useCandidateForm
describe('useCandidateForm', () => {
  it('populate fills form fields correctly', () => {
    const { form, populate } = useCandidateForm()
    populate({ fullName: 'Bob', phone: '0123456789' })

    expect(form.fullName).toBe('Bob')
    expect(form.phone).toBe('0123456789')
  })

  it('reset clears form to defaults', () => {
    const { form, populate, reset } = useCandidateForm()
    populate({ fullName: 'Charlie', phone: '0123456789' })
    expect(form.fullName).toBe('Charlie')

    reset()
    expect(form.fullName).toBe('')
    expect(form.phone).toBe('')
  })

  it('validate returns true for valid data and false for invalid', () => {
    const { populate, validate } = useCandidateForm()
    // Invalid because missing required phone and dateApplied
    populate({ fullName: 'NoPhone' })
    expect(validate()).toBe(false)

    // Valid case
    populate({ fullName: 'Valid', phone: '0123456789', dateApplied: '01/01/2025' })
    expect(validate()).toBe(true)
  })

  it('preparePayload includes workPeriod object', () => {
    const { populate, preparePayload } = useCandidateForm()
    populate({ workPeriodFrom: '01/2020', workPeriodTo: '12/2020' })
    const payload = preparePayload()

    expect(payload.workPeriod).toEqual({ from: '01/2020', to: '12/2020' })
  })
})
