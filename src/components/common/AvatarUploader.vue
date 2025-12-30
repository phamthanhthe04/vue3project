<template>
  <div class="avatar-uploader">
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="visually-hidden"
      @change="onFileChange"
      aria-hidden="true"
    />

    <button type="button" class="avatar-button" @click="openFileDialog" :aria-label="buttonLabel">
      <img v-if="preview" :src="preview" class="avatar-image" :alt="altText" />
      <div v-else class="avatar-placeholder" :class="colorClass">{{ displayText }}</div>
    </button>

    <div class="avatar-actions">
      <button v-if="preview" type="button" class="btn-small" @click="remove">Xóa</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { AvatarColorLabel } from '@/utils/enums'

const props = defineProps({
  modelValue: { type: String, default: '' }, // base64 or URL
  avatarText: { type: String, default: '' },
  avatarColor: { type: [Number, String], default: null }, // code or color string
  alt: { type: String, default: 'Avatar' },
})

const emit = defineEmits(['update:modelValue', 'update:meta'])

const fileInput = ref(null)
const preview = ref(props.modelValue || '')

watch(
  () => props.modelValue,
  (v) => (preview.value = v || ''),
)

const displayText = computed(() => props.avatarText || 'Ảnh')
const altText = computed(() => props.alt)
const buttonLabel = computed(() => (preview.value ? 'Thay đổi ảnh đại diện' : 'Tải ảnh lên'))

const colorClass = computed(() => {
  if (typeof props.avatarColor === 'number')
    return `avatar-color-${AvatarColorLabel[props.avatarColor] || ''}`
  if (typeof props.avatarColor === 'string') return `avatar-color-${props.avatarColor}`
  return ''
})

function openFileDialog() {
  fileInput.value?.click()
}

function onFileChange(e) {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (event) => {
    const dataUrl = event.target.result
    preview.value = dataUrl
    emit('update:modelValue', dataUrl)
    // optional: emit meta so parent can set avatarText/color
    emit('update:meta', { avatarText: props.avatarText, avatarColor: props.avatarColor })
  }
  reader.readAsDataURL(file)
}

function remove() {
  preview.value = ''
  emit('update:modelValue', '')
}
</script>

<style scoped>
.avatar-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 90px;
}

.avatar-button {
  border: 2px solid #e0e0e0;
  background: #fafafa;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-button:hover {
  border-color: #bdbdbd;
  background: #f5f5f5;
}

.avatar-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 13px;
  text-align: center;
  padding: 6px;
  word-break: break-word;
}

.avatar-actions {
  width: 100%;
  display: flex;
  justify-content: center;
}

.btn-small {
  font-size: 12px;
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #262626;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-small:hover {
  border-color: #2196f3;
  color: #2196f3;
}

.visually-hidden {
  position: absolute;
  left: -9999px;
}
</style>
