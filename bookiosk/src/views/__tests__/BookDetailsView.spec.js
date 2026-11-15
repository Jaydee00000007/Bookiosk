import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import BookDetailsView from '../BookDetailsView.vue'
import { getBookById } from '../../services/googleBooks'
import { recordBookView } from '../../composables/useBookViews'

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: 'book-1' } })
}))

vi.mock('../../components/SiteFooter.vue', () => ({
  default: { template: '<footer />' }
}))

vi.mock('../../components/NavBar.vue', () => ({
  default: { template: '<nav />' }
}))

vi.mock('../../services/googleBooks', () => ({
  getBookById: vi.fn()
}))

vi.mock('../../composables/useBookViews', () => ({
  recordBookView: vi.fn()
}))

vi.mock('../../composables/useMyShelf', () => ({
  useMyShelf: () => ({
    isSaved: () => false,
    toggleBook: vi.fn()
  })
}))

describe('BookDetailsView', () => {
  beforeEach(() => {
    getBookById.mockReset()
    recordBookView.mockReset()
    getBookById.mockResolvedValue({
      id: 'book-1',
      volumeInfo: {
        title: 'African stories',
        authors: ['Ama Writer'],
        description: '<p>A collection of stories.</p>',
        publisher: 'Story House',
        pageCount: 240,
        categories: ['Fiction']
      }
    })
  })

  it('presents book details and records a successful view', async () => {
    const wrapper = mount(BookDetailsView, {
      global: {
        stubs: {
          NavBar: true,
          SiteFooter: true,
          RouterLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })
    await flushPromises()

    expect(getBookById).toHaveBeenCalledWith('book-1')
    expect(recordBookView).toHaveBeenCalledWith('book-1')
    expect(wrapper.get('h1').text()).toBe('African stories')
    expect(wrapper.text()).toContain('A collection of stories.')
    expect(wrapper.text()).toContain('240 pages')
  })

  it('does not count a failed book load as a view', async () => {
    getBookById.mockRejectedValueOnce(new Error('Book service unavailable'))
    const wrapper = mount(BookDetailsView, {
      global: {
        stubs: {
          NavBar: true,
          SiteFooter: true,
          RouterLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })
    await flushPromises()

    expect(recordBookView).not.toHaveBeenCalled()
    expect(wrapper.get('[role="alert"]').text()).toContain('Book service unavailable')
  })
})
