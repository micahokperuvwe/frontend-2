<script setup>
defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle-completion', 'delete-task'])
</script>

<template>
  <div 
    class="flex items-center justify-between p-4 mb-3 bg-white rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md group"
    :class="{ 'opacity-70 bg-slate-50': task.completed }"
  >
    <div class="flex items-center gap-4 flex-1 cursor-pointer" @click="emit('toggle-completion', task.id)">
      <div 
        class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0"
        :class="task.completed ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 group-hover:border-indigo-400'"
      >
        <svg v-if="task.completed" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      
      <span 
        class="text-lg text-slate-700 transition-all select-none flex-1 truncate break-words"
        :class="{ 'line-through text-slate-400': task.completed }"
      >
        {{ task.text }}
      </span>
    </div>
    
    <button 
      @click.stop="emit('delete-task', task.id)"
      class="p-2 ml-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
      aria-label="Delete Task"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18"></path>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    </button>
  </div>
</template>
