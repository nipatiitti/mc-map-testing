<script lang="ts">
  import mapImage from '$lib/assets/map.png'
  import MapLine from '$lib/features/Map/MapLine.svelte'
  import MapMarkers from '$lib/features/Map/MapMarkers.svelte'
  import MapStats from '$lib/features/Map/MapStats.svelte'
  import { createMapContext } from '$lib/features/Map/mapState.svelte'
  import * as L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import type { Action } from 'svelte/action'

  let map = createMapContext()

  // Image dimensions: 2506x2506 pixels
  // Scale: 2.5 px = 1m, so 1 px = 0.4m
  const imageWidth = 2506
  const imageHeight = 2506
  const pixelsPerMeter = 2

  // Calculate real-world dimensions in meters
  const mapWidthMeters = imageWidth / pixelsPerMeter
  const mapHeightMeters = imageHeight / pixelsPerMeter

  const createMap: Action<HTMLDivElement> = (e) => {
    // Create a simple CRS that uses meters
    const bounds: L.LatLngBoundsExpression = [
      [0, 0],
      [mapHeightMeters, mapWidthMeters],
    ]

    map.map = L.map(e, {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 3,
    })

    // Add the image overlay
    L.imageOverlay(mapImage, bounds).addTo(map.map)

    // Set the view to the center of the map
    map.map.fitBounds(bounds)
    map.ready = true

    return {
      destroy() {
        map.map?.remove()
      },
    }
  }
</script>

<div use:createMap id="map-container" class="w-full h-full"></div>

{#if map.ready}
  <MapMarkers />
  <MapLine />
  <MapStats />
{/if}
