import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import SignInView from '../SignInView.vue'
import SignUpView from '../SignUpView.vue'

const globalOptions = {
  stubs: {
    RouterLink: {
      template: '<a><slot /></a>'
    }
  }
}

describe('account forms', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends sign-in details to the backend and reports its response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Welcome back, reader.' })
    }))
    const wrapper = mount(SignInView, { global: globalOptions })

    await wrapper.find('#signin-email').setValue('reader@example.com')
    await wrapper.find('#signin-password').setValue('reader-password')
    await wrapper.find('#keep-signed-in').setValue(true)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('#signin-email').element.value).toBe('reader@example.com')
    expect(wrapper.find('#keep-signed-in').element.checked).toBe(true)
    expect(fetch).toHaveBeenCalledWith('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'reader@example.com',
        password: 'reader-password',
        keepSignedIn: true
      })
    })
    expect(wrapper.find('[role="status"]').text()).toBe('Welcome back, reader.')
  })

  it('sends sign-up details including selected genres and reports backend errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'That email is already registered.' })
    }))
    const wrapper = mount(SignUpView, { global: globalOptions })

    const fictionButton = wrapper.find('.genre-chip')
    await fictionButton.trigger('click')
    expect(fictionButton.attributes('aria-pressed')).toBe('true')

    await wrapper.find('#signup-fullname').setValue('A Reader')
    await wrapper.find('#signup-email').setValue('reader@example.com')
    await wrapper.find('#signup-password').setValue('reader-password')
    await wrapper.find('#signup-terms').setValue(true)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(fetch).toHaveBeenCalledWith('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'A Reader',
        email: 'reader@example.com',
        password: 'reader-password',
        genres: ['Fiction']
      })
    })
    expect(wrapper.find('[role="alert"]').text()).toBe('That email is already registered.')
  })
})
