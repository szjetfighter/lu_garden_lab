import { ref } from 'vue'
import * as THREE from 'three'
import { Text } from 'troika-three-text'

// 思源宋体 - 子集化字体（仅包含诗歌用到的706个字符，210KB）
import sourceHanSerifUrl from '../assets/fonts/思源宋体-subset.ttf?url'
// 卡片背景纹理 - 四季
import springTextureUrl from '../assets/textures/spring-texture.jpg?url'
import summerTextureUrl from '../assets/textures/summer-texture.jpg?url'
import autumnTextureUrl from '../assets/textures/autumn-texture.jpg?url'
import winterTextureUrl from '../assets/textures/winter-texture.jpg?url'

import type { Season } from './useSeasonEffects'

// 季节纹理映射
const seasonTextures: Record<Season, string> = {
  spring: springTextureUrl,
  summer: summerTextureUrl,
  autumn: autumnTextureUrl,
  winter: winterTextureUrl,
}

export interface CharParticle {
  char: string
  mesh: any // Troika Text instance
  home: THREE.Vector3
  position: THREE.Vector3
  velocity: THREE.Vector3
  lineIndex: number
  charIndex: number
}

export function useTextParticles(scene: THREE.Scene) {
  const particles = ref<CharParticle[]>([])
  const isReady = ref(false)
  let cardMesh: THREE.Mesh | null = null  // 卡片mesh引用

  // 清理所有粒子
  const clearParticles = () => {
    isReady.value = false
    
    // 清理场景中所有对象（除了相机和灯光）
    while (scene.children.length > 0) {
      const obj = scene.children[0]
      scene.remove(obj)
      if ((obj as any).dispose) {
        (obj as any).dispose()
      }
    }
    
    particles.value = []
  }

  // 创建文字粒子
  const createParticles = async (lines: string[], season: Season = 'summer') => {
    // 先清理旧的粒子
    clearParticles()

    const charSize = 0.18
    const lineHeight = charSize * 2.2
    const charSpacing = charSize * 1.3

    // 计算总高度（包括所有行）
    const totalHeight = lines.length * lineHeight
    
    // 计算最大行宽
    const maxLineWidth = Math.max(...lines.map(l => l.length)) * charSpacing
    
    // 添加圆角卡片背景
    const cardPadding = 0.5
    const cardWidth = maxLineWidth + cardPadding * 2
    const cardHeight = totalHeight + cardPadding * 2
    const cornerRadius = 0.15
    
    // 创建圆角矩形Shape
    const shape = new THREE.Shape()
    const x = -cardWidth / 2
    const y = -cardHeight / 2
    shape.moveTo(x + cornerRadius, y)
    shape.lineTo(x + cardWidth - cornerRadius, y)
    shape.quadraticCurveTo(x + cardWidth, y, x + cardWidth, y + cornerRadius)
    shape.lineTo(x + cardWidth, y + cardHeight - cornerRadius)
    shape.quadraticCurveTo(x + cardWidth, y + cardHeight, x + cardWidth - cornerRadius, y + cardHeight)
    shape.lineTo(x + cornerRadius, y + cardHeight)
    shape.quadraticCurveTo(x, y + cardHeight, x, y + cardHeight - cornerRadius)
    shape.lineTo(x, y + cornerRadius)
    shape.quadraticCurveTo(x, y, x + cornerRadius, y)
    
    const cardGeometry = new THREE.ShapeGeometry(shape)
    
    // 加载当前季节的纹理
    const textureLoader = new THREE.TextureLoader()
    const cardTexture = textureLoader.load(seasonTextures[season])
    cardTexture.wrapS = THREE.RepeatWrapping
    cardTexture.wrapT = THREE.RepeatWrapping
    
    // 使用自定义ShaderMaterial实现燃烧消失和光晕过渡效果
    const cardMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0.0 },  // 燃烧消失进度（夏天专用）
        uTime: { value: 0.0 },  // 时间，用于火焰闪烁
        uTexture: { value: cardTexture },  // 纹理贴图
        uBurnColor: { value: new THREE.Color(0xff6622) },
        uCardSize: { value: new THREE.Vector2(cardWidth, cardHeight) },
        uGlowProgress: { value: 0.0 },  // 光晕过渡进度（切换季节用）
        uGlowIn: { value: false },  // true=聚合淡入, false=崩解淡出
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec2 vPosition;
        void main() {
          vUv = uv;
          vPosition = position.xy;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uProgress;
        uniform float uTime;
        uniform sampler2D uTexture;
        uniform vec3 uBurnColor;
        uniform vec2 uCardSize;
        uniform float uGlowProgress;
        uniform bool uGlowIn;
        varying vec2 vUv;
        varying vec2 vPosition;
        
        // 简单噪声函数
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        // 燃烧效果函数（夏天专用）
        void burnEffect(vec3 texColor) {
          // 对角线方向（从右下角到左上角）
          vec2 cornerBR = vec2(uCardSize.x / 2.0, -uCardSize.y / 2.0);
          vec2 cornerTL = vec2(-uCardSize.x / 2.0, uCardSize.y / 2.0);
          vec2 diagDir = normalize(cornerTL - cornerBR);
          
          // 计算沿对角线的投影距离（直线扩散）
          vec2 toPoint = vPosition - cornerBR;
          float projDist = dot(toPoint, diagDir);
          float dist = projDist / length(uCardSize);
          
          // 方案2：去掉分区，只用噪声
          float regionDelay = 0.0;  // 无分区延迟
          
          // 添加噪声让边缘不规则
          float n = noise(vPosition * 8.0) * 0.06;
          float distWithNoise = dist + n + regionDelay;
          
          // 燃烧边界（从右下角向左上角推进）
          float burnEdge = uProgress * 1.2;
          float burnWidth = 0.08;
          
          // 初始状态：全部显示纹理
          if (uProgress < 0.01) {
            gl_FragColor = vec4(texColor, 0.85);
            return;
          }
          
          // 已燃烧区域（右下角）：完全透明
          if (distWithNoise < burnEdge - burnWidth) {
            discard;
          }
          
          // 燃烧边缘：橙红色渐变 + 闪烁
          if (distWithNoise < burnEdge) {
            float edgeFactor = (distWithNoise - (burnEdge - burnWidth)) / burnWidth;
            
            // 火焰闪烁效果（使用时间+位置的噪声）
            float flicker = noise(vPosition * 15.0 + uTime * 3.0) * 0.5 + 0.5;
            float flicker2 = noise(vPosition * 25.0 - uTime * 5.0) * 0.3;
            
            // 多层火焰颜色
            vec3 hotColor = vec3(1.0, 0.9, 0.3);  // 黄色核心
            vec3 midColor = vec3(1.0, 0.4, 0.0);  // 橙色
            vec3 coolColor = vec3(0.8, 0.1, 0.0); // 暗红色边缘
            
            // 根据位置和闪烁混合颜色
            vec3 fireColor = mix(hotColor, midColor, edgeFactor + flicker2);
            fireColor = mix(fireColor, coolColor, edgeFactor * 0.5);
            
            // 亮度随机变化
            float brightness = 0.8 + flicker * 0.4;
            vec3 color = mix(fireColor * brightness, texColor, edgeFactor * 0.8);
            
            float alpha = 0.95 * max(0.3, edgeFactor);
            gl_FragColor = vec4(color, alpha);
            return;
          }
          
          // 未燃烧区域：纹理
          gl_FragColor = vec4(texColor, 0.85);
        }
        
        // 光晕过渡效果（优先级高于燃烧）
        void glowTransition(vec3 texColor) {
          float progress = uGlowProgress;
          
          if (uGlowIn) {
            // 聚合淡入：从白光中显现
            float alpha = progress;  // 0->1
            float glowIntensity = (1.0 - progress) * 1.5;  // 光晕从强到弱
            vec3 glowColor = vec3(1.0, 0.95, 0.9);  // 暖白色光晕
            vec3 finalColor = mix(glowColor, texColor, progress);
            finalColor += glowColor * glowIntensity * 0.3;  // 添加光晕
            gl_FragColor = vec4(finalColor, alpha * 0.85);
          } else {
            // 崩解淡出：变亮然后消失
            float alpha = 1.0 - progress;  // 1->0
            // 前半段变亮，后半段淡出
            float brightPhase = smoothstep(0.0, 0.4, progress);
            float fadePhase = smoothstep(0.3, 1.0, progress);
            
            vec3 glowColor = vec3(1.0, 0.95, 0.9);
            float glowIntensity = brightPhase * (1.0 - fadePhase) * 2.0;
            vec3 finalColor = texColor + glowColor * glowIntensity;
            gl_FragColor = vec4(finalColor, alpha * 0.85);
          }
        }
        
        void main() {
          vec2 uv = (vPosition / uCardSize) + 0.5;
          vec3 texColor = texture2D(uTexture, uv).rgb;
          
          // 光晕过渡优先
          if (uGlowProgress > 0.001) {
            glowTransition(texColor);
            return;
          }
          
          // 燃烧效果
          burnEffect(texColor);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    })
    
    cardMesh = new THREE.Mesh(cardGeometry, cardMaterial)
    cardMesh.position.z = -0.1  // 放在文字后面
    cardMesh.name = 'poemCard'  // 标记为卡片
    scene.add(cardMesh)
    
    // 从顶部开始，垂直居中
    // n行文字占据(n-1)*lineHeight的范围，中心应在原点
    const startYBase = (totalHeight - lineHeight) / 2

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx]
      const currentY = startYBase - lineIdx * lineHeight
      
      if (!line) {
        continue
      }

      const charCount = line.length

      for (let charIdx = 0; charIdx < charCount; charIdx++) {
        const char = line[charIdx]
        if (char === ' ') {
          continue
        }

        // 创建Troika文字
        const textMesh = new Text()
        textMesh.text = char
        textMesh.font = sourceHanSerifUrl  // 使用本地思源宋体
        textMesh.fontSize = charSize
        textMesh.color = 0xffffff
        textMesh.anchorX = 'center'
        textMesh.anchorY = 'middle'

        // X位置：以行中心为原点，奇数字符中间字在0，偶数字符对称分布
        // 公式：(i - (n-1)/2) * charSpacing
        const homePos = new THREE.Vector3(
          (charIdx - (charCount - 1) / 2) * charSpacing,
          currentY,
          0
        )

        textMesh.position.copy(homePos)
        textMesh.sync()

        scene.add(textMesh)

        particles.value.push({
          char,
          mesh: textMesh,
          home: homePos.clone(),
          position: homePos.clone(),
          velocity: new THREE.Vector3(0, 0, 0),
          lineIndex: lineIdx,
          charIndex: charIdx,
        })
      }
    }

    isReady.value = true
  }

  // 更新粒子位置到mesh
  const syncMeshPositions = () => {
    particles.value.forEach(p => {
      p.mesh.position.copy(p.position)
    })
  }

  // 回到原位的力
  const applyHomeForce = (strength: number = 0.02) => {
    particles.value.forEach(p => {
      const direction = new THREE.Vector3().subVectors(p.home, p.position)
      p.velocity.add(direction.multiplyScalar(strength))
    })
  }

  // 斥力（鼠标/触摸）
  const applyRepulsion = (
    pointerX: number, 
    pointerY: number, 
    radius: number = 1.5, 
    strength: number = 0.5
  ) => {
    // 将归一化坐标转换为场景坐标
    const pointerPos = new THREE.Vector3(pointerX * 4, pointerY * 3, 0)

    particles.value.forEach(p => {
      const distance = p.position.distanceTo(pointerPos)
      if (distance < radius && distance > 0.01) {
        const direction = new THREE.Vector3().subVectors(p.position, pointerPos)
        const force = direction.normalize().multiplyScalar(
          strength * (1 - distance / radius)
        )
        p.velocity.add(force)
      }
    })
  }

  // 阻尼
  const applyDamping = (factor: number = 0.92) => {
    particles.value.forEach(p => {
      p.velocity.multiplyScalar(factor)
    })
  }

  // 更新位置
  const updatePositions = () => {
    particles.value.forEach(p => {
      p.position.add(p.velocity)
    })
    syncMeshPositions()
  }

  // 重力（用于秋天落叶效果）
  const applyGravity = (x: number = 0, y: number = -0.01) => {
    particles.value.forEach(p => {
      p.velocity.x += x
      p.velocity.y += y
    })
  }

  // 随机扰动（用于夏天蒸发效果）
  const applyJitter = (strength: number = 0.01) => {
    particles.value.forEach(p => {
      p.velocity.x += (Math.random() - 0.5) * strength
      p.velocity.y += (Math.random() - 0.5) * strength
    })
  }

  // 设置透明度
  const setOpacity = (opacity: number) => {
    particles.value.forEach(p => {
      p.mesh.fillOpacity = opacity
    })
  }

  // 设置颜色
  const setColor = (color: number) => {
    particles.value.forEach(p => {
      p.mesh.color = color
    })
  }

  // 清理
  const dispose = () => {
    particles.value.forEach(p => {
      scene.remove(p.mesh)
      p.mesh.dispose()
    })
    particles.value = []
  }

  // 获取卡片mesh
  const getCardMesh = () => cardMesh

  return {
    particles,
    isReady,
    createParticles,
    clearParticles,
    syncMeshPositions,
    applyHomeForce,
    applyRepulsion,
    applyDamping,
    updatePositions,
    applyGravity,
    applyJitter,
    setOpacity,
    setColor,
    dispose,
    getCardMesh,
  }
}
