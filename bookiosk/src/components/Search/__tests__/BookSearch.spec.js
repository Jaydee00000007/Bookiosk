import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BookSearch from '../BookSearch.vue'

describe('BookSearch', () => {
  it('updates the search model and emits a trimmed search on submit', async () => {
    const wrapper = mount(BookSearch)

    await wrapper.get('input').setValue('  Achebe  ')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('update:search')?.at(-1)).toEqual(['  Achebe  '])
    expect(wrapper.emitted('search')).toEqual([['Achebe']])
  })

  it('shows loading and validation errors accessibly', () => {
    const wrapper = mount(BookSearch, {
      props: {
        loading: true,
        error: 'Unable to load books.'
      }
    })

    expect(wrapper.get('button').element.disabled).toBe(true)
    expect(wrapper.get('[role="alert"]').text()).toBe('Unable to load books.')
  })
})
