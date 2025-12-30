import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App, { global: { stubs: ['router-view', 'router-link', 'Sidebar'] } })
    expect(wrapper.text()).toContain('Tuyển dụng')
  })
})
