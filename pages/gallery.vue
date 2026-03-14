<template>
  <div class="page-container bg-dark">
    <div class="container-inner py-10">
      <h1 class="section-title mb-4">{{ t('gallery.title') }}</h1>

      <!-- Session Filters -->
      <div class="flex flex-wrap gap-2 mb-10">
        <button v-for="session in sessions" :key="session"
          @click="activeSession = session"
          class="badge cursor-pointer text-sm px-4 py-1.5 transition-all"
          :class="activeSession === session ? 'bg-primary text-secondary border-primary' : 'badge-primary hover:bg-primary/30'">
          {{ session === 'All' ? t('gallery.filter_all') : session }}
        </button>
      </div>

      <!-- Photo Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div v-for="photo in filtered" :key="photo.id"
          @click="lightbox = photo"
          class="relative rounded-2xl overflow-hidden cursor-pointer group aspect-square"
          :style="`background: linear-gradient(135deg, ${photo.color}cc, ${photo.color}66)`">
          <!-- Emoji display -->
          <div class="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
            {{ photo.emoji }}
          </div>
          <!-- Hover overlay -->
          <div class="absolute inset-0 bg-dark/0 group-hover:bg-dark/40 transition-all duration-300 flex items-end p-3 opacity-0 group-hover:opacity-100">
            <div>
              <p class="font-heading font-bold text-xs text-white">{{ photo.title }}</p>
              <p class="font-body text-xs text-white/70">{{ photo.session }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filtered.length === 0" class="text-center py-20">
        <p class="font-body text-tertiary/50">No photos in this session yet.</p>
      </div>
    </div>

    <!-- Lightbox -->
    <Transition name="lightbox">
      <div v-if="lightbox" class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="lightbox = null">
        <div class="absolute inset-0 bg-dark/90 backdrop-blur-sm" @click="lightbox = null"></div>
        <div class="relative max-w-lg w-full">
          <!-- Photo card -->
          <div class="rounded-3xl overflow-hidden relative aspect-square"
            :style="`background: linear-gradient(135deg, ${lightbox.color}dd, ${lightbox.color}88)`">
            <div class="absolute inset-0 flex items-center justify-center text-[8rem]">
              {{ lightbox.emoji }}
            </div>
          </div>
          <div class="mt-4 px-2">
            <h3 class="font-heading font-bold text-xl text-tertiary">{{ lightbox.title }}</h3>
            <p class="font-body text-sm text-tertiary/60 mt-1">{{ lightbox.description }}</p>
            <div class="flex gap-3 mt-4">
              <button @click="sharePhoto" class="btn-ghost btn-sm flex items-center gap-2">
                <Share2 class="w-4 h-4" /> {{ t('gallery.share') }}
              </button>
              <button @click="lightbox = null" class="btn-ghost btn-sm ml-auto flex items-center gap-2">
                <X class="w-4 h-4" /> {{ t('gallery.close') }}
              </button>
            </div>
          </div>
          <!-- Close button -->
          <button @click="lightbox = null"
            class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-secondary flex items-center justify-center font-bold hover:bg-accent transition-colors">
            ✕
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true, ssr: false })

import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGalleryStore } from '~/stores/gallery'
import { Share2, X } from 'lucide-vue-next'

const { t } = useI18n()
const galleryStore = useGalleryStore()

const sessions = galleryStore.getSessions()
const activeSession = ref('All')
const lightbox = ref(null)

const filtered = computed(() => galleryStore.getBySession(activeSession.value))

function sharePhoto() {
  navigator.clipboard?.writeText(window.location.href)
  alert('Photo link copied to clipboard!')
}
</script>

<style scoped>
.lightbox-enter-active, .lightbox-leave-active { transition: all 0.3s ease; }
.lightbox-enter-from, .lightbox-leave-to { opacity: 0; }
.lightbox-enter-from .relative.max-w-lg, .lightbox-leave-to .relative.max-w-lg { transform: scale(0.95); }
</style>
