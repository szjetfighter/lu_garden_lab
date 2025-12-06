/**
 * 毒理学报告 - 文字粒子系统
 * 
 * 使用单独的 Mesh 渲染每个字符（支持不同纹理）
 * 每个粒子携带权重信息，决定离心行为
 */

import { ref, shallowRef, markRaw } from 'vue'
import * as THREE from 'three'
import type { ToxicPoem, ToxicToken } from '../data/poems'

export interface ToxicParticle {
  mesh: THREE.Mesh         // 单独的 Mesh
  char: string             // 字符
  weight: number           // 权重 (0, 0.5, 1)
  type: 'core' | 'link' | 'dust'
  home: THREE.Vector3      // 初始位置
  position: THREE.Vector3  // 当前位置
  velocity: THREE.Vector3  // 速度
  rotation: number         // 旋转角度
  opacity: number          // 透明度
  scale: number            // 缩放
  isEjected: boolean       // 是否已被离心甩出
}

// 创建字符纹理
function createCharTexture(char: string, size: number = 128): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  
  // 透明背景
  ctx.clearRect(0, 0, size, size)
  
  // 绿色终端风格字体
  ctx.fillStyle = '#00ff00'
  ctx.font = `bold ${size * 0.7}px "Courier New", monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // 添加发光效果
  ctx.shadowColor = '#00ff00'
  ctx.shadowBlur = 8
  
  ctx.fillText(char, size / 2, size / 2)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

// 纹理缓存
const textureCache = new Map<string, THREE.Texture>()

function getCharTexture(char: string): THREE.Texture {
  if (!textureCache.has(char)) {
    textureCache.set(char, createCharTexture(char))
  }
  return textureCache.get(char)!
}

export function useToxicParticles(scene: THREE.Scene) {
  const particles = ref<ToxicParticle[]>([])
  const meshGroup = shallowRef<THREE.Group | null>(null)
  
  // 布局参数
  const charSize = 0.5
  const charSpacing = 0.55
  const lineSpacing = 0.75
  
  // 离心机旋转状态
  let globalRotation = 0

  const loadPoem = (poem: ToxicPoem) => {
    // 清理旧粒子
    clear()
    
    // 创建组
    const group = new THREE.Group()
    meshGroup.value = markRaw(group)
    
    // 收集所有字符
    const allTokens: { token: ToxicToken; lineIdx: number; charIdx: number }[] = []
    poem.lines.forEach((line, lineIdx) => {
      line.tokens.forEach((token, charIdx) => {
        allTokens.push({ token, lineIdx, charIdx })
      })
    })
    
    if (allTokens.length === 0) return
    
    // 计算布局中心
    const totalLines = poem.lines.length
    const startY = (totalLines - 1) * lineSpacing / 2
    
    // 共享几何体
    const geometry = new THREE.PlaneGeometry(charSize, charSize)
    
    // 创建每个字符的 Mesh
    allTokens.forEach(({ token, lineIdx, charIdx }) => {
      // 计算位置
      const lineTokens = poem.lines[lineIdx].tokens
      const lineWidth = lineTokens.length * charSpacing
      const startX = -lineWidth / 2 + charSpacing / 2
      
      const x = startX + charIdx * charSpacing
      const y = startY - lineIdx * lineSpacing
      const z = 0
      
      const home = new THREE.Vector3(x, y, z)
      
      // 创建材质（每个字符独立材质）
      const texture = getCharTexture(token.char)
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
      })
      
      // 根据权重设置颜色
      if (token.type === 'core') {
        material.color.setHex(0xffffff) // 核心：亮
      } else if (token.type === 'link') {
        material.color.setHex(0xaaffaa) // 连接：中
      } else {
        material.color.setHex(0x66ff66) // 杂质：暗
      }
      
      // 创建 Mesh
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.copy(home)
      
      const particle: ToxicParticle = {
        mesh: markRaw(mesh),
        char: token.char,
        weight: token.weight,
        type: token.type,
        home: home.clone(),
        position: home.clone(),
        velocity: new THREE.Vector3(0, 0, 0),
        rotation: 0,
        opacity: 1,
        scale: 1,
        isEjected: false
      }
      
      particles.value.push(particle)
      group.add(mesh)
    })
    
    scene.add(group)
  }

  const updateParticleMesh = (p: ToxicParticle) => {
    p.mesh.position.copy(p.position)
    p.mesh.rotation.z = p.rotation
    p.mesh.scale.setScalar(p.scale)
    
    // 更新透明度
    const material = p.mesh.material as THREE.MeshBasicMaterial
    material.opacity = p.opacity
    
    // 被甩出的粒子变红
    if (p.isEjected) {
      material.color.setHex(0xff4444)
    }
  }

  /**
   * 应用离心力
   */
  const applyCentrifuge = (rpm: number, deltaTime: number) => {
    if (!meshGroup.value) return
    
    const rpmRatio = rpm / 9000
    
    // 更新全局旋转角度
    const angularVelocity = (rpm * Math.PI * 2) / 60
    globalRotation += angularVelocity * deltaTime
    
    particles.value.forEach(p => {
      if (p.isEjected) {
        // 已甩出：继续飞行并淡出
        p.position.add(p.velocity.clone().multiplyScalar(deltaTime))
        p.opacity = Math.max(0, p.opacity - deltaTime * 0.5)
        p.rotation += deltaTime * 5
        p.scale = Math.max(0, p.scale - deltaTime * 0.3)
      } else {
        // 围绕中心旋转
        const homeX = p.home.x
        const homeY = p.home.y
        const cos = Math.cos(globalRotation)
        const sin = Math.sin(globalRotation)
        
        const rotatedX = homeX * cos - homeY * sin
        const rotatedY = homeX * sin + homeY * cos
        
        // 离心阈值
        const threshold = p.weight * 0.8 + 0.1
        
        if (rpmRatio > threshold) {
          // 甩出！
          p.isEjected = true
          
          const radius = Math.sqrt(rotatedX * rotatedX + rotatedY * rotatedY)
          if (radius > 0.01) {
            const radialDir = new THREE.Vector3(rotatedX, rotatedY, 0).normalize()
            const tangentDir = new THREE.Vector3(-rotatedY, rotatedX, 0).normalize()
            
            const tangentSpeed = angularVelocity * radius * 0.3
            const radialSpeed = 2 + rpmRatio * 3
            
            p.velocity.copy(radialDir).multiplyScalar(radialSpeed)
            p.velocity.add(tangentDir.multiplyScalar(tangentSpeed))
            p.velocity.z = (Math.random() - 0.5) * 1
          } else {
            p.velocity.set(Math.random() - 0.5, Math.random() - 0.5, 0).normalize().multiplyScalar(3)
          }
          
          p.position.set(rotatedX, rotatedY, p.home.z)
        } else {
          // 跟随旋转
          p.position.x = rotatedX
          p.position.y = rotatedY
          p.position.z = p.home.z
          p.rotation = globalRotation
        }
      }
      
      updateParticleMesh(p)
    })
  }

  /**
   * 重置
   */
  const reset = () => {
    globalRotation = 0
    
    particles.value.forEach(p => {
      p.position.copy(p.home)
      p.velocity.set(0, 0, 0)
      p.rotation = 0
      p.opacity = 1
      p.scale = 1
      p.isEjected = false
      
      // 恢复颜色
      const material = p.mesh.material as THREE.MeshBasicMaterial
      if (p.type === 'core') {
        material.color.setHex(0xffffff)
      } else if (p.type === 'link') {
        material.color.setHex(0xaaffaa)
      } else {
        material.color.setHex(0x66ff66)
      }
      material.opacity = 1
      
      updateParticleMesh(p)
    })
  }

  const clear = () => {
    if (meshGroup.value) {
      scene.remove(meshGroup.value)
      
      // 清理材质
      particles.value.forEach(p => {
        const material = p.mesh.material as THREE.MeshBasicMaterial
        material.dispose()
      })
      
      meshGroup.value = null
    }
    particles.value = []
  }

  const getResidue = (): string => {
    return particles.value
      .filter(p => !p.isEjected && p.weight === 1)
      .map(p => p.char)
      .join('')
  }

  const getExtractionRate = (): number => {
    const total = particles.value.length
    const ejected = particles.value.filter(p => p.isEjected).length
    return total > 0 ? ejected / total : 0
  }

  return {
    particles,
    meshGroup,
    loadPoem,
    applyCentrifuge,
    reset,
    clear,
    getResidue,
    getExtractionRate
  }
}
