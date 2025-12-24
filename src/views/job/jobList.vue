<script setup>
import { ref, computed } from 'vue'
import { useCandidates } from '../../composables/useCandidates.js'
import { getStatusClass, getAvatarColorClass } from '../../utils/enums.js'
import AddCandidateModal from '@/views/candidates/modals/AddCandidateModal.vue'
import EditCandidateModal from '@/views/candidates/modals/EditCandidateModal.vue'
import FilterCandidateModal from '@/views/candidates/modals/FilterCandidateModal.vue'
import MSButton from '@/components/controls/ms-button/MSButton.vue'
import MSTable from '@/components/controls/ms-table/MSTable.vue'
import { useToast } from '@/composables/useToast'
import { candidateFields, formatCellValue } from './candidateTableConfig.js'
import { getAvatarText, getRandomAvatarColor } from '@/utils/avatarHelper.js'
const { success, error, warning } = useToast()

// ============================================
// PHẦN 1: DATA & STATE MANAGEMENT
// ============================================

// Lấy data từ composable
const {
  candidates,
  loading,
  searchKeyword,
  filters,
  filteredCandidates,
  activeFiltersCount,
  searchCandidates,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  updateFilters,
  resetFilters,
} = useCandidates()

// Modal states
const showAddModal = ref(false)
const showEditModal = ref(false)
const showFilterModal = ref(false)
const selectedCandidate = ref(null)

// Selection state - Tích hợp với MSTable
const selectedCandidates = ref([])

// Pagination state
const currentPage = ref(1)
const pageSize = ref(25)

// ============================================
// PHẦN 2: COMPUTED PROPERTIES
// ============================================

/**
 * Pagination: Lấy candidates cho trang hiện tại
 */
const paginatedCandidates = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCandidates.value.slice(start, end)
})

/**
 * Tính tổng số trang
 */
const totalPages = computed(() => {
  return Math.ceil(filteredCandidates.value.length / pageSize.value)
})

/**
 * Thông tin hiển thị phân trang
 */
const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, filteredCandidates.value.length)
  return { start, end, total: filteredCandidates.value.length }
})

// ============================================
// PHẦN 3: METHODS - SEARCH & FILTER
// ============================================

/**
 * Xử lý tìm kiếm
 */
const handleSearch = (event) => {
  searchCandidates(event.target.value)
  currentPage.value = 1 // Reset về trang 1 khi search
}

/**
 * Xử lý mở modal filter
 */
const handleOpenFilter = () => {
  showFilterModal.value = true
}

/**
 * Xử lý đóng modal filter
 */
const handleCloseFilter = () => {
  showFilterModal.value = false
}

/**
 * Xử lý áp dụng filter
 */
const handleApplyFilter = (newFilters) => {
  updateFilters(newFilters)
  showFilterModal.value = false
  currentPage.value = 1 // Reset về trang 1 khi filter
}

/**
 * Xử lý reset filter
 */
const handleResetFilter = () => {
  resetFilters()
  showFilterModal.value = false
  currentPage.value = 1
}

// ============================================
// PHẦN 4: METHODS - CRUD OPERATIONS
// ============================================

/**
 * Xử lý thêm ứng viên mới
 */
const handleAddCandidate = () => {
  showAddModal.value = true
}

/**
 * Xử lý lưu ứng viên mới
 */
const handleSaveCandidate = (candidateData) => {
  const result = addCandidate(candidateData)
  if (result) {
    showAddModal.value = false
    success('Thêm ứng viên thành công!')
  }
}

/**
 * Xử lý chỉnh sửa ứng viên
 * @param {Object} candidate - Candidate object từ MSTable
 */
const handleEditCandidate = (candidate) => {
  selectedCandidate.value = candidate
  showEditModal.value = true
}

/**
 * Xử lý lưu chỉnh sửa ứng viên
 */
const handleSaveEditCandidate = (candidateData) => {
  const result = updateCandidate(candidateData.id, candidateData)
  if (result) {
    success('Cập nhật ứng viên thành công!')
    showEditModal.value = false
    selectedCandidate.value = null
  } else {
    error('Có lỗi xảy ra khi cập nhật ứng viên')
  }
}

/**
 * Xử lý xóa ứng viên
 * @param {Object} candidate - Candidate object từ MSTable
 */
const handleDeleteCandidate = (candidate) => {
  if (confirm(`Bạn có chắc muốn xóa ứng viên "${candidate.fullName}"?`)) {
    const result = deleteCandidate(candidate.id)
    if (result) {
      success('Xóa ứng viên thành công!')
      // Điều chỉnh page nếu page hiện tại không còn data
      if (paginatedCandidates.value.length === 0 && currentPage.value > 1) {
        currentPage.value--
      }
    } else {
      error('Có lỗi xảy ra khi xóa ứng viên')
    }
  }
}

/**
 * Xử lý đóng modals
 */
const handleCloseModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  selectedCandidate.value = null
}
// ============================================
// PHẦN 6: METHODS - SELECTION MANAGEMENT
// ============================================

/**
 * Xử lý thay đổi selection từ MSTable
 * @param {Array} selected - Array of selected candidates
 */
const handleSelectionChange = (selected) => {
  selectedCandidates.value = selected
  console.log('Selected candidates:', selected.length)

  // TODO: Có thể thêm bulk actions ở đây
  // - Bulk delete
  // - Bulk export
  // - Bulk change status
}

// ============================================
// PHẦN 7: METHODS - PAGINATION
// ============================================

/**
 * Chuyển trang
 */
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

/**
 * Thay đổi số bản ghi/trang
 */
const changePageSize = (event) => {
  pageSize.value = parseInt(event)
  currentPage.value = 1 // Reset về trang 1
}

// ============================================
// PHẦN 8: HELPER METHODS
// ============================================

/**
 * Tạo rating stars
 */
const getRatingStars = (rating) => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

/**
 * Check if candidate has image avatar
 */
const hasImageAvatar = (candidate) => {
  return candidate.avatar && candidate.avatar.trim() !== ''
}
</script>

<template>
  <div class="candidate-page">
    <div class="candidate-page-main">
      <!-- ============================================ -->
      <!-- PAGE HEADER - Giữ nguyên như cũ -->
      <!-- ============================================ -->
      <div class="page-header display-flex justify-content-space-between align-items-center">
        <h1 class="page-title">Ứng viên</h1>
        <div>
          <MSButton
            label="Thêm ứng viên"
            type="primary"
            iconLeft="icon icon-add-candidate"
            iconRight="icon icon-arrow-down"
            @click="handleAddCandidate"
          />
        </div>
      </div>

      <!-- ============================================ -->
      <!-- TOOLBAR - Giữ nguyên như cũ -->
      <!-- ============================================ -->
      <div class="toolbar display-flex align-items-center justify-content-space-between">
        <!-- Search AI -->
        <div class="search-ai display-flex align-items-center flex">
          <div class="search-ai-icon display-flex align-items-center justify-content-center">
            <button class="img-search-ai img-ct-search-ai"></button>
          </div>
          <input
            class="search-ai-input"
            placeholder="Tìm kiếm hoặc nhờ AI trợ giúp"
            :value="searchKeyword"
            @input="handleSearch"
          />
        </div>

        <!-- Toolbar actions -->
        <div class="toolbar-actions display-flex align-items-center">
          <button
            class="btn-icon-only"
            @click="handleOpenFilter"
            :title="activeFiltersCount > 0 ? `Đang áp dụng ${activeFiltersCount} bộ lọc` : 'Bộ lọc'"
          >
            <div class="icon icon-filter"></div>
            <span v-if="activeFiltersCount > 0" class="filter-badge">
              {{ activeFiltersCount }}
            </span>
          </button>
          <button class="btn-icon-only">
            <div class="icon icon-export"></div>
          </button>
          <button class="btn-icon-only">
            <div class="icon icon-activity"></div>
          </button>
          <button class="btn-icon-only">
            <div class="icon icon-settings"></div>
          </button>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- MSTABLE - PHẦN CHÍNH ĐƯỢC REFACTOR -->
      <!-- ============================================ -->
      <div class="table-container flex">
        <MSTable
          :fields="candidateFields"
          :rows="paginatedCandidates"
          v-model:selected="selectedCandidates"
          :selectable="true"
          :scrollable="true"
          :loading="loading"
          loadingText="Đang tải dữ liệu ứng viên..."
          emptyText="Không có ứng viên nào"
          rowKey="id"
          :showActions="true"
          @edit="handleEditCandidate"
          @delete="handleDeleteCandidate"
        >
          <!-- ==================== -->
          <!-- SLOT 1: Full Name với Avatar -->
          <!-- ==================== -->
          <template #fullName="{ row }">
            <div class="candidate-info display-flex align-items-center">
              <!-- Avatar -->
              <div
                class="avatar"
                :class="{
                  [getAvatarColorClass(row.avatarColor)]: !hasImageAvatar(row),
                }"
              >
                <!-- Image Avatar -->
                <img
                  v-if="hasImageAvatar(row)"
                  :src="row.avatar"
                  :alt="row.fullName"
                  class="avatar-image"
                />
                <!-- Text Avatar -->
                <span v-else class="avatar-text">
                  {{ row.avatarText }}
                </span>
              </div>

              <!-- Candidate Details -->
              <div class="candidate-details">
                <div class="candidate-name">
                  {{ row.fullName }}
                  <!-- Badge nhân viên -->
                  <span v-if="row.isEmployee" class="badge-employee"></span>
                </div>
              </div>
            </div>
          </template>

          <!-- ==================== -->
          <!-- SLOT 2: Status Badge -->
          <!-- ==================== -->
          <template #status="{ row }">
            <span class="badge-status" :class="getStatusClass(row.status)">
              {{ row.status }}
            </span>
          </template>

          <!-- ==================== -->
          <!-- SLOT 3: Rating Stars -->
          <!-- ==================== -->
          <template #rating="{ row }">
            <span class="rating-stars">
              {{ getRatingStars(row.rating) }}
            </span>
          </template>

          <!-- ==================== -->
          <!-- SLOT 4: Custom Actions -->
          <!-- Ẩn actions mặc định của MSTable, dùng floating button -->
          <!-- ==================== -->
        </MSTable>
      </div>

      <!-- ============================================ -->
      <!-- PAGINATION - Giữ nguyên UI, thêm logic -->
      <!-- ============================================ -->
      <div class="pagination display-flex justify-content-space-between align-items-center">
        <div class="pagination-info">
          Tổng: <strong>{{ paginationInfo.total }}</strong> bản ghi
        </div>

        <div class="pagination-controls display-flex align-items-center">
          <span>Số bản ghi/trang</span>
          <select
            class="pagination-select"
            :value="pageSize"
            @change="changePageSize($event.target.value)"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>

          <span class="pagination-range">
            {{ paginationInfo.start }} - {{ paginationInfo.end }} bản ghi
          </span>

          <!-- Previous button -->
          <button
            class="btn-pagination"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <span>&lt;</span>
          </button>

          <!-- Next button -->
          <button
            class="btn-pagination"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <span>&gt;</span>
          </button>
        </div>
      </div>

      <!-- Selection info - TÍNH NĂNG MỚI -->
      <div v-if="selectedCandidates.length > 0" class="selection-info">
        <strong>Đã chọn {{ selectedCandidates.length }} ứng viên</strong>
        <button class="btn-bulk-action" @click="console.log('Bulk delete')">Xóa đã chọn</button>
        <button class="btn-bulk-action" @click="console.log('Bulk export')">Export đã chọn</button>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- MODALS - Giữ nguyên như cũ -->
    <!-- ============================================ -->
    <AddCandidateModal :show="showAddModal" @close="handleCloseModal" @save="handleSaveCandidate" />

    <EditCandidateModal
      :show="showEditModal"
      :candidate="selectedCandidate"
      @close="handleCloseModal"
      @save="handleSaveEditCandidate"
    />

    <FilterCandidateModal
      :show="showFilterModal"
      :filters="filters"
      @close="handleCloseFilter"
      @apply="handleApplyFilter"
      @reset="handleResetFilter"
    />
  </div>
</template>

<style scoped>
/* ============================================ */
/* BASE STYLES */
/* ============================================ */
.candidate-page {
  display: flex;
  background-color: #ffffff; /* Đổi thành trắng giống CandidateList */
  overflow: hidden;
}

.candidate-page-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  gap: 8px; /* Giảm gap xuống 8px */
  padding: 12px 16px; /* Giảm padding để fit viewport */
  box-sizing: border-box; /* Đảm bảo padding không làm tràn */
}

/* ============================================ */
/* PAGE HEADER */
/* ============================================ */
.page-header {
  flex-shrink: 0; /* Không cho phép co lại */
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
}

/* ============================================ */
/* TOOLBAR */
/* ============================================ */
.toolbar {
  flex-shrink: 0; /* Không cho phép co lại */
  gap: 16px;
}

.search-ai {
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 8px 12px;
  gap: 8px;
}

.search-ai-input {
  border: none;
  outline: none;
  font-size: 14px;
  width: 100%;
}

.toolbar-actions {
  gap: 8px;
}

.btn-icon-only {
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}

.filter-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4d4f;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
}

/* ============================================ */
/* TABLE CONTAINER */
/* ============================================ */
.table-container {
  background: white;
  border-radius: 0; /* Bỏ border-radius giống CandidateList */
  padding: 0; /* Bỏ padding bên trong */
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  min-height: 0;
  border: 1px solid #f0f0f0; /* Thêm border nhẹ */
}

/* ============================================ */
/* AVATAR STYLES - QUAN TRỌNG */
/* ============================================ */
.candidate-info {
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
  user-select: none;
}

/* Avatar Color Classes */
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

.candidate-details {
  display: flex;
  flex-direction: column;
}

.candidate-name {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.badge-employee {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: #52c41a;
  border-radius: 50%;
  margin-left: 8px;
}

/* ============================================ */
/* STATUS BADGE */
/* ============================================ */
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

/* ============================================ */
/* RATING STARS */
/* ============================================ */
.rating-stars {
  color: #fadb14;
  font-size: 16px;
  letter-spacing: 2px;
}

/* ============================================ */
/* PAGINATION */
/* ============================================ */
.pagination {
  flex-shrink: 0;
  padding: 8px 0; /* Giảm padding */
  background: transparent; /* Bỏ background */
  border-radius: 0;
}

.pagination-info {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.pagination-controls {
  gap: 12px;
}

.pagination-select {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.pagination-range {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.btn-pagination {
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-pagination:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

.btn-pagination:disabled {
  cursor: not-allowed;
  /* ============================================ */
  /* BULK ACTIONS */
  /* ============================================ */
  .selection-info {
    flex-shrink: 0; /* Không cho phép co lại */
    padding: 12px 16px;
    background: #e6f7ff;
    border: 1px solid #91d5ff;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-bulk-action {
  padding: 6px 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-bulk-action:hover {
  background: #40a9ff;
}

/* ============================================ */
/* UTILITY CLASSES */
/* ============================================ */
.display-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.justify-content-space-between {
  justify-content: space-between;
}

.flex {
  flex: 1;
}
</style>
