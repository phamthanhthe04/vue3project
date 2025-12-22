<script setup>
import { ref, watch } from 'vue'
import { CandidateStatus, CandidateSource, EducationLevel } from '../../../utils/enums'
import MSButton from '@/components/controls/MSButton/MSButton.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  filters: {
    type: Object,
    default: () => ({
      status: '',
      source: '',
      educationLevel: '',
      position: '',
    }),
  },
})

const emit = defineEmits(['close', 'apply', 'reset'])

// Local state cho bộ lọc
const localFilters = ref({
  status: '',
  source: '',
  educationLevel: '',
  position: '',
})

// Danh sách vị trí tuyển dụng phổ biến
const positionOptions = [
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'Mobile Developer',
  'DevOps Engineer',
  'QA Engineer',
  'Business Analyst',
  'Product Manager',
  'UI/UX Designer',
  'Data Analyst',
]

// Enum options
const statusOptions = Object.values(CandidateStatus)
const sourceOptions = Object.values(CandidateSource)
const educationLevelOptions = Object.values(EducationLevel)

// Watch props để cập nhật local state
watch(
  () => props.filters,
  (newFilters) => {
    localFilters.value = { ...newFilters }
  },
  { immediate: true },
)

// Handle apply filter
const handleApply = () => {
  emit('apply', localFilters.value)
}

// Handle reset filter
const handleReset = () => {
  localFilters.value = {
    status: '',
    source: '',
    educationLevel: '',
    position: '',
  }
  emit('reset')
}

// Handle close
const handleClose = () => {
  emit('close')
}
</script>
<template>
  <div v-if="show" class="filter-sidebar">
    <!-- Sidebar Header -->
    <div class="filter-sidebar-header">
      <h3 class="filter-sidebar-title">Bộ lọc</h3>
      <button class="filter-sidebar-close" @click="handleClose" title="Đóng">
        <span class="icon icon-close"></span>
      </button>
    </div>

    <!-- Sidebar Body -->
    <div class="filter-sidebar-body">
      <!-- Vòng tuyển dụng -->
      <div class="filter-group">
        <label class="filter-label">Vòng tuyển dụng</label>
        <select v-model="localFilters.status" class="filter-select">
          <option value="">Tất cả</option>
          <option v-for="status in statusOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>

      <!-- Nguồn ứng viên -->
      <div class="filter-group">
        <label class="filter-label">Nguồn ứng viên</label>
        <select v-model="localFilters.source" class="filter-select">
          <option value="">Tất cả</option>
          <option v-for="source in sourceOptions" :key="source" :value="source">
            {{ source }}
          </option>
        </select>
      </div>

      <!-- Trình độ đào tạo -->
      <div class="filter-group">
        <label class="filter-label">Trình độ đào tạo</label>
        <select v-model="localFilters.educationLevel" class="filter-select">
          <option value="">Tất cả</option>
          <option v-for="level in educationLevelOptions" :key="level" :value="level">
            {{ level }}
          </option>
        </select>
      </div>

      <!-- Vị trí tuyển dụng -->
      <div class="filter-group">
        <label class="filter-label">Vị trí tuyển dụng</label>
        <select v-model="localFilters.position" class="filter-select">
          <option value="">Tất cả</option>
          <option v-for="position in positionOptions" :key="position" :value="position">
            {{ position }}
          </option>
        </select>
      </div>
    </div>

    <!-- Sidebar Footer -->
    <div class="filter-sidebar-footer">
      <MSButton type="secondary" label="Bỏ lọc" outline @click="handleReset"></MSButton>
      <MSButton type="primary" label="Áp dụng" @click="handleApply"></MSButton>
    </div>
  </div>
</template>

<style scoped>
.filter-sidebar {
  width: 320px;
  background-color: #ffffff;
  border-left: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-shrink: 0;
}

.filter-sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e5e5;
  flex-shrink: 0;
}

.filter-sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #111111;
  margin: 0;
}

.filter-sidebar-close {
  width: 28px;
  height: 28px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.filter-sidebar-close:hover {
  background-color: #f5f5f5;
}

.filter-sidebar-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8px;
}

.filter-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #111111;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:hover {
  border-color: #3990ff;
}

.filter-select:focus {
  outline: none;
  border-color: #3990ff;
  box-shadow: 0 0 0 2px rgba(57, 144, 255, 0.1);
}

.filter-sidebar-footer {
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #e5e5e5;
  flex-shrink: 0;
  background-color: #ffffff;
}

.btn-filter {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reset {
  background-color: #ffffff;
  color: #666666;
  border: 1px solid #d9d9d9;
}

.btn-reset:hover {
  background-color: #f5f5f5;
  border-color: #999999;
}

.btn-apply {
  background-color: #3990ff;
  color: #ffffff;
}

.btn-apply:hover {
  background-color: #2b7ce5;
}
</style>
