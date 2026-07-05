import type { Question } from '../types'
import d1 from './d1.json'
import d2 from './d2.json'
import d3 from './d3.json'
import d4 from './d4.json'
import d5 from './d5.json'
import samples from './samples.json'

export const questions: Question[] = [
  ...d1,
  ...d2,
  ...d3,
  ...d4,
  ...d5,
  ...samples,
] as Question[]
