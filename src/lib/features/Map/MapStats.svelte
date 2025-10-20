<script lang="ts">
  import { getMapContext } from './mapState.svelte'

  const mapState = getMapContext()

  const speeds = {
    walking: 4.317, // m/s
    running: 5.612, // m/s
  }

  // Calculate line length
  let length = $derived.by(() => {
    const points = mapState.points
    if (points.length < 2) return 0

    let totalLength = 0
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i].position as [number, number]
      const p2 = points[i + 1].position as [number, number]

      const dx = p2[1] - p1[1] // longitude difference (x)
      const dy = p2[0] - p1[0] // latitude difference (y)
      const distance = Math.sqrt(dx * dx + dy * dy)
      totalLength += distance
    }

    return totalLength
  })

  // Format the length for display
  let formattedLength = $derived.by(() => {
    if (length === 0) return '0.0 m'
    if (length >= 1000) {
      return `${(length / 1000).toFixed(2)} km`
    }
    return `${length.toFixed(1)} m`
  })

  let timeInterval = $derived.by(() => {
    return {
      walking: length / speeds.walking,
      running: length / speeds.running,
    }
  })

  let formattedTime = $derived.by(() => {
    const formatSeconds = (seconds: number) => {
      if (seconds < 60) {
        return `${seconds.toFixed(1)} s`
      } else if (seconds < 3600) {
        const mins = Math.floor(seconds / 60)
        const secs = (seconds % 60).toFixed(0)
        return `${mins} min ${secs} s`
      } else {
        const hours = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        return `${hours} h ${mins} min`
      }
    }

    return {
      walking: formatSeconds(timeInterval.walking),
      running: formatSeconds(timeInterval.running),
    }
  })
</script>

<div
  class="absolute top-4 flex flex-col gap-0.5 right-4 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-4 z-[1000]"
>
  <span class="text-1xl font-bold text-gray-900">{formattedLength}</span>

  <span class="text-xs font-medium text-gray-600 uppercase tracking-wide">Walking ({speeds.walking} b/s):</span>
  <span class="text-1xl font-bold text-gray-900">{formattedTime.walking}</span>

  <span class="text-xs font-medium text-gray-600 uppercase tracking-wide">Running ({speeds.running} b/s):</span>
  <span class="text-1xl font-bold text-gray-900">{formattedTime.running}</span>
</div>
