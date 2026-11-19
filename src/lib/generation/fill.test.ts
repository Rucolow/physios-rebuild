import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pickForDay, resolveAbDay, takesForDay, type FillRule } from './fill.ts'

const g = (dayGroup: FillRule['dayGroup']): FillRule => ({ categoryType: 'general', dailyPickLimit: null, dayGroup })
const cardio: FillRule = { categoryType: 'cardio', dailyPickLimit: null, dayGroup: 'both' }
const high: FillRule = { categoryType: 'high_intensity', dailyPickLimit: null, dayGroup: 'both' }

test('日曜は休み、平日は A/B を交互に数える', () => {
  // 2026-11-02 は月曜
  assert.deepEqual(resolveAbDay('2026-11-02', '2026-11-02'), { isRestDay: false, dayGroup: 'A', workdayIndex: 0 })
  assert.deepEqual(resolveAbDay('2026-11-02', '2026-11-03'), { isRestDay: false, dayGroup: 'B', workdayIndex: 1 })
  assert.equal(resolveAbDay('2026-11-02', '2026-11-08').isRestDay, true)
  assert.deepEqual(resolveAbDay('2026-11-02', '2026-11-09'), { isRestDay: false, dayGroup: 'A', workdayIndex: 6 })
})

test('見出しから 1 種目、A は下半身・B は上半身、自転車とジョギングは日替わりで片方、高強度は 2', () => {
  const shelf = [
    { size: 3, rule: g('both') }, // 準備
    { size: 3, rule: g('A') }, // 下半身
    { size: 3, rule: g('B') }, // 上半身
    { size: 3, rule: cardio }, // 自転車
    { size: 3, rule: cardio }, // ジョギング
    { size: 5, rule: high },
  ]
  assert.deepEqual(takesForDay(shelf, 0, null), [1, 1, 0, 1, 0, 2])
  assert.deepEqual(takesForDay(shelf, 1, null), [1, 0, 1, 0, 1, 2])
})

test('A の日は 16 に足りない分を下半身に足し、B の日は足さない', () => {
  const shelf = [
    { size: 3, rule: g('both') },
    { size: 3, rule: g('A') },
    { size: 3, rule: g('A') },
    { size: 3, rule: g('B') },
    { size: 3, rule: cardio },
  ]
  // A: 準備1 + 下半身1+1 + 自転車1 = 4 → 下半身に 1 本ずつ足して 7（下半身は各 3 で尽きる）
  assert.deepEqual(takesForDay(shelf, 0, 16), [1, 3, 3, 0, 1])
  assert.deepEqual(takesForDay(shelf, 0, 6), [1, 2, 2, 0, 1])
  assert.deepEqual(takesForDay(shelf, 1, 16), [1, 0, 0, 1, 1])
})

test('見出しの中は、前にその見出しが出た日の続きから進む', () => {
  const shelf = [
    { items: ['bike10', 'bike20', 'bike30'], rule: cardio },
    { items: ['jog10', 'jog20', 'jog30'], rule: cardio },
    { items: ['p1', 'p2', 'p3'], rule: g('both') },
  ]
  const day = (i: number) => pickForDay(shelf, { dayGroup: i % 2 === 0 ? 'A' : 'B', workdayIndex: i }, null)
  assert.deepEqual(day(0), [['bike10'], [], ['p1']])
  assert.deepEqual(day(1), [[], ['jog10'], ['p2']])
  assert.deepEqual(day(2), [['bike20'], [], ['p3']])
  assert.deepEqual(day(4), [['bike30'], [], ['p2']])
  assert.deepEqual(day(6), [['bike10'], [], ['p1']])
})

test('行を変えた日が B に当たるときは、新しい行の 0 番目の稼働日を B として組む', () => {
  const shelf = [
    { items: ['p1', 'p2'], rule: g('both') },
    { items: ['l1', 'l2'], rule: g('A') },
    { items: ['u1', 'u2'], rule: g('B') },
  ]
  assert.deepEqual(pickForDay(shelf, { dayGroup: 'B', workdayIndex: 0 }, null), [['p1'], [], ['u1']])
  assert.deepEqual(pickForDay(shelf, { dayGroup: 'A', workdayIndex: 1 }, null), [['p2'], ['l1'], []])
  assert.deepEqual(pickForDay(shelf, { dayGroup: 'B', workdayIndex: 2 }, null), [['p1'], [], ['u2']])
})
