<template>
  <div class="ms-toolbar display-flex align-items-center justify-content-space-between">
    <div class="ms-toolbar-left">
      <slot name="left"></slot>
    </div>
    <div class="ms-toolbar-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup>
// Base form, chưa nhận props, chỉ slot cho left và right
</script>

<style scoped>
.ms-toolbar {
  background-color: #ffffff;
  padding: 12px 16px;
  border-radius: 6px 6px 0 0;
}
.ms-toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ms-toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
