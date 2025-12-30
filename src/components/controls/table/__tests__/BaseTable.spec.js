import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseTable from '@/components/controls/table/BaseTable.vue'

describe('BaseTable', () => {
  const columns = [
    { key: 'a', label: 'A', class: 'col-a' },
    { key: 'b', label: 'B', class: 'col-b' },
  ]

  it('renders header columns', () => {
    const wrapper = mount(BaseTable, { props: { columns, rows: [] } })
    const headers = wrapper.findAll('th').map((h) => h.text())
    expect(headers).toEqual(['A', 'B'])
  })

  it('shows loading slot when loading', () => {
    const wrapper = mount(BaseTable, {
      props: { columns, rows: [], loading: true },
      slots: { loading: '<tr><td colspan="2">loading...</td></tr>' },
    })
    expect(wrapper.text()).toContain('loading...')
  })

  it('shows empty slot when no rows', () => {
    const wrapper = mount(BaseTable, {
      props: { columns, rows: [] },
      slots: { empty: '<tr><td colspan="2">no data</td></tr>' },
    })
    expect(wrapper.text()).toContain('no data')
  })

  it('renders row slot for each row', () => {
    const rows = [
      { id: 1, a: 'x', b: 'y' },
      { id: 2, a: 'x2', b: 'y2' },
    ]
    const wrapper = mount(BaseTable, {
      props: { columns, rows },
      slots: {
        row: `<template #row="{ row }"><tr><td>{{ row.a }}</td><td>{{ row.b }}</td></tr></template>`,
      },
    })

    expect(wrapper.findAll('tbody tr').length).toBe(2)
    expect(wrapper.text()).toContain('x')
    expect(wrapper.text()).toContain('y2')
  })
})
