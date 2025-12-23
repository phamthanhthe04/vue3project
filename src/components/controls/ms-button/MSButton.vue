<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Nội dung button
  label: {
    type: String,
    default: '',
  },

  // Loại button: primary, secondary, success, danger, warning, info
  type: {
    type: String,
    default: 'primary',
    validator: (value) => {
      return ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'text'].includes(
        value,
      )
    },
  },

  // Kích thước: small, medium, large
  size: {
    type: String,
    default: 'medium',
    validator: (value) => {
      return ['small', 'medium', 'large'].includes(value)
    },
  },

  // Icon bên trái
  iconLeft: {
    type: String,
    default: '',
  },

  // Icon bên phải
  iconRight: {
    type: String,
    default: '',
  },

  // Disabled state
  disabled: {
    type: Boolean,
    default: false,
  },

  // Loading state
  loading: {
    type: Boolean,
    default: false,
  },

  // Full width
  block: {
    type: Boolean,
    default: false,
  },

  // Outline variant
  outline: {
    type: Boolean,
    default: false,
  },

  // Round corners
  round: {
    type: Boolean,
    default: false,
  },
})

// Emit events
const emit = defineEmits(['click'])

// Computed class names
const buttonClass = computed(() => {
  return [
    'ms-button',
    `ms-button--${props.type}`,
    `ms-button--${props.size}`,
    {
      'ms-button--outline': props.outline,
      'ms-button--block': props.block,
      'ms-button--round': props.round,
      'ms-button--loading': props.loading,
      'ms-button--disabled': props.disabled,
    },
  ]
})

// Handle click
const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button :class="buttonClass" :disabled="disabled || loading" @click="handleClick">
    <!-- Loading spinner -->
    <span v-if="loading" class="ms-button__spinner">
      <i class="ms-icon icon-loading"></i>
    </span>

    <!-- Icon left -->
    <i v-if="iconLeft && !loading" :class="['ms-button__icon-left', iconLeft]"></i>

    <!-- Label or slot content -->
    <span class="ms-button__content">
      <slot>{{ label }}</slot>
    </span>

    <!-- Icon right -->
    <i v-if="iconRight && !loading" :class="['ms-button__icon-right', iconRight]"></i>
  </button>
</template>

<style scoped>
/* ==================== BASE BUTTON ==================== */
.ms-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  white-space: nowrap;
}

.ms-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
}

/* ==================== SIZES ==================== */
.ms-button--small {
  padding: 6px 12px;
  font-size: 13px;
  min-height: 28px;
}

.ms-button--medium {
  padding: 10px 20px;
  font-size: 14px;
  min-height: 36px;
}

.ms-button--large {
  padding: 12px 24px;
  font-size: 16px;
  min-height: 44px;
}

/* ==================== TYPES - SOLID ==================== */
.ms-button--primary {
  background-color: #3990ff;
  color: white;
}

.ms-button--primary:hover:not(.ms-button--disabled) {
  background-color: #4097ff;
}

.ms-button--secondary {
  background-color: #757575;
  color: white;
  border: none;
}
.ms-button--success {
  background-color: #4caf50;
  color: white;
  border-color: #4caf50;
}

.ms-button--success:hover:not(.ms-button--disabled) {
  background-color: #43a047;
  border-color: #43a047;
}

.ms-button--danger {
  background-color: #f44336;
  color: white;
  border-color: #f44336;
}

.ms-button--danger:hover:not(.ms-button--disabled) {
  background-color: #e53935;
  border-color: #e53935;
}

.ms-button--warning {
  background-color: #ff9800;
  color: white;
  border-color: #ff9800;
}

.ms-button--warning:hover:not(.ms-button--disabled) {
  background-color: #fb8c00;
  border-color: #fb8c00;
}

.ms-button--info {
  background-color: #2196f3;
  color: white;
  border-color: #2196f3;
}

.ms-button--info:hover:not(.ms-button--disabled) {
  background-color: #1e88e5;
  border-color: #1e88e5;
}

.ms-button--text {
  background-color: transparent;
  color: #1976d2;
  border-color: transparent;
}

.ms-button--text:hover:not(.ms-button--disabled) {
  background-color: rgba(25, 118, 210, 0.08);
}

/* ==================== OUTLINE VARIANT ==================== */
.ms-button--outline {
  background-color: transparent;
}

.ms-button--outline.ms-button--primary {
  color: #4097ff;
  border-color: #4097ff;
}
.ms-button--outline.ms-button--secondary {
  color: #757575;
  border-color: #757575;
}
.ms-button--outline.ms-button--success {
  color: #4caf50;
  border-color: #4caf50;
}

.ms-button--outline.ms-button--success:hover:not(.ms-button--disabled) {
  background-color: rgba(76, 175, 80, 0.08);
}

.ms-button--outline.ms-button--danger {
  color: #f44336;
  border-color: #f44336;
}

.ms-button--outline.ms-button--danger:hover:not(.ms-button--disabled) {
  background-color: rgba(244, 67, 54, 0.08);
}

.ms-button--outline.ms-button--warning {
  color: #ff9800;
  border-color: #ff9800;
}

.ms-button--outline.ms-button--warning:hover:not(.ms-button--disabled) {
  background-color: rgba(255, 152, 0, 0.08);
}

.ms-button--outline.ms-button--info {
  color: #2196f3;
  border-color: #2196f3;
}

.ms-button--outline.ms-button--info:hover:not(.ms-button--disabled) {
  background-color: rgba(33, 150, 243, 0.08);
}

/* ==================== STATES ==================== */
.ms-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ms-button--loading {
  cursor: wait;
  opacity: 0.8;
}

.ms-button--block {
  width: 100%;
  display: flex;
}

.ms-button--round {
  border-radius: 24px;
}

/* ==================== SPINNER ==================== */
.ms-button__spinner {
  display: inline-flex;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ==================== ICONS ==================== */
.ms-button__icon-left,
.ms-button__icon-right {
  font-size: 1.2em;
}

.ms-button__content {
  display: inline-flex;
  align-items: center;
}
</style>
