import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data')
const files = ['d1.json', 'd2.json', 'd3.json', 'd4.json', 'd5.json', 'samples.json']

const errors = []
const ids = new Set()
const domainCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
let total = 0

for (const file of files) {
  const questions = JSON.parse(readFileSync(join(dataDir, file), 'utf-8'))
  if (!Array.isArray(questions)) {
    errors.push(`${file}: not an array`)
    continue
  }
  for (const q of questions) {
    total += 1
    const where = `${file} ${q.id ?? '(no id)'}`
    if (!q.id) errors.push(`${where}: missing id`)
    else if (ids.has(q.id)) errors.push(`${where}: duplicate id`)
    else ids.add(q.id)

    if (![1, 2, 3, 4, 5].includes(q.domain)) errors.push(`${where}: invalid domain ${q.domain}`)
    else domainCounts[q.domain] += 1

    if (typeof q.task !== 'string' || !/^\d\.\d$/.test(q.task))
      errors.push(`${where}: invalid task "${q.task}"`)
    if (!['knowledge', 'skill', 'sample'].includes(q.type))
      errors.push(`${where}: invalid type "${q.type}"`)
    if (typeof q.question !== 'string' || q.question.length < 20)
      errors.push(`${where}: question missing or too short`)
    if (q.type !== 'sample' && !q.question.includes('____') && !q.question.includes('?'))
      errors.push(`${where}: fill-in question has neither a blank nor a question mark`)
    if (!Array.isArray(q.options) || q.options.length !== 4)
      errors.push(`${where}: must have exactly 4 options`)
    else {
      if (new Set(q.options).size !== 4) errors.push(`${where}: options are not unique`)
      if (!Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex > 3)
        errors.push(`${where}: answerIndex out of range`)
    }
    if (typeof q.explanation !== 'string' || q.explanation.length < 40)
      errors.push(`${where}: explanation missing or too short`)
  }
}

console.log(`Total questions: ${total}`)
for (const d of [1, 2, 3, 4, 5]) {
  console.log(`  Domain ${d}: ${domainCounts[d]}`)
}

if (errors.length > 0) {
  console.error(`\n${errors.length} validation error(s):`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}
console.log('\nAll questions valid.')
