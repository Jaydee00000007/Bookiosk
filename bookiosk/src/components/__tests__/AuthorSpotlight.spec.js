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

  it('uses the author of the most-viewed book when one is provided', async () => {
    const mostViewedBook = {
      id: 'popular-book',
      volumeInfo: {
        title: 'The most-read story',
        authors: ['Ama Writer'],
        imageLinks: { thumbnail: 'https://books.example/popular-cover.jpg' }
      }
    }

    const wrapper = mount(AuthorSpotlight, {
      props: {
        mostViewedBook,
        mostViewedBookReady: true
      }
    })

    await flushPromises()

    expect(searchBooks).not.toHaveBeenCalled()
    expect(wrapper.get('h2').text()).toBe('Ama Writer')
    expect(wrapper.get('.author-details > span').text()).toBe('Most-viewed author')
    expect(wrapper.text()).toContain('The most-read story')
  })
})
