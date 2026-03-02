<template>
  <div class="page-container bg-dark">
    <div class="container-inner py-10 max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="section-title">{{ t('letters.dashboard_title') }}</h1>
        <RouterLink to="/letters/write" class="btn-primary btn-sm">
          <PenLine class="w-4 h-4" /> {{ t('letters.write_title') }}
        </RouterLink>
      </div>

      <!-- Tabs -->
      <div class="flex rounded-xl overflow-hidden border border-primary/10 mb-8 max-w-xs">
        <button @click="tab = 'received'" class="flex-1 py-2.5 text-sm font-heading font-semibold transition-all"
          :class="tab === 'received' ? 'bg-primary text-secondary' : 'text-tertiary/70 hover:bg-primary/10'">
          {{ t('letters.received') }} ({{ received.length }})
        </button>
        <button @click="tab = 'sent'" class="flex-1 py-2.5 text-sm font-heading font-semibold transition-all"
          :class="tab === 'sent' ? 'bg-primary text-secondary' : 'text-tertiary/70 hover:bg-primary/10'">
          {{ t('letters.sent_tab') }} ({{ sent.length }})
        </button>
      </div>

      <!-- Letters -->
      <div v-if="currentList.length === 0" class="text-center py-20">
        <p class="text-5xl mb-4">💌</p>
        <p class="font-body text-tertiary/60">{{ t('letters.no_letters') }}</p>
        <RouterLink to="/letters/write" class="btn-primary mt-4 inline-flex">Write a Letter</RouterLink>
      </div>

      <div class="space-y-4">
        <div v-for="letter in currentList" :key="letter.id"
          class="card p-6 border-primary/10 hover:border-primary/30 transition-all">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <!-- From/To header -->
              <div class="flex items-center gap-2 mb-3">
                <span class="badge-primary text-xs">
                  {{ tab === 'received' ? t('letters.from') : 'To' }}:
                  {{ tab === 'received'
                    ? (letter.anonymous ? '🎭 Anonymous' : getCamper(letter.fromId)?.name)
                    : getCamper(letter.toId)?.name
                  }}
                </span>
                <span v-if="letter.edited" class="badge-info text-xs">Edited</span>
                <span class="font-body text-xs text-tertiary/40 ml-auto">{{ formatDate(letter.timestamp) }}</span>
              </div>

              <!-- Body -->
              <div v-if="expandedId !== letter.id" @click="expandedId = letter.id"
                class="font-body text-sm text-tertiary/75 leading-relaxed cursor-pointer line-clamp-3 hover:text-tertiary transition-colors">
                {{ letter.body }}
              </div>
              <div v-else class="font-body text-sm text-tertiary/85 leading-relaxed whitespace-pre-wrap cursor-pointer"
                @click="expandedId = null">
                {{ letter.body }}
              </div>
            </div>

            <!-- Edit bullet (sent only, own letters) -->
            <div v-if="tab === 'sent'" class="flex-shrink-0">
              <button v-if="editingId !== letter.id" @click="startEdit(letter)" class="btn-ghost btn-sm btn-icon">
                <Pencil class="w-4 h-4" />
              </button>
              <div v-else class="space-y-2">
                <textarea v-model="editBody" rows="6" class="input text-sm resize-none w-64"></textarea>
                <div class="flex gap-2">
                  <button @click="saveEdit(letter.id)" class="btn-primary btn-sm flex-1 justify-center text-xs">Save</button>
                  <button @click="editingId = null" class="btn-ghost btn-sm text-xs">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useCampersStore } from '../stores/campers'
import { useLettersStore } from '../stores/letters'
import { PenLine, Pencil } from 'lucide-vue-next'

const { t } = useI18n()
const auth = useAuthStore()
const campersStore = useCampersStore()
const lettersStore = useLettersStore()

const tab = ref('received')
const expandedId = ref(null)
const editingId = ref(null)
const editBody = ref('')

const received = computed(() => lettersStore.getReceived(auth.user.id))
const sent = computed(() => lettersStore.getSent(auth.user.id))
const currentList = computed(() => tab.value === 'received' ? received.value : sent.value)

const getCamper = (id) => campersStore.getCamperById(id)
const formatDate = (ts) => new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

function startEdit(letter) { editingId.value = letter.id; editBody.value = letter.body }
function saveEdit(id) { lettersStore.edit(id, editBody.value); editingId.value = null }
</script>

<style scoped>
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
</style>
