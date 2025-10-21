/**
 * Blends two skin textures together by overlaying the second on top of the first
 * @param baseUrl - The base skin texture URL
 * @param overlayUrl - The overlay skin texture URL to apply on top
 * @returns Promise<HTMLCanvasElement> - Canvas with blended result
 */
export async function blendSkins(baseUrl: string, overlayUrl: string): Promise<HTMLCanvasElement> {
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
      img.src = url
    })
  }

  const [baseImg, overlayImg] = await Promise.all([loadImage(baseUrl), loadImage(overlayUrl)])

  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  // Draw base skin first
  ctx.drawImage(baseImg, 0, 0, 64, 64)

  // Draw overlay skin on top
  ctx.drawImage(overlayImg, 0, 0, 64, 64)

  return canvas
}
