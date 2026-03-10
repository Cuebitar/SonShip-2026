import { defineNuxtPlugin } from "nuxt/app"

export default defineNuxtPlugin(async () => {
  const campersStore = useCampersStore()
  if (!campersStore.loaded) {
    await campersStore.initCampers()
  }
})
