<template>
  <div class="ms-input-group" :class="{ 'ms-input-group--inline': labelInline }" :style="rootStyle">
    <!-- Label removed for MSLabel pattern. Use MSLabel outside. -->
    <!--
    <template v-if="labelInline">
      <label ...>...</label>
      ...
    </template>
    <template v-else>
      <label ...>...</label>
      ...
    </template>
    -->
    <div :class="['ms-input-group__wrapper', labelInline ? 'ms-input-group__wrapper--inline' : '']">
      <div class="ms-input-group__input-wrapper">
        <input
          ref="inputRef"
          :id="id"
          v-model="inputValue"
          :type="type"
          :name="name"
          :placeholder="placeholder"
          :disabled="disabled"
          :list="datalistId"
          class="form-input"
          :class="inputClass"
          @input="handleInput"
          @blur="handleBlur"
          @focus="handleFocus"
        />
        <datalist v-if="options.length > 0" :id="datalistId">
          <option
            v-for="option in options"
            :key="typeof option === 'object' ? option.value : option"
            :value="typeof option === 'object' ? option.label : option"
          >
            {{ typeof option === 'object' ? option.label : option }}
          </option>
        </datalist>
        <button
          v-if="showAddButton"
          type="button"
          :class="['btn-action-inside', 'icon', addIcon]"
          @click="handleAdd"
          title="Thêm mới"
        ></button>
      </div>
      <div v-if="showDropdownButton" class="form-btn-dropdown">
        <button
          type="button"
          :class="['btn-action-drop', 'icon', dropdownIcon]"
          @click="handleDropdown"
          title="Xem tất cả"
        ></button>
      </div>
    </div>

    <!-- Error message -->
    <span v-if="error" class="form-error">
      <span class="form-error-icon">⚠</span>
      {{ error }}
    </span>

    <!-- Helper text -->
    <span v-if="helperText && !error" class="form-helper">{{ helperText }}</span>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  // Hiển thị label và input trên 1 dòng
  labelInline: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  name: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  }, // Deprecated, use MSLabel outside
  labelClass: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  }, // Deprecated, use MSLabel outside
  // Icon đầu label (class icon)
  iconLabel: {
    type: String,
    default: '',
  },
  // Icon bullet trước label (• hoặc text khác)
  bulletIcon: {
    type: String,
    default: '',
  },
  // Datalist options cho autocomplete
  options: {
    type: Array,
    default: () => [],
  },
  // Show add button (icon plus bên trong input)
  showAddButton: {
    type: Boolean,
    default: false,
  },
  // Show dropdown button (button riêng bên ngoài)
  showDropdownButton: {
    type: Boolean,
    default: false,
  },
  // Validation
  error: {
    type: String,
    default: '',
  },
  helperText: {
    type: String,
    default: '',
  },
  inputClass: {
    type: String,
    default: '',
  },
  // Tên icon bên trong input (mặc định: icon-plus)
  addIcon: {
    type: String,
    default: 'icon-plus',
  },
  // Tên icon dropdown ngoài input (mặc định: icon-dropdown)
  dropdownIcon: {
    type: String,
    default: 'icon-dropdown',
  },
  // Width of input group
  width: {
    type: [String, Number],
    default: '100%',
  },
})

const emit = defineEmits(['update:modelValue', 'input', 'blur', 'focus', 'add', 'dropdown'])

const inputRef = ref(null)

// Generate unique ID cho datalist
const datalistId = computed(
  () => `ms-input-group-datalist-${Math.random().toString(36).substr(2, 9)}`,
)

// Nếu options là object {value, label}, đồng bộ label <-> value
const inputValue = ref(props.modelValue)

// Khi modelValue từ ngoài thay đổi, cập nhật inputValue
watch(
  () => props.modelValue,
  (val) => {
    // Nếu là code, tìm label tương ứng để hiển thị
    if (Array.isArray(props.options) && typeof val === 'number') {
      const found = props.options.find((opt) => typeof opt === 'object' && opt.value === val)
      if (found) inputValue.value = found.label
      else inputValue.value = val
    } else {
      inputValue.value = val
    }
  },
)

// Khi inputValue thay đổi (user nhập/chọn), đồng bộ lại modelValue
watch(inputValue, (val) => {
  if (Array.isArray(props.options)) {
    // Nếu user chọn đúng label, lưu lại value (code), còn không thì lưu nguyên label
    const found = props.options.find((opt) => typeof opt === 'object' && opt.label === val)
    if (found) emit('update:modelValue', found.value)
    else emit('update:modelValue', val)
  } else {
    emit('update:modelValue', val)
  }
})

const handleInput = (e) => {
  emit('input', e.target.value)
}

const handleBlur = (e) => {
  emit('blur', e)
}

const handleFocus = (e) => {
  emit('focus', e)
}

const handleAdd = () => {
  emit('add', inputValue.value)
}

const handleDropdown = () => {
  emit('dropdown')
}

// Tính toán style cho width
function normalizeWidth(val) {
  if (val === undefined || val === null || val === '') return '100%'
  if (typeof val === 'number') return `${val}px`
  if (typeof val === 'string' && /^\d+(\.\d+)?$/.test(val.trim())) {
    return `${val.trim()}px`
  }
  return val
}
const rootStyle = computed(() => ({ width: normalizeWidth(props.width) }))

// Expose input ref cho parent
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<style scoped>
.ms-input-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.ms-input-group--inline {
  flex-direction: row;
  align-items: center;
}
.ms-input-group__label--inline {
  min-width: 150px;
  margin-bottom: 0;
  margin-right: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
}
.ms-input-group__wrapper--inline {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0;
}

/* Ẩn icon drop-down mặc định của datalist input trên Chrome, Edge, Safari */
input[list]::-webkit-calendar-picker-indicator {
  display: none !important;
}
input[list]::-webkit-input-placeholder {
  color: #bdbdbd;
}
input[list]::-ms-expand {
  display: none;
}
input[list]::-webkit-search-decoration,
input[list]::-webkit-search-cancel-button,
input[list]::-webkit-search-results-button,
input[list]::-webkit-search-results-decoration {
  display: none;
}

.ms-input-group__label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.ms-input-group__wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.ms-input-group__input-wrapper {
  position: relative;
  flex: 1;
}

/* Override padding khi có add button */
.ms-input-group__input-wrapper:has(.btn-action-inside) input {
  padding-right: 36px;
}

.ms-input-group__input-wrapper {
  position: relative;
  flex: 1;
}
.ms-input-group__dropdown-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 18px;
  color: #1976d2;
  z-index: 2;
}
/* Icon đầu label */
.ms-input-group__label-icon {
  margin-right: 6px;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}
</style>
