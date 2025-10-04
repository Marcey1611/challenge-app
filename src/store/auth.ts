import { defineStore } from 'pinia'
import { auth } from '@/firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User as FbUser,
} from 'firebase/auth'

export interface User { uid: string; email: string | null }
interface State { user: User | null; ready: boolean }

export const useAuthStore = defineStore('auth', {
  state: (): State => ({ user: null, ready: false }),
  getters: { isAuthenticated: (s) => !!s.user },
  actions: {
    /** aufrufen, sobald die App startet */
    init(): Promise<void> {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (u: FbUser | null) => {
          this.user = u ? { uid: u.uid, email: u.email } : null
          this.ready = true
          resolve()
        })
      })
    },
    async login({ email, password }: { email: string; password: string }) {
      await signInWithEmailAndPassword(auth, email, password)
    },
    async register({ email, password }: { email: string; password: string }) {
      await createUserWithEmailAndPassword(auth, email, password)
    },
    async logout() {
      await signOut(auth)
    },
  },
})
