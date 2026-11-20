import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseLlmsFull, jaDateToIso } from './parse.ts'

const SAMPLE = `# BRÜCKE — Full Article Index

> 説明

---

# 題その一

- URL: https://brucke.app/articles/one
- Author: Quelle と Feder
- Published: 2026年7月3日
- Category: 研究・教育 / 研究手法
- Access: free

> 副題その一

# 題その一

本文一。

## 小見出し

# 題その二

- URL: https://brucke.app/articles/two
- Author: 清水
- Published: 2026年6月13日
- Category: 臨床
- Access: free

本文二。
`

test('記事ごとに分け、題・副題・本文を取り出す', () => {
  const a = parseLlmsFull(SAMPLE)
  assert.equal(a.length, 2)
  assert.equal(a[0].slug, 'one')
  assert.equal(a[0].title, '題その一')
  assert.equal(a[0].subtitle, '副題その一')
  assert.equal(a[0].publishedOn, '2026-07-03')
  assert.equal(a[0].category, '研究・教育 / 研究手法')
  assert.equal(a[0].body, '本文一。\n\n## 小見出し')
  assert.equal(a[1].subtitle, null)
  assert.equal(a[1].body, '本文二。')
})

test('和暦でない日付は null', () => {
  assert.equal(jaDateToIso('July 3'), null)
})
