<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import Message from 'primevue/message'

const email = ref<string>('')
const password = ref<string>('')
const mode = ref<'login' | 'register'>('login')
const error = ref<string>(''), busy = ref<boolean>(false)

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

async function submit(): Promise<void> {
  error.value = ''
  busy.value = true
  try {
    if (mode.value === 'login') {
      await auth.login({ email: email.value, password: password.value })
    } else {
      await auth.register({ email: email.value, password: password.value })
    }
    const redirect = (route.query.redirect as string) || '/'
    router.replace(redirect)
  } catch (e: any) {
    error.value = e?.message ?? 'Aktion fehlgeschlagen'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="flex align-items-center justify-content-center" style="min-height:100vh;">
    <Card class="w-11 md:w-4 shadow-2">
      <template #title>{{ mode === 'login' ? 'Login' : 'Register' }}</template>
      <template #content>
        <div class="flex flex-column gap-3">
          <div>
            <label class="block mb-2" for="email">E-Mail</label>
            <InputText
              id="email"
              v-model="email"
              class="w-full"
              type="email"
              autocomplete="email"
              :disabled="busy"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label class="block mb-2" for="password">Passwort</label>
            <Password
              id="password"
              v-model="password"
              class="w-full"
              :feedback="false"           
              toggleMask                 
              input-class="w-full"
              :disabled="busy"
              :inputProps="{ autocomplete: 'current-password' }"
            />
          </div>

          <Message v-if="error" severity="error" :closable="false">
            {{ error }}
          </Message>

          <Button
            class="w-full"
            :label="mode === 'login' ? 'Login' : 'Register'"
            :icon="mode === 'login' ? 'pi pi-sign-in' : 'pi pi-user-plus'"
            :loading="busy"
            @click="submit"
          />

          <Divider />

          <Button
            class="w-full"
            :label="mode === 'login' ? 'Neu hier? Konto erstellen' : 'Schon ein Konto? Anmelden'"
            icon="pi pi-exchange"
            severity="secondary"
            outlined
            :disabled="busy"
            @click="mode = mode === 'login' ? 'register' : 'login'"
          />
        </div>
      </template>
    </Card>
  </div>
</template>
