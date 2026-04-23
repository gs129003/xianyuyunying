import http from './client'
import type { XianyuAccount, ApiResponse, PageResult } from '../types'

export const accountApi = {
  /** 获取账号列表 */
  list: (params?: { page?: number; pageSize?: number }) =>
    http.get<any, ApiResponse<PageResult<XianyuAccount>>>('/api/accounts', { params }),

  /** 添加账号（Cookie 方式） */
  add: (data: { nickname: string; cookie: string }) =>
    http.post<any, ApiResponse<XianyuAccount>>('/api/accounts', data),

  /** 删除账号 */
  remove: (id: number) =>
    http.delete<any, ApiResponse<null>>(`/api/accounts/${id}`),

  /** 开启/关闭自动回复 */
  toggleAutoReply: (id: number, enabled: boolean) =>
    http.patch<any, ApiResponse<XianyuAccount>>(`/api/accounts/${id}/auto-reply`, { enabled }),

  /** 刷新账号状态 */
  refresh: (id: number) =>
    http.post<any, ApiResponse<XianyuAccount>>(`/api/accounts/${id}/refresh`),

  /** 更新 Cookie */
  updateCookie: (id: number, cookie: string) =>
    http.patch<any, ApiResponse<XianyuAccount>>(`/api/accounts/${id}/cookie`, { cookie }),
}

export const productApi = {
  /** 获取商品列表 */
  list: (params?: { page?: number; pageSize?: number; status?: string; accountId?: number }) =>
    http.get<any, ApiResponse<PageResult<any>>>('/api/products', { params }),

  /** 新建商品 */
  create: (data: Partial<any>) =>
    http.post<any, ApiResponse<any>>('/api/products', data),

  /** 更新商品 */
  update: (id: number, data: Partial<any>) =>
    http.put<any, ApiResponse<any>>(`/api/products/${id}`, data),

  /** 删除商品 */
  remove: (id: number) =>
    http.delete<any, ApiResponse<null>>(`/api/products/${id}`),

  /** 上架/下架 */
  toggleStatus: (id: number, status: 'published' | 'offline') =>
    http.patch<any, ApiResponse<any>>(`/api/products/${id}/status`, { status }),

  /** 发布到闲鱼 */
  publish: (id: number, accountId?: number) =>
    http.post<any, ApiResponse<any>>(`/api/products/${id}/publish`, { accountId }),

  /** 批量发布 */
  batchPublish: (ids: number[], accountId?: number) =>
    http.post<any, ApiResponse<any>>('/api/products/batch-publish', { ids, accountId }),
}

export const parseApi = {
  /**
   * 解析电商链接，自动提取商品信息
   * 支持淘宝、天猫、阿里巴巴1688、闲鱼、拼多多
   */
  parseUrl: (url: string) =>
    http.post<any, ApiResponse<any>>('/api/parse/url', { url }),

  /** 批量解析 */
  batchParse: (urls: string[]) =>
    http.post<any, ApiResponse<any[]>>('/api/parse/batch', { urls }),
}

export const aiApi = {
  /** 获取 AI 配置 */
  getConfig: () =>
    http.get<any, ApiResponse<any>>('/api/ai/config'),

  /** 保存 AI 配置 */
  saveConfig: (data: any) =>
    http.post<any, ApiResponse<any>>('/api/ai/config', data),

  /** 测试 AI 配置 */
  testConfig: (message: string) =>
    http.post<any, ApiResponse<{ reply: string; latency: number }>>('/api/ai/test', { message }),

  /** 获取回复规则列表 */
  getRules: (params?: { accountId?: number }) =>
    http.get<any, ApiResponse<any[]>>('/api/ai/rules', { params }),

  /** 创建回复规则 */
  createRule: (data: any) =>
    http.post<any, ApiResponse<any>>('/api/ai/rules', data),

  /** 更新回复规则 */
  updateRule: (id: number, data: any) =>
    http.put<any, ApiResponse<any>>(`/api/ai/rules/${id}`, data),

  /** 删除回复规则 */
  deleteRule: (id: number) =>
    http.delete<any, ApiResponse<null>>(`/api/ai/rules/${id}`),

  /** 规则排序 */
  reorderRules: (ids: number[]) =>
    http.post<any, ApiResponse<null>>('/api/ai/rules/reorder', { ids }),
}

export const hotApi = {
  search: (params: { keyword?: string; category?: string; page?: number }) =>
    http.get<any, ApiResponse<any>>('/api/hot-search', { params }),

  refresh: () =>
    http.post<any, ApiResponse<null>>('/api/hot-search/refresh'),
}

export const systemApi = {
  version: () => http.get<any, ApiResponse<{ version: string; buildAt: string }>>('/api/system/version'),
  checkUpdate: () => http.get<any, ApiResponse<any>>('/api/system/check-update'),
  doUpdate: () => http.post<any, ApiResponse<null>>('/api/system/update'),
  stats: () => http.get<any, ApiResponse<any>>('/api/system/stats'),
}
