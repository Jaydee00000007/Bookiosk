import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import BookCard from '../BookCard.vue'
import { useMyShelf } from '../../composables/useMyShelf'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() })
}))

const book = {
  id: 'book-1',
  volumeInfo: {
    title: 'African stories',
    authors: ['A. Writer']
  }
}

describe('BookCard shelf action', () => {
  const { savedBooks } = useMyShelf()

  beforeEach(() => {
    localStorage.clear()
    savedBooks.value = []
  })

  it('adds and removes a book with a reactive active state', async () => {
    const wrapper = mount(BookCard, { props: { book } })
    const shelfButton = wrapper.get('.shelf-button')

    expect(shelfButton.text()).toBe('Add to My Shelf')
    expect(shelfButton.attributes('aria-pressed')).toBe('false')

    await shelfButton.trigger('click')

    expect(savedBooks.value).toEqual([book])
    expect(shelfButton.text()).toBe('Remove from My Shelf')
    expect(shelfButton.classes()).toContain('is-saved')
    expect(shelfButton.attributes('aria-pressed')).toBe('true')

    await shelfButton.trigger('click')

    expect(savedBooks.value).toEqual([])
    expect(shelfButton.text()).toBe('Add to My Shelf')
    expect(shelfButton.classes()).not.toContain('is-saved')
  })
})
