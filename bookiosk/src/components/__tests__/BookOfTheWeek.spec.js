import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import BookOfTheWeek from '../BookOfTheWeek.vue'
import { searchBooks } from '../../services/googleBooks'

vi.mock('../../services/googleBooks', () => ({
  searchBooks: vi.fn()
}))

vi.mock('../../composables/useMyShelf', () => ({
  useMyShelf: () => ({
    isSaved: () => false,
    toggleBook: vi.fn()
  })
}))

describe('BookOfTheWeek', () => {
  beforeEach(() => {
    searchBooks.mockReset()
  })

  it('features the most-viewed book when provided', async () => {
    const mostViewedBook = {
      id: 'popular-book',
      volumeInfo: {
        title: 'The most-read story',
        authors: ['Ama Writer']
      }
    }

    const wrapper = mount(BookOfTheWeek, {
      props: {
        mostViewedBook,
        mostViewedBookReady: true
      }
    })
    await flushPromises()

    expect(searchBooks).not.toHaveBeenCalled()
    expect(wrapper.get('h2').text()).toBe('The most-read story')
    expect(wrapper.get('.book-details > span').text()).toBe('Most-viewed book')
  })
})
