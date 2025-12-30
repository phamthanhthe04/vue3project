<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" :class="{ active: show }" @click="handleOverlayClick">
      <div class="modal-container" :class="containerClasses" @click.stop>
        <!-- Header -->
        <div class="modal-header">
          <slot name="header">
            <h2 class="modal-title">{{ title }}</h2>
          </slot>
          <button v-if="showClose" class="modal-close" @click="handleClose" aria-label="Đóng">
            <span class="icon icon-close"></span>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body" :class="bodyClass">
          <slot></slot>
        </div>

        <!-- Footer (optional) -->
        <div v-if="$slots.footer" class="modal-footer" :class="footerClass">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v) => ['small', 'medium', 'large', 'xlarge', 'full'].includes(v),
  },
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  bodyClass: {
    type: String,
    default: '',
  },
  footerClass: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'update:show'])

const containerClasses = computed(() => [
  `modal-container--${props.size}`,
  { 'modal-container--loading': props.loading },
])

const handleClose = () => {
  emit('close')
  emit('update:show', false)
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleClose()
  }
}
</script>

<style scoped>
@import '../../assets/css/base-modal.css';
</style>
