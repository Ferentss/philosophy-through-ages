import type { NavigationLink, PageBlock } from './blocks'
// Interface описує очікувану відповідь HTTP API.
export interface CommonResponse { siteName: string; logoText: string; menu: NavigationLink[]; footer: { text: string } }
export interface PageResponse { path: string; title: string; blocks: PageBlock[] }
