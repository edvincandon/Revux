import { expect } from 'chai'
import sinon from 'sinon'
import shallowEqual from '../src/utils/shallowEqual'

describe('shallowEqual', () => {
  it('should return true if arguments fields are equal', () => {
    const o = {}
    const d = () => 1
    expect(shallowEqual({ a: 1, b: 2, c: undefined }, { a: 1, b: 2, c: undefined })).to.eql(true)
    expect(shallowEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })).to.eql(true)
    expect(shallowEqual({ a: 1, b: 2, c: o }, { a: 1, b: 2, c: o })).to.eql(true)
    expect(shallowEqual({ a: 1, b: 2, c: o, d }, { a: 1, b: 2, c: o, d })).to.eql(true)
  })
  it('should return false if arguments fields are different function identities', () => {
    expect(shallowEqual({ a: 1, b: 2, d: () => 1 }, { a: 1, b: 2, d: () => 1 })).to.eql(false)
  })
  it('should return false if arguments have different number of keys', () => {
    expect(shallowEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })).to.eql(false)
    expect(shallowEqual({ a: 1, b: 2}, { a: 1, b: 2, c: 3 })).to.eql(false)
  })
  it('should return false if arguments have different keys', () => {
    expect(shallowEqual({a: 1, b: 2, c: undefined}, {a: 1, bb: 2, c: undefined})).to.eql(false)
  })
  it('should return true for 0', () => {
    expect(shallowEqual(0, 0)).to.eql(true)
  })
  it('should return false for NaN', () => {
    expect(shallowEqual(NaN, false)).to.eql(false)
    expect(shallowEqual(function() {}, 1)).to.eql(false)
  })
})
