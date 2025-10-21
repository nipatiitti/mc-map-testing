import { BoxGeometry, DoubleSide, FrontSide, Group, Mesh, MeshStandardMaterial, Texture } from 'three'
import { setSkinUVs } from './uvMapping'

export type ModelType = 'default' | 'slim'

/**
 * Simple Minecraft player model for static rendering
 */
export class PlayerModel extends Group {
  private material: MeshStandardMaterial
  private outerLayerMaterial: MeshStandardMaterial
  private slim = false

  // Body parts
  private head: Group
  private body: Group
  private rightArm: Group
  private leftArm: Group
  private rightLeg: Group
  private leftLeg: Group

  // Meshes that need to be updated when model type changes
  private rightArmMesh: Mesh
  private rightArmOuterMesh: Mesh
  private leftArmMesh: Mesh
  private leftArmOuterMesh: Mesh

  private rightArmBox: BoxGeometry
  private rightArmOuterBox: BoxGeometry
  private leftArmBox: BoxGeometry
  private leftArmOuterBox: BoxGeometry

  constructor() {
    super()

    // Materials
    this.material = new MeshStandardMaterial({
      side: FrontSide,
      transparent: true,
      alphaTest: 0.1,
    })

    this.outerLayerMaterial = new MeshStandardMaterial({
      side: DoubleSide,
      transparent: true,
      alphaTest: 0.1,
    })

    // Head (8x8x8)
    const headBox = new BoxGeometry(8, 8, 8)
    setSkinUVs(headBox, 0, 0, 8, 8, 8)
    const headMesh = new Mesh(headBox, this.material)
    headMesh.position.y = 4

    // Head outer layer (9x9x9)
    const headOuterBox = new BoxGeometry(9, 9, 9)
    setSkinUVs(headOuterBox, 32, 0, 8, 8, 8)
    const headOuterMesh = new Mesh(headOuterBox, this.outerLayerMaterial)
    headOuterMesh.position.y = 4

    this.head = new Group()
    this.head.add(headMesh, headOuterMesh)
    this.add(this.head)

    // Body (8x12x4)
    const bodyBox = new BoxGeometry(8, 12, 4)
    setSkinUVs(bodyBox, 16, 16, 8, 12, 4)
    const bodyMesh = new Mesh(bodyBox, this.material)

    // Body outer layer (8.5x12.5x4.5)
    const bodyOuterBox = new BoxGeometry(8.5, 12.5, 4.5)
    setSkinUVs(bodyOuterBox, 16, 32, 8, 12, 4)
    const bodyOuterMesh = new Mesh(bodyOuterBox, this.outerLayerMaterial)

    this.body = new Group()
    this.body.add(bodyMesh, bodyOuterMesh)
    this.body.position.y = -6
    this.add(this.body)

    // Right Arm - will be updated based on model type
    this.rightArmBox = new BoxGeometry()
    this.rightArmMesh = new Mesh(this.rightArmBox, this.material)

    this.rightArmOuterBox = new BoxGeometry()
    this.rightArmOuterMesh = new Mesh(this.rightArmOuterBox, this.outerLayerMaterial)

    const rightArmPivot = new Group()
    rightArmPivot.add(this.rightArmMesh, this.rightArmOuterMesh)
    rightArmPivot.position.y = -6

    this.rightArm = new Group()
    this.rightArm.add(rightArmPivot)
    this.rightArm.position.set(-5, -2, 0)
    this.add(this.rightArm)

    // Left Arm - will be updated based on model type
    this.leftArmBox = new BoxGeometry()
    this.leftArmMesh = new Mesh(this.leftArmBox, this.material)

    this.leftArmOuterBox = new BoxGeometry()
    this.leftArmOuterMesh = new Mesh(this.leftArmOuterBox, this.outerLayerMaterial)

    const leftArmPivot = new Group()
    leftArmPivot.add(this.leftArmMesh, this.leftArmOuterMesh)
    leftArmPivot.position.y = -6

    this.leftArm = new Group()
    this.leftArm.add(leftArmPivot)
    this.leftArm.position.set(5, -2, 0)
    this.add(this.leftArm)

    // Right Leg (4x12x4)
    const rightLegBox = new BoxGeometry(4, 12, 4)
    setSkinUVs(rightLegBox, 0, 16, 4, 12, 4)
    const rightLegMesh = new Mesh(rightLegBox, this.material)

    const rightLegOuterBox = new BoxGeometry(4.5, 12.5, 4.5)
    setSkinUVs(rightLegOuterBox, 0, 32, 4, 12, 4)
    const rightLegOuterMesh = new Mesh(rightLegOuterBox, this.outerLayerMaterial)

    const rightLegPivot = new Group()
    rightLegPivot.add(rightLegMesh, rightLegOuterMesh)
    rightLegPivot.position.y = -6

    this.rightLeg = new Group()
    this.rightLeg.add(rightLegPivot)
    this.rightLeg.position.set(-1.9, -12, 0)
    this.add(this.rightLeg)

    // Left Leg (4x12x4)
    const leftLegBox = new BoxGeometry(4, 12, 4)
    setSkinUVs(leftLegBox, 16, 48, 4, 12, 4)
    const leftLegMesh = new Mesh(leftLegBox, this.material)

    const leftLegOuterBox = new BoxGeometry(4.5, 12.5, 4.5)
    setSkinUVs(leftLegOuterBox, 0, 48, 4, 12, 4)
    const leftLegOuterMesh = new Mesh(leftLegOuterBox, this.outerLayerMaterial)

    const leftLegPivot = new Group()
    leftLegPivot.add(leftLegMesh, leftLegOuterMesh)
    leftLegPivot.position.y = -6

    this.leftLeg = new Group()
    this.leftLeg.add(leftLegPivot)
    this.leftLeg.position.set(1.9, -12, 0)
    this.add(this.leftLeg)

    // Set initial model type
    this.setModelType('default')

    // Position the entire model
    this.position.y = 8
  }

  setTexture(texture: Texture): void {
    this.material.map = texture
    this.material.needsUpdate = true

    this.outerLayerMaterial.map = texture
    this.outerLayerMaterial.needsUpdate = true
  }

  setModelType(type: ModelType): void {
    this.slim = type === 'slim'
    const armWidth = this.slim ? 3 : 4

    // Update right arm
    this.rightArmMesh.scale.set(armWidth, 12, 4)
    setSkinUVs(this.rightArmBox, 40, 16, armWidth, 12, 4)

    this.rightArmOuterMesh.scale.set(armWidth + 0.5, 12.5, 4.5)
    setSkinUVs(this.rightArmOuterBox, 40, 32, armWidth, 12, 4)

    // Update left arm
    this.leftArmMesh.scale.set(armWidth, 12, 4)
    setSkinUVs(this.leftArmBox, 32, 48, armWidth, 12, 4)

    this.leftArmOuterMesh.scale.set(armWidth + 0.5, 12.5, 4.5)
    setSkinUVs(this.leftArmOuterBox, 48, 48, armWidth, 12, 4)

    // Adjust arm pivot positions
    const armOffset = this.slim ? 0.5 : 1
    const rightArmPivot = this.rightArm.children[0]
    const leftArmPivot = this.leftArm.children[0]

    rightArmPivot.children[0].position.x = -armOffset
    rightArmPivot.children[1].position.x = -armOffset
    leftArmPivot.children[0].position.x = armOffset
    leftArmPivot.children[1].position.x = armOffset
  }
}
