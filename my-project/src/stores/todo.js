import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

const API_URL = 'http://localhost:5001/api/todos'

export const useTodoStore = defineStore('todo', () => {
  const tasks = ref([])
  const loading = ref(false)
  const authStore = useAuthStore()

  const fetchTasks = async () => {
    loading.value = true
    try {
      const res = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      if (res.ok) {
        tasks.value = await res.json()
      }
    } catch (e) {
      console.error('Failed to fetch tasks', e)
    } finally {
      loading.value = false
    }
  }

  const addTask = async (text) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify({ text })
      })
      if (res.ok) {
        const newTask = await res.json()
        tasks.value.unshift(newTask)
      }
    } catch (e) {
      console.error('Failed to add task', e)
    }
  }

  const toggleTask = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify({ completed: !currentStatus })
      })
      if (res.ok) {
        const updatedTask = await res.json()
        const index = tasks.value.findIndex(t => t._id === id)
        if (index !== -1) {
          tasks.value[index] = updatedTask
        }
      }
    } catch (e) {
      console.error('Failed to toggle task', e)
    }
  }

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      if (res.ok) {
        tasks.value = tasks.value.filter(t => t._id !== id)
      }
    } catch (e) {
      console.error('Failed to delete task', e)
    }
  }

  const totalTasks = computed(() => tasks.value.length)
  const completedTasks = computed(() => tasks.value.filter(t => t.completed).length)
  const progressPercentage = computed(() => {
     if (totalTasks.value === 0) return 0
     return Math.round((completedTasks.value / totalTasks.value) * 100)
  })

  return {
    tasks,
    loading,
    fetchTasks,
    addTask,
    toggleTask,
    deleteTask,
    totalTasks,
    completedTasks,
    progressPercentage
  }
})
