<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add-task'])
const newTask = ref('')

const submitTask = () => {
  if (newTask.value.trim() !== '') {
    emit('add-task', newTask.value.trim())
    newTask.value = ''
  }
}
</script>

<template>
  <div class="mb-6 flex gap-2">
    <input 
      v-model="newTask" 
      @keyup.enter="submitTask"
      type="text" 
      placeholder="What needs to be done?" 
      class="flex-1 px-4 py-3 rounded-xl bg-white shadow-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400 text-lg"
    >
    <button 
      @click="submitTask"
      class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm transition-all flex items-center gap-2 hover:shadow-md active:scale-95"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 font-bold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      <span class="hidden sm:inline">Add Task</span>
    </button>
  </div>
</template>
