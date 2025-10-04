<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
function go(path: string){ router.push(path) }
</script>

<template>
  <aside class="p-3 surface-100 h-full">
    <ul class="list-none p-0 m-0">
      <li class="mb-2">
        <button class="p-button p-component w-full" @click="go('/')">
          <span class="p-button-label">Home</span>
        </button>
      </li>
      <li class="mb-2">
        <button class="p-button p-component w-full" @click="go('/#steps')">
          <span class="p-button-label">Steps</span>
        </button>
      </li>
      <li class="mb-2">
        <button class="p-button p-component w-full" @click="go('/#habits')">
          <span class="p-button-label">Habits</span>
        </button>
      </li>
    </ul>
  </aside>
</template>
