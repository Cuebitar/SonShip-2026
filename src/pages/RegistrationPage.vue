<template>
  <div class="page-container">
    <!-- Header -->
    <section class="py-24 bg-gradient-dark relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(230,177,83,0.1),transparent_60%)]"></div>
      <div class="container-inner relative z-10 text-center">
        <h1 class="section-title mb-4">{{ t("register.title") }}</h1>
        <p class="section-subtitle max-w-xl mx-auto">
          {{ t("register.subtitle") }}
        </p>
      </div>
    </section>

    <section class="py-16 bg-dark">
      <div class="container-inner grid grid-cols-1 lg:grid-cols-3 gap-10">
        <!-- Camp Info Sidebar -->
        <div class="space-y-4">
          <h3 class="font-heading font-bold text-primary text-lg">
            {{ t("register.info_title") }}
          </h3>
          <div class="card p-6 space-y-4">
            <div>
              <p class="input-label">📅 {{ t("register.date") }}</p>
              <p class="font-body text-tertiary">August 28–31, 2026</p>
            </div>
            <div class="divider" />
            <div>
              <p class="input-label">📍 {{ t("register.venue") }}</p>
              <p class="font-body text-tertiary">Radiant Retreats Site B, Jalan Utama Janda Baik, Kampung Chemperoh, 28750 Bentong, Pahang</p>
            </div>
            <div class="divider" />
            <div>
              <p class="input-label">💰 {{ t("register.fee") }}</p>
              <p class="font-body text-primary font-bold text-xl">
                RM 200 ({{ t("register.early_bird") }}, before 31th May)
              </p>
              <p class="font-body text-primary font-bold text-xl">
                RM 230 ({{ t("register.normal") }}, before 30th June)
              </p>
              <p class="font-body text-primary font-bold text-xl">
                RM 280 ({{ t("register.super_late_bird") }}, from 1st July)
              </p>
              <p class="font-body text-xs text-tertiary/50 mt-1">
                {{ t("register.fee_note") }}
              </p>
            </div>
            <div class="divider" />
            <div class="card bg-primary/10 border-primary/30 p-4">
              <p class="font-body text-sm text-primary">
                {{ t("register.warning") }}
              </p>
            </div>
          </div>
        </div>

        <!-- Registration Form -->
        <div class="lg:col-span-2">
          <form @submit.prevent="handleSubmit" class="card p-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label class="input-label">{{ t("register.full_name") }} *</Label>
                <input v-model="form.fullName" required type="text" class="input" :placeholder="`e.g. Liam Chen`" />
              </div>
              <div>
                <Label class="input-label">{{ t("register.ic_number") }} *</Label>
                <input v-model="form.ic" required type="text" class="input" placeholder="e.g. 990101-14-5678" />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label class="input-label">{{ t("register.phone") }} *</Label>
                <input v-model="form.phone" required type="tel" class="input" placeholder="e.g. 012-3456789" />
              </div>
              <div>
                <Label class="input-label">{{ t("register.email") }} *</Label>
                <input v-model="form.email" required type="email" class="input"
                placeholder="e.g. sonship@megasubangcmc.org.my" />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="flex flex-col gap-1">
                <Label class="input-label">{{ t("register.gender") }} *</Label>
                <RadioGroup default-value="male" class="flex flex-row gap-4">
                  <div class="flex items-center space-x-2">
                    <RadioGroupItem id="r1" value="male" />
                    <Label for="r1">{{ t("register.male") }}</Label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <RadioGroupItem id="r2" value="female" />
                    <Label for="r2">{{ t("register.female") }}</Label>
                  </div>
                </RadioGroup>
              </div>
              <div class="flex flex-col gap-1">
                <Label class="input-label">{{ t("register.transportation") }} * 
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger><Info class="w-3 h-3" /></TooltipTrigger>
                      <TooltipContent>
                        <div class="space-y-2 text-xs p-1">
                          <p><span class="font-bold text-primary">Car:</span> Drop off at the campsite at 4:00 PM, 28th August.</p>
                          <p><span class="font-bold text-primary">Bus:</span> Pick up at the church at 2:30 PM, 28th August.</p>
                          <p class="pt-1 mt-1 border-t border-white/10 italic opacity-80">
                            Note: Camp fees remain the same regardless of transportation choice.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <RadioGroup default-value="male" class="flex flex-row gap-4">
                  <div class="flex items-center space-x-2">
                    <RadioGroupItem id="r1" value="car" />
                    <Label for="r1">{{ t("register.car") }}</Label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <RadioGroupItem id="r2" value="bus" />
                    <Label for="r2">{{ t("register.bus") }}</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div>
              <Label class="input-label">{{
                t("register.important_info")
              }}</Label>
              <textarea v-model="form.importantInfo" rows="3" class="input resize-none"
                placeholder="Any allergies, medical conditions, dietary needs..."></textarea>
            </div>

            <div class="divider" />
            <h4 class="font-heading font-bold text-tertiary">
              Emergency Contact
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label class="input-label">{{ t("register.emergency_contact_name") }} *</Label>
                <input v-model="form.emergencyContactName" required type="text" class="input" :placeholder="`e.g. Liam Chen`" />
              </div>
              <div>
                <Label class="input-label">{{ t("register.emergency_contact_phone") }} *</Label>
                <input v-model="form.emergencyContactPhone" required type="text" class="input" placeholder="e.g. 990101-14-5678" />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label class="input-label">{{ t("register.emergency_contact_relationship") }} *</Label>
                <Select>
                  <SelectTrigger class="">
                    <SelectValue placeholder="Select a relationship" />
                  </SelectTrigger>
                  <SelectContent class=" border-primary/20">
                    <SelectItem  value="father">Father</SelectItem>
                    <SelectItem value="mother">Mother</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div class="divider" />
            <h4 class="font-heading font-bold text-tertiary">
              Additional Questions
            </h4>

            <div>
              <Label class="input-label">{{ t("register.q1") }}</Label>
              <textarea v-model="form.q1" rows="3" class="input resize-none"></textarea>
            </div>
            <div>
              <Label class="input-label">{{ t("register.q2") }}</Label>
              <textarea v-model="form.q2" rows="2" class="input resize-none"></textarea>
            </div>
            <div>
              <Label class="input-label">{{ t("register.q3") }}</Label>
              <input v-model="form.q3" type="text" class="input" placeholder="Instagram, friend, church..." />
            </div>

            <div class="pt-2">
              <button type="submit" class="btn-primary w-full justify-center btn-lg" :disabled="loading">
                <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
                <span v-else>{{ t("register.submit") }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Success Modal -->
    <Transition name="modal">
      <div v-if="showSuccess" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" @click="showSuccess = false"></div>
        <div class="relative card p-10 max-w-md text-center border-primary/30 shadow-warm-lg">
          <div class="text-6xl mb-4 animate-bounce">🎉</div>
          <h3 class="font-heading font-black text-2xl text-primary mb-3">
            {{ t("register.success_title") }}
          </h3>
          <p class="font-body text-tertiary/80 leading-relaxed mb-6">
            {{ t("register.success_msg") }}
          </p>
          <button @click="showSuccess = false" class="btn-primary w-full justify-center">
            {{ t("register.success_close") }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { Loader2, Info } from "lucide-vue-next";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const { t } = useI18n();
const loading = ref(false);
const showSuccess = ref(false);

const form = reactive({
  fullName     : "",
  ic           : "",
  phone        : "",
  email        : "",
  gender       : "",
  importantInfo: "",
  q1           : "",
  q2           : "",
  q3           : "",
});

async function handleSubmit() {
  loading.value = true;
  await new Promise((r) => setTimeout(r, 1500));
  loading.value     = false;
  showSuccess.value = true;
  Object.assign(form, {
    fullName     : "",
    ic           : "",
    phone        : "",
    importantInfo: "",
    q1           : "",
    q2           : "",
    q3           : "",
  });
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
