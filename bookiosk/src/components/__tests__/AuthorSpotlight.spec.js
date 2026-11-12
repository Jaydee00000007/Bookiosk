import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import AuthorSpotlight from '../AuthorSpotlight.vue'
import { searchBooks } from '../../services/googleBooks'

vi.mock('../../services/googleBooks', () => ({
  searchBooks: vi.fn()
}))

describe('AuthorSpotlight', () => {
  beforeEach(() => {
    searchBooks.mockReset()
    searchBooks.mockResolvedValue([{
      id: 'book-1',
      volumeInfo: {
        title: 'Featured story',
        description: 'A story by the featured author.',
        previewLink: 'https://books.google.com/books?id=book-1',
        imageLinks: { thumbnail: 'http://books.example/cover.jpg' }
      }
    }])
  })

  it('loads the featured author and links to a book preview', async () => {
    const wrapper = mount(AuthorSpotlight)
    await flushPromises()

    expect(searchBooks).toHaveBeenCalledWith(
      'inauthor:Chimamanda Ngozi Adichie',
      { orderBy: 'relevance', maxResults: 1 }
    )
    expect(wrapper.find('h2').text()).toBe('Chimamanda Ngozi Adichie')
    expect(wrapper.find('img').attributes('src')).toBe('https://books.example/cover.jpg')
    expect(wrapper.find('a.explore-author-btn').attributes('href'))
      .toBe('https://books.google.com/books?id=book-1')
  })
})
