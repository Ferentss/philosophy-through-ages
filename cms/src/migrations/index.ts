import * as initial from './20261020_074222'
import * as philosophy from './20261026_philosophy'
export const migrations = [
  { name: '20261020_074222', up: initial.up, down: initial.down },
  { name: '20261026_philosophy', up: philosophy.up, down: philosophy.down },
]
