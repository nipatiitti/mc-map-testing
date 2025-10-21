<script lang="ts">
  import type { Action } from 'svelte/action'
  import type { ModelType } from './utils/playerModel'
  import { blendSkins } from './utils/skinBlending'
  import { SkinRenderer } from './utils/skinRenderer'

  type Props = {
    baseSkinUrl: string
    overlaySkinUrl: string
    modelType?: ModelType
  }

  let { baseSkinUrl, overlaySkinUrl, modelType = 'default' }: Props = $props()

  let renderer: SkinRenderer | null = null
  let container: HTMLDivElement

  const createThreejs: Action<HTMLDivElement> = (container) => {
    const canvas = document.createElement('canvas')
    container.appendChild(canvas)

    renderer = new SkinRenderer({
      canvas,
      width: container.clientWidth,
      height: container.clientHeight,
    })

    loadBlendedSkin()

    return {
      destroy() {
        if (renderer) {
          renderer.dispose()
          renderer = null
        }
      },
    }
  }

  const loadBlendedSkin = async () => {
    if (!renderer) return

    try {
      const blendedCanvas = await blendSkins(baseSkinUrl, overlaySkinUrl)
      renderer.loadSkinFromCanvas(blendedCanvas, modelType)
    } catch (error) {
      console.error('Failed to blend skins:', error)
    }
  }

  const handleResize = () => {
    if (renderer && container) {
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
  }

  // Reload when URLs or model type change
  $effect(() => {
    loadBlendedSkin()
  })
</script>

<svelte:window onresize={handleResize} />

<div use:createThreejs bind:this={container} class="z-10 relative w-full h-full flex items-center justify-center"></div>
