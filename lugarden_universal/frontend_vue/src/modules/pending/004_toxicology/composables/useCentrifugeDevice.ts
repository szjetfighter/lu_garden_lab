/**
 * 离心机3D设备
 * 
 * 结构：
 * - 玻璃圆筒罩（透明）
 * - 金属转子盘（承载文字）
 * - 工业底座
 * - 金属支架框架
 * - RPM指示灯环
 */

import * as THREE from 'three'
import { markRaw } from 'vue'

export function useCentrifugeDevice(scene: THREE.Scene) {
  const deviceGroup = markRaw(new THREE.Group())
  
  // 转子引用（用于旋转动画）
  let rotorGroup: THREE.Group | null = null
  // 内部光源（用于动态调节）
  let innerLight: THREE.PointLight | null = null
  let bottomLight: THREE.PointLight | null = null
  // 试管组引用（用于离心倾斜）
  const tubeGroups: { group: THREE.Group; angle: number }[] = []
  
  const create = () => {
    // ========== 底座 ==========
    // 主底座 - 厚实的圆柱
    const baseGeometry = new THREE.CylinderGeometry(3.5, 4, 0.8, 64)
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.9,
      roughness: 0.3
    })
    const base = new THREE.Mesh(baseGeometry, baseMaterial)
    base.position.y = -3.4
    deviceGroup.add(base)
    
    // 底座边缘发光环
    const baseRingGeometry = new THREE.TorusGeometry(3.8, 0.08, 16, 64)
    const baseRingMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.8
    })
    const baseRing = new THREE.Mesh(baseRingGeometry, baseRingMaterial)
    baseRing.position.y = -3
    baseRing.rotation.x = Math.PI / 2
    deviceGroup.add(baseRing)
    
    // 底座装饰槽
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const ventGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.8)
      const ventMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        metalness: 0.8,
        roughness: 0.2
      })
      const vent = new THREE.Mesh(ventGeometry, ventMaterial)
      vent.position.set(
        Math.cos(angle) * 3.6,
        -3.4,
        Math.sin(angle) * 3.6
      )
      vent.rotation.y = angle
      deviceGroup.add(vent)
    }
    
    // ========== 支撑柱 ==========
    const pillarGeometry = new THREE.CylinderGeometry(0.15, 0.2, 5, 16)
    const pillarMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      metalness: 0.95,
      roughness: 0.2
    })
    
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial)
      pillar.position.set(
        Math.cos(angle) * 3,
        -0.5,
        Math.sin(angle) * 3
      )
      deviceGroup.add(pillar)
    }
    
    // ========== 玻璃圆筒罩 ==========
    const glassGeometry = new THREE.CylinderGeometry(2.8, 2.8, 4.5, 64, 1, true)
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xaaffaa,
      metalness: 0,
      roughness: 0.05,
      transmission: 0.9,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false  // 让内部物体可见
    })
    const glass = new THREE.Mesh(glassGeometry, glassMaterial)
    glass.position.y = -0.5
    glass.renderOrder = 1  // 后渲染
    deviceGroup.add(glass)
    
    // 玻璃罩顶部金属环
    const topRingGeometry = new THREE.TorusGeometry(2.8, 0.12, 16, 64)
    const metalRingMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.95,
      roughness: 0.15
    })
    const topRing = new THREE.Mesh(topRingGeometry, metalRingMaterial)
    topRing.position.y = 1.75
    topRing.rotation.x = Math.PI / 2
    deviceGroup.add(topRing)
    
    // 玻璃罩底部金属环
    const bottomRing = new THREE.Mesh(topRingGeometry, metalRingMaterial)
    bottomRing.position.y = -2.75
    bottomRing.rotation.x = Math.PI / 2
    deviceGroup.add(bottomRing)
    
    // ========== 顶盖 ==========
    const lidGeometry = new THREE.CylinderGeometry(3, 3.2, 0.4, 64)
    const lidMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.9,
      roughness: 0.3
    })
    const lid = new THREE.Mesh(lidGeometry, lidMaterial)
    lid.position.y = 2
    deviceGroup.add(lid)
    
    // 顶盖中心通风口
    const ventHoleGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32)
    const ventHoleMaterial = new THREE.MeshStandardMaterial({
      color: 0x050505,
      metalness: 0.8,
      roughness: 0.2
    })
    const ventHole = new THREE.Mesh(ventHoleGeometry, ventHoleMaterial)
    ventHole.position.y = 2.2
    deviceGroup.add(ventHole)
    
    // ========== 转子组（用于旋转）==========
    rotorGroup = markRaw(new THREE.Group())
    
    // 中心轴（贯穿上下）
    const axleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 6, 32)
    const axleMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.95,
      roughness: 0.1
    })
    const axle = new THREE.Mesh(axleGeometry, axleMaterial)
    axle.position.y = -0.5
    rotorGroup.add(axle)
    
    // ========== 带孔圆盘（试管架）==========
    const tubeCount = 4
    const tubeRadius = 0.2
    const tubeHeight = 3
    const tubeDistance = 1.5  // 试管距中心距离
    const diskRadius = 2.5
    const diskThickness = 0.4
    const holeRadius = tubeRadius + 0.05  // 孔略大于试管
    
    // 创建带孔圆盘形状
    const diskShape = new THREE.Shape()
    diskShape.absarc(0, 0, diskRadius, 0, Math.PI * 2, false)
    
    // 添加4个孔
    for (let i = 0; i < tubeCount; i++) {
      const angle = (i / tubeCount) * Math.PI * 2
      const holeX = Math.cos(angle) * tubeDistance
      const holeY = Math.sin(angle) * tubeDistance
      
      const hole = new THREE.Path()
      hole.absarc(holeX, holeY, holeRadius, 0, Math.PI * 2, true)
      diskShape.holes.push(hole)
    }
    
    // 挤出成圆盘
    const diskGeometry = new THREE.ExtrudeGeometry(diskShape, {
      depth: diskThickness,
      bevelEnabled: false
    })
    const diskMaterial = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      metalness: 0.6,
      roughness: 0.4
    })
    const disk = new THREE.Mesh(diskGeometry, diskMaterial)
    disk.rotation.x = -Math.PI / 2  // 水平放置
    disk.position.y = -0.5 + diskThickness / 2 + 1  // 向上平移1
    rotorGroup.add(disk)
    
    // ========== 4根试管 ==========
    // 试管材质（半透明玻璃）
    const tubeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xaaffff,
      metalness: 0,
      roughness: 0.05,
      transmission: 0.85,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      depthWrite: false
    })
    
    // 圆盘高度（试管锚点）
    const diskY = -0.5 + diskThickness / 2 + 1
    // 初始倾斜角度（15% of 最大60°）
    const initialTilt = 0.15 * (Math.PI / 3)
    
    for (let i = 0; i < tubeCount; i++) {
      const angle = (i / tubeCount) * Math.PI * 2
      const x = Math.cos(angle) * tubeDistance
      const z = Math.sin(angle) * tubeDistance
      
      // 创建试管组（锚点在圆盘孔位置）
      const tubeGroup = new THREE.Group()
      tubeGroup.position.set(x, diskY, z)
      
      // 初始倾斜：底部向外（径向方向）
      // 绕切线轴旋转，使试管在径向垂直平面内倾斜
      tubeGroup.rotation.x = Math.sin(angle) * initialTilt
      tubeGroup.rotation.z = -Math.cos(angle) * initialTilt
      
      // 试管主体（圆柱）- 相对于锚点向下
      const tubeBodyGeometry = new THREE.CylinderGeometry(tubeRadius, tubeRadius, tubeHeight - tubeRadius, 32, 1, true)
      const tubeBody = new THREE.Mesh(tubeBodyGeometry, tubeMaterial)
      tubeBody.position.set(0, -(tubeHeight - tubeRadius) / 2, 0)
      tubeGroup.add(tubeBody)
      
      // 试管底部（半球封口）
      const tubeBottomGeometry = new THREE.SphereGeometry(tubeRadius, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2)
      const tubeBottom = new THREE.Mesh(tubeBottomGeometry, tubeMaterial)
      tubeBottom.position.set(0, -(tubeHeight - tubeRadius), 0)
      tubeGroup.add(tubeBottom)
      
      // 试管顶部开口边缘
      const tubeRimGeometry = new THREE.TorusGeometry(tubeRadius, 0.03, 8, 32)
      const tubeRimMaterial = new THREE.MeshStandardMaterial({
        color: 0x666666,
        metalness: 0.7,
        roughness: 0.3
      })
      const tubeRim = new THREE.Mesh(tubeRimGeometry, tubeRimMaterial)
      tubeRim.position.set(0, 0.02, 0)
      tubeRim.rotation.x = Math.PI / 2
      tubeGroup.add(tubeRim)
      
      rotorGroup.add(tubeGroup)
      tubeGroups.push({ group: tubeGroup, angle })
    }
    
    deviceGroup.add(rotorGroup)
    
    // ========== RPM指示灯环 ==========
    const indicatorCount = 24
    for (let i = 0; i < indicatorCount; i++) {
      const angle = (i / indicatorCount) * Math.PI * 2
      const indicatorGeometry = new THREE.SphereGeometry(0.08, 8, 8)
      
      // 前70%绿色，后30%红色（危险区）
      const isRed = i >= indicatorCount * 0.7
      const indicatorMaterial = new THREE.MeshBasicMaterial({
        color: isRed ? 0xff0000 : 0x00ff00,
        transparent: true,
        opacity: 0.3
      })
      
      const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial)
      indicator.position.set(
        Math.cos(angle) * 3.3,
        -2.9,
        Math.sin(angle) * 3.3
      )
      indicator.userData = { isIndicator: true, index: i }
      deviceGroup.add(indicator)
    }
    
    
    // ========== 灯光 ==========
    // 环境光（整体提亮）
    const ambientLight = new THREE.AmbientLight(0x404040, 2)
    deviceGroup.add(ambientLight)
    
    // 半球光（模拟天空/地面反射）
    const hemiLight = new THREE.HemisphereLight(0x88ffaa, 0x222222, 1.5)
    deviceGroup.add(hemiLight)
    
    // 顶部主光源（冷白色）
    const topLight = new THREE.SpotLight(0xccffcc, 80, 20, Math.PI / 3, 0.3)
    topLight.position.set(0, 10, 5)
    topLight.target.position.set(0, 0, 0)
    deviceGroup.add(topLight)
    deviceGroup.add(topLight.target)
    
    // 内部绿色环境光（从玻璃罩内部发出）
    innerLight = new THREE.PointLight(0x00ff00, 3, 6)
    innerLight.position.set(0, 0, 0)
    deviceGroup.add(innerLight)
    
    // 底部红色警示光
    bottomLight = new THREE.PointLight(0xff3300, 1, 5)
    bottomLight.position.set(0, -3, 0)
    deviceGroup.add(bottomLight)
    
    // 四角补光（工业感）
    const cornerColors = [0x00ffff, 0x00ff00, 0x00ffff, 0x00ff00]
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4
      const cornerLight = new THREE.PointLight(cornerColors[i], 3, 8)
      cornerLight.position.set(
        Math.cos(angle) * 4,
        2,
        Math.sin(angle) * 4
      )
      deviceGroup.add(cornerLight)
    }
    
    // 正面补光（照亮文字）
    const frontLight = new THREE.DirectionalLight(0xffffff, 1)
    frontLight.position.set(0, 2, 8)
    deviceGroup.add(frontLight)
    
    // 添加到场景
    scene.add(deviceGroup)
  }
  
  /**
   * 更新转子旋转和指示灯
   * @param rotation 当前旋转角度
   * @param rpmRatio 转速比例 (0-1)
   */
  const update = (rotation: number, rpmRatio: number) => {
    // 转子跟随旋转
    if (rotorGroup) {
      rotorGroup.rotation.y = rotation
    }
    
    // 试管离心倾斜（15% 初始 + RPM 增量，最大 60°）
    const maxTilt = Math.PI / 3  // 60°
    const baseTilt = 0.15 * maxTilt  // 15% 初始倾斜
    const dynamicTilt = baseTilt + rpmRatio * (maxTilt - baseTilt)
    
    tubeGroups.forEach(({ group, angle }) => {
      // 绕切线轴旋转，使试管在径向垂直平面内倾斜
      group.rotation.x = Math.sin(angle) * dynamicTilt
      group.rotation.z = -Math.cos(angle) * dynamicTilt
    })
    
    // 动态调整光源强度
    if (innerLight) {
      // 绿光随转速增强
      innerLight.intensity = 2 + rpmRatio * 8
    }
    if (bottomLight) {
      // 红色警示光在高转速时亮起
      bottomLight.intensity = rpmRatio > 0.7 ? (rpmRatio - 0.7) / 0.3 * 5 : 0.5
      // 高转速时闪烁
      if (rpmRatio > 0.8) {
        bottomLight.intensity *= 0.5 + Math.sin(Date.now() * 0.02) * 0.5
      }
    }
    
    // 更新指示灯亮度
    deviceGroup.children.forEach(child => {
      if (child.userData?.isIndicator) {
        const index = child.userData.index
        const indicatorCount = 24
        const threshold = index / indicatorCount
        
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
        
        // 当前RPM超过该指示灯阈值时点亮
        if (rpmRatio >= threshold) {
          material.opacity = 0.9
        } else {
          material.opacity = 0.2
        }
      }
    })
  }
  
  const dispose = () => {
    scene.remove(deviceGroup)
    
    // 清理试管组引用
    tubeGroups.length = 0
    
    // 递归清理
    deviceGroup.traverse(obj => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose()
        if (obj.material instanceof THREE.Material) {
          obj.material.dispose()
        }
      }
    })
  }
  
  return {
    deviceGroup,
    create,
    update,
    dispose
  }
}
