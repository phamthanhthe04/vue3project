<template>
  <div class="ms-page-header display-flex justify-content-space-between align-items-center">
    <h1 class="ms-page-title">
      <slot name="title">Tiêu đề trang</slot>
    </h1>
    <div class="ms-page-header-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
// Base form, chưa nhận props, chỉ slot cho title và actions
</script>

<style scoped>
.ms-page-header {
  padding: 0 0 16px 0;
  margin: 0;
}
.ms-page-title {
  font-size: 24px;
  font-weight: 600;
  color: #111111;
  margin: 0;
}
.ms-page-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
