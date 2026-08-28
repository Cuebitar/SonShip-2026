<template>
  <div class="page-container bg-dark min-h-screen pb-16">

    <!-- Header (idle state only) -->
    <section v-if="!started" class="py-12 bg-gradient-dark relative overflow-hidden border-b border-white/10">
      <div class="container-inner relative z-10">
        <h1 class="font-heading font-black text-3xl md:text-4xl text-primary mb-2">🧬 Immune System Briefing</h1>
        <p class="font-body text-tertiary">Reveal the article on screen for a timed 4-minute read, then it closes automatically.</p>
      </div>
    </section>

    <!-- Idle state -->
    <section v-if="!started" class="container-inner mt-8 max-w-3xl mx-auto">
      <div class="card p-8 sm:p-12 border border-primary/30 text-center">
        <p class="text-5xl mb-4">🧬</p>
        <h2 class="font-heading font-black text-xl text-white mb-2">Ready to reveal the article</h2>
        <p class="text-sm text-tertiary mb-8">
          Once started, the article will be shown for 4 minutes and then close automatically.
        </p>
        <button @click="start" class="btn-primary w-auto min-w-0 px-10">
          ▶ Start
        </button>
      </div>
    </section>

    <!-- Article state: nothing but the article and the timer -->
    <section v-else class="container-inner py-10 max-w-3xl mx-auto">
      <button
        @click="close"
        title="Click to close early"
        class="px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-all mb-6"
      >
        ⏱ Closes in {{ formattedTime }}
      </button>

      <article class="prose-article space-y-5 text-white/90 leading-relaxed text-sm sm:text-base">
          <p>
            Our immune system is made up of the innate (general) immune system and the adaptive (specialized) immune system working together. The innate immune system is the body's first line of defense against intruders. It responds in the same way to all germs, thus is sometimes referred to as the "non-specific" immune system. It acts very quickly – for instance, it makes sure that bacteria that have entered the skin through a small wound are detected and destroyed on the spot within a few hours.
          </p>
          <p>
            If the innate (general) immune system fails to destroy the germs, the adaptive (specialized) immune system takes over and target the specific type of germ that is causing the infection. The adaptive immune system is made up of T cells, B cells, and antibodies. The T and B lymphocytes (T and B Cells) are involved in the acquired or antigen-specific immune response given that they are the only cells in the organism able to recognize and respond specifically to each antigenic epitope. The B Cells have the ability to transform into plasmocytes and are responsible for producing antibodies (Abs). Thus, humoral immunity depends on the B Cells while cell immunity depends on the T Cells.
          </p>
          <p>
            B cells (B lymphocytes) are made in the bone marrow, where they mature into specialized immune system cells. They take their name from the "B" in "bone marrow." B cells are activated by T helper cells: T helper cells send signals to B cells that match the same germs as they do. This stimulates the B cells to make copies of themselves and turn into plasma cells. The plasma cells quickly make very large amounts of antibodies and release them into the blood. Because the T helper cells only activate the B cells that match the attacking germs, the body only makes the exact antibodies that are needed. Some of the activated B cells turn into memory cells and become part of the "memory" of the adaptive immune system. The different cells of the adaptive immune system communicate either directly or through soluble chemical messengers such as cytokines (usually proteins).
          </p>
          <p>
            T cells (also called T lymphocytes) are made in bone marrow. They travel in the bloodstream to the thymus, where they mature. The "T" in their name comes from "thymus." T cells have three main jobs: 1. They use chemical messengers to activate other cells of the immune system, starting the adaptive immune system response (T helper cells). 2. They detect tumor cells or cells that have been infected by viruses and destroy them (cytotoxic T cells). 3. Some T helper cells become memory T cells after the infection has cleared up. They "remember" the germ that was fought off, and are then ready to activate the adaptive immune system quickly if the body is infected by the same germ again. T cells have specific features (receptors) on their surfaces that germs can attach to – like a lock that one particular key will fit. The immune system can make a matching T cell type for each germ within a few days of infection. Then if a germ attaches to a matching T cell, the T cell starts to multiply – making more T cells that can specifically fight that germ.
          </p>
      </article>
    </section>

  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true, layout: false })

import { ref, computed, onUnmounted } from 'vue'

const DURATION_SECONDS = 3 * 60

const started = ref(false)
const secondsLeft = ref(DURATION_SECONDS)
let timer = null

const formattedTime = computed(() => {
  const m = Math.floor(secondsLeft.value / 60)
  const s = secondsLeft.value % 60
  return `${m}:${String(s).padStart(2, '0')}`
})

function start() {
  clearInterval(timer)
  secondsLeft.value = DURATION_SECONDS
  started.value = true
  timer = setInterval(() => {
    secondsLeft.value -= 1
    if (secondsLeft.value <= 0) close()
  }, 1000)
}

function close() {
  clearInterval(timer)
  timer = null
  started.value = false
}

onUnmounted(() => clearInterval(timer))
</script>
