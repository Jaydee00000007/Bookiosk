import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HomeView from '../HomeView.vue'
import { searchBooks } from '../../services/googleBooks'

vi.mock('../../services/googleBooks', () => ({
  getBookById: vi.fn(),
  searchBooks: vi.fn()
}))

vi.mock('../../components/NavBar.vue', () => ({
  default: { template: '<nav />' }
}))

vi.mock('../../components/SiteFooter.vue', () => ({
  default: { template: '<footer />' }
}))

describe('HomeView browsing', () => {
  beforeEach(() => {
    searchBooks.mockReset()
    searchBooks.mockResolvedValue([
      { id: 'book-1', volumeInfo: { title: 'African stories' } }
    ])
  })

  it('loads and displays books selected by genre and region', async () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          NavBar: true,
          BookSearch: true,
          BookOfTheWeek: true,
          AuthorSpotlight: true,
          BookGrid: {
            props: ['books'],
            template: '<div class="results">{{ books.map(book => book.volumeInfo.title).join(", ") }}</div>'
          }
        }
      }
    })

    await wrapper.findAll('.browse-genre').at(0).findAll('button').at(1).trigger('click')
    await flushPromises()

    expect(searchBooks).toHaveBeenLastCalledWith(
      'subject:poetry African literature',
      { maxResults: 12 }
    )
    expect(wrapper.find('.results').text()).toContain('African stories')

    await wrapper.findAll('.browse-genre').at(1).findAll('button').at(0).trigger('click')
    await flushPromises()

    expect(searchBooks).toHaveBeenLastCalledWith(
      'subject:"West African literature"',
      { maxResults: 12 }
    )
    expect(wrapper.find('.results').text()).toContain('African stories')
  })

  it('combines the search text with the selected regional filter', async () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          NavBar: true,
          BookSearch: {
            props: ['search'],
            emits: ['update:search', 'search'],
            template: `
              <form @submit.prevent="$emit('search', search)">
                <input
                  :value="search"
                  @input="$emit('update:search', $event.target.value)"
                >
              </form>
            `
          },
          BookOfTheWeek: true,
          AuthorSpotlight: true,
          BookGrid: true
        }
      }
    })

    await wrapper.findAll('.filter-btn').at(0).trigger('click')
    await wrapper.get('input').setValue('Achebe')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(searchBooks).toHaveBeenLastCalledWith(
      'subject:"Nigerian literature" Achebe',
      { maxResults: 12 }
    )

    await wrapper.findAll('.filter-btn').at(1).trigger('click')
    await flushPromises()

    expect(searchBooks).toHaveBeenLastCalledWith(
      'subject:"African literature" Achebe',
      { maxResults: 12 }
    )
    expect(wrapper.findAll('.filter-btn').at(1).attributes('aria-pressed')).toBe('true')

    await wrapper.findAll('.filter-btn').at(2).trigger('click')
    await flushPromises()

    expect(searchBooks).toHaveBeenLastCalledWith(
      'Achebe',
      { maxResults: 12 }
    )
  })

  it('keeps the newest selection when browse requests finish out of order', async () => {
    let resolvePoetry
    let resolveRegion

    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          NavBar: true,
          BookSearch: true,
          BookOfTheWeek: true,
          AuthorSpotlight: true,
          BookGrid: {
            props: ['books'],
            template: '<div class="results">{{ books.map(book => book.volumeInfo.title).join(", ") }}</div>'
          }
        }
      }
    })
    // Let the one-time homepage feature request finish before controlling
    // the two browse requests whose completion order this test exercises.
    await flushPromises()

    searchBooks
      .mockImplementationOnce(() => new Promise(resolve => {
        resolvePoetry = resolve
      }))
      .mockImplementationOnce(() => new Promise(resolve => {
        resolveRegion = resolve
      }))

    const browseMenus = wrapper.findAll('.browse-genre')
    await browseMenus.at(0).findAll('button').at(1).trigger('click')
    await browseMenus.at(1).findAll('button').at(0).trigger('click')

    resolveRegion([
      { id: 'region-book', volumeInfo: { title: 'Latest selection' } }
    ])
    await flushPromises()
    resolvePoetry([
      { id: 'poetry-book', volumeInfo: { title: 'Stale selection' } }
    ])
    await flushPromises()

    expect(wrapper.find('.results').text()).toContain('Latest selection')
    expect(wrapper.find('.results').text()).not.toContain('Stale selection')
  })

  it('clears the book grid without removing browse menus', async () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          NavBar: true,
          BookSearch: true,
          BookOfTheWeek: true,
          AuthorSpotlight: true,
          BookGrid: {
            props: ['books'],
            template: `
              <div>
                <button
                  class="close-book-list"
                  @click="$emit('close')"
                >
                  Close
                </button>
                <span class="listed-book-count">{{ books.length }}</span>
              </div>
            `
          }
        }
      }
    })

    await wrapper.findAll('.browse-genre').at(0).findAll('button').at(1).trigger('click')
    await flushPromises()
    expect(wrapper.find('#search').exists()).toBe(true)
    expect(wrapper.find('.listed-book-count').text()).toBe('1')

    await wrapper.find('.close-book-list').trigger('click')
    expect(wrapper.find('#search').exists()).toBe(true)
    expect(wrapper.find('.listed-book-count').text()).toBe('0')
    expect(wrapper.findAll('.browse-genre')).toHaveLength(2)
  })
})
