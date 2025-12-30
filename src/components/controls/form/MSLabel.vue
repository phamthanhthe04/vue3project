<template>
  <label
    class="ms-label"
    :class="[alignClass, { 'ms-label--disabled': disabled }]"
    :style="labelStyle"
    :for="forId"
    :title="tooltip"
  >
    <span v-if="icon" :class="['ms-label__icon', icon]"></span>
    <slot />
    <span v-if="required" class="ms-label__required">*</span>
  </label>
</template>

<script setup>
const props = defineProps({
  forId: String,
  icon: String,
  required: Boolean,
  width: [String, Number],
  fontSize: [String, Number],
  align: { type: String, default: 'left' },
  tooltip: String,
  disabled: Boolean,
})

const alignClass = props.align ? `ms-label--${props.align}` : ''
const labelStyle = {
  width: props.width
    ? typeof props.width === 'number'
      ? props.width + 'px'
      : props.width
    : undefined,
  fontSize: props.fontSize
    ? typeof props.fontSize === 'number'
      ? props.fontSize + 'px'
      : props.fontSize
    : undefined,
}
</script>

<style scoped>
.ms-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  color: #222;
  cursor: pointer;
  user-select: none;
}
.ms-label--disabled {
  color: #aaa;
  cursor: not-allowed;
}
.ms-label__icon {
  font-size: 1em;
  margin-right: 4px;
  display: inline-flex;
  align-items: center;
}
.ms-label__required {
  color: #ff4d4f;
  margin-left: 4px;
  font-size: 1em;
}
.ms-label--right {
  justify-content: flex-end;
}
.ms-label--center {
  justify-content: center;
}
.ms-label--left {
  justify-content: flex-start;
}
</style>
