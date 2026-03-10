<template>
  <div class="page-container bg-dark">
    <div class="container-inner py-10 max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="section-title">{{ t('friends.title') }}</h1>
        <button @click="showAdd = true" class="btn-primary btn-sm">
          <UserPlus class="w-4 h-4" /> {{ t('friends.add') }}
        </button>
      </div>

      <!-- Friends Grid -->
      <div v-if="friends.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div v-for="friend in friends" :key="friend.id" class="card-hover p-5 text-center group">
          <div class="text-5xl mb-2">{{ friend.avatar }}</div>
          <h3 class="font-heading font-bold text-sm text-tertiary group-hover:text-primary transition-colors">{{ friend.name }}</h3>
          <p class="font-body text-xs text-primary mb-2">{{ friend.group }}</p>
          <span class="badge-accent text-xs">{{ friend.campCode }}</span>
        </div>
      </div>
      <div v-else class="text-center py-20">
        <p class="text-5xl mb-4">👋</p>
        <p class="font-body text-tertiary/60">{{ t('friends.no_friends') }}</p>
        <p class="font-body text-sm text-tertiary/40 mt-2">Hint: Try adding code SC002 or SC003!</p>
      </div>

      <!-- Add Friend Modal -->
      <Transition name="modal">
        <div v-if="showAdd" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" @click="showAdd = false"></div>
          <div class="relative card p-8 max-w-sm w-full border-primary/20 shadow-warm-lg">
            <h3 class="font-heading font-bold text-xl text-primary mb-2">{{ t('friends.add') }}</h3>
            <p class="font-body text-xs text-tertiary/50 mb-5">{{ t('friends.add_hint') }}</p>
            <input v-model="friendCode" type="text" class="input mb-3 text-center tracking-widest uppercase"
              :placeholder="t('friends.input_placeholder')" maxlength="6" />
            <p v-if="addError" class="font-body text-xs text-red-400 mb-3">{{ addError }}</p>
            <p v-if="addSuccess" class="font-body text-xs text-green-400 mb-3">Friend added! 🎉</p>
            <div class="flex gap-2">
              <button @click="showAdd = false" class="btn-ghost btn-sm flex-1">{{ t('common.cancel') }}</button>
              <button @click="addFriend" class="btn-primary btn-sm flex-1">Add</button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true })

import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useCampersStore } from '~/stores/campers'
import { UserPlus } from 'lucide-vue-next'

const { t } = useI18n()
const auth = useAuthStore()
const campersStore = useCampersStore()

const showAdd = ref(false)
const friendCode = ref('')
const addError = ref('')
const addSuccess = ref(false)

const friends = computed(() => campersStore.getFriends(auth.user?.id))

function addFriend() {
  addError.value = ''; addSuccess.value = false
  const result = campersStore.addFriend(auth.user.id, friendCode.value.toUpperCase())
  if (result.success) { addSuccess.value = true; friendCode.value = ''; setTimeout(() => showAdd.value = false, 1200) }
  else addError.value = result.error
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
