// BaseBlock — спільні поля. & поєднує його з полями конкретної секції.
export type BaseBlock = { anchor: string; title: string; subtitle?: string }
export interface MediaImage { src: string; alt: string }
export interface NavigationLink { label: string; link: string }
export interface Topic { icon: string; title: string; text: string }
export interface ButtonInfo { text: string; link: string; variant: 'primary' | 'secondary' }
export interface Epoch { title: string; period: string; description: string; detail: string; image: MediaImage | null }
export interface Philosopher { name: string; years: string; idea: string; bio: string; epoch: string; image: MediaImage | null }
export interface PhilosophicalQuote { text: string; author: string; source: string; isParaphrase: boolean }

export type HeroBlock = BaseBlock & { type: 'hero'; badge: string; image: MediaImage | null; buttons: ButtonInfo[] }
export type AboutBlock = BaseBlock & { type: 'about'; text: string; topics: Topic[] }
export type FeaturesBlock = BaseBlock & { type: 'features'; items: Topic[] }
export type EpochsBlock = BaseBlock & { type: 'epochs'; items: Epoch[] }
export type PhilosophersBlock = BaseBlock & { type: 'philosophers'; items: Philosopher[] }
export type QuestionsBlock = BaseBlock & { type: 'questions'; items: Array<{ question: string; answer: string }> }
export type QuotesBlock = BaseBlock & { type: 'quotes'; items: PhilosophicalQuote[] }
export type ProjectInfoBlock = BaseBlock & { type: 'projectInfo'; text: string; contactEmail: string }
// | — Union Type: сторінка містить блоки різних типів.
export type PageBlock = HeroBlock | AboutBlock | FeaturesBlock | EpochsBlock | PhilosophersBlock | QuestionsBlock | QuotesBlock | ProjectInfoBlock
