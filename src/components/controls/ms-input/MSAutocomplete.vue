<template>
  <div class="ms-autocomplete">
    <label v-if="label" class="ms-autocomplete__label">
      {{ label }}
      <span v-if="required" class="ms-autocomplete__required">*</span>
    </label>

    <div class="ms-autocomplete__wrapper">
      <input
        v-model="inputValue"
        :list="datalistId"
        :placeholder="placeholder"
        :disabled="disabled"
        class="ms-autocomplete__field"
        @input="handleInput"
      />

      <datalist :id="datalistId">
        <option v-for="option in options" :key="option" :value="option" />
      </datalist>

      <button
        v-if="allowAdd"
        type="button"
        class="ms-autocomplete__add-btn icon icon-plus"
        @click="handleAdd"
        title="Thêm mới"
      ></button>

      <button
        v-if="allowDropdown"
        type="button"
        class="ms-autocomplete__dropdown-btn icon icon-dropdown"
        @click="handleDropdown"
        title="Xem tất cả"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  allowAdd: { type: Boolean, default: false },
  allowDropdown: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'add', 'dropdown'])

// Generate unique ID cho datalist
const datalistId = `ms-autocomplete-${Math.random().toString(36).substr(2, 9)}`

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const handleInput = (e) => {
  inputValue.value = e.target.value
}

const handleAdd = () => {
  emit('add', inputValue.value)
}

const handleDropdown = () => {
  emit('dropdown')
}
</script>
