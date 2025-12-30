<script setup>
import { ref } from 'vue'
import MSInput from '@/components/controls/ms-input/MSInput.vue'

const pageTitle = ref('Lịch')
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1>{{ pageTitle }}</h1>
    </div>
    <div class="page-content">
      <p>Trang lịch đang được phát triển...</p>
      <MSInput v-model="value" label="Họ và tên" placeholder="Nhập họ và tên" required />
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.page-content {
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
