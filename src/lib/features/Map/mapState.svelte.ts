import { Map, type LatLngExpression } from 'leaflet'
import { getContext, setContext } from 'svelte'

const MAP_CONTEXT_KEY = Symbol.for('MAP_CONTEXT_KEY')

export interface MapPoint {
  id: string
  position: LatLngExpression
}

export class MapState {
  map = $state.raw() as Map
  ready = $state(false)
  points = $state<MapPoint[]>([])

  addPoint(position: LatLngExpression): MapPoint {
    const id = crypto.randomUUID()
    const point: MapPoint = { id, position }
    this.points.push(point)
    return point
  }

  updatePoint(id: string, position: LatLngExpression) {
    const point = this.points.find((p) => p.id === id)
    if (point) {
      point.position = position
    }
  }

  deletePoint(id: string) {
    const index = this.points.findIndex((p) => p.id === id)
    if (index !== -1) {
      this.points.splice(index, 1)
    }
  }

  clear() {
    this.points = []
  }
}

export const createMapContext = () => setContext(MAP_CONTEXT_KEY, new MapState())
export const getMapContext = () => getContext<MapState>(MAP_CONTEXT_KEY)
