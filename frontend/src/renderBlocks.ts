import type { PageBlock } from './types/blocks'
import { renderHero } from './blocks/hero'
import { renderAbout } from './blocks/about'
import { renderFeatures } from './blocks/features'
import { renderEpochs } from './blocks/epochs'
import { renderPhilosophers } from './blocks/philosophers'
import { renderQuestions } from './blocks/questions'
import { renderQuotes } from './blocks/quotes'
import { renderProjectInfo } from './blocks/project-info'

// Union Type PageBlock: поле type визначає тип секції без any.
export function renderBlocks(blocks: PageBlock[]): DocumentFragment {
  const output = document.createDocumentFragment()

  for (const block of blocks) {
    if (!block || typeof block !== 'object') continue

    try {
      switch (block.type) {
        case 'hero':
          output.append(renderHero(block))
          break
        case 'about':
          output.append(renderAbout(block))
          break
        case 'features':
          output.append(renderFeatures(block))
          break
        case 'epochs':
          output.append(renderEpochs(block))
          break
        case 'philosophers':
          output.append(renderPhilosophers(block))
          break
        case 'questions':
          output.append(renderQuestions(block))
          break
        case 'quotes':
          output.append(renderQuotes(block))
          break
        case 'projectInfo':
          output.append(renderProjectInfo(block))
          break
        default:
          // Новий або невідомий CMS-блок не ламає всю сторінку.
          console.warn('Невідомий блок CMS:', (block as { type: string }).type)
      }
    } catch (error: unknown) {
      console.error(`Помилка під час показу блоку ${block.type}`, error)
    }
  }

  return output
}
