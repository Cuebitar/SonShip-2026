<template>
  <div class="page-container bg-dark">
    <div class="container-inner py-10">
      <div class="flex items-center justify-between mb-8">
        <h1 class="section-title">{{ t('messages.title') }}</h1>
        <button @click="composeOpen = true" class="btn-primary btn-sm">
          <Pencil class="w-4 h-4" /> {{ t('messages.compose') }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[60vh]">
        <!-- Sidebar -->
        <div class="space-y-2">
          <div class="flex rounded-xl overflow-hidden border border-primary/10 mb-4">
            <button @click="tab = 'inbox'" class="flex-1 py-2.5 text-sm font-heading font-semibold transition-all"
              :class="tab === 'inbox' ? 'bg-primary text-secondary' : 'text-tertiary/70 hover:bg-primary/10'">
              {{ t('messages.inbox') }}
              <span v-if="unread > 0" class="ml-1.5 badge-danger text-xs px-1.5 py-0">{{ unread }}</span>
            </button>
            <button @click="tab = 'sent'" class="flex-1 py-2.5 text-sm font-heading font-semibold transition-all"
              :class="tab === 'sent' ? 'bg-primary text-secondary' : 'text-tertiary/70 hover:bg-primary/10'">
              {{ t('messages.sent') }}
            </button>
          </div>

          <div v-if="messageList.length === 0" class="card p-6 text-center">
            <p class="font-body text-xs text-tertiary/40">{{ t('messages.no_messages') }}</p>
          </div>
          <div v-for="msg in messageList" :key="msg.id"
            @click="open(msg)"
            class="card p-4 cursor-pointer transition-all duration-200"
            :class="selected?.id === msg.id ? 'border-primary/50 bg-primary/10' : 'hover:border-primary/20'">
            <div class="flex items-start justify-between gap-2 mb-1">
              <p class="font-heading font-semibold text-sm text-tertiary truncate">{{ partnerName(msg) }}</p>
              <span v-if="!msg.read && tab === 'inbox'" class="badge-danger text-xs px-1.5">{{ t('messages.new_badge') }}</span>
              <span class="text-xs text-tertiary/30 whitespace-nowrap">{{ formatTime(msg.timestamp) }}</span>
            </div>
            <p class="font-body text-xs text-primary font-semibold truncate">{{ msg.subject }}</p>
            <p class="font-body text-xs text-tertiary/50 mt-0.5 truncate">{{ msg.body }}</p>
          </div>
        </div>

        <!-- Message View -->
        <div class="md:col-span-2 card p-6 flex flex-col">
          <div v-if="selected" class="flex-1">
            <h2 class="font-heading font-bold text-lg text-tertiary mb-1">{{ selected.subject }}</h2>
            <p class="font-body text-xs text-tertiary/50 mb-6">
              {{ tab === 'inbox' ? 'From' : 'To' }}: {{ partnerName(selected) }} · {{ formatTime(selected.timestamp) }}
            </p>
            <p class="font-body text-sm text-tertiary/80 leading-relaxed">{{ selected.body }}</p>
          </div>
          <div v-else class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <p class="text-4xl mb-3">💬</p>
              <p class="font-body text-sm text-tertiary/40">Select a message to read</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Compose Modal -->
    <Transition name="modal">
      <div v-if="composeOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" @click="composeOpen = false"></div>
        <div class="relative card p-8 max-w-lg w-full border-primary/20 space-y-4">
          <h3 class="font-heading font-bold text-xl text-primary">{{ t('messages.compose') }}</h3>
          <div>
            <label class="input-label">{{ t('messages.to') }}</label>
            <select v-model="compose.toId" class="input">
              <option v-for="c in otherCampers" :key="c.id" :value="c.id">{{ c.avatar }} {{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="input-label">{{ t('messages.subject') }}</label>
            <input v-model="compose.subject" type="text" class="input" />
          </div>
          <div>
            <label class="input-label">{{ t('messages.body') }}</label>
            <textarea v-model="compose.body" rows="4" class="input resize-none"></textarea>
          </div>
          <div class="flex gap-2">
            <button @click="composeOpen = false" class="btn-ghost btn-sm flex-1">{{ t('common.cancel') }}</button>
            <button @click="sendMessage" class="btn-primary btn-sm flex-1 justify-center">
              <Send class="w-4 h-4" /> {{ t('messages.send') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true })

import { ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useCampersStore } from '~/stores/campers'
import { useMessagesStore } from '~/stores/messages'
import { Pencil, Send } from 'lucide-vue-next'

const { t } = useI18n()
const auth = useAuthStore()
const campersStore = useCampersStore()
const msgStore = useMessagesStore()

const tab = ref('inbox')
const selected = ref(null)
const composeOpen = ref(false)
const compose = reactive({ toId: null, subject: '', body: '' })

const messageList = computed(() => tab.value === 'inbox' ? msgStore.getInbox(auth.user.id) : msgStore.getSent(auth.user.id))
const unread = computed(() => msgStore.unreadCount(auth.user.id))
const otherCampers = computed(() => campersStore.campers.filter(c => c.id !== auth.user.id))

function open(msg) {
  selected.value = msg
  if (tab.value === 'inbox') msgStore.markRead(msg.id)
}

function partnerName(msg) {
  const id = tab.value === 'inbox' ? msg.fromId : msg.toId
  return campersStore.getCamperById(id)?.name || 'Unknown'
}

function formatTime(ts) {
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function sendMessage() {
  if (!compose.toId || !compose.subject || !compose.body) return
  msgStore.send({ fromId: auth.user.id, ...compose })
  composeOpen.value = false
  Object.assign(compose, { toId: null, subject: '', body: '' })
  tab.value = 'sent'
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
