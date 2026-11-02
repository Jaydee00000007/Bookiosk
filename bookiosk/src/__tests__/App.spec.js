import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts and provides the application layout', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: {
            template: '<main>Bookiosk</main>'
          }
        }
      }
    })

    expect(wrapper.text()).toContain('Bookiosk')
  })
})
