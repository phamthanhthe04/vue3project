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
import { candidateFields } from '../job/candidateTableConfig.js'

const { success, error, warning } = useToast()
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

// Bulk actions state
const showBulkActions = computed(() => selectedCandidates.value.length > 0)
const selectedCount = computed(() => selectedCandidates.value.length)

// Pagination state
const currentPage = ref(1)
const pageSize = ref(25)

// Pagination: Lấy candidates cho trang hiện tại
const paginatedCandidates = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCandidates.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredCandidates.value.length / pageSize.value)
})

const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, filteredCandidates.value.length)
  return { start, end, total: filteredCandidates.value.length }
})

// Search
const handleSearch = (event) => {
  searchCandidates(event.target.value)
  currentPage.value = 1
}

// Filter
const handleOpenFilter = () => {
  showFilterModal.value = true
}
const handleCloseFilter = () => {
  showFilterModal.value = false
}
const handleApplyFilter = (newFilters) => {
  updateFilters(newFilters)
  showFilterModal.value = false
  currentPage.value = 1
}
const handleResetFilter = () => {
  resetFilters()
  showFilterModal.value = false
  currentPage.value = 1
}

// CRUD
const handleAddCandidate = () => {
  showAddModal.value = true
}
const handleSaveCandidate = (candidateData) => {
  const result = addCandidate(candidateData)
  if (result) showAddModal.value = false
}
const handleEditCandidate = (candidate) => {
  selectedCandidate.value = candidate
  showEditModal.value = true
}
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
const handleDeleteCandidate = (candidate) => {
  if (confirm(`Bạn có chắc muốn xóa ứng viên "${candidate.fullName}"?`)) {
    const result = deleteCandidate(candidate.id)
    if (result) {
      success('Xóa ứng viên thành công!')
      if (paginatedCandidates.value.length === 0 && currentPage.value > 1) {
        currentPage.value--
      }
    } else {
      error('Có lỗi xảy ra khi xóa ứng viên')
    }
  }
}
const handleCloseModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  selectedCandidate.value = null
}

// Bulk actions
const clearSelection = () => {
  selectedCandidates.value = []
}
const toggleSelectAll = () => {
  if (selectedCandidates.value.length === paginatedCandidates.value.length) {
    clearSelection()
  } else {
    selectedCandidates.value = [...paginatedCandidates.value]
  }
}
const sendEmail = () => {
  success(`Sẽ gửi email đến ${selectedCount.value} ứng viên`)
}
const confirmDelete = () => {
  if (confirm(`Bạn có chắc muốn xóa ${selectedCount.value} ứng viên đã chọn?`)) {
    success(`Đã xóa ${selectedCount.value} ứng viên`)
    clearSelection()
  }
}

// Pagination
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
const changePageSize = (event) => {
  pageSize.value = parseInt(event)
  currentPage.value = 1
}

// Helpers
const getRatingStars = (rating) => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}
const hasImageAvatar = (candidate) => {
  return candidate.avatar && candidate.avatar.trim() !== ''
}
</script>

<template>
  <div class="candidate-page">
    <div class="candidate-page-main">
      <!-- PAGE HEADER -->
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

      <!-- TOOLBAR: Search & Filter & Bulk Actions -->
      <div
        v-if="!showBulkActions"
        class="toolbar display-flex align-items-center justify-content-space-between"
      >
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

      <!-- BULK ACTIONS BAR -->
      <div
        v-else
        class="bulk-actions-bar display-flex align-items-center justify-content-space-between"
      >
        <div class="bulk-selection-info display-flex align-items-center">
          <input
            type="checkbox"
            :checked="selectedCount > 0"
            @change="toggleSelectAll"
            class="bulk-checkbox"
          />
          <span class="bulk-count">
            <strong>{{ selectedCount }}</strong> đã chọn
          </span>
          <button class="btn-bulk" @click="clearSelection">
            <span class="btn-text">Bỏ chọn</span>
          </button>
          <button class="btn-bulk btn-email" @click="sendEmail">
            <span class="icon icon-email"></span>
            <span class="btn-text">Gửi email</span>
          </button>
          <button class="btn-bulk btn-tag" @click="handleTag">
            <span class="icon icon-tag"></span>
            <span class="btn-text">Quản lí thẻ</span>
          </button>
          <button class="btn-bulk btn-tag" @click="handleCreateJob">
            <span class="icon icon-create-job"></span>
            <span class="btn-text">Tạo công việc</span>
          </button>
          <button class="btn-bulk btn-tag" @click="handleAddCampaign">
            <span class="icon icon-sb-campaign"></span>
            <span class="btn-text">Thêm vào chiến dịch</span>
          </button>
          <button class="btn-bulk btn-tag" @click="handleMovePotenial">
            <span class="icon icon-sb-potential"></span>
            <span class="btn-text">Chuyển vào kho tiềm năng</span>
          </button>
          <button class="btn-bulk btn-more">
            <span class="icon icon-more-vertical"></span>
          </button>
        </div>
      </div>

      <!-- MSTABLE - Chuẩn hóa -->
      <div class="table-container" style="flex: 1 1 auto; min-height: 0">
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
          <!-- SLOT: Full Name với Avatar -->
          <template #fullName="{ row }">
            <div class="candidate-info display-flex align-items-center">
              <div
                class="avatar"
                :class="{
                  [getAvatarColorClass(row.avatarColor)]: !hasImageAvatar(row),
                }"
              >
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
              <div class="candidate-details">
                <div class="candidate-name">
                  {{ row.fullName }}
                  <span v-if="row.isEmployee" class="badge-employee"></span>
                </div>
              </div>
            </div>
          </template>
          <!-- SLOT: Status Badge -->
          <template #status="{ row }">
            <span class="badge-status" :class="getStatusClass(row.status)">
              {{ row.status }}
            </span>
          </template>
          <!-- SLOT: Rating Stars -->
          <template #rating="{ row }">
            <span class="rating-stars">
              {{ getRatingStars(row.rating) }}
            </span>
          </template>
        </MSTable>
      </div>

      <!-- PAGINATION đặt ngay sau table-container để scrollbar nằm trên -->
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
          <button
            class="btn-pagination"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <span>&lt;</span>
          </button>
          <button
            class="btn-pagination"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <span>&gt;</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Sidebar -->
    <FilterCandidateModal
      :show="showFilterModal"
      :filters="filters"
      @close="handleCloseFilter"
      @apply="handleApplyFilter"
      @reset="handleResetFilter"
    />
    <!-- Add Candidate Modal -->
    <AddCandidateModal :show="showAddModal" @close="handleCloseModal" @save="handleSaveCandidate" />
    <!-- Edit Candidate Modal -->
    <EditCandidateModal
      :show="showEditModal"
      :candidate="selectedCandidate"
      @close="handleCloseModal"
      @save="handleSaveEditCandidate"
    />
  </div>
</template>

<style scoped>
/* ==================== PAGE LAYOUT ==================== */
.candidate-page {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.candidate-page-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* ==================== BUTTONS ==================== */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  gap: 6px;
}

.btn-primary {
  background: #3990ff;
  color: #ffffff;
}

.btn-primary:hover {
  background: #7fb7fdff;
}

.btn-icon-only {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #d9d9d9;
  background-color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
}

.btn-icon-only:hover {
  background-color: #f5f7fa;
  border-color: #3990ff;
}

.filter-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  background-color: #ff4d4f;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  border: 2px solid #ffffff;
}

.btn-pagination {
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #d9d9d9;
  background-color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 16px;
  color: #666666;
}

.btn-pagination:hover:not(:disabled) {
  background-color: #f5f7fa;
  border-color: #3990ff;
  color: #3990ff;
}

.btn-pagination:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ==================== SEARCH ==================== */
.search-ai {
  max-width: 300px;
  position: relative;
}

.search-ai-icon {
  width: 24px;
  height: 32px;
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  border: none;
}

.search-ai-input {
  width: 100%;
  padding: 10px 12px 10px 38px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #111111;
  transition: all 0.2s ease;
  background-color: #ffffff;
}

.search-ai-input:focus {
  outline: none;
  border-color: #3990ff;
}

.search-ai-input::placeholder {
  color: #999999;
}

/* ==================== TABLE ==================== */
.table-container {
  background-color: #ffffff;
  overflow: auto;
  min-height: 0;
  border: 1px solid #e5e5e5;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1400px;
}

.data-table thead {
  background-color: #f5f7fa;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #333333;
  white-space: nowrap;
  border-bottom: 1px solid #e5e5e5;
  background-color: #f5f7fa;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  color: #333333;
  vertical-align: middle;
}

.data-table tbody tr:hover {
  background-color: #e1eeff;
}

/* ==================== STATUS BADGE ==================== */
.badge-status {
  padding: 5px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  display: inline-block;
  white-space: nowrap;
}

.status-hired {
  background-color: #d4edda;
  color: #155724;
}

.status-interview {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status-submitted {
  background-color: #fff3cd;
  color: #856404;
}

.status-reviewing {
  background-color: #e2e3e5;
  color: #383d41;
}

.status-rejected {
  background-color: #f8d7da;
  color: #721c24;
}

.status-pending {
  background-color: #cce5ff;
  color: #004085;
}

/* ==================== CANDIDATE INFO ==================== */
.candidate-info {
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
  text-transform: uppercase;
  overflow: hidden;
}

/* Avatar Image */
.avatar .avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* Avatar Text */
.avatar .avatar-text {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

/* Avatar Colors - Only apply when no image */
.avatar-color-pink {
  background: linear-gradient(135deg, #ff6b9d 0%, #ff4081 100%);
}

.avatar-color-orange {
  background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%);
}

.avatar-color-blue {
  background: linear-gradient(135deg, #42a5f5 0%, #2196f3 100%);
}

.avatar-color-cyan {
  background: linear-gradient(135deg, #26c6da 0%, #00bcd4 100%);
}

.avatar-color-teal {
  background: linear-gradient(135deg, #26a69a 0%, #009688 100%);
}

.avatar-color-purple {
  background: linear-gradient(135deg, #ab47bc 0%, #9c27b0 100%);
}

.avatar-color-green {
  background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
}

.candidate-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.candidate-name {
  font-weight: 500;
  color: #111111;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
}

/* ==================== BADGE EMPLOYEE ==================== */
.badge-employee {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: #28c76f;
  border-radius: 50%;
  margin-left: 6px;
  position: relative;
}

.badge-employee::before {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 10px;
  font-weight: bold;
}

/* ==================== RATING STARS ==================== */
.rating-stars {
  color: #ffc107;
  font-size: 14px;
  letter-spacing: 2px;
}

/* ==================== TABLE COLUMNS ==================== */
.col-checkbox {
  width: 48px;
  text-align: center;
}

.col-phone {
  min-width: 130px;
}

.col-source {
  min-width: 140px;
}

.col-name {
  min-width: 220px;
}

.col-email {
  min-width: 200px;
}

.col-campaign {
  min-width: 180px;
}

.col-position {
  min-width: 160px;
}

.col-job {
  min-width: 180px;
}

.col-status {
  min-width: 140px;
}

.col-rating {
  min-width: 100px;
}

.col-date-applied {
  min-width: 120px;
}

.col-education-level {
  min-width: 140px;
}

.col-education-place {
  min-width: 200px;
}

.col-major {
  min-width: 160px;
}

.col-recent-workplace {
  min-width: 180px;
}

.col-recruiter {
  min-width: 140px;
}

.col-using-unit {
  min-width: 140px;
}

.col-fit-profile {
  min-width: 120px;
}

.col-area {
  min-width: 120px;
}

.col-referrer {
  min-width: 140px;
}

.col-contact-info {
  min-width: 180px;
}

.col-potential-warehouse {
  min-width: 140px;
}

.data-table input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3990ff;
  margin: 0;
}

/* ==================== FLOATING EDIT BUTTON ==================== */
.floating-edit-btn {
  position: fixed;
  right: 24px;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  background-color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.floating-edit-btn:hover {
  background-color: #f5f7fa;
  border-color: #3990ff;
  box-shadow: 0 4px 12px rgba(57, 144, 255, 0.2);
}

.floating-edit-btn .icon-edit {
  width: 20px;
  height: 20px;
  background-color: #666666;
  transition: background-color 0.2s ease;
}

.floating-edit-btn:hover .icon-edit {
  background-color: #3990ff;
}

.table-row-hoverable {
  transition: background-color 0.15s ease;
}

.table-row-hoverable:hover {
  background-color: #f5f7fa;
}
</style>
