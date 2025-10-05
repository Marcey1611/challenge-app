<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import {
  ensureStepDoc, subscribeStepDoc, toggleCheckpoint,
  setExtraSteps, setTarget, resetWeek,
  type StepChallenge, computeBalance, computeCompleted
} from '@/services/stepChallenges'

import Card from 'primevue/card'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Divider from 'primevue/divider'
import Tag from 'primevue/tag'

const auth = useAuthStore()
const state = reactive<{ data: StepChallenge | null; unsub?: () => void; saving: boolean }>({
  data: null,
  unsub: undefined,
  saving: false
})

onMounted(async () => {
  if (!auth.user) return
  await ensureStepDoc(auth.user.uid)
  state.unsub = subscribeStepDoc(auth.user.uid, (d) => { state.data = d })
})
onBeforeUnmount(() => { state.unsub?.() })

const completed = computed(() =>
  state.data ? computeCompleted(state.data.checkpoints, state.data.extraSteps) : 0
)
const balance = computed(() =>
  state.data ? computeBalance(state.data) : 0
)

async function onToggle(i: number) {
  if (!auth.user || !state.data) return
  await toggleCheckpoint(auth.user.uid, i, state.data)
}

async function onExtraChange(val: number | null) {
  if (!auth.user) return
  await setExtraSteps(auth.user.uid, val ?? 0)
}

async function onTargetChange(val: number | null) {
  if (!auth.user) return
  await setTarget(auth.user.uid, val ?? 0)
}

async function onReset() {
  if (!auth.user || !state.data) return
  state.saving = true
  try { await resetWeek(auth.user.uid, state.data) }
  finally { state.saving = false }
}
</script>

<template>
  <Card class="shadow-2">
    <template #title>Weekly Step Challenge</template>
    <template #content>
      <div v-if="!state.data">loading …</div>

      <div v-else class="grid">
        <div class="col-12 md:col-6 lg:col-4">
          <div class="p-3 border-round surface-100">
            <div class="mb-2">
              <strong>Steps this Week:</strong>
              <Tag :value="completed.toLocaleString()" severity="success" class="ml-2" />
            </div>
            <div class="mb-2">
              <strong>Week Balance:</strong>
              <Tag
                :value="balance.toLocaleString()"
                :severity="balance >= 0 ? 'success' : 'danger'"
                class="ml-2"
              />
            </div>
            <div>
              <strong>Balance total:</strong>
              <Tag
                :value="state.data.carryOver.toLocaleString()"
                :severity="state.data.carryOver >= 0 ? 'success' : 'danger'"
                class="ml-2"
              />
            </div>
          </div>
        </div>

        <div class="col-12 md:col-3">
          <label class="block mb-2">EXtra Steps</label>
          <InputNumber
            class="w-full"
            :useGrouping="true"
            :min="0"
            :step="500"
            :value="state.data.extraSteps"
            @update:modelValue="onExtraChange"
          />
        </div>
        <div class="col-12 md:col-3">
          <label class="block mb-2">Change Week Goal</label>
          <InputNumber
            class="w-full"
            :useGrouping="true"
            :min="0"
            :step="1000"
            :value="state.data.target"
            @update:modelValue="onTargetChange"
          />
        </div>

        <div class="col-12"><Divider /></div>

        <div class="col-12">
          <div class="grid">
            <div
              v-for="(isDone, i) in state.data.checkpoints"
              :key="i"
              class="col-6 md:col-4 lg:col-3 xl:col-2 mb-3"
            >
              <Button
                class="w-full"
                :severity="isDone ? 'success' : 'secondary'"
                :outlined="!isDone"
                :icon="isDone ? 'pi pi-check-circle' : 'pi pi-circle'"
                :label="`${(i+1) * 10}k`"
                :aria-pressed="isDone"
                @click="onToggle(i)"
              />
            </div>
          </div>
        </div>

        <div class="col-12"><Divider /></div>

        <div class="col-12 flex align-items-center gap-3">
          <Button
            severity="danger"
            icon="pi pi-refresh"
            label="Woche resetten"
            :disabled="state.saving"
            @click="onReset"
          />
          <small class="text-500">
            Last Reset:
            {{ state.data.lastResetAt?.toDate?.() ? state.data.lastResetAt.toDate().toLocaleString() : '—' }}
          </small>
        </div>
      </div>
    </template>
  </Card>
</template>
