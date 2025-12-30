import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import CandidateForm from '@/components/candidate/CandidateForm.vue'

// Các test cho component CandidateForm
describe('CandidateForm', () => {
  it('emits save with prepared payload when form is valid', async () => {
    // Mô phỏng một candidate hợp lệ để populate form
    const validCandidate = {
      fullName: 'John Doe',
      phone: '0123456789',
      dateApplied: '01/01/2025',
    }

    const wrapper = mount(CandidateForm, {
      props: { modelValue: validCandidate },
      global: {
        // Stub các component liên quan tới file uploads để tránh FileReader trong môi trường test
        stubs: ['AvatarUploader', 'FormSection', 'FormRow'],
      },
    })

    // Gọi submit trực tiếp (defineExpose cung cấp submit)
    await wrapper.vm.submit()

    // Kiểm tra rằng sự kiện save đã được emit với payload chuẩn
    expect(wrapper.emitted()).toHaveProperty('save')
    const payload = wrapper.emitted('save')[0][0]
    expect(payload.fullName).toBe('John Doe')
    expect(payload.workPeriod).toBeTruthy()
    expect(payload.workPeriod.from).toBeDefined()
  })

  it('does not emit save when validation fails', async () => {
    // Không cung cấp phone/dateApplied nên sẽ fail theo schema
    const wrapper = mount(CandidateForm, {
      props: { modelValue: { fullName: '' } },
      global: { stubs: ['AvatarUploader', 'FormSection', 'FormRow'] },
    })

    await wrapper.vm.submit()

    expect(wrapper.emitted('save')).toBeUndefined()
  })

  it('emits cancel when cancel button is clicked', async () => {
    const wrapper = mount(CandidateForm, {
      props: { modelValue: null },
      global: { stubs: ['AvatarUploader', 'FormSection', 'FormRow'] },
    })

    // Gọi trực tiếp hàm onCancel được expose
    await wrapper.vm.onCancel()

    expect(wrapper.emitted()).toHaveProperty('cancel')
  })

  it('populates internal form from modelValue', async () => {
    const data = { fullName: 'Alice', phone: '0123456789', dateApplied: '02/02/2025' }
    const wrapper = mount(CandidateForm, {
      props: { modelValue: data },
      global: { stubs: ['AvatarUploader', 'FormSection', 'FormRow'] },
    })

    // local là reactive form được lấy từ useCandidateForm
    expect(wrapper.vm.local.fullName).toBe('Alice')
    expect(wrapper.vm.local.phone).toBe('0123456789')
  })
})
