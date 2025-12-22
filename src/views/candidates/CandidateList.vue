<script setup>
import { ref } from 'vue'
import { useCandidates } from '../../composables/useCandidates.js'
import { getStatusClass, getAvatarColorClass } from '../../utils/enums.js'
import AddCandidateModal from '../../views/candidates/modals/AddCandidateModal.vue'
import EditCandidateModal from '../../views/candidates/modals/EditCandidateModal.vue'
import FilterCandidateModal from '../../views/candidates/modals/FilterCandidateModal.vue'
import MSButton from '../../components/controls/MSButton/MSButton.vue'

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

// Modal state
const showAddModal = ref(false)
const showEditModal = ref(false)
const showFilterModal = ref(false)
const selectedCandidate = ref(null)

// Floating edit button state
const showEditButton = ref(false)
const editButtonTop = ref(0)
const hoveredCandidateId = ref(null)

// Xử lý tìm kiếm
const handleSearch = (event) => {
  searchCandidates(event.target.value)
}

// Tạo rating stars
const getRatingStars = (rating) => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

// Xử lý mở modal thêm ứng viên
const handleAddCandidate = () => {
  showAddModal.value = true
}

// Xử lý đóng modal
const handleCloseModal = () => {
  showAddModal.value = false
}

// Xử lý lưu ứng viên mới
const handleSaveCandidate = (candidateData) => {
  const result = addCandidate(candidateData)
  if (result) {
    console.log('Thêm ứng viên thành công:', result.fullName)
  }
  alert('Thêm ứng viên thành công!')
  showAddModal.value = false
}

// Xử lý hover vào row
const handleRowMouseEnter = (event, candidate) => {
  const row = event.currentTarget
  const rect = row.getBoundingClientRect()
  editButtonTop.value = rect.top + rect.height / 2
  hoveredCandidateId.value = candidate.id
  selectedCandidate.value = candidate
  showEditButton.value = true
}

const handleRowMouseLeave = () => {
  // Không ẩn ngay, sẽ ẩn khi mouse leave khỏi button
}

// Xử lý click button edit
const handleEditButtonClick = () => {
  if (selectedCandidate.value) {
    showEditModal.value = true
    showEditButton.value = false
  }
}

const handleEditButtonMouseLeave = () => {
  showEditButton.value = false
  hoveredCandidateId.value = null
  selectedCandidate.value = null
}

// Xử lý đóng modal edit
const handleCloseEditModal = () => {
  showEditModal.value = false
  selectedCandidate.value = null
}

// Xử lý lưu chỉnh sửa ứng viên
const handleSaveEditCandidate = (candidateData) => {
  const result = updateCandidate(candidateData.id, candidateData)
  if (result) {
    console.log('Cập nhật ứng viên thành công:', result.fullName)
  }
  alert('Cập nhật ứng viên thành công!')
  showEditModal.value = false
  selectedCandidate.value = null
}

// Xử lý mở modal filter
const handleOpenFilter = () => {
  showFilterModal.value = true
}

// Xử lý đóng modal filter
const handleCloseFilter = () => {
  showFilterModal.value = false
}

// Xử lý áp dụng filter
const handleApplyFilter = (newFilters) => {
  updateFilters(newFilters)
  showFilterModal.value = false
}

// Xử lý reset filter
const handleResetFilter = () => {
  resetFilters()
  showFilterModal.value = false
}

// Check if candidate has image avatar
const hasImageAvatar = (candidate) => {
  return candidate.avatar && candidate.avatar.trim() !== ''
}
</script>

<template>
  <div class="candidate-page">
    <div class="candidate-page-main">
      <!--page header-->
      <div class="page-header display-flex justify-content-space-between align-items-center">
        <h1 class="page-title">Ứng viên</h1>
        <div>
          <MSButton
            label="Thêm ứng viên"
            type="primary"
            iconLeft="icon icon-add-candidate"
            iconRight="icon icon-arrow-down"
            @click="handleAddCandidate"
          ></MSButton>
        </div>
      </div>

      <!--toolbar-->
      <div class="toolbar display-flex align-items-center justify-content-space-between">
        <!--search AI-->
        <div class="search-ai display-flex align-items-center flex">
          <div class="search-ai-icon display-flex align-items-center justify-content-center">
            <button class="img-search-ai img-ct-search-ai" id="search-candidate-button"></button>
          </div>
          <input
            class="search-ai-input"
            id="search-candidate-input"
            placeholder="Tìm kiếm hoặc nhờ AI trợ giúp"
            :value="searchKeyword"
            @input="handleSearch"
          />
        </div>
        <!--toolbar actions-->
        <div class="toolbar-actions display-flex align-items-center">
          <button
            class="btn-icon-only"
            @click="handleOpenFilter"
            :title="activeFiltersCount > 0 ? `Đang áp dụng ${activeFiltersCount} bộ lọc` : 'Bộ lọc'"
          >
            <div class="icon icon-filter"></div>
            <span v-if="activeFiltersCount > 0" class="filter-badge">{{ activeFiltersCount }}</span>
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

      <!--table container-->
      <div class="table-container flex">
        <table class="data-table">
          <thead>
            <tr>
              <th class="col-checkbox">
                <input type="checkbox" />
              </th>
              <th class="col-phone">Số điện thoại</th>
              <th class="col-source">Nguồn ứng viên</th>
              <th class="col-name">Họ và tên</th>
              <th class="col-email">Email</th>
              <th class="col-campaign">Chiến dịch tuyển dụng</th>
              <th class="col-position">Vị trí tuyển dụng</th>
              <th class="col-job">Tin tuyển dụng</th>
              <th class="col-status">Vòng tuyển dụng</th>
              <th class="col-rating">Đánh giá</th>
              <th class="col-date-applied">Ngày ứng tuyển</th>
              <th class="col-education-level">Trình độ đào tạo</th>
              <th class="col-education-place">Nơi đào tạo</th>
              <th class="col-major">Chuyên ngành</th>
              <th class="col-recent-workplace">Nơi làm việc gần đây</th>
              <th class="col-recruiter">Nhân sự khai thác</th>
              <th class="col-using-unit">Đơn vị sử dụng</th>
              <th class="col-fit-profile">Phù hợp với chân dung</th>
              <th class="col-area">Khu vực</th>
              <th class="col-referrer">Người giới thiệu</th>
              <th class="col-contact-info">Thông tin tiếp cận</th>
              <th class="col-potential-warehouse">Thuộc kho tiềm năng</th>
            </tr>
          </thead>
          <tbody id="candidates-table-body">
            <tr v-if="loading">
              <td colspan="22" style="text-align: center; padding: 40px">
                <span>Đang tải dữ liệu...</span>
              </td>
            </tr>
            <tr v-else-if="filteredCandidates.length === 0">
              <td colspan="22" style="text-align: center; padding: 40px">
                <span>Không có ứng viên nào</span>
              </td>
            </tr>
            <tr
              v-else
              v-for="candidate in filteredCandidates"
              :key="candidate.id"
              @mouseenter="handleRowMouseEnter($event, candidate)"
              @mouseleave="handleRowMouseLeave"
              class="table-row-hoverable"
            >
              <td class="col-checkbox">
                <input type="checkbox" />
              </td>
              <td class="col-phone">{{ candidate.phone }}</td>
              <td class="col-source">{{ candidate.source }}</td>
              <td class="col-name">
                <div class="candidate-info display-flex align-items-center">
                  <div
                    class="avatar"
                    :class="{
                      [getAvatarColorClass(candidate.avatarColor)]: !hasImageAvatar(candidate),
                    }"
                  >
                    <!-- Image Avatar -->
                    <img
                      v-if="hasImageAvatar(candidate)"
                      :src="candidate.avatar"
                      :alt="candidate.fullName"
                      class="avatar-image"
                    />
                    <!-- Text Avatar -->
                    <span v-else class="avatar-text">
                      {{ candidate.avatarText }}
                    </span>
                  </div>
                  <div class="candidate-details">
                    <div class="candidate-name">
                      {{ candidate.fullName }}
                      <span v-if="candidate.isEmployee" class="badge-employee"></span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="col-email">{{ candidate.email }}</td>
              <td class="col-campaign">{{ candidate.campaign || '-' }}</td>
              <td class="col-position">{{ candidate.position }}</td>
              <td class="col-job">{{ candidate.job }}</td>
              <td class="col-status">
                <span class="badge-status" :class="getStatusClass(candidate.status)">
                  {{ candidate.status }}
                </span>
              </td>
              <td class="col-rating">
                <span class="rating-stars">{{ getRatingStars(candidate.rating) }}</span>
              </td>
              <td class="col-date-applied">{{ candidate.dateApplied }}</td>
              <td class="col-education-level">{{ candidate.educationLevel }}</td>
              <td class="col-education-place">{{ candidate.educationPlace }}</td>
              <td class="col-major">{{ candidate.major }}</td>
              <td class="col-recent-workplace">{{ candidate.recentWorkplace }}</td>
              <td class="col-recruiter">{{ candidate.recruiter }}</td>
              <td class="col-using-unit">{{ candidate.usingUnit || '-' }}</td>
              <td class="col-fit-profile">{{ candidate.fitProfile ? 'Có' : 'Không' }}</td>
              <td class="col-area">{{ candidate.area }}</td>
              <td class="col-referrer">{{ candidate.referrer || '-' }}</td>
              <td class="col-contact-info">{{ candidate.contactInfo }}</td>
              <td class="col-potential-warehouse">
                {{ candidate.potentialWarehouse ? 'Có' : 'Không' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Floating Edit Button -->
      <button
        v-if="showEditButton"
        class="floating-edit-btn"
        :style="{ top: editButtonTop + 'px' }"
        @click="handleEditButtonClick"
        @mouseenter="showEditButton = true"
        @mouseleave="handleEditButtonMouseLeave"
        title="Sửa thông tin ứng viên"
      >
        <div class="icon icon-edit"></div>
      </button>

      <!--pagination-->
      <div class="pagination display-flex justify-content-space-between align-items-center">
        <div class="pagination-info">
          Tổng: <strong>{{ filteredCandidates.length }}</strong> bản ghi
        </div>
        <div class="pagination-controls display-flex align-items-center">
          <span>Số bản ghi/trang</span>
          <select class="pagination-select">
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span class="pagination-range"
            >1 - {{ Math.min(25, filteredCandidates.length) }} bản ghi</span
          >
          <button class="btn-pagination" disabled>
            <span>&lt;</span>
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
      @close="handleCloseEditModal"
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

/* ==================== PAGE HEADER ==================== */
.page-header {
  padding: 0 0 16px 0;
  margin: 0;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #111111;
  margin: 0;
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

/* ==================== TOOLBAR ==================== */
.toolbar {
  background-color: #ffffff;
  padding: 12px 16px;
  border-radius: 6px 6px 0 0;
}

.toolbar-actions {
  gap: 8px;
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

/* ==================== PAGINATION ==================== */
.pagination {
  background-color: #ffffff;
  padding: 14px 24px;
  border-top: 1px solid #e5e5e5;
}

.pagination-info {
  font-size: 14px;
  color: #666666;
}

.pagination-info strong {
  color: #111111;
  font-weight: 600;
}

.pagination-controls {
  gap: 16px;
  font-size: 14px;
  color: #666666;
}

.pagination-select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background-color: #ffffff;
}

.pagination-range {
  color: #666666;
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
.avatar-pink {
  background: linear-gradient(135deg, #ff6b9d 0%, #ff4081 100%);
}

.avatar-orange {
  background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%);
}

.avatar-blue {
  background: linear-gradient(135deg, #42a5f5 0%, #2196f3 100%);
}

.avatar-cyan {
  background: linear-gradient(135deg, #26c6da 0%, #00bcd4 100%);
}

.avatar-teal {
  background: linear-gradient(135deg, #26a69a 0%, #009688 100%);
}

.avatar-purple {
  background: linear-gradient(135deg, #ab47bc 0%, #9c27b0 100%);
}

.avatar-green {
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
