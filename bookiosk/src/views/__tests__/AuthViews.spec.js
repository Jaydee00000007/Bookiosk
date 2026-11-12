import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

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
  it('binds sign-in fields and reports that authentication is not configured', async () => {
    const wrapper = mount(SignInView, { global: globalOptions })

    await wrapper.find('#signin-email').setValue('reader@example.com')
    await wrapper.find('#signin-password').setValue('reader-password')
    await wrapper.find('#keep-signed-in').setValue(true)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('#signin-email').element.value).toBe('reader@example.com')
    expect(wrapper.find('#keep-signed-in').element.checked).toBe(true)
    expect(wrapper.find('[role="status"]').text()).toContain('Nothing was sent or saved')
  })

  it('toggles reading interests and validates sign-up without claiming to create an account', async () => {
    const wrapper = mount(SignUpView, { global: globalOptions })

    const fictionButton = wrapper.find('.p-genre')
    await fictionButton.trigger('click')
    expect(fictionButton.attributes('aria-pressed')).toBe('true')

    await wrapper.find('#signup-fullname').setValue('A Reader')
    await wrapper.find('#signup-email').setValue('reader@example.com')
    await wrapper.find('#signup-password').setValue('reader-password')
    await wrapper.find('#signup-terms').setValue(true)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('[role="status"]').text()).toContain('Nothing was sent or saved')
  })
})
