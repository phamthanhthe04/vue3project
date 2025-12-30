<script setup>
const props = defineProps({
  label: { type: String, default: '' },
  required: { type: Boolean, default: false },
  help: { type: String, default: '' },
  id: { type: String, default: null },
})
</script>

<template>
  <div class="ms-form-field">
    <label :for="id" class="form-label">
      {{ label || '\u00A0' }} <span v-if="required" class="required-star">*</span>
    </label>

    <div class="form-field-control">
      <slot />
      <small v-if="help" class="form-help">{{ help }}</small>
    </div>
  </div>
</template>

<style scoped>
@import './base-form.css';

.ms-form-field {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #1e2633;
  min-height: 20px;
  display: block;
}

.form-help {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 4px;
}
</style>
