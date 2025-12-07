/**
 * 毒理报告 - Three.js 场景管理器
 * 
 * 特性：
 * - 工业废土风格渲染
 * - 后期处理管线 (Bloom + Glitch + Scanlines)
 * - 正交相机（模拟监控屏幕）
 */

import { ref, shallowRef, markRaw, type Ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

// 自定义扫描线+噪点着色器
const ScanlineShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    scanlineIntensity: { value: 0.1 },
    noiseIntensity: { value: 0.05 },
    glitchIntensity: { value: 0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float scanlineIntensity;
    uniform float noiseIntensity;
    uniform float glitchIntensity;
    varying vec2 vUv;

    // 噪点函数
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      
      // Glitch位移
      if (glitchIntensity > 0.0) {
        float glitchOffset = glitchIntensity * 0.1 * sin(time * 50.0 + uv.y * 100.0);
        uv.x += glitchOffset * step(0.99, random(vec2(time * 0.1, floor(uv.y * 20.0))));
      }
      
      vec4 color = texture2D(tDiffuse, uv);
      
      // 扫描线
      float scanline = sin(uv.y * 800.0) * 0.5 + 0.5;
      color.rgb -= scanline * scanlineIntensity;
      
      // 噪点
      float noise = random(uv + time) * noiseIntensity;
      color.rgb += noise - noiseIntensity * 0.5;
      
      // RGB色差 (Glitch时增强)
      if (glitchIntensity > 0.5) {
        float chromaOffset = glitchIntensity * 0.01;
        color.r = texture2D(tDiffuse, uv + vec2(chromaOffset, 0.0)).r;
        color.b = texture2D(tDiffuse, uv - vec2(chromaOffset, 0.0)).b;
      }
      
      // 暗角
      float vignette = 1.0 - length((uv - 0.5) * 1.2);
      color.rgb *= smoothstep(0.0, 0.7, vignette);
      
      gl_FragColor = color;
    }
  `
}

export function useToxicScene(containerRef: Ref<HTMLElement | null>) {
  // 使用 markRaw 防止 Vue 代理 Three.js 对象
  const scene = markRaw(new THREE.Scene())
  const camera = markRaw(new THREE.PerspectiveCamera(60, 1, 0.1, 100))
  // 使用 shallowRef 避免深度代理
  const renderer = shallowRef<THREE.WebGLRenderer | null>(null)
  const composer = shallowRef<EffectComposer | null>(null)
  const scanlinePass = shallowRef<ShaderPass | null>(null)
  const bloomPass = shallowRef<UnrealBloomPass | null>(null)
  
  // 轨道控制器
  let controls: OrbitControls | null = null
  
  let animationId: number | null = null
  const updateCallbacks: Array<(delta: number, time: number) => void> = []
  const clock = new THREE.Clock()

  // 当前RPM (用于控制效果强度)
  const currentRpm = ref(0)
  const maxRpm = 9000

  const init = () => {
    if (!containerRef.value) return

    const container = containerRef.value
    const width = container.clientWidth
    const height = container.clientHeight

    // 渲染器 - 工业废土风格
    renderer.value = new THREE.WebGLRenderer({ 
      antialias: false, // 故意关闭抗锯齿，增加粗糙感
      alpha: false 
    })
    renderer.value.setSize(width, height)
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)) // 降低分辨率
    renderer.value.setClearColor(0x1a1a1a, 1) // 深色背景
    container.appendChild(renderer.value.domElement)

    // 相机 - 正视
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, 0)

    // 轨道控制器 - 可拖动/缩放
    controls = new OrbitControls(camera, renderer.value.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = true
    controls.minDistance = 3
    controls.maxDistance = 30
    controls.enablePan = true
    controls.enableRotate = true

    // 后期处理管线
    setupPostProcessing(width, height)

    // 窗口大小变化
    window.addEventListener('resize', handleResize)

    // 启动渲染循环
    animate()
  }

  const setupPostProcessing = (width: number, height: number) => {
    if (!renderer.value) return

    composer.value = new EffectComposer(renderer.value)

    // 基础渲染通道
    const renderPass = new RenderPass(scene, camera)
    composer.value.addPass(renderPass)

    // Bloom - CRT泛光（动态强度）
    bloomPass.value = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.3,  // 初始强度
      0.4,  // 半径
      0.7   // 阈值（让绿色发光环等发光）
    )
    composer.value.addPass(bloomPass.value)

    // 扫描线 + 噪点 + Glitch
    scanlinePass.value = new ShaderPass(ScanlineShader)
    composer.value.addPass(scanlinePass.value)
  }

  const handleResize = () => {
    if (!containerRef.value || !renderer.value || !composer.value) return

    const width = containerRef.value.clientWidth
    const height = containerRef.value.clientHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.value.setSize(width, height)
    composer.value.setSize(width, height)
  }

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    
    const delta = clock.getDelta()
    const time = clock.getElapsedTime()
    
    // 更新轨道控制器
    if (controls) {
      controls.update()
    }
    
    // 更新扫描线shader
    if (scanlinePass.value) {
      scanlinePass.value.uniforms.time.value = time
      
      // 根据RPM调整效果强度
      const rpmRatio = currentRpm.value / maxRpm
      scanlinePass.value.uniforms.scanlineIntensity.value = 0.05 + rpmRatio * 0.15
      scanlinePass.value.uniforms.noiseIntensity.value = 0.08 + rpmRatio * 0.92
      
      // 动态 Bloom 辉光（随转速增强）
      if (bloomPass.value) {
        bloomPass.value.strength = 0.3 + rpmRatio * 0.8  // 0.3 → 1.1
      }
      
      // 三阶段 Glitch 和背景颜色（平滑过渡）
      // 颜色定义：深灰 → 紫红 → 亮紫红 → 亮红
      const colors = [
        { r: 0x1a, g: 0x1a, b: 0x1a },  // 深灰
        { r: 0x1a, g: 0x0a, b: 0x15 },  // 紫红
        { r: 0x2a, g: 0x0a, b: 0x1a },  // 亮紫红
        { r: 0x33, g: 0x08, b: 0x08 },  // 亮红
      ]
      
      // 计算颜色插值
      let colorIndex: number
      let colorT: number
      if (rpmRatio >= 0.9) {
        colorIndex = 2
        colorT = Math.min(1, (rpmRatio - 0.9) / 0.1)
        scanlinePass.value.uniforms.glitchIntensity.value = 1.5 + (rpmRatio - 0.9) * 15
      } else if (rpmRatio >= 0.6) {
        colorIndex = 1
        colorT = (rpmRatio - 0.6) / 0.3
        scanlinePass.value.uniforms.glitchIntensity.value = 0.5 + (rpmRatio - 0.6) * 3.33
      } else if (rpmRatio >= 0.3) {
        colorIndex = 0
        colorT = (rpmRatio - 0.3) / 0.3
        scanlinePass.value.uniforms.glitchIntensity.value = 0.2 + (rpmRatio - 0.3) * 1
      } else {
        colorIndex = 0
        colorT = 0
        scanlinePass.value.uniforms.glitchIntensity.value = 0
      }
      
      // 线性插值颜色
      const c1 = colors[colorIndex]
      const c2 = colors[Math.min(colorIndex + 1, colors.length - 1)]
      const r = Math.floor(c1.r + (c2.r - c1.r) * colorT)
      const g = Math.floor(c1.g + (c2.g - c1.g) * colorT)
      const b = Math.floor(c1.b + (c2.b - c1.b) * colorT)
      renderer.value?.setClearColor((r << 16) | (g << 8) | b, 1)
    }
    
    // 执行所有更新回调
    updateCallbacks.forEach(cb => cb(delta, time))
    
    // 使用后期处理渲染
    if (composer.value) {
      composer.value.render()
    }
  }

  const dispose = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    
    window.removeEventListener('resize', handleResize)
    
    if (controls) {
      controls.dispose()
      controls = null
    }
    
    if (renderer.value) {
      renderer.value.dispose()
      containerRef.value?.removeChild(renderer.value.domElement)
    }
    
    if (composer.value) {
      composer.value.dispose()
    }
  }

  const onUpdate = (callback: (delta: number, time: number) => void) => {
    updateCallbacks.push(callback)
  }

  const setRpm = (rpm: number) => {
    currentRpm.value = Math.max(0, Math.min(maxRpm, rpm))
  }

  return {
    scene,
    camera,
    renderer,
    composer,
    currentRpm,
    init,
    dispose,
    onUpdate,
    setRpm
  }
}
