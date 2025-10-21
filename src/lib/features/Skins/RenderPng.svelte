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

  // Track pointer movement so drag rotations do not trigger overlay selection
  const dragState = {
    pointerDown: false,
    preventClick: false,
    startX: 0,
    startY: 0,
  }

  const dragThreshold = 4

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

    const handlePointerDown = (event: PointerEvent) => {
      dragState.pointerDown = true
      dragState.preventClick = false
      dragState.startX = event.clientX
      dragState.startY = event.clientY
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragState.pointerDown || dragState.preventClick) {
        return
      }

      const deltaX = event.clientX - dragState.startX
      const deltaY = event.clientY - dragState.startY

      if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
        dragState.preventClick = true
      }
    }

    const suppressIfDragging = (event: Event) => {
      if (dragState.preventClick) {
        event.stopPropagation()
        event.preventDefault()
      }
    }

    const handlePointerUp = (event: PointerEvent) => {
      suppressIfDragging(event)
      dragState.pointerDown = false
    }

    const handlePointerCancel = (event: PointerEvent) => {
      suppressIfDragging(event)
      dragState.pointerDown = false
    }

    const handleClick = (event: MouseEvent) => {
      suppressIfDragging(event)
      dragState.preventClick = false
    }

    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('pointercancel', handlePointerCancel)
    canvas.addEventListener('click', handleClick, true)

    return {
      destroy() {
        canvas.removeEventListener('pointerdown', handlePointerDown)
        canvas.removeEventListener('pointermove', handlePointerMove)
        canvas.removeEventListener('pointerup', handlePointerUp)
        canvas.removeEventListener('pointercancel', handlePointerCancel)
        canvas.removeEventListener('click', handleClick, true)

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
