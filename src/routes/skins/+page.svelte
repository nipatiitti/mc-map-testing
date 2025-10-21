<script lang="ts">
  import bg from '$lib/assets/port.jpg'
  import baker1 from '$lib/assets/skins/baker1.png'
  import miner1 from '$lib/assets/skins/miner1.png'
  import RenderPng from '$lib/features/Skins/RenderPng.svelte'
  import RenderPreview from '$lib/features/Skins/RenderPreview.svelte'
  import { onMount } from 'svelte'

  let selectedOverlay = $state(miner1)

  let userSkin = $state<string | null>(null)
  let loading = $state(false)

  /* On form submission load the skin as base64 url to state */
  const handleSkinUpload = async (event: Event) => {
    event.preventDefault()
    const fileInput = event.target as HTMLInputElement
    if (fileInput.files && fileInput.files[0]) {
      loading = true
      const file = fileInput.files[0]
      const reader = new FileReader()
      try {
        await new Promise<void>((resolve, reject) => {
          reader.onload = () => {
            userSkin = reader.result as string
            resolve()
          }
          reader.onerror = () => {
            reject(reader.error)
          }
          reader.readAsDataURL(file)
        })
      } catch (error) {
        console.error('Failed to read skin file:', error)
      } finally {
        loading = false
      }
    }

    fileInput.value = ''
  }

  $effect(() => {
    // Save user skin to localStorage
    if (userSkin) {
      localStorage.setItem('userSkin', userSkin)
    }
  })

  onMount(() => {
    // Load user skin from localStorage
    const savedSkin = localStorage.getItem('userSkin')
    if (savedSkin) {
      userSkin = savedSkin
    }
  })
</script>

<div class="relative flex h-screen w-full flex-col gap-4 bg-slate-950 px-6 py-2 text-slate-100">
  <div class="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/10 via-transparent to-fuchsia-500/10"></div>

  <p class="text-sm font-semibold tracking-tight text-gray-500">
    Disclaimer: We don't know the exact code used to blend these skins on the server, so take this tool with a grain of
    salt
  </p>
  <div class="flex max-h-72 flex-wrap gap-4">
    {#snippet overlay(name: string, url: string)}
      <button
        class="group relative flex h-full w-60 min-w-60 flex-col gap-2 overflow-hidden rounded-xs border border-white/10 bg-white/5 p-3 text-left shadow-xl transition-transform hover:-translate-y-1 hover:border-white/30 hover:shadow-2xl {selectedOverlay ===
        url
          ? 'ring-4 ring-emerald-400/70'
          : ''}"
        onclick={() => (selectedOverlay = url)}
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        ></div>
        <h3 class="relative rounded-2xl bg-white/10 p-2 text-center text-sm font-semibold text-slate-200">
          {name}
        </h3>
        <RenderPng pngUrl={url} modelType="default" />
      </button>
    {/snippet}

    {@render overlay('Miner 1', miner1)}
    {@render overlay('Baker 1', baker1)}
  </div>

  <div class="flex flex-col gap-2 rounded-xs border border-white/10 bg-white/5 p-4 text-sm text-slate-200 shadow-inner">
    <label for="skinFile" class="font-medium text-slate-100">Upload your skin:</label>
    <input
      onchange={handleSkinUpload}
      type="file"
      id="skinFile"
      name="skinFile"
      accept="image/png"
      class="rounded-lg border border-white/10 bg-slate-900/80 p-2 text-sm text-slate-100 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-500/90 file:px-3 file:py-1 file:text-sm file:font-medium file:text-slate-950 hover:file:bg-emerald-400"
    />
  </div>

  {#if !loading && selectedOverlay && userSkin}
    <div class="w-full relative flex-1 overflow-hidden rounded-xs border border-white/10 bg-slate-900/60 shadow-2xl">
      <div
        style="background-image: url('{bg}'); background-size: cover; background-position: center; position: absolute; inset: 0; filter: blur(4px);"
      ></div>
      <RenderPreview baseSkinUrl={userSkin} overlaySkinUrl={selectedOverlay} modelType="default" />
    </div>
  {/if}
</div>
