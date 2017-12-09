import {format} from './utils'

describe('test format()', () => {
  test('should return empty array without arguments', () => {
    expect(format()).toEqual([])
  })

  test('true, 1, "a"', () => {
    expect(format(true, 1, 'a')).toEqual([true, 1, 'a'])
  })

  test('"%d %s %O %O", 1, true, {a: 1}, [1, 2]', () => {
    expect(format('%d %s %O %O', 1, true, {a: 1}, [1, 2])).toEqual([1, ' true ', {a: 1}, ' ', [1, 2]])
  })

  test('"%d %s %O", 1, true, {a: 1}, [1, 2]', () => {
    expect(format('%d %s %O', 1, true, {a: 1}, [1, 2])).toEqual([1, ' true ', {a: 1}, [1, 2]])
  })

  test('"%d %s %O %O", 1, true, {a: 1}', () => {
    expect(format('%d %s %O %O', 1, true, {a: 1})).toEqual([1, ' true ', {a: 1}, ' %O'])
  })
})
