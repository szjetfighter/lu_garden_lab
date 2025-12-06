import { ref } from 'vue'
import * as THREE from 'three'
import { Text } from 'troika-three-text'

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
  const createParticles = async (lines: string[]) => {
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
    
    // 使用自定义ShaderMaterial实现从右下角开始的燃烧消失效果
    const cardMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0.0 },  // 消失进度
        uTime: { value: 0.0 },  // 时间，用于火焰闪烁
        uBaseColor: { value: new THREE.Color(0x1a1a2e) },
        uBurnColor: { value: new THREE.Color(0xff6622) },
        uCardSize: { value: new THREE.Vector2(cardWidth, cardHeight) },
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
        uniform vec3 uBaseColor;
        uniform vec3 uBurnColor;
        uniform vec2 uCardSize;
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
        
        void main() {
          // 对角线方向（从右下角到左上角）
          vec2 cornerBR = vec2(uCardSize.x / 2.0, -uCardSize.y / 2.0);
          vec2 cornerTL = vec2(-uCardSize.x / 2.0, uCardSize.y / 2.0);
          vec2 diagDir = normalize(cornerTL - cornerBR);
          
          // 计算沿对角线的投影距离（直线扩散）
          vec2 toPoint = vPosition - cornerBR;
          float projDist = dot(toPoint, diagDir);
          float dist = projDist / length(uCardSize);
          
          // 分区延迟：对角线上方 vs 下方
          float diagSlope = uCardSize.y / uCardSize.x;
          float pointSlope = (vPosition.y + uCardSize.y / 2.0) / (vPosition.x + uCardSize.x / 2.0 + 0.001);
          float regionDelay = pointSlope > diagSlope ? 0.08 : 0.0;
          
          // 添加噪声让边缘不规则
          float n = noise(vPosition * 8.0) * 0.06;
          float distWithNoise = dist + n + regionDelay;
          
          // 燃烧边界（从右下角向左上角推进）
          float burnEdge = uProgress * 1.2;
          float burnWidth = 0.08;
          
          // 初始状态：全部显示原色
          if (uProgress < 0.01) {
            gl_FragColor = vec4(uBaseColor, 0.85);
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
            vec3 color = mix(fireColor * brightness, uBaseColor, edgeFactor * 0.8);
            
            float alpha = 0.95 * max(0.3, edgeFactor);
            gl_FragColor = vec4(color, alpha);
            return;
          }
          
          // 未燃烧区域：原色
          gl_FragColor = vec4(uBaseColor, 0.85);
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
    const startYBase = totalHeight / 2

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx]
      const currentY = startYBase - lineIdx * lineHeight
      
      if (!line) {
        continue
      }

      const lineWidth = line.length * charSpacing
      const lineStartX = -lineWidth / 2

      for (let charIdx = 0; charIdx < line.length; charIdx++) {
        const char = line[charIdx]
        if (char === ' ') {
          continue
        }

        // 创建Troika文字
        const textMesh = new Text()
        textMesh.text = char
        textMesh.fontSize = charSize
        textMesh.color = 0xffffff
        textMesh.anchorX = 'center'
        textMesh.anchorY = 'middle'

        // X位置：行起始 + 字符索引 * 间距
        // 所有文字在同一平面上（Z=0），呈现平面卡片效果
        const homePos = new THREE.Vector3(
          lineStartX + charIdx * charSpacing,
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
