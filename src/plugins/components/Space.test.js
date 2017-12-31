import React from 'react'
import {mount} from 'enzyme'
import Space from './Space'

describe('<Space />', () => {
  test('default space', () => {
    const s = mount(<Space />)
    expect(s.childAt(0).props().children).toBe(' ')
  })

  test('has 1 space', () => {
    const s = mount(<Space count={1} />)
    expect(s.childAt(0).props().children).toBe(' ')
  })

  test('has 2 space', () => {
    const s = mount(<Space count={2} />)
    expect(s.childAt(0).props().children).toBe(' '.repeat(2))
  })
})
