declare module 'troika-three-text' {
  import { Object3D, Color } from 'three'
  
  export class Text extends Object3D {
    text: string
    fontSize: number
    color: number | string | Color
    anchorX: 'left' | 'center' | 'right' | number
    anchorY: 'top' | 'top-baseline' | 'middle' | 'bottom-baseline' | 'bottom' | number
    outlineWidth: number | string
    outlineColor: number | string | Color
    outlineBlur: number | string
    outlineOpacity: number
    strokeWidth: number | string
    strokeColor: number | string | Color
    fillOpacity: number
    font: string | null
    textAlign: 'left' | 'right' | 'center' | 'justify'
    maxWidth: number
    lineHeight: number | 'normal'
    letterSpacing: number
    whiteSpace: 'normal' | 'nowrap'
    overflowWrap: 'normal' | 'break-word'
    material: any
    sync(callback?: () => void): void
    dispose(): void
  }
}
