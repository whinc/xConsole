import {format} from './utils'

describe('test format()', () => {
  test('should return empty array if arguments is undefined', () => {
    expect(format()).toEqual([])
  })

  test('should return array contain passed in arguments if first argument is not string type', () => {
    expect(format(true, 1, 'a')).toEqual([true, 1, 'a'])
  })

  test('test %i and %d', () => {
    expect(format('%i%i%d%d', 1.2, 2, 1.2, 2)).toEqual([1, 2, 1, 2])
  })

  test('test %f', () => {
    expect(format('%f %f', 1.2, 2)).toEqual([1.2, ' ', 2])
  })

  test('test %s', () => {
    expect(format('%s %s', 'a', true)).toEqual(['a true'])
  })

  test('test %o and %O', () => {
    let o1 = {a: 1}
    let o2 = {b: 2}
    expect(format('%o %O', o1, o2)).toEqual([o1, ' ', o2])
  })

  test('arguments count equal to specifiers count', () => {
    expect(format('%d %s %O %O', 1, true, {a: 1}, [1, 2])).toEqual([1, ' true ', {a: 1}, ' ', [1, 2]])
  })

  test('arguments count great then specifiers count', () => {
    expect(format('%d %s %O', 1, true, {a: 1}, [1, 2])).toEqual([1, ' true ', {a: 1}, [1, 2]])
  })

  test('arguments count less then specifiers count', () => {
    expect(format('%d %s %O %O', 1, true, {a: 1})).toEqual([1, ' true ', {a: 1}, ' %O'])
  })
})
