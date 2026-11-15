import { beforeEach, describe, expect, it } from 'vitest'

import {
  getMostViewedBookId,
  recordBookView
} from '../useBookViews'

describe('useBookViews', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists view counts and returns the most-viewed book', () => {
    recordBookView('book-a')
    recordBookView('book-b')
    recordBookView('book-a')

    expect(getMostViewedBookId()).toBe('book-a')
    expect(JSON.parse(localStorage.getItem('bookiosk-book-views'))).toEqual([
      { id: 'book-a', count: 2 },
      { id: 'book-b', count: 1 }
    ])
  })
})
