<template>
  <div class="page-container bg-dark min-h-screen pb-16">

    <!-- Header -->
    <section class="py-12 bg-gradient-dark relative overflow-hidden border-b border-white/10">
      <div class="container-inner relative z-10">
        <NuxtLink to="/admin/games" class="text-xs text-primary/60 hover:text-primary transition-colors mb-3 inline-flex items-center gap-1">
          ← Games Dashboard
        </NuxtLink>
        <h1 class="font-heading font-black text-3xl md:text-4xl text-primary mb-2">🔍 The Final Night</h1>
        <p class="font-body text-tertiary">Detective game — score management &amp; clue distribution</p>
      </div>
    </section>

    <!-- Tabs -->
    <section class="container-inner mt-6">
      <div class="flex gap-1 border-b border-white/10">
        <button
          v-for="tab in TABS" :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-5 py-3 font-heading font-bold text-sm transition-all border-b-2 -mb-px',
            activeTab === tab.id
              ? 'text-primary border-primary'
              : 'text-tertiary/60 border-transparent hover:text-white'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </section>

    <!-- Score Dashboard -->
    <section v-if="activeTab === 'control'" class="container-inner mt-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-heading font-bold text-white text-lg">
          Score Dashboard
          <span class="ml-2 text-sm font-normal text-tertiary/50">{{ store.leaderboard.length }} groups</span>
        </h2>
      </div>

      <div class="card overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr class="border-b border-white/10 bg-white/5">
              <th class="p-4 font-heading text-primary font-bold text-sm w-14">Rank</th>
              <th class="p-4 font-heading text-primary font-bold text-sm">Group</th>
              <th class="p-4 font-heading text-primary font-bold text-sm text-center">
                Stage 3
                <span class="block text-primary/40 font-normal text-xs">/100</span>
              </th>
              <th class="p-4 font-heading text-primary font-bold text-sm text-center">
                Stage 4
                <span class="block text-primary/40 font-normal text-xs">/100</span>
              </th>
              <th class="p-4 font-heading text-primary font-bold text-sm text-center">
                Stage 5
                <span class="block text-primary/40 font-normal text-xs">/100</span>
              </th>
              <th class="p-4 font-heading text-primary font-bold text-sm text-center">
                Total
                <span class="block text-primary/40 font-normal text-xs">/300</span>
              </th>
              <th class="p-4 font-heading text-primary font-bold text-sm text-right">Edit</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!store.loaded">
              <td colspan="7" class="p-8 text-center text-tertiary">Loading…</td>
            </tr>
            <tr v-else-if="store.leaderboard.length === 0">
              <td colspan="7" class="p-8 text-center text-tertiary">No groups yet.</td>
            </tr>
            <tr
              v-else
              v-for="(entry, i) in store.leaderboard"
              :key="entry.name"
              class="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td class="p-4">
                <span :class="['font-heading font-black text-xl', rankColorClass(i)]">{{ i + 1 }}</span>
              </td>
              <td class="p-4 font-bold text-white">{{ entry.name }}</td>
              <td class="p-4 text-center">
                <span :class="scoreColorClass(entry.stage3, 100)">{{ entry.stage3 }}</span>
              </td>
              <td class="p-4 text-center">
                <span :class="scoreColorClass(entry.stage4, 100)">{{ entry.stage4 }}</span>
              </td>
              <td class="p-4 text-center">
                <span :class="scoreColorClass(entry.stage5, 100)">{{ entry.stage5 }}</span>
              </td>
              <td class="p-4 text-center">
                <span class="font-heading font-black text-primary text-xl">{{ entry.total }}</span>
              </td>
              <td class="p-4 text-right">
                <button @click="openEdit(entry)" class="btn-primary py-1.5 px-3 text-xs w-auto min-w-0">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </section>

    <!-- ═══ Reports Tab ═════════════════════════════════════════════ -->
    <section v-if="activeTab === 'reports'" class="container-inner mt-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-heading font-bold text-white text-lg">
          Final Reports
          <span class="ml-2 text-sm font-normal text-tertiary/50">
            {{ submittedReports.length }} / {{ reportsList.length }} submitted
          </span>
        </h2>
      </div>

      <div v-if="!store.loaded" class="card p-8 text-center text-tertiary">Loading…</div>
      <div v-else-if="reportsList.length === 0" class="card p-8 text-center text-tertiary">No groups yet.</div>
      <div v-else class="space-y-4">
        <div
          v-for="entry in reportsList" :key="entry.name"
          class="card p-5 border"
          :class="entry.submittedAt ? 'border-white/10' : 'border-white/5 opacity-60'"
        >
          <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 class="font-heading font-bold text-white">{{ entry.name }}</h3>
            <span v-if="entry.submittedAt" class="text-xs text-tertiary/50">
              Submitted {{ formatReportTime(entry.submittedAt) }}
              <template v-if="entry.submittedBy?.name"> by {{ entry.submittedBy.name }}</template>
            </span>
            <span v-else class="px-2.5 py-1 rounded-full text-xs font-bold bg-white/5 text-tertiary/50">Not submitted</span>
          </div>

          <div class="space-y-3">
            <div>
              <p class="text-xs font-bold text-primary/80 mb-1">1. What happened that night?</p>
              <p class="text-sm text-white whitespace-pre-line">{{ entry.q1 || '—' }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-primary/80 mb-1">2. Other information about the suspects?</p>
              <p class="text-sm text-white whitespace-pre-line">{{ entry.q2 || '—' }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ Clues Tab ═══════════════════════════════════════════════ -->
    <section v-if="activeTab === 'clues'" class="container-inner mt-8">

      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-4">
          <h2 class="font-heading font-bold text-white text-lg">
            Clue Library
            <span class="ml-2 text-sm font-normal text-tertiary/50">{{ store.clueList.length }} clues</span>
          </h2>
          <button
            @click="toggleMiniGames"
            :class="[
              'px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap',
              miniGamesEnabled
                ? 'bg-green-500/20 text-green-400 border-green-500/40'
                : 'bg-white/5 text-tertiary/50 border-white/10 hover:bg-white/10'
            ]"
          >
            🎲 Mini-Games: {{ miniGamesEnabled ? 'On' : 'Off' }}
          </button>
        </div>
        <button @click="openAddClue" class="btn-primary py-1.5 px-4 text-xs w-auto min-w-0">
          + Add Clue
        </button>
      </div>

      <!-- Stage filter -->
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <span class="text-xs font-bold text-tertiary/50 uppercase tracking-widest mr-1">Filter:</span>
        <label
          v-for="opt in stageFilterOptions" :key="opt.value"
          class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all border"
          :class="clueStageFilter === opt.value
            ? 'bg-primary/15 text-primary border-primary/50'
            : 'bg-white/5 text-tertiary border-white/10 hover:bg-white/10'"
        >
          <input
            type="radio"
            name="clue-stage-filter"
            :value="opt.value"
            v-model="clueStageFilter"
            class="accent-primary w-3 h-3"
          />
          {{ opt.label }}
          <span class="text-tertiary/50 font-normal">({{ opt.count }})</span>
        </label>
      </div>

      <div class="card overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[860px]">
          <thead>
            <tr class="border-b border-white/10 bg-white/5">
              <th class="p-4 font-heading text-primary font-bold text-sm w-24 whitespace-nowrap">
                <button @click="toggleClueSort('stage')" class="flex items-center gap-1 hover:text-white transition-colors">
                  Stage <span class="text-[10px] w-2 inline-block">{{ clueSortIndicator('stage') }}</span>
                </button>
              </th>
              <th class="p-4 font-heading text-primary font-bold text-sm">
                <button @click="toggleClueSort('title')" class="flex items-center gap-1 hover:text-white transition-colors">
                  Title <span class="text-[10px] w-2 inline-block">{{ clueSortIndicator('title') }}</span>
                </button>
              </th>
              <th class="p-4 font-heading text-primary font-bold text-sm">Description</th>
              <th class="p-4 font-heading text-primary font-bold text-sm">
                <button @click="toggleClueSort('fileName')" class="flex items-center gap-1 hover:text-white transition-colors">
                  Document <span class="text-[10px] w-2 inline-block">{{ clueSortIndicator('fileName') }}</span>
                </button>
              </th>
              <th class="p-4 font-heading text-primary font-bold text-sm text-center">
                <button @click="toggleClueSort('viewers')" class="flex items-center gap-1 mx-auto hover:text-white transition-colors">
                  Viewers <span class="text-[10px] w-2 inline-block">{{ clueSortIndicator('viewers') }}</span>
                </button>
              </th>
              <th class="p-4 font-heading text-primary font-bold text-sm">Clue Link</th>
              <th class="p-4 font-heading text-primary font-bold text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!store.cluesLoaded">
              <td colspan="7" class="p-8 text-center text-tertiary">Loading…</td>
            </tr>
            <tr v-else-if="filteredClues.length === 0">
              <td colspan="7" class="p-8 text-center text-tertiary">
                <template v-if="store.clueList.length === 0">
                  No clues yet. Click <strong class="text-primary">"+ Add Clue"</strong> to create the first one.
                </template>
                <template v-else>
                  No clues for Stage {{ clueStageFilter }}.
                </template>
              </td>
            </tr>
            <tr
              v-else
              v-for="c in filteredClues"
              :key="c.id"
              class="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td class="p-4">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary whitespace-nowrap">Stage {{ c.stage }}</span>
              </td>
              <td class="p-4 font-bold text-white">{{ c.title }}</td>
              <td class="p-4 text-tertiary/80 text-sm max-w-[220px]">
                <p class="line-clamp-2">{{ c.description || '—' }}</p>
              </td>
              <td class="p-4 text-sm">
                <a
                  v-if="c.fileUrl"
                  :href="c.fileUrl" target="_blank" rel="noopener"
                  class="text-primary/80 hover:text-primary underline underline-offset-2 break-all"
                >{{ c.fileName || 'View file' }}</a>
                <span v-else class="text-tertiary/40">—</span>
              </td>
              <td class="p-4 text-center">
                <button
                  @click="viewersTarget = c"
                  class="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                  :class="(c.viewers?.length || 0) > 0
                    ? 'bg-green-500/15 text-green-400 hover:bg-green-500/25'
                    : 'bg-white/5 text-tertiary/50 hover:bg-white/10'"
                >
                  👁 {{ c.viewers?.length || 0 }}
                </button>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <code class="text-xs text-tertiary/60 bg-white/5 px-2 py-1 rounded max-w-[160px] truncate">/clue/{{ c.id }}</code>
                  <button
                    @click="copyLink(c)"
                    class="px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0"
                    :class="copiedId === c.id
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'"
                  >
                    {{ copiedId === c.id ? '✓ Copied!' : '⎘ Copy Link' }}
                  </button>
                </div>
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openEditClue(c)"
                    class="px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    @click="removeClue(c)"
                    class="px-3 py-1.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-xs text-tertiary/40 mt-3">
        Copy a clue link into your QR/NFC tag generator. Campers who open the link are recorded under Viewers.
        <template v-if="miniGamesEnabled">They must clear 3 random mini-challenges before the clue is revealed.</template>
        <template v-else>Mini-games are off — clues are shown immediately when the link is opened.</template>
      </p>
    </section>

    <!-- Add Clue Modal -->
    <Transition name="modal">
      <div v-if="showAddClue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" @click="closeAddClue"></div>
        <div class="relative card max-w-md w-full p-0 shadow-2xl border-primary/30 max-h-[90vh] overflow-y-auto">

          <div class="p-6 border-b border-white/10 flex justify-between items-center">
            <div>
              <h3 class="font-heading font-black text-xl text-primary">Add Clue</h3>
              <p class="text-xs text-tertiary mt-0.5">Upload a clue document and generate its link</p>
            </div>
            <button @click="closeAddClue" class="text-tertiary hover:text-white text-2xl leading-none p-1">&times;</button>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-bold text-primary/80 mb-1.5">Stage</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="stage in [1, 2, 3, 4, 5]" :key="stage"
                  @click="clueForm.stage = stage"
                  :class="[
                    'px-4 py-2 rounded-full font-heading text-sm font-bold transition-all',
                    clueForm.stage === stage
                      ? 'bg-primary text-dark shadow-warm'
                      : 'bg-white/5 text-tertiary hover:bg-white/10'
                  ]"
                >
                  {{ stage }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-primary/80 mb-1.5">Title <span class="text-red-400">*</span></label>
              <input v-model="clueForm.title" type="text" class="input py-2 bg-dark/50" placeholder="e.g. The Torn Letter" />
            </div>

            <div>
              <label class="block text-xs font-bold text-primary/80 mb-1.5">Description</label>
              <textarea
                v-model="clueForm.description"
                rows="3"
                class="input py-2 bg-dark/50 resize-none"
                placeholder="Shown to campers above the document (optional)"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-primary/80 mb-1.5">Clue Document</label>
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx,.txt"
                @change="onFilePicked"
                class="block w-full text-sm text-tertiary file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
              />
              <p v-if="clueForm.file" class="text-xs text-green-400 mt-2">
                ✓ {{ clueForm.file.name }} ({{ (clueForm.file.size / 1024).toFixed(0) }} KB)
              </p>
            </div>

            <p v-if="clueError" class="text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {{ clueError }}
            </p>
          </div>

          <div class="p-6 border-t border-white/10 flex justify-end gap-3">
            <button @click="closeAddClue" class="px-4 py-2 font-bold text-tertiary hover:text-white transition-colors text-sm">
              Cancel
            </button>
            <button
              @click="saveClue"
              :disabled="savingClue"
              class="btn-primary w-auto min-w-0 px-6 text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': savingClue }"
            >
              {{ savingClue ? 'Uploading…' : 'Save Clue' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Edit Clue Modal -->
    <Transition name="modal">
      <div v-if="editClueTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" @click="closeEditClue"></div>
        <div class="relative card max-w-md w-full p-0 shadow-2xl border-primary/30 max-h-[90vh] overflow-y-auto">

          <div class="p-6 border-b border-white/10 flex justify-between items-center">
            <div>
              <h3 class="font-heading font-black text-xl text-primary">Edit Clue</h3>
              <p class="text-xs text-tertiary mt-0.5">Update the details or replace its document</p>
            </div>
            <button @click="closeEditClue" class="text-tertiary hover:text-white text-2xl leading-none p-1">&times;</button>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-bold text-primary/80 mb-1.5">Stage</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="stage in [1, 2, 3, 4, 5]" :key="stage"
                  @click="editClueForm.stage = stage"
                  :class="[
                    'px-4 py-2 rounded-full font-heading text-sm font-bold transition-all',
                    editClueForm.stage === stage
                      ? 'bg-primary text-dark shadow-warm'
                      : 'bg-white/5 text-tertiary hover:bg-white/10'
                  ]"
                >
                  {{ stage }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-primary/80 mb-1.5">Title <span class="text-red-400">*</span></label>
              <input v-model="editClueForm.title" type="text" class="input py-2 bg-dark/50" placeholder="e.g. The Torn Letter" />
            </div>

            <div>
              <label class="block text-xs font-bold text-primary/80 mb-1.5">Description</label>
              <textarea
                v-model="editClueForm.description"
                rows="3"
                class="input py-2 bg-dark/50 resize-none"
                placeholder="Shown to campers above the document (optional)"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-primary/80 mb-1.5">Clue Document</label>
              <a
                v-if="editClueTarget.fileUrl"
                :href="editClueTarget.fileUrl" target="_blank" rel="noopener"
                class="block text-xs text-primary/80 hover:text-primary underline underline-offset-2 break-all mb-2"
              >Current: {{ editClueTarget.fileName || 'View file' }}</a>
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx,.txt"
                @change="onEditFilePicked"
                class="block w-full text-sm text-tertiary file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
              />
              <p class="text-xs text-tertiary/40 mt-2">Leave empty to keep the current document.</p>
              <p v-if="editClueForm.file" class="text-xs text-green-400 mt-2">
                ✓ Replacing with {{ editClueForm.file.name }} ({{ (editClueForm.file.size / 1024).toFixed(0) }} KB)
              </p>
            </div>

            <p v-if="editClueError" class="text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {{ editClueError }}
            </p>
          </div>

          <div class="p-6 border-t border-white/10 flex justify-end gap-3">
            <button @click="closeEditClue" class="px-4 py-2 font-bold text-tertiary hover:text-white transition-colors text-sm">
              Cancel
            </button>
            <button
              @click="saveEditClue"
              :disabled="savingEditClue"
              class="btn-primary w-auto min-w-0 px-6 text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': savingEditClue }"
            >
              {{ savingEditClue ? 'Saving…' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Viewers Modal -->
    <Transition name="modal">
      <div v-if="viewersTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" @click="viewersTarget = null"></div>
        <div class="relative card max-w-sm w-full p-0 shadow-2xl border-primary/30 max-h-[80vh] overflow-y-auto">

          <div class="p-6 border-b border-white/10 flex justify-between items-center">
            <div>
              <h3 class="font-heading font-black text-xl text-primary">{{ viewersTarget.title }}</h3>
              <p class="text-xs text-tertiary mt-0.5">{{ viewersTarget.viewers?.length || 0 }} campers opened this clue</p>
            </div>
            <button @click="viewersTarget = null" class="text-tertiary hover:text-white text-2xl leading-none p-1">&times;</button>
          </div>

          <div class="p-6">
            <p v-if="!viewersTarget.viewers?.length" class="text-tertiary text-sm text-center py-4">
              No one has opened this clue yet.
            </p>
            <table v-else class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="pb-2 pr-2">
                    <button
                      @click="toggleViewerSort('name')"
                      class="flex items-center gap-1 font-bold text-primary/80 hover:text-primary transition-colors"
                    >
                      Name <span class="text-[10px] w-2 inline-block">{{ viewerSortIndicator('name') }}</span>
                    </button>
                  </th>
                  <th class="pb-2 pr-2">
                    <button
                      @click="toggleViewerSort('group')"
                      class="flex items-center gap-1 font-bold text-primary/80 hover:text-primary transition-colors"
                    >
                      Group <span class="text-[10px] w-2 inline-block">{{ viewerSortIndicator('group') }}</span>
                    </button>
                  </th>
                  <th class="pb-2">
                    <button
                      @click="toggleViewerSort('at')"
                      class="flex items-center gap-1 ml-auto font-bold text-primary/80 hover:text-primary transition-colors"
                    >
                      Time <span class="text-[10px] w-2 inline-block">{{ viewerSortIndicator('at') }}</span>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="v in sortedViewers" :key="v.email"
                  class="border-b border-white/5"
                >
                  <td class="py-2 pr-2 font-bold text-white">{{ v.name }}</td>
                  <td class="py-2 pr-2 text-tertiary/50">{{ v.group || 'No group' }}</td>
                  <td class="py-2 text-tertiary/60 text-right whitespace-nowrap">{{ formatViewTime(v.at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Edit Score Modal -->
    <Transition name="modal">
      <div v-if="editTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" @click="closeEdit"></div>
        <div class="relative card max-w-sm w-full p-0 shadow-2xl border-primary/30">

          <div class="p-6 border-b border-white/10 flex justify-between items-center">
            <div>
              <h3 class="font-heading font-black text-xl text-primary">{{ editTarget.name }}</h3>
              <p class="text-xs text-tertiary mt-0.5">Edit stage scores</p>
            </div>
            <button @click="closeEdit" class="text-tertiary hover:text-white text-2xl leading-none p-1">&times;</button>
          </div>

          <div class="p-6 space-y-4">
            <div v-for="stage in [3, 4, 5]" :key="stage">
              <label class="block text-xs font-bold text-primary/80 mb-1.5">
                Stage {{ stage }} Score
                <span class="text-tertiary/40 font-normal ml-1">(0–100)</span>
              </label>
              <input
                v-model.number="editForm[`stage${stage}`]"
                type="number" min="0" max="100"
                class="input py-2 bg-dark/50"
                :placeholder="`Stage ${stage} score`"
              />
            </div>
            <div class="pt-2 border-t border-white/10">
              <p class="text-xs text-tertiary/40">
                New total: <span class="font-bold text-primary">
                  {{ (editForm.stage3 || 0) + (editForm.stage4 || 0) + (editForm.stage5 || 0) }}
                </span> / 300
              </p>
            </div>
          </div>

          <div class="p-6 border-t border-white/10 flex justify-end gap-3">
            <button @click="closeEdit" class="px-4 py-2 font-bold text-tertiary hover:text-white transition-colors text-sm">
              Cancel
            </button>
            <button @click="saveEdit" class="btn-primary w-auto min-w-0 px-6 text-sm">
              Save Scores
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true })

import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useDetectiveGameStore } from '~/stores/detectiveGame'

const store = useDetectiveGameStore()

const TABS = [
  { id: 'control', label: '🏆 Scores' },
  { id: 'reports', label: '📝 Reports' },
  { id: 'clues', label: '🗝️ Clues' },
]
const activeTab = ref('control')

onMounted(async () => {
  await store.subscribe()
  await store.subscribeClues()
})

onUnmounted(() => store.unsubscribe())

// Stage filter for the clue table
const clueStageFilter = ref('all')

const stageFilterOptions = computed(() => [
  { value: 'all', label: 'All Stages', count: store.clueList.length },
  ...[1, 2, 3, 4, 5].map(stage => ({
    value: stage,
    label: `Stage ${stage}`,
    count: store.clueList.filter(c => c.stage === stage).length,
  })),
])

// Column sort for the clue table
const clueSort = reactive({ key: null, dir: 'asc' })

function toggleClueSort(key) {
  if (clueSort.key === key) {
    clueSort.dir = clueSort.dir === 'asc' ? 'desc' : 'asc'
  } else {
    clueSort.key = key
    clueSort.dir = 'asc'
  }
}

function clueSortIndicator(key) {
  if (clueSort.key !== key) return ''
  return clueSort.dir === 'asc' ? '▲' : '▼'
}

const CLUE_SORT_ACCESSORS = {
  stage: c => c.stage ?? 0,
  title: c => (c.title || '').toLowerCase(),
  fileName: c => (c.fileName || '').toLowerCase(),
  viewers: c => c.viewers?.length || 0,
}

const filteredClues = computed(() => {
  const base = clueStageFilter.value === 'all'
    ? store.clueList
    : store.clueList.filter(c => c.stage === clueStageFilter.value)

  if (!clueSort.key) return base

  const accessor = CLUE_SORT_ACCESSORS[clueSort.key]
  const sorted = [...base].sort((a, b) => {
    const av = accessor(a)
    const bv = accessor(b)
    if (av < bv) return -1
    if (av > bv) return 1
    return 0
  })
  return clueSort.dir === 'desc' ? sorted.reverse() : sorted
})

// Mini-game gate for clue pages (on unless explicitly turned off)
const miniGamesEnabled = computed(() => store.gameState.miniGamesEnabled !== false)

async function toggleMiniGames() {
  await store.setGameState({ miniGamesEnabled: !miniGamesEnabled.value })
}

function rankColorClass(i) {
  if (i === 0) return 'text-yellow-400'
  if (i === 1) return 'text-slate-400'
  if (i === 2) return 'text-amber-600'
  return 'text-tertiary/30'
}

// ─── Reports ────────────────────────────────────────────────────────

const reportsList = computed(() =>
  Object.entries(store.scores)
    .map(([name, d]) => ({
      name,
      q1: d.report?.q1 || '',
      q2: d.report?.q2 || '',
      submittedBy: d.report?.submittedBy || null,
      submittedAt: d.report?.submittedAt || null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name)),
)

const submittedReports = computed(() => reportsList.value.filter(r => r.submittedAt))

function formatReportTime(ts) {
  if (!ts?.seconds) return '—'
  return new Date(ts.seconds * 1000).toLocaleString('en-MY', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

function scoreColorClass(score, max) {
  if (score === 0) return 'text-tertiary/30 font-normal'
  const pct = score / max
  if (pct >= 0.8) return 'text-green-400 font-bold'
  if (pct >= 0.5) return 'text-yellow-400 font-bold'
  return 'text-white font-medium'
}

const editTarget = ref(null)
const editForm = reactive({ stage3: 0, stage4: 0, stage5: 0 })

function openEdit(entry) {
  editTarget.value = entry
  editForm.stage3 = entry.stage3
  editForm.stage4 = entry.stage4
  editForm.stage5 = entry.stage5
}

function closeEdit() {
  editTarget.value = null
}

async function saveEdit() {
  if (!editTarget.value) return
  await store.upsertGroupScore(editTarget.value.name, {
    stage3: Number(editForm.stage3) || 0,
    stage4: Number(editForm.stage4) || 0,
    stage5: Number(editForm.stage5) || 0,
  })
  closeEdit()
}

// ─── Clues ──────────────────────────────────────────────────────────

const showAddClue = ref(false)
const savingClue = ref(false)
const clueError = ref('')
const clueForm = reactive({ stage: 1, title: '', description: '', file: null })

function openAddClue() {
  clueForm.stage = 1
  clueForm.title = ''
  clueForm.description = ''
  clueForm.file = null
  clueError.value = ''
  showAddClue.value = true
}

function closeAddClue() {
  if (savingClue.value) return
  showAddClue.value = false
}

function onFilePicked(e) {
  clueForm.file = e.target.files?.[0] || null
}

async function saveClue() {
  if (savingClue.value) return
  clueError.value = ''
  if (!clueForm.title.trim()) {
    clueError.value = 'Title is required.'
    return
  }
  savingClue.value = true
  try {
    await store.addClue({
      stage: clueForm.stage,
      title: clueForm.title.trim(),
      description: clueForm.description.trim(),
      file: clueForm.file,
    })
    savingClue.value = false
    showAddClue.value = false
  } catch (err) {
    console.error('[detective] add clue failed', err)
    clueError.value = `Upload failed: ${err.message}`
    savingClue.value = false
  }
}

async function removeClue(c) {
  if (!confirm(`Delete clue "${c.title}"? Its link and viewer records will be gone.`)) return
  await store.deleteClue(c.id)
}

// ─── Edit Clue ──────────────────────────────────────────────────────

const editClueTarget = ref(null)
const savingEditClue = ref(false)
const editClueError = ref('')
const editClueForm = reactive({ stage: 1, title: '', description: '', file: null })

function openEditClue(c) {
  editClueTarget.value = c
  editClueForm.stage = c.stage
  editClueForm.title = c.title
  editClueForm.description = c.description || ''
  editClueForm.file = null
  editClueError.value = ''
}

function closeEditClue() {
  if (savingEditClue.value) return
  editClueTarget.value = null
}

function onEditFilePicked(e) {
  editClueForm.file = e.target.files?.[0] || null
}

async function saveEditClue() {
  if (savingEditClue.value || !editClueTarget.value) return
  editClueError.value = ''
  if (!editClueForm.title.trim()) {
    editClueError.value = 'Title is required.'
    return
  }
  savingEditClue.value = true
  try {
    await store.updateClue(editClueTarget.value.id, {
      stage: editClueForm.stage,
      title: editClueForm.title.trim(),
      description: editClueForm.description.trim(),
      file: editClueForm.file,
    })
    savingEditClue.value = false
    editClueTarget.value = null
  } catch (err) {
    console.error('[detective] update clue failed', err)
    editClueError.value = `Update failed: ${err.message}`
    savingEditClue.value = false
  }
}

// Copy the public clue link (for QR/NFC tags)
const copiedId = ref(null)

async function copyLink(c) {
  const url = `${window.location.origin}/clue/${c.id}`
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    // Clipboard API can fail on non-HTTPS / older browsers
    prompt('Copy this link:', url)
  }
  copiedId.value = c.id
  setTimeout(() => { if (copiedId.value === c.id) copiedId.value = null }, 2000)
}

// Viewers modal
const viewersTarget = ref(null)
const viewerSort = reactive({ key: 'at', dir: 'asc' })

function toggleViewerSort(key) {
  if (viewerSort.key === key) {
    viewerSort.dir = viewerSort.dir === 'asc' ? 'desc' : 'asc'
  } else {
    viewerSort.key = key
    viewerSort.dir = 'asc'
  }
}

function viewerSortIndicator(key) {
  if (viewerSort.key !== key) return ''
  return viewerSort.dir === 'asc' ? '▲' : '▼'
}

const sortedViewers = computed(() => {
  const list = [...(viewersTarget.value?.viewers || [])]
  const { key, dir } = viewerSort
  list.sort((a, b) => (a[key] || '').toString().localeCompare((b[key] || '').toString()))
  if (dir === 'desc') list.reverse()
  return list
})

function formatViewTime(at) {
  if (!at) return '—'
  return new Date(at).toLocaleString('en-MY', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative.card,
.modal-leave-to .relative.card {
  transform: scale(0.95) translateY(16px);
}
</style>
