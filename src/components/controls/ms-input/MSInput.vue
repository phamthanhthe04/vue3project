<template>
  <div class="ms-input" :class="rootClasses" :style="rootStyle">
    <!-- Input wrapper với icon support -->
    <div
      class="ms-input__wrapper"
      :class="{
        'has-prefix-left': prefixIcon && prefixPosition === 'left',
        'has-prefix-right': prefixIcon && prefixPosition === 'right',
        'has-suffix-inside': suffixIcon && !suffixOutside,
        'has-suffix-outside': suffixIcon && suffixOutside,
      }"
    >
      <!-- Input field -->
      <input
        ref="inputRef"
        :id="id"
        v-model="inputValue"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :list="list"
        class="ms-input__field"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <!-- Prefix icon (nằm trong input, có thể đặt bên phải hoặc bên trái) -->
      <span
        v-if="prefixIcon"
        :class="['ms-input__prefix-icon', prefixIcon, `ms-input__prefix-icon--${prefixPosition}`]"
      ></span>

      <!-- Suffix icon/button (inside input) -->
      <button
        v-if="suffixIcon && !suffixOutside"
        type="button"
        :class="['ms-input__suffix-icon', suffixIcon]"
        @click="handleSuffixClick"
      >
        <span :class="suffixIcon"></span>
      </button>
    </div>

    <!-- Suffix icon/button rendered outside input (bên phải ngay cạnh ô nhập) -->
    <button
      v-if="suffixIcon && suffixOutside"
      type="button"
      class="ms-input__suffix-outside"
      @click="handleSuffixClick"
    >
      <span :class="suffixIcon"></span>
    </button>

    <!-- Error message -->
    <span v-if="error" class="ms-input__error">{{ error }}</span>

    <!-- Helper text -->
    <span v-if="helperText && !error" class="ms-input__helper">{{ helperText }}</span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  id: { type: String, default: '' },
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  name: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  list: { type: String, default: '' },
  required: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  maxlength: { type: [String, Number], default: null },
  layout: {
    type: String,
    default: 'column',
    validator: (v) => ['column', 'inline', 'split'].includes(v),
  },
  width: { type: [String, Number], default: '100%' },

  // Icons
  prefixIcon: { type: String, default: '' },
  // Vị trí của prefix icon: 'left' hoặc 'right' (mặc định 'left')
  prefixPosition: {
    type: String,
    default: 'left',
    validator: (v) => ['left', 'right'].includes(v),
  },
  suffixIcon: { type: String, default: '' },
  // Nếu true: render icon bên ngoài ô input (bên phải ngay cạnh input) thay vì nằm chồng lên input
  suffixOutside: { type: Boolean, default: false },

  // Validation
  error: { type: String, default: '' },
  helperText: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'suffixClick'])

const inputRef = ref(null)
const isFocused = ref(false)

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const rootClasses = computed(() => ({
  'ms-input--error': !!props.error,
  'ms-input--disabled': props.disabled,
  'ms-input--focused': isFocused.value,
  [`ms-input--${props.layout}`]: true,
}))

const rootStyle = computed(() => ({
  width: normalizeWidth(props.width),
}))

function normalizeWidth(val) {
  if (val === undefined || val === null || val === '') return '100%'
  if (typeof val === 'number') return `${val}px`
  // Nếu truyền '425' (chuỗi số), chuyển sang px
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

const handleSuffixClick = () => {
  if (props.clearable && inputValue.value) {
    inputValue.value = ''
  }
  emit('suffixClick')
}
</script>

<style scoped>
.ms-input--column {
  display: flex;
  flex-direction: column;
}
.ms-input--inline {
  display: flex;
  gap: 16px;
  & .ms-input__wrapper {
    flex: 1;
  }
}
.ms-input--split {
  display: flex;
  gap: 8px;
}
.ms-input__wrapper {
  position: relative;
}
.ms-input__field {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}
.ms-input__field:hover {
  border-color: #40a9ff;
}
.ms-input__field:focus {
  outline: none;
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
.ms-input__wrapper.has-prefix-left .ms-input__field {
  padding-left: 36px;
}
.ms-input__wrapper.has-prefix-right .ms-input__field {
  padding-right: 36px;
}
.ms-input__wrapper.has-prefix-right.has-suffix-inside .ms-input__field {
  padding-right: 56px;
}
.ms-input__prefix-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 12px;
  pointer-events: none;
}
.ms-input__prefix-icon.ms-input__prefix-icon--right {
  left: auto;
  right: 36px;
}
.ms-input__wrapper .ms-input__prefix-icon {
  color: rgba(0, 0, 0, 0.45);
}
.ms-input__wrapper .ms-input__suffix-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}
.ms-input__suffix-outside {
  margin-left: 8px;
  border: none;
  background: transparent;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.65);
}
.ms-input__suffix-outside:hover {
  background: rgba(0, 0, 0, 0.04);
}
.ms-input__error {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 2px;
}
.ms-input__helper {
  color: #888;
  font-size: 12px;
  margin-top: 2px;
}
.ms-input--error .ms-input__field {
  border-color: #e74c3c;
}
.ms-input--disabled .ms-input__field {
  background: #f5f5f5;
  color: #aaa;
  cursor: not-allowed;
}
</style>
