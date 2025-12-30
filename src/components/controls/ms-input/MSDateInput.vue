<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  // v-model value
  modelValue: {
    type: String,
    default: '',
  },

  // Label hiển thị (deprecated, dùng MSLabel ngoài)
  id: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },

  // Cho phép thay đổi định dạng
  allowFormatChange: {
    type: Boolean,
    default: true,
  },

  // Hiển thị icon calendar
  showCalendar: {
    type: Boolean,
    default: true,
  },

  // Bắt buộc nhập (deprecated, dùng MSLabel ngoài)
  required: {
    type: Boolean,
    default: false,
  },

  // Error message
  error: {
    type: String,
    default: '',
  },

  // Disabled state
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

// Định dạng ngày hiện tại
const dateFormat = ref('ddmmyyyy')

// Placeholder động theo format
const placeholder = computed(() => {
  switch (dateFormat.value) {
    case 'yyyy':
      return 'yyyy'
    case 'mmyyyy':
      return 'MM/yyyy'
    case 'ddmmyyyy':
    default:
      return 'dd/MM/yyyy'
  }
})

// Input ref để focus và trigger calendar
const inputRef = ref(null)
const dateInputRef = ref(null)

// Xử lý thay đổi giá trị
const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
  emit('change', event.target.value)
}

// Xử lý click icon calendar
const handleCalendarClick = () => {
  if (props.disabled) return

  // Tạo input type="date" tạm để mở calendar picker
  if (dateInputRef.value) {
    dateInputRef.value.showPicker?.()
  }
}

// Xử lý chọn ngày từ calendar picker
const handleDateSelect = (event) => {
  const selectedDate = event.target.value // yyyy-MM-dd

  if (!selectedDate) return

  // Convert theo format hiện tại
  const [year, month, day] = selectedDate.split('-')

  let formattedDate = ''
  switch (dateFormat.value) {
    case 'yyyy':
      formattedDate = year
      break
    case 'mmyyyy':
      formattedDate = `${month}/${year}`
      break
    case 'ddmmyyyy':
    default:
      formattedDate = `${day}/${month}/${year}`
      break
  }

  emit('update:modelValue', formattedDate)
  emit('change', formattedDate)
}

// Class cho container
const containerClass = computed(() => {
  return {
    'ms-date-input': true,
    'ms-date-input--error': !!props.error,
    'ms-date-input--disabled': props.disabled,
  }
})
</script>

<template>
  <div :class="containerClass">
    <!-- Label removed for MSLabel pattern. Use MSLabel outside. -->
    <div class="ms-date-input__header">
      <!-- <label class="ms-date-input__label" :style="!label ? 'visibility:hidden;' : ''">
        {{ label || 'label' }}
        <span v-if="required && label" class="ms-date-input__required">*</span>
      </label> -->
      <!-- Format selector -->
      <select
        v-if="allowFormatChange"
        v-model="dateFormat"
        class="ms-date-input__format-selector"
        :disabled="disabled"
      >
        <option value="ddmmyyyy">Ngày tháng năm</option>
        <option value="mmyyyy">Tháng năm</option>
        <option value="yyyy">Năm</option>
      </select>
    </div>

    <!-- Input wrapper -->
    <div class="ms-date-input__wrapper">
      <!-- Text input -->
      <input
        ref="inputRef"
        :id="id"
        :value="modelValue"
        type="text"
        class="ms-date-input__input"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleInput"
      />

      <!-- Calendar icon -->
      <button
        v-if="showCalendar"
        type="button"
        class="icon icon-calendar"
        :disabled="disabled"
        @click="handleCalendarClick"
        title="Chọn từ lịch"
      ></button>

      <!-- Hidden date input for calendar picker -->
      <input
        ref="dateInputRef"
        type="date"
        class="ms-date-input__date-picker"
        @change="handleDateSelect"
      />
    </div>

    <!-- Error message -->
    <span v-if="error" class="ms-date-input__error-message">
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
/* Container */
.ms-date-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Header (Label + Format selector) */
.ms-date-input__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

/* Label */
.ms-date-input__label {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
}

.ms-date-input__required {
  color: #ff4d4f;
  margin-left: 4px;
}

/* Format selector */
.ms-date-input__format-selector {
  font-size: 14px;
  border: none;
  color: #b7b7b7;
  cursor: pointer;
  transition: all 0.3s;
}
.ms-date-input__format-selector:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  background-color: #f5f5f5;
}

/* Input wrapper */
.ms-date-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* Text input */
.ms-date-input__input {
  flex: 1;
  padding: 8px 32px 8px 12px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;
  box-sizing: border-box;
}

.ms-date-input__input::placeholder {
  color: rgba(0, 0, 0, 0.25);
}

.ms-date-input__input:hover {
  border-color: #40a9ff;
}

.ms-date-input__input:focus {
  outline: none;
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.ms-date-input__input:disabled {
  background-color: #f5f5f5;
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
}

/* Calendar button */
/* .icon.icon-calendar {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  color: rgba(0, 0, 0, 0.45);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transition: all 0.3s;
}

.icon.icon-calendar:hover {
  color: #40a9ff;
  background-color: rgba(0, 0, 0, 0.04);
}

.icon.icon-calendar:active {
  transform: translateY(-50%) scale(0.95);
}

.icon.icon-calendar:disabled {
  cursor: not-allowed;
  opacity: 0.3;
} */

/* icon calendar style */
.icon.icon-calendar {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}

/* Hidden date picker */
.ms-date-input__date-picker {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
}

/* Error state */
.ms-date-input--error .ms-date-input__input {
  border-color: #ff4d4f;
}

.ms-date-input--error .ms-date-input__input:focus {
  border-color: #ff4d4f;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
}

/* Error message */
.ms-date-input__error-message {
  font-size: 12px;
  color: #ff4d4f;
  line-height: 1.5;
  margin-top: 4px;
}

/* Disabled state */
.ms-date-input--disabled .ms-date-input__label {
  color: rgba(0, 0, 0, 0.25);
}
</style>
