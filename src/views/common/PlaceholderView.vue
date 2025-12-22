<script setup>
import { ref } from 'vue'

const pages = [
  { title: 'Kho tiềm năng', path: '/potential' },
  { title: 'Chiến dịch tuyển dụng', path: '/campaign' },
  { title: 'Công việc', path: '/jobs' },
  { title: 'AI Marketing', path: '/ai-marketing' },
  { title: 'Trao đổi với ứng viên', path: '/communication' },
  { title: 'Báo cáo', path: '/reports' },
  { title: 'Khác', path: '/other' },
]
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1>{{ $route.meta.title || 'Trang' }}</h1>
    </div>
    <div class="page-content">
      <p>Trang này đang được phát triển...</p>
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
