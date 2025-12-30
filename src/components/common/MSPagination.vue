<template>
  <div class="ms-pagination display-flex justify-content-space-between align-items-center">
    <div class="ms-pagination-info">
      <slot name="info"></slot>
    </div>
    <div class="ms-pagination-controls display-flex align-items-center">
      <slot name="controls"></slot>
    </div>
  </div>
</template>

<script setup>
// Base form, chưa nhận props, chỉ slot cho info và controls
</script>

<style scoped>
.ms-pagination {
  background-color: #ffffff;
  padding: 14px 24px;
  border-top: 1px solid #e5e5e5;
}
.ms-pagination-info {
  font-size: 14px;
  color: #666666;
}
.ms-pagination-info strong {
  color: #111111;
  font-weight: 600;
}
.ms-pagination-controls {
  gap: 16px;
  font-size: 14px;
  color: #666666;
}
</style>
