import { test } from 'node:test'
import assert from 'node:assert/strict'
import { searchMatches } from './search.ts'

test('かなの違い・ローマ字・全角半角で外さない', () => {
  const kenta = '佐藤 健太 ケンタ 健太くん U-19 前距腓靭帯損傷・軽度'
  assert.equal(searchMatches(kenta, 'けんた'), true)
  assert.equal(searchMatches(kenta, 'ケンタ'), true)
  assert.equal(searchMatches(kenta, 'kenta'), true)
  assert.equal(searchMatches(kenta, 'Ｋｅｎｔａ'), true)
  assert.equal(searchMatches(kenta, '佐藤健'), true)
  assert.equal(searchMatches(kenta, '佐藤 靭帯'), true)
  assert.equal(searchMatches(kenta, 'u19'), false)
  assert.equal(searchMatches(kenta, 'U-19'), true)
  assert.equal(searchMatches(kenta, 'しょう'), false)
  assert.equal(searchMatches('森 大和 ヤマト ハムストリングス肉離れ', 'はむ'), true)
  assert.equal(searchMatches('森 大和 ヤマト ハムストリングス肉離れ', 'hamusuto'), true)
  assert.equal(searchMatches('佐藤 翔 ショウ', 'sho'), true)
  assert.equal(searchMatches('佐藤 翔 ショウ', 'syou'), true)
  assert.equal(searchMatches('田中 蓮', ''), true)
})
