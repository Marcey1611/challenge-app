// src/services/stepChallenge.ts
import { db } from '@/firebase'
import {
  doc, getDoc, setDoc, updateDoc, onSnapshot,
  serverTimestamp
} from 'firebase/firestore'

export type StepChallenge = {
  target: number
  checkpoints: boolean[]           // 10 Einträge
  extraSteps: number
  carryOver: number
  lastResetAt?: any
  weekStart: string                // ISO yyyy-mm-dd (Montag)
}

export function stepDocRef(uid: string) {
  return doc(db, 'users', uid, 'configs', 'stepChallenge')
}

export async function ensureStepDoc(uid: string): Promise<void> {
  const ref = stepDocRef(uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      target: 100000,
      checkpoints: Array(10).fill(false),
      extraSteps: 0,
      carryOver: 0,
      lastResetAt: serverTimestamp(),
      weekStart: mondayOf(new Date())
    } as StepChallenge)
  }
}

export function subscribeStepDoc(
  uid: string,
  cb: (data: StepChallenge) => void
) {
  return onSnapshot(stepDocRef(uid), (snap) => {
    if (snap.exists()) cb(snap.data() as StepChallenge)
  })
}

export async function toggleCheckpoint(uid: string, index: number, current: StepChallenge) {
  const arr = [...current.checkpoints]
  arr[index] = !arr[index]
  await updateDoc(stepDocRef(uid), {
    checkpoints: arr,
    lastResetAt: current.lastResetAt ?? serverTimestamp() // no-op, aber TS happy
  })
}

export async function setExtraSteps(uid: string, value: number) {
  await updateDoc(stepDocRef(uid), { extraSteps: Math.max(0, Math.floor(value)) })
}

export async function setTarget(uid: string, value: number) {
  const v = Math.max(0, Math.floor(value))
  await updateDoc(stepDocRef(uid), { target: v })
}

export function computeCompleted(checkpoints: boolean[], extraSteps: number): number {
  const checked = checkpoints.reduce((acc, b) => acc + (b ? 1 : 0), 0)
  return checked * 10_000 + (extraSteps || 0)
}

export function computeBalance(current: StepChallenge): number {
  return computeCompleted(current.checkpoints, current.extraSteps) - current.target
}

// Reset: Checkboxen & extraSteps leeren, carryOver um Balance erhöhen
export async function resetWeek(uid: string, current: StepChallenge) {
  const balance = computeBalance(current)
  await updateDoc(stepDocRef(uid), {
    checkpoints: Array(10).fill(false),
    extraSteps: 0,
    carryOver: (current.carryOver || 0) + balance,
    lastResetAt: serverTimestamp(),
    weekStart: mondayOf(nextWeek(new Date()))
  })
}

// Helpers
function pad(n: number) { return n < 10 ? `0${n}` : `${n}` }
function mondayOf(d: Date): string {
  const date = new Date(d)
  const day = date.getDay() // 0 So, 1 Mo, ...
  const diff = (day === 0 ? -6 : 1 - day)
  date.setDate(date.getDate() + diff)
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`
}
function nextWeek(d: Date): Date {
  const n = new Date(d)
  n.setDate(n.getDate() + 7)
  return n
}
