import {withSandbox} from './utils'

describe('evalInSandbox', () => {
  test('eval nothing', () => {
    expect(eval(withSandbox())).toBe(undefined)
  })

  test('eval empty string', () => {
    expect(eval(withSandbox(''))).toBe(undefined)
  })

  test('eval simple expression', () => {
    expect(eval(withSandbox('1 + 2'))).toBe(3)
  })

  test('eval express with empty sandbox', () => {
    let a = 1
    let b = 2
    expect(eval(withSandbox('a + b'))).toBe(a + b)
  })

  test('eval express with mock sandbox', () => {
    let a = 1
    let b = 2
    let sandbox = {
      a: 3,
      b: 4
    }
    expect(eval(withSandbox('a + b', sandbox))).toBe(sandbox.a + sandbox.b)

    sandbox = {
      '$': (a, b) => a + b
    }
    expect(eval(withSandbox('$(1, 2)', sandbox))).toBe(3)
    let sandbox2 = sandbox
    sandbox = undefined
    expect(eval(withSandbox('$(1, 2)', sandbox2))).toThrow()
  })

  test('eval expression with this', () => {
    expect(eval(withSandbox('this.a'))).toBe(undefined)
    let sandbox = {
      a: 1
    }
    expect(eval(withSandbox('this.a', sandbox))).toBe(1)
  })
})
