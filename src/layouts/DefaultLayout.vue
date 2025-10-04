<script setup lang="ts">
import AppTopbar from '@/components/AppTopbar.vue'
</script>

<template>
  <div class="grid" style="min-height:100vh;">
    <div class="col-12">
      <AppTopbar />
    </div>
    <div class="col-12 md:col-9 lg:col-10 p-3">
      <slot />
    </div>
  </div>
</template>
