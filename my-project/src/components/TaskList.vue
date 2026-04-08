<script setup>
import { computed } from 'vue'
import TaskItem from './TaskItem.vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['toggle-completion', 'delete-task'])

const sortedTasks = computed(() => {
  // Show uncompleted tasks first
  return [...props.tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      return b.id - a.id; // Newest first for same completion status
    }
    return a.completed ? 1 : -1;
  });
})
</script>

<template>
  <div class="mt-8">
    <div v-if="tasks.length === 0" class="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 11l3 3L22 4"></path>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
      </div>
      <h3 class="text-xl font-medium text-slate-800 mb-2">You're all caught up!</h3>
      <p class="text-slate-500">Add a new task above to get started.</p>
    </div>

    <transition-group 
      v-else 
      name="list" 
      tag="div" 
      class="relative"
    >
      <TaskItem 
        v-for="task in sortedTasks" 
        :key="task.id" 
        :task="task"
        @toggle-completion="id => emit('toggle-completion', id)"
        @delete-task="id => emit('delete-task', id)"
      />
    </transition-group>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
.list-leave-active {
  position: absolute;
  width: 100%;
}
.list-move {
  transition: transform 0.4s ease;
}
</style>
