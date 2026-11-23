import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import SignInView from '../SignInView.vue'
import SignUpView from '../SignUpView.vue'
import { signIn, signUp } from '../../services/auth'

const push = vi.fn()

vi.mock('../../services/auth', () => ({
  signIn: vi.fn(),
  signUp: vi.fn()
}))

vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    useRouter: () => ({ push })
  }
})

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
    signIn.mockResolvedValue({ message: 'Welcome back, reader.' })
    vi.stubGlobal('fetch', vi.fn())
    const wrapper = mount(SignInView, { global: globalOptions })

    await wrapper.find('#signin-email').setValue('reader@example.com')
    await wrapper.find('#signin-password').setValue('reader-password')
    await wrapper.find('#keep-signed-in').setValue(true)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('#signin-email').element.value).toBe('reader@example.com')
    expect(wrapper.find('#keep-signed-in').element.checked).toBe(true)
    expect(signIn).toHaveBeenCalledWith({
      email: 'reader@example.com',
      password: 'reader-password',
      keepSignedIn: true
    })
    expect(wrapper.find('[role="status"]').text()).toBe('Welcome back, reader.')
  })

  it('sends sign-up details including selected genres and reports backend errors', async () => {
    signUp.mockRejectedValue(new Error('That email is already registered.'))
    vi.stubGlobal('fetch', vi.fn())
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

    expect(signUp).toHaveBeenCalledWith({
      name: 'A Reader',
      email: 'reader@example.com',
      password: 'reader-password',
      genres: ['Fiction']
    })
    expect(wrapper.find('[role="alert"]').text()).toBe('That email is already registered.')
  })
})
