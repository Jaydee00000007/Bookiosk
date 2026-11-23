import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

import MyShelf from '../MyShelf.vue'
import { useMyShelf } from '../../composables/useMyShelf'

describe('MyShelf', () => {
  const { savedBooks, addBook, removeBook } = useMyShelf()

  beforeEach(() => {
    localStorage.clear()
    savedBooks.value = []
  })

  function mountShelf(props = {}) {
    return mount(MyShelf, {
      props,
      global: {
        stubs: {
          RouterLink: {
            props: ['to'],
            template: '<a :href="to.hash || to"><slot /></a>'
          }
        }
      }
    })
  }

  it('reactively updates the saved count and empty state', async () => {
    const wrapper = mountShelf()

    expect(wrapper.get('.qty-savedbooks').text()).toBe('0 books')
    expect(wrapper.find('.shelf-empty').exists()).toBe(true)
    expect(wrapper.get('.shelf-browse-link').attributes('href')).toBe('#search')

    addBook({
      id: 'book-1',
      volumeInfo: { title: 'African stories' }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.get('.qty-savedbooks').text()).toBe('1 book')
    expect(wrapper.get('.book-title').text()).toBe('African stories')
    expect(wrapper.find('.shelf-empty').exists()).toBe(false)
    expect(wrapper.find('.shelf-browse-link').exists()).toBe(false)

    removeBook('book-1')
    await wrapper.vm.$nextTick()

    expect(wrapper.get('.qty-savedbooks').text()).toBe('0 books')
    expect(wrapper.find('.shelf-empty').exists()).toBe(true)
  })

  it('shows a loading state instead of the empty state', () => {
    const wrapper = mountShelf({ loading: true })

    expect(wrapper.get('[role="status"]').text()).toBe('Loading your saved books...')
    expect(wrapper.find('.shelf-empty').exists()).toBe(false)
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })
})
