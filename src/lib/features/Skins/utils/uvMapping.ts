import { BoxGeometry, BufferAttribute, Vector2 } from 'three'

/**
 * Sets UV coordinates for a box geometry based on Minecraft skin texture layout
 */
export function setSkinUVs(box: BoxGeometry, u: number, v: number, width: number, height: number, depth: number): void {
  const textureWidth = 64
  const textureHeight = 64

  const toFaceVertices = (x1: number, y1: number, x2: number, y2: number): Vector2[] => [
    new Vector2(x1 / textureWidth, 1.0 - y2 / textureHeight),
    new Vector2(x2 / textureWidth, 1.0 - y2 / textureHeight),
    new Vector2(x2 / textureWidth, 1.0 - y1 / textureHeight),
    new Vector2(x1 / textureWidth, 1.0 - y1 / textureHeight),
  ]

  const top = toFaceVertices(u + depth, v, u + width + depth, v + depth)
  const bottom = toFaceVertices(u + width + depth, v, u + width * 2 + depth, v + depth)
  const left = toFaceVertices(u, v + depth, u + depth, v + depth + height)
  const front = toFaceVertices(u + depth, v + depth, u + width + depth, v + depth + height)
  const right = toFaceVertices(u + width + depth, v + depth, u + width + depth * 2, v + height + depth)
  const back = toFaceVertices(u + width + depth * 2, v + depth, u + width * 2 + depth * 2, v + height + depth)

  const uvAttr = box.attributes.uv as BufferAttribute
  const uvRight = [right[3], right[2], right[0], right[1]]
  const uvLeft = [left[3], left[2], left[0], left[1]]
  const uvTop = [top[3], top[2], top[0], top[1]]
  const uvBottom = [bottom[0], bottom[1], bottom[3], bottom[2]]
  const uvFront = [front[3], front[2], front[0], front[1]]
  const uvBack = [back[3], back[2], back[0], back[1]]

  const newUVData: number[] = []

  for (const uvArray of [uvRight, uvLeft, uvTop, uvBottom, uvFront, uvBack]) {
    for (const uv of uvArray) {
      newUVData.push(uv.x, uv.y)
    }
  }

  uvAttr.set(new Float32Array(newUVData))
  uvAttr.needsUpdate = true
}
