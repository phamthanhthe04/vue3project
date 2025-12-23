<script setup>
import { ref } from 'vue'
import MSTable from '../../components/controls/ms-table/MSTable.vue'

const pageTitle = ref('Lịch')
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1>{{ pageTitle }}</h1>
    </div>
    <div class="page-content">
      <p>Trang lịch đang được phát triển...</p>
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
