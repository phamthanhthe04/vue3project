<script setup>
import { ref } from 'vue'
import MSTable from '../../components/controls/ms-table/MSTable.vue'
import { getStatusClass, getAvatarColorClass } from '../../utils/enums.js'

// Demo mode switch
const demoMode = ref('job') // 'job' hoặc 'candidate'

// Job fields
const jobFields = [
  {
    key: 'jobName',
    label: 'Tên công việc',
    type: 'custom',
  },
  {
    key: 'department',
    label: 'Phòng ban',
    type: 'text',
  },
  {
    key: 'location',
    label: 'Địa điểm',
    type: 'text',
  },
  {
    key: 'postedDate',
    label: 'Ngày đăng',
    type: 'date',
  },
  {
    key: 'status',
    label: 'Trạng thái',
    type: 'text',
  },
]

const jobRows = ref([
  {
    id: 1,
    jobName: 'Nhân viên kinh doanh',
    department: 'Kinh doanh',
    location: 'Hà Nội',
    postedDate: '2024-06-01',
    status: 'Mở',
  },
  {
    id: 2,
    jobName: 'Lập trình viên Frontend',
    department: 'Công nghệ thông tin',
    location: 'Hồ Chí Minh',
    postedDate: '2024-05-28',
    status: 'Đóng',
  },
  {
    id: 3,
    jobName: 'Chuyên viên marketing',
    department: 'Marketing',
    location: 'Đà Nẵng',
    postedDate: '2024-06-03',
    status: 'Mở',
  },
  {
    id: 4,
    jobName: 'Kỹ sư phần mềm Backend',
    department: 'Công nghệ thông tin',
    location: 'Hà Nội',
    postedDate: '2024-06-05',
    status: 'Mở',
  },
  {
    id: 5,
    jobName: 'Nhân viên hành chính',
    department: 'Hành chính',
    location: 'Hà Nội',
    postedDate: '2024-05-30',
    status: 'Đóng',
  },
])

// Candidate fields - Simplified version
const candidateFields = [
  {
    key: 'fullName',
    label: 'Họ và tên',
    type: 'custom',
    width: '200px',
  },
  {
    key: 'phone',
    label: 'Số điện thoại',
    type: 'text',
    width: '120px',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'text',
    width: '180px',
  },
  {
    key: 'source',
    label: 'Nguồn',
    type: 'text',
    width: '120px',
  },
  {
    key: 'status',
    label: 'Trạng thái',
    type: 'custom',
    width: '150px',
  },
  {
    key: 'rating',
    label: 'Đánh giá',
    type: 'custom',
    width: '120px',
  },
  {
    key: 'dateApplied',
    label: 'Ngày ứng tuyển',
    type: 'text',
    width: '120px',
  },
]

const candidateRows = ref([
  {
    id: 1,
    fullName: 'Nguyễn Văn A',
    phone: '0987654321',
    email: 'nguyenvana@example.com',
    source: 'LinkedIn',
    status: 'Nộp hồ sơ',
    rating: 5,
    dateApplied: '15/06/2024',
    avatar: '',
    avatarText: 'NA',
    avatarColor: 'blue',
  },
  {
    id: 2,
    fullName: 'Trần Thị B',
    phone: '0912345678',
    email: 'tranthib@example.com',
    source: 'Facebook',
    status: 'Phỏng vấn',
    rating: 4,
    dateApplied: '10/06/2024',
    avatar: '',
    avatarText: 'TB',
    avatarColor: 'pink',
  },
  {
    id: 3,
    fullName: 'Lê Văn C',
    phone: '0934567890',
    email: 'levanc@example.com',
    source: 'Giới thiệu',
    status: 'Đạt',
    rating: 5,
    dateApplied: '05/06/2024',
    avatar: '',
    avatarText: 'LC',
    avatarColor: 'green',
  },
])

const selectedRows = ref([])

// Xử lý sửa công việc
const handleEdit = (row) => {
  console.log('Edit:', row)
  alert(`Sửa: ${demoMode.value === 'job' ? row.jobName : row.fullName}`)
}

// Xử lý xóa công việc
const handleDelete = (row) => {
  const name = demoMode.value === 'job' ? row.jobName : row.fullName
  if (confirm(`Bạn có chắc muốn xóa "${name}"?`)) {
    const rows = demoMode.value === 'job' ? jobRows : candidateRows
    const index = rows.value.findIndex((r) => r.id === row.id)
    if (index !== -1) {
      rows.value.splice(index, 1)
      console.log('Deleted:', name)
    }
  }
}

// Get rating stars
const getRatingStars = (rating) => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

// Check if candidate has image avatar
const hasImageAvatar = (candidate) => {
  return candidate.avatar && candidate.avatar.trim() !== ''
}

// Switch demo mode
const switchMode = (mode) => {
  demoMode.value = mode
  selectedRows.value = []
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1>MSTable Demo - {{ demoMode === 'job' ? 'Công việc' : 'Ứng viên' }}</h1>
      <div class="demo-switch">
        <button :class="['btn-switch', { active: demoMode === 'job' }]" @click="switchMode('job')">
          Danh sách công việc
        </button>
        <button
          :class="['btn-switch', { active: demoMode === 'candidate' }]"
          @click="switchMode('candidate')"
        >
          Demo Candidate Table
        </button>
      </div>
    </div>

    <!-- Job Table -->
    <div v-if="demoMode === 'job'" class="page-content">
      <div class="info-box">
        <h3>MSTable Basic - Danh sách công việc</h3>
        <p>Features: Custom slot, Date format, Edit/Delete actions</p>
      </div>

      <MSTable :fields="jobFields" :rows="jobRows" @edit="handleEdit" @delete="handleDelete">
        <!-- Custom slot cho tên công việc -->
        <template #jobName="{ row }">
          <strong style="color: #1890ff">{{ row.jobName }}</strong>
        </template>
      </MSTable>
    </div>

    <!-- Candidate Table -->
    <div v-else class="page-content">
      <div class="info-box candidate-demo">
        <h3>MSTable Advanced - Demo Candidate Style</h3>
        <p><strong>Các tính năng mới:</strong></p>
        <ul>
          <li>Checkbox selection ({{ selectedRows.length }} selected)</li>
          <li>Avatar với text + color</li>
          <li>Status badge với màu động</li>
          <li>Rating stars custom</li>
          <li>Horizontal scroll</li>
          <li>Floating action buttons</li>
        </ul>
      </div>

      <MSTable
        :fields="candidateFields"
        :rows="candidateRows"
        v-model:selected="selectedRows"
        :selectable="true"
        :scrollable="true"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <!-- Custom slot cho tên với avatar -->
        <template #fullName="{ row }">
          <div class="candidate-info">
            <div class="avatar" :class="getAvatarColorClass(row.avatarColor)">
              <img
                v-if="hasImageAvatar(row)"
                :src="row.avatar"
                :alt="row.fullName"
                class="avatar-image"
              />
              <span v-else class="avatar-text">
                {{ row.avatarText }}
              </span>
            </div>
            <div class="candidate-name">
              <strong>{{ row.fullName }}</strong>
            </div>
          </div>
        </template>

        <!-- Custom slot cho status badge -->
        <template #status="{ row }">
          <span class="badge-status" :class="getStatusClass(row.status)">
            {{ row.status }}
          </span>
        </template>

        <!-- Custom slot cho rating -->
        <template #rating="{ row }">
          <span class="rating-stars">{{ getRatingStars(row.rating) }}</span>
        </template>
      </MSTable>

      <div class="selected-info" v-if="selectedRows.length > 0">
        <strong>Đã chọn {{ selectedRows.length }} ứng viên:</strong>
        {{ selectedRows.map((r) => r.fullName).join(', ') }}
      </div>
    </div>
  </div>
</template>
<style scoped>
.page-container {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
}

.demo-switch {
  display: flex;
  gap: 8px;
}

.btn-switch {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-switch:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.btn-switch.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.page-content {
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.info-box {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}

.info-box.candidate-demo {
  background: #f6ffed;
  border-color: #b7eb8f;
}

.info-box h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
}

.info-box p {
  margin: 8px 0;
  color: rgba(0, 0, 0, 0.65);
}

.info-box ul {
  margin: 8px 0;
  padding-left: 20px;
}

.info-box li {
  color: rgba(0, 0, 0, 0.65);
  margin: 4px 0;
}

/* Candidate Info Styles */
.candidate-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-text {
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
}

/* Avatar colors */
.avatar-color-blue {
  background-color: #2196f3;
}

.avatar-color-pink {
  background-color: #f50057;
}

.avatar-color-green {
  background-color: #4caf50;
}

.avatar-color-orange {
  background-color: #ff9800;
}

.avatar-color-purple {
  background-color: #9c27b0;
}

.avatar-color-cyan {
  background-color: #00bcd4;
}

.avatar-color-teal {
  background-color: #009688;
}

.candidate-name {
  font-size: 14px;
}

/* Status Badge */
.badge-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.status-submitted {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-interview {
  background-color: #fff7e6;
  color: #fa8c16;
}

.status-passed {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-failed {
  background-color: #fff1f0;
  color: #f5222d;
}

/* Rating Stars */
.rating-stars {
  color: #fadb14;
  font-size: 16px;
  letter-spacing: 2px;
}

/* Selected info */
.selected-info {
  margin-top: 16px;
  padding: 12px;
  background: #e6f7ff;
  border-radius: 4px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}
</style>
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
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
}

.page-content {
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}
</style>
