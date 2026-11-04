import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fillDay, pickForDay, resolveAbDay, rotate } from './fill.ts'

test('日曜は休み、平日は A/B を交互に数える', () => {
  // 2026-11-02 は月曜
  assert.deepEqual(resolveAbDay('2026-11-02', '2026-11-02'), { isRestDay: false, dayGroup: 'A', workdayIndex: 0 })
  assert.deepEqual(resolveAbDay('2026-11-02', '2026-11-03'), { isRestDay: false, dayGroup: 'B', workdayIndex: 1 })
  assert.equal(resolveAbDay('2026-11-02', '2026-11-08').isRestDay, true)
  // 土曜(11/7)は 5 日目、翌月曜(11/9)は日曜を飛ばして 6 日目
  assert.deepEqual(resolveAbDay('2026-11-02', '2026-11-09'), { isRestDay: false, dayGroup: 'A', workdayIndex: 6 })
})

test('確保してから周回し、量に達したら止める', () => {
  const cells = [
    { poolSize: 3, rule: { categoryType: 'general' as const, dailyPickLimit: null, dayGroup: 'both' as const } },
    { poolSize: 6, rule: { categoryType: 'general' as const, dailyPickLimit: null, dayGroup: 'A' as const } },
    { poolSize: 2, rule: { categoryType: 'cardio' as const, dailyPickLimit: null, dayGroup: 'both' as const } },
    { poolSize: 5, rule: { categoryType: 'high_intensity' as const, dailyPickLimit: null, dayGroup: 'both' as const } },
  ]
  const a = fillDay(cells, { dayGroup: 'A', workdayIndex: 0 }, 8)
  // 確保 cardio 1 + high 2 = 3、残り 5 を見出し 0,1 で周回 → 3 と 2... 0 は 3 で尽きる
  assert.deepEqual(a.map((p) => p.take), [3, 2, 1, 2])
  const b = fillDay(cells, { dayGroup: 'B', workdayIndex: 1 }, 8)
  assert.deepEqual(b.map((p) => p.take), [3, 0, 1, 2])
})

test('量が無いプロトコルでは全件', () => {
  const r = fillDay([{ poolSize: 4, rule: null }], { dayGroup: 'A', workdayIndex: 3 }, null)
  assert.deepEqual(r, [{ take: 4, offset: null }])
})

test('巡回は前日の続きから採る', () => {
  assert.deepEqual(rotate(['a', 'b', 'c', 'd'], 2, 3), ['d', 'a'])
  const shelf = [{ items: ['a', 'b', 'c', 'd'], rule: { categoryType: 'cardio' as const, dailyPickLimit: null, dayGroup: 'both' as const } }]
  assert.deepEqual(pickForDay(shelf, { dayGroup: 'A', workdayIndex: 0 }, 16), [['a']])
  assert.deepEqual(pickForDay(shelf, { dayGroup: 'B', workdayIndex: 1 }, 16), [['b']])
  assert.deepEqual(pickForDay(shelf, { dayGroup: 'A', workdayIndex: 2 }, 16), [['c']])
})
