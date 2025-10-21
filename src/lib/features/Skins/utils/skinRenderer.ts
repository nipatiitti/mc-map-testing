import { AmbientLight, CanvasTexture, NearestFilter, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PlayerModel, type ModelType } from './playerModel'

export interface SkinRendererOptions {
  canvas: HTMLCanvasElement
  width: number
  height: number
}

/**
 * Simple renderer for Minecraft player skins
 */
export class SkinRenderer {
  private scene: Scene
  private camera: PerspectiveCamera
  private renderer: WebGLRenderer
  private playerModel: PlayerModel
  private controls!: OrbitControls
  private animationId: number | null = null

  constructor(options: SkinRendererOptions) {
    const { canvas, width, height } = options

    // Setup scene
    this.scene = new Scene()

    // Setup camera
    this.camera = new PerspectiveCamera(50, width / height, 0.1, 1000)
    this.camera.position.set(0, 0, 40)
    this.camera.lookAt(0, 0, 0)

    // Setup renderer
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(0x000000, 0)

    // Add lights
    const ambientLight = new AmbientLight(0xffffff, 1.5)
    this.scene.add(ambientLight)

    const cameraLight = new PointLight(0xffffff, 1)
    this.camera.add(cameraLight)
    this.scene.add(this.camera)

    // Create player model
    this.playerModel = new PlayerModel()
    this.scene.add(this.playerModel)

    // Setup orbit controls
    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enablePan = false
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.minDistance = 20
    this.controls.maxDistance = 100
    this.controls.target.set(0, 0, 0)

    // Start render loop for orbit controls
    this.startRenderLoop()
  }

  private startRenderLoop(): void {
    const animate = () => {
      this.render()
      this.animationId = requestAnimationFrame(animate)
    }
    animate()
  }

  async loadSkin(url: string, modelType: ModelType = 'default'): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 64
        canvas.height = 64
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, 64, 64)

        this.loadSkinFromCanvas(canvas, modelType)
        resolve()
      }

      img.onerror = () => {
        reject(new Error('Failed to load skin texture'))
      }

      img.src = url
    })
  }

  loadSkinFromCanvas(canvas: HTMLCanvasElement, modelType: ModelType = 'default'): void {
    const texture = new CanvasTexture(canvas)
    texture.magFilter = NearestFilter
    texture.minFilter = NearestFilter
    texture.needsUpdate = true

    this.playerModel.setTexture(texture)
    this.playerModel.setModelType(modelType)

    this.render()
  }

  render(): void {
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  setSize(width: number, height: number): void {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
    this.render()
  }

  dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.controls.dispose()
    this.renderer.dispose()
  }
}
