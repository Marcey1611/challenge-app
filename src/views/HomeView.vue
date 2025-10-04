<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SectionSteps from '@/views/SectionSteps.vue'
</script>

<template>
  <DefaultLayout>
    <div class="grid">
      <div class="w-full">
        <SectionSteps />
      </div>
      <!--<div class="col-12 lg:col-6">
        <SectionHabits />
      </div>-->
    </div>
  </DefaultLayout>
</template>
