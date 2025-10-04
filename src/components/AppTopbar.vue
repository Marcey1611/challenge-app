<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu'
import { ref } from 'vue'

const auth = useAuthStore()
const router = useRouter()

const menu = ref()
const items = [
  {
    label: auth.user?.email || 'User',
    items: [
      { label: 'Profil', icon: 'pi pi-id-card', command: () => router.push('/profile') },
      { label: 'Logout', icon: 'pi pi-sign-out', command: async () => { await auth.logout(); router.push('/login') } }
    ]
  }
]

function toggleMenu(event: Event) {
  menu.value.toggle(event)
}
</script>

<template>
  <Toolbar class="shadow-2 surface-card px-3 py-2">
    <template #start>
      <h2 class="m-0 text-primary">Chalbit</h2>
    </template>

    <template #end>
      <div class="flex align-items-center gap-3">
        <Avatar
          icon="pi pi-user"
          shape="circle"
          size="large"
          class="cursor-pointer"
          @click="toggleMenu"
        />
        <Menu ref="menu" :model="items" popup />
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          severity="danger"
          size="small"
          outlined
          @click="auth.logout()"
        />
      </div>
    </template>
  </Toolbar>
</template>
