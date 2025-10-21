<script lang="ts">
  import type { Action } from 'svelte/action'
  import type { ModelType } from './utils/playerModel'
  import { SkinRenderer } from './utils/skinRenderer'

  type Props = {
    pngUrl: string
    modelType?: ModelType
  }

  let { pngUrl, modelType = 'default' }: Props = $props()

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

    renderer.loadSkin(pngUrl, modelType).catch((error) => {
      console.error('Failed to load skin:', error)
    })

    return {
      destroy() {
        if (renderer) {
          renderer.dispose()
          renderer = null
        }
      },
    }
  }

  const handleResize = () => {
    if (renderer && container) {
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
  }
</script>

<svelte:window onresize={handleResize} />

<div use:createThreejs bind:this={container} class="w-full h-full flex items-center justify-center"></div>
