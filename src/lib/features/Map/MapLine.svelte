<script lang="ts">
  import * as L from 'leaflet'
  import { getMapContext } from './mapState.svelte'

  const mapState = getMapContext()

  let polyline: L.Polyline | null = null

  // Reactive effect to update the line
  $effect(() => {
    if (!mapState.map) return

    const points = mapState.points
    const positions = points.map((p) => p.position)

    if (positions.length > 1) {
      if (polyline) {
        // Update existing line
        polyline.setLatLngs(positions)
      } else {
        // Create new line
        polyline = L.polyline(positions, {
          color: '#3b82f6',
          weight: 3,
        }).addTo(mapState.map!)
      }
    } else {
      // Remove line if less than 2 points
      if (polyline) {
        polyline.remove()
        polyline = null
      }
    }

    return () => {
      if (polyline) {
        polyline.remove()
        polyline = null
      }
    }
  })
</script>
