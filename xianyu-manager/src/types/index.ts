// ======================== 账号管理 ========================
export type LoginType = 'cookie' | 'password'

export interface XianyuAccount {
  id: number
  nickname: string
  avatar?: string
  cookie: string
  /** 登录方式：cookie 或 password */
  loginType: LoginType
  /** 账号密码登录时使用的手机号/用户名（脱敏展示） */
  loginPhone?: string
  status: 'online' | 'offline' | 'expired' | 'error'
  goodsCount: number
  todayMessages: number
  totalMessages: number
  autoReply: boolean
  createdAt: string
  lastActiveAt: string
}

// ======================== 商品管理 ========================
export type ProductStatus = 'draft' | 'pending' | 'published' | 'offline' | 'failed'
export type ProductSource = 'manual' | 'taobao' | 'alibaba' | 'xianyu' | 'pinduoduo'

export interface Product {
  id: number
  accountId?: number
  name: string
  price: number
  originalPrice?: number
  profitRate?: number
  category: string
  desc: string
  images: string[]
  status: ProductStatus
  source: ProductSource
  sourceUrl?: string
  sourcePrice?: number
  stock?: number
  soldCount?: number
  createdAt: string
  publishedAt?: string
}

// ======================== 链接解析 ========================
export interface ParsedProduct {
  name: string
  price: number
  images: string[]
  desc: string
  category: string
  source: ProductSource
  sourceUrl: string
  sourcePrice: number
  shop?: string
  sales?: number
}

// ======================== AI 回复 ========================
export type AiProvider = 'openai' | 'qianwen' | 'deepseek' | 'gemini' | 'custom'

export interface AiConfig {
  id: number
  provider: AiProvider
  apiKey: string
  baseUrl?: string
  model: string
  systemPrompt: string
  temperature: number
  maxTokens: number
  enabled: boolean
  createdAt: string
}

export interface ReplyRule {
  id: number
  accountId?: number
  type: 'keyword' | 'product' | 'global' | 'ai'
  keywords?: string[]
  productId?: number
  replyContent: string
  useAi: boolean
  priority: number
  enabled: boolean
  hitCount: number
  createdAt: string
}

// ======================== 热销品 ========================
export interface HotItem {
  rank: number
  name: string
  want: number
  avgPrice: number
  category: string
  trend: 'up' | 'down' | 'new'
  score: number
  imageUrl?: string
}

// ======================== API 响应通用格式 ========================
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface PageResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
