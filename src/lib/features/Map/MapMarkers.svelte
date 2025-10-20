<script lang="ts">
  import * as L from 'leaflet'
  import { getMapContext } from './mapState.svelte'

  const mapState = getMapContext()

  // Track markers
  const markers = new Map<string, L.Marker>()

  // Create custom SVG icon
  const createCustomIcon = () => {
    const svgIcon = L.divIcon({
      html: `
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="white" stroke="#3b82f6" stroke-width="2"/>
          <circle cx="12" cy="12" r="4" fill="#3b82f6"/>
        </svg>
      `,
      className: 'custom-marker-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    })
    return svgIcon
  }

  // Setup map click listener
  $effect(() => {
    if (!mapState.map) return

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      mapState.addPoint([e.latlng.lat, e.latlng.lng])
    }

    mapState.map.on('click', handleMapClick)

    return () => {
      mapState.map?.off('click', handleMapClick)
    }
  })

  // Sync markers with points
  $effect(() => {
    if (!mapState.map) return

    const points = mapState.points

    // Remove markers that no longer exist in points
    markers.forEach((marker, id) => {
      if (!points.find((p) => p.id === id)) {
        marker.remove()
        markers.delete(id)
      }
    })

    // Add or update markers
    points.forEach((point) => {
      let marker = markers.get(point.id)

      if (!marker) {
        // Create new marker with custom icon
        marker = L.marker(point.position, {
          draggable: true,
          icon: createCustomIcon(),
        }).addTo(mapState.map!)

        // Create popup with delete button
        const popupContent = document.createElement('div')
        popupContent.className = 'p-2'

        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = 'Delete Point'
        deleteBtn.className = 'bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm'
        deleteBtn.onclick = () => {
          mapState.deletePoint(point.id)
          marker?.closePopup()
        }

        popupContent.appendChild(deleteBtn)
        marker.bindPopup(popupContent)

        // Handle dragging
        marker.on('dragend', (e) => {
          const newPos = e.target.getLatLng()
          mapState.updatePoint(point.id, [newPos.lat, newPos.lng])
        })

        markers.set(point.id, marker)
      } else {
        // Update position if changed
        marker.setLatLng(point.position)
      }
    })

    return () => {
      markers.forEach((marker) => marker.remove())
      markers.clear()
    }
  })
</script>
