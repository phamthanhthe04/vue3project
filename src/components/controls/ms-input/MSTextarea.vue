<template>
  <div class="ms-textarea" :class="rootClasses" :style="rootStyle">
    <!-- Label removed for MSLabel pattern. Use MSLabel outside. -->
    <!-- <label v-if="label && showLabel" class="ms-textarea__label">
      <span v-if="iconLabel" :class="['ms-textarea__label-icon', iconLabel]" />
      {{ label }}
      <span v-if="required" class="ms-textarea__required">*</span>
    </label> -->
    <textarea
      ref="textareaRef"
      :id="id"
      v-model="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      class="ms-textarea__field"
      :rows="rows"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
    ></textarea>
    <span v-if="error" class="ms-textarea__error">{{ error }}</span>
    <span v-if="helperText && !error" class="ms-textarea__helper">{{ helperText }}</span>
    <span v-if="showCount && maxlength" class="ms-textarea__count"
      >{{ inputValue.length }}/{{ maxlength }}</span
    >
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  id: { type: String, default: '' },
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' }, // Deprecated, use MSLabel outside
  showLabel: { type: Boolean, default: true }, // Deprecated
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false }, // Deprecated, use MSLabel outside
  error: { type: String, default: '' },
  helperText: { type: String, default: '' },
  maxlength: { type: [String, Number], default: null },
  rows: { type: [String, Number], default: 4 },
  width: { type: [String, Number], default: '100%' },
  showCount: { type: Boolean, default: false },
  iconLabel: { type: String, default: '' },
  layout: {
    type: String,
    default: 'column',
    validator: (v) => ['column', 'row', 'vertical', 'inline'].includes(v),
  },
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'input'])

const textareaRef = ref(null)
const isFocused = ref(false)

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const rootClasses = computed(() => ({
  'ms-textarea--error': !!props.error,
  'ms-textarea--disabled': props.disabled,
  'ms-textarea--focused': isFocused.value,
  [`ms-textarea--${props.layout}`]: true,
}))

const rootStyle = computed(() => ({
  width: normalizeWidth(props.width),
}))

function normalizeWidth(val) {
  if (val === undefined || val === null || val === '') return '100%'
  if (typeof val === 'number') return `${val}px`
  if (typeof val === 'string' && /^\d+(\.\d+)?$/.test(val.trim())) {
    return `${val.trim()}px`
  }
  return val
}

const handleBlur = (e) => {
  isFocused.value = false
  emit('blur', e)
}

const handleFocus = (e) => {
  isFocused.value = true
  emit('focus', e)
}

const handleInput = (e) => {
  emit('input', e.target.value)
}
</script>

<style scoped>
.ms-textarea {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
}
.ms-textarea--column,
.ms-textarea--vertical {
  flex-direction: column;
  align-items: stretch;
}
.ms-textarea--row,
.ms-textarea--inline {
  flex-direction: row;
  align-items: center;
  gap: 16px;
}
.ms-textarea__label {
  font-weight: 400;
  margin-bottom: 4px;
  font-size: 14px;
}
.ms-textarea--row .ms-textarea__label,
.ms-textarea--inline .ms-textarea__label {
  margin-bottom: 0;
  min-width: 150px;
  margin-right: 12px;
  white-space: nowrap;
}
.ms-textarea__required {
  color: red;
  margin-left: 2px;
}
.ms-textarea__field {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s;
  resize: vertical;
  min-height: 80px;
}
.ms-textarea--row .ms-textarea__field,
.ms-textarea--inline .ms-textarea__field {
  flex: 1;
}
.ms-textarea__field:focus {
  outline: none;
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
.ms-textarea--error .ms-textarea__field {
  border-color: #e74c3c;
}
.ms-textarea__error {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 2px;
}
.ms-textarea__helper {
  color: #888;
  font-size: 12px;
  margin-top: 2px;
}
.ms-textarea__count {
  color: #888;
  font-size: 12px;
  align-self: flex-end;
}
.ms-textarea--disabled .ms-textarea__field {
  background: #f5f5f5;
  color: #aaa;
  cursor: not-allowed;
}
/* Icon đầu label */
.ms-textarea__label-icon {
  margin-right: 6px;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}
</style>
