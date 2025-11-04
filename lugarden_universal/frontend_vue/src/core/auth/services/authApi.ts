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

    // 手动创建带Authorization header的请求
    const response = await fetch('/api/my-works', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

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
  
  // 简单实现：后续可以解析JWT payload
  // 现在先返回null，等登录后再完善
  return null
}

