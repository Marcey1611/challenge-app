<script setup lang="ts">
/**import { ref } from 'vue'
interface Habit { id: number; title: string; done: boolean }
const habits = ref<Habit[]>([
  { id: 1, title: 'X Gläser Wasser', done: false },
  { id: 2, title: '20 Min. Cardio', done: true }
])
function toggle(h: Habit) { h.done = !h.done }**/
</script>

<template>
  <!--<div class="surface-card p-3 border-round shadow-2">
    <h3 class="mb-2">Habits heute</h3>
    <ul class="list-none p-0 m-0">
      <li v-for="h in habits" :key="h.id" class="flex align-items-center justify-content-between py-2 border-bottom-1 surface-border">
        <span :class="{ 'line-through text-500': h.done }">{{ h.title }}</span>
        <button class="p-button p-component p-button-sm" :class="{ 'p-button-outlined': !h.done }" @click="toggle(h)">
          <i class="pi" :class="h.done ? 'pi-check' : 'pi-circle'" />
        </button>
      </li>
    </ul>
  </div>-->
</template>
