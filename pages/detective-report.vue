<template>
  <div class="min-h-screen bg-dark flex flex-col">

    <!-- Minimal header (no site nav) -->
    <header class="py-3 sm:py-4 border-b border-white/10 bg-gradient-dark">
      <div class="container-inner flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
        <div>
          <p class="font-heading font-black text-primary text-base sm:text-lg leading-tight">🔍 终极密室 The Final Night</p>
          <p class="text-[11px] text-primary/50">最终报告 Final Report</p>
        </div>
        <NuxtLink to="/dashboard" class="text-xs text-primary/60 hover:text-primary transition-colors shrink-0">
          ← 返回主页 Back to Dashboard
        </NuxtLink>
      </div>
    </header>

    <main class="flex-1 container-inner py-6 sm:py-8 max-w-2xl mx-auto w-full">

      <!-- No team assigned -->
      <div v-if="!groupName" class="text-center py-16 sm:py-24 px-4">
        <p class="text-5xl mb-4">🚫</p>
        <h1 class="font-heading font-black text-xl sm:text-2xl text-white mb-2">尚未分配团队 No Team Assigned</h1>
        <p class="text-tertiary mb-8 text-sm sm:text-base">
          你需要先加入一个团队，才能提交报告。请联系工作人员将你加入小组。
          <br>You need to be part of a team before you can submit a report. Ask an admin to add you to a group.
        </p>
        <NuxtLink to="/dashboard" class="btn-primary w-auto min-w-0 px-8 inline-block">返回主页 Back to Dashboard</NuxtLink>
      </div>

      <div v-else class="space-y-6">
        <div class="text-center px-2">
          <p class="text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary/60 mb-2 break-words">团队 Team {{ groupName }}</p>
          <h1 class="font-heading font-black text-xl sm:text-2xl text-white">写下你们发现的线索<br class="sm:hidden">Write down what you've uncovered</h1>
          <p class="text-sm text-tertiary mt-1">
            在评分前，你可以随时修改并重新提交答案。
            <br>You can edit and resubmit your answers any time before judging.
          </p>
        </div>

        <div class="card p-4 sm:p-6 border border-primary/30 space-y-6">
          <div>
            <label class="block text-sm font-bold text-primary mb-2">
              1. 那晚发生了什么事？ What happened that night?
              <span class="text-tertiary/50 font-normal block mt-0.5">（请尽可能详细描述）(Be as detailed as possible)</span>
            </label>
            <textarea
              v-model="q1"
              rows="6"
              class="input py-2.5 bg-dark/50 resize-none"
              placeholder="按时间顺序完整讲述你们团队所了解的故事… Tell the full story, in order, as your team understands it…"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-bold text-primary mb-2">
              2. 你们还找到哪些关于嫌疑人的信息？ Any other information you found about the suspects?
              <span class="text-tertiary/50 font-normal block mt-0.5">（写下第一题未包含的任何信息）(Write down anything you didn't include under question 1)</span>
            </label>
            <textarea
              v-model="q2"
              rows="6"
              class="input py-2.5 bg-dark/50 resize-none"
              placeholder="姓名、动机、不在场证明，任何可疑的线索… Names, motives, alibis, anything suspicious…"
            ></textarea>
          </div>

          <p v-if="error" class="text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            {{ error }}
          </p>
          <p v-if="lastSubmittedAt" class="text-xs text-tertiary/50">
            上次提交时间 Last submitted {{ lastSubmittedAt }}
          </p>

          <button
            @click="submit"
            :disabled="saving"
            class="btn-primary w-full"
            :class="{ 'opacity-50 cursor-not-allowed': saving }"
          >
            {{ saving ? '提交中… Submitting…' : saved ? '✓ 已提交 Submitted' : '提交报告 Submit Report' }}
          </button>
        </div>

        <NuxtLink to="/dashboard" class="block w-full text-center py-3 font-bold text-tertiary hover:text-white transition-colors text-sm">
          ← 返回主页 Back to Dashboard
        </NuxtLink>
      </div>

    </main>
  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true, layout: false, ssr: false })

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useDetectiveGameStore } from '~/stores/detectiveGame'
import { useAuthStore } from '~/stores/auth'

const store = useDetectiveGameStore()
const auth = useAuthStore()

const groupName = computed(() => auth.user?.group || '')

const q1 = ref('')
const q2 = ref('')
const saving = ref(false)
const saved = ref(false)
const error = ref('')
let prefilled = false

const lastSubmittedAt = computed(() => {
  const ts = store.scores[groupName.value]?.report?.submittedAt
  if (!ts?.seconds) return ''
  return new Date(ts.seconds * 1000).toLocaleString('en-MY', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
})

watch(() => store.scores[groupName.value], (team) => {
  if (prefilled || !team) return
  prefilled = true
  q1.value = team.report?.q1 || ''
  q2.value = team.report?.q2 || ''
}, { immediate: true })

onMounted(() => store.subscribe())
onUnmounted(() => store.unsubscribe())

async function submit() {
  if (!groupName.value || saving.value) return
  error.value = ''
  if (!q1.value.trim() && !q2.value.trim()) {
    error.value = '请至少回答一个问题后再提交。Please answer at least one question before submitting.'
    return
  }
  saving.value = true
  saved.value = false
  try {
    await store.submitReport(groupName.value, {
      q1: q1.value.trim(),
      q2: q2.value.trim(),
      submittedBy: { name: auth.user?.name || '', email: auth.user?.email || '' },
    })
    saved.value = true
  } catch (err) {
    console.error('[detective-report] submit failed', err)
    error.value = `提交失败 Submit failed: ${err.message}`
  } finally {
    saving.value = false
  }
}
</script>
