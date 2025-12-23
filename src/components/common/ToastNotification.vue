<script setup>
import { ref } from 'vue'

// Toast state
const toasts = ref([])
let nextId = 0

// Show toast
const show = (message, type = 'info', duration = 3000) => {
  const id = nextId++
  const toast = { id, message, type, visible: true }

  toasts.value.push(toast)

  // Auto hide
  setTimeout(() => {
    hide(id)
  }, duration)
}

// Hide toast
const hide = (id) => {
  const index = toasts.value.findIndex((t) => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Public methods
const success = (message, duration) => show(message, 'success', duration)
const error = (message, duration) => show(message, 'error', duration)
const warning = (message, duration) => show(message, 'warning', duration)
const info = (message, duration) => show(message, 'info', duration)

// Expose methods
defineExpose({
  show,
  success,
  error,
  warning,
  info,
})
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast-${toast.type}`"
          @click="hide(toast.id)"
        >
          <div class="toast-icon">
            <span v-if="toast.type === 'success'" class="icon-success">✓</span>
            <span v-else-if="toast.type === 'error'" class="icon-error">✕</span>
            <span v-else-if="toast.type === 'warning'" class="icon-warning">⚠</span>
            <span v-else class="icon-info">ℹ</span>
          </div>
          <div class="toast-message">{{ toast.message }}</div>
          <button class="toast-close" @click.stop="hide(toast.id)">×</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: 500px;
  padding: 12px 16px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toast:hover {
  transform: translateX(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.toast-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.toast-close {
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
}

.toast-close:hover {
  color: #333;
}

/* Toast types */
.toast-success {
  border-left: 4px solid #52c41a;
}

.toast-success .toast-icon {
  color: #52c41a;
}

.toast-error {
  border-left: 4px solid #ff4d4f;
}

.toast-error .toast-icon {
  color: #ff4d4f;
}

.toast-warning {
  border-left: 4px solid #faad14;
}

.toast-warning .toast-icon {
  color: #faad14;
}

.toast-info {
  border-left: 4px solid #1890ff;
}

.toast-info .toast-icon {
  color: #1890ff;
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
