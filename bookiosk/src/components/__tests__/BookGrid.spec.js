import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BookGrid from '../BookGrid.vue'

describe('BookGrid', () => {
  const books = Array.from({ length: 10 }, (_, index) => ({
    id: `book-${index + 1}`,
    volumeInfo: { title: `Book ${index + 1}` }
  }))

  function mountGrid(props = {}) {
    return mount(BookGrid, {
      props: {
        books,
        ...props
      },
      global: {
        stubs: {
          BookCard: {
            props: ['book'],
            template: '<article class="book-card">{{ book.volumeInfo.title }}</article>'
          }
        }
      }
    })
  }

  it('paginates books and disables controls at the ends', async () => {
    const wrapper = mountGrid()

    expect(wrapper.findAll('.book-card')).toHaveLength(8)
    expect(wrapper.get('.pagination span').text()).toBe('Page 1 of 2')
    expect(wrapper.get('.pagination button').element.disabled).toBe(true)

    await wrapper.get('.pagination button:last-child').trigger('click')

    expect(wrapper.findAll('.book-card')).toHaveLength(2)
    expect(wrapper.get('.pagination span').text()).toBe('Page 2 of 2')
    expect(wrapper.get('.pagination button:last-child').element.disabled).toBe(true)
  })

  it('switches between loading and book results reactively', async () => {
    const wrapper = mountGrid({ loading: true })

    expect(wrapper.get('[role="status"]').text()).toContain('Finding books')
    expect(wrapper.findAll('.book-card')).toHaveLength(0)

    await wrapper.setProps({ loading: false })

    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    expect(wrapper.findAll('.book-card')).toHaveLength(8)
  })

  it('emits close only when the list is configured as closable', async () => {
    const wrapper = mountGrid({ closable: true })

    await wrapper.get('.close-results').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('keeps the empty state visible after the list is cleared', () => {
    const wrapper = mountGrid({
      books: [],
      closable: true,
      emptyMessage: 'Search for books to see them here.'
    })

    expect(wrapper.find('.book-grid').exists()).toBe(false)
    expect(wrapper.find('.book-state').text()).toBe('Search for books to see them here.')
    expect(wrapper.find('.close-results').exists()).toBe(false)
  })
})
