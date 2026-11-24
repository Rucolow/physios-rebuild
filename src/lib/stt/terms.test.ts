import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CLINICAL_TERMS, CLINICAL_TERMS_DE, fitKeyterms, keytermCost, keytermName, mainLanguage, orderKeyterms } from './terms.ts'

test('手がかりは上限に収まる分だけ残し、並び順の先の言葉を優先する', () => {
  const names = Array.from({ length: 25 }, (_, i) => `Vorname${i} Nachname${i}`)
  const aliases = Array.from({ length: 50 }, (_, i) => `カタカナノヨミ${i}`)
  const ordered = orderKeyterms({ names, own: [], injuries: ['前十字靭帯損傷', '前十字靭帯'], aliases, language: 'de' })
  const kept = fitKeyterms(ordered)
  assert.ok(kept.reduce((n, t) => n + keytermCost(t), 0) <= 480)
  for (const n of names) assert.ok(kept.includes(n))
  for (const t of CLINICAL_TERMS_DE) assert.ok(kept.includes(t))
  assert.ok(kept.length < ordered.length)
})

test('日本語のトレーナーでは日本語の所見の言葉を先に残す', () => {
  const names = ['森大和', '佐藤健太', '田中蓮']
  const kept = fitKeyterms(orderKeyterms({ names, own: ['シンスプリント'], injuries: [], aliases: ['ヤマト'], language: 'ja' }))
  assert.deepEqual(kept.slice(0, 4), [...names, 'シンスプリント'])
  assert.ok(kept.includes(CLINICAL_TERMS[0]))
})

test('主に話す言語は最近のメモから決め、無ければ名簿の名前の文字で決める', () => {
  assert.equal(mainLanguage(['de', 'de', 'ja']), 'de')
  assert.equal(mainLanguage(['ja', null]), 'ja')
  assert.equal(mainLanguage([]), null)
  const de = orderKeyterms({ names: ['Jost Mairose'], own: [], injuries: [], aliases: [], language: null })
  assert.equal(de[1], CLINICAL_TERMS_DE[0])
  const ja = orderKeyterms({ names: ['森大和'], own: [], injuries: [], aliases: [], language: null })
  assert.equal(ja[1], CLINICAL_TERMS[0])
})

test('原綴りの名前は「名 姓」、かな・漢字の名前は続けて渡す', () => {
  assert.equal(keytermName('Mairose', 'Jost'), 'Jost Mairose')
  assert.equal(keytermName('森', '大和'), '森大和')
})
