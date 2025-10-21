import { getContext, setContext } from 'svelte'

const SKIN_STATE_KEY = Symbol.for('SkinState')

export class SkinState {
  // Object URL of the skin PNG
  skinPng = $state<string | null>(null)

  // Object URL of the overlay PNG
  overlayPng = $state<string | null>(null)
}

export const createSkinState = () => setContext(SKIN_STATE_KEY, new SkinState())
export const getSkinState = () => getContext<SkinState>(SKIN_STATE_KEY)
