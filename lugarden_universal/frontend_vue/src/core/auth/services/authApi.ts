/**
 * 用户认证API服务
 * 封装用户注册、登录、查询作品等API调用
 */

import { apiClient } from '@/shared/services/api'

// ================================
// 类型定义
// ================================

export interface RegisterRequest {
  username: string
  password: string
  confirmPassword: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  success: boolean
  token?: string
  user?: {
    id: string
    username: string
    createdAt: string
  }
  error?: string
}

export interface Work {
  id: string
  userId: string
  sourcePoemId: string
  mappingId: string
  sourcePoemTitle: string
  sourcePoemChapter: string
  mappingChapter: string
  mappingCombination: string
  mappingMeaning: string | null
  userInput: string
  poemTitle: string
  poemContent: string
  poemQuote: string | null
  poemQuoteSource: string | null
  conversationId: string
  messageId: string
  usageMetadata: string
  createdAt: string
}

export interface MyWorksResponse {
  success: boolean
  works?: Work[]
  error?: string
}

// ================================
// 认证相关API
// ================================

/**
 * 用户注册
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    return response
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '注册失败'
    }
  }
}

/**
 * 用户登录
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', data)
    return response
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '登录失败'
    }
  }
}

/**
 * 获取当前用户的所有作品
 */
export async function getMyWorks(): Promise<MyWorksResponse> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return {
        success: false,
        error: '未登录'
      }
    }

    // 使用原生fetch（因为ApiClient暂时不支持自定义headers）
    // 但手动检测401并清除token
    const response = await fetch('/api/my-works', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    // 检测401：认证失败
    if (response.status === 401) {
      console.warn('[authApi] 检测到401，清除token并跳转登录页')
      localStorage.removeItem('token')
      
      // 跳转到登录页（保留当前路径作为redirect）
      const currentPath = window.location.pathname + window.location.search
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
      
      return {
        success: false,
        error: '认证失败，请重新登录'
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '获取作品列表失败' }))
      return {
        success: false,
        error: errorData.error || '获取作品列表失败'
      }
    }

    return await response.json()
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取作品列表失败'
    }
  }
}

// ================================
// Token管理辅助函数
// ================================

/**
 * 保存Token到localStorage
 */
export function saveToken(token: string): void {
  localStorage.setItem('token', token)
}

/**
 * 获取Token
 */
export function getToken(): string | null {
  return localStorage.getItem('token')
}

/**
 * 清除Token
 */
export function clearToken(): void {
  localStorage.removeItem('token')
}

/**
 * 检查是否已登录
 */
export function isAuthenticated(): boolean {
  return !!getToken()
}

/**
 * 获取当前用户信息（从token解析，简单版本）
 */
export function getCurrentUser(): { username: string } | null {
  const token = getToken()
  if (!token) return null
  
  try {
    // JWT格式：header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    // 解码payload（base64）
    const payload = JSON.parse(atob(parts[1]))
    return {
      username: payload.username || payload.sub || '用户'
    }
  } catch (error) {
    console.error('[authApi] 解析token失败:', error)
    return null
  }
}

/**
 * 获取当前用户名
 */
export function getUsername(): string | null {
  const user = getCurrentUser()
  return user?.username || null
}

// ================================
// 保存共笔作品
// ================================

export interface SaveGongBiWorkRequest {
  sourcePoemId: string
  mappingId: string
  userInput: string
  poemTitle: string
  poemContent: string
  poemQuote?: string | null
  poemQuoteSource?: string | null
  conversationId: string
  messageId: string
  usageMetadata: any
}

export interface SaveWorkResponse {
  success: boolean
  work?: any
  error?: string
}

/**
 * 保存共笔作品到我的作品集
 */
export async function saveGongBiWork(data: SaveGongBiWorkRequest): Promise<SaveWorkResponse> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return {
        success: false,
        error: '未登录'
      }
    }

    const response = await fetch('/api/my-works/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })

    // 检测401：认证失败
    if (response.status === 401) {
      console.warn('[authApi] 检测到401，清除token并跳转登录页')
      localStorage.removeItem('token')
      
      // 跳转到登录页（保留当前路径作为redirect）
      const currentPath = window.location.pathname + window.location.search
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
      
      return {
        success: false,
        error: '认证失败，请重新登录'
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '保存作品失败' }))
      return {
        success: false,
        error: errorData.error || '保存作品失败'
      }
    }

    return await response.json()
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '保存作品失败'
    }
  }
}

// ================================
// 删除账号
// ================================

export interface DeleteAccountRequest {
  username: string
}

export interface DeleteAccountResponse {
  success: boolean
  message?: string
  error?: string
}

/**
 * 删除账号
 * @param username - 用户输入的用户名（用于二次确认）
 */
export async function deleteAccount(username: string): Promise<DeleteAccountResponse> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return {
        success: false,
        error: '未登录'
      }
    }

    const response = await fetch('/api/user/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username })
    })

    // 检测401：认证失败
    if (response.status === 401) {
      console.warn('[authApi] 检测到401，清除token并跳转登录页')
      localStorage.removeItem('token')
      
      // 跳转到登录页
      window.location.href = '/login'
      
      return {
        success: false,
        error: '认证失败，请重新登录'
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '删除账号失败' }))
      return {
        success: false,
        error: errorData.message || errorData.error || '删除账号失败'
      }
    }

    const result = await response.json()
    return result
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '删除账号失败'
    }
  }
}

