<template>
  <div
    class="base-table"
    :class="{ 'base-table--scrollable': scrollable, 'base-table--loading': loading }"
  >
    <!-------Loading overlay-->
    <div v-if="loading" class="table-loading">
      <span class="loading-spinner"></span>
      <p>{{ loadingText }}</p>
    </div>
    <table>
      <!--------Header table   -->
      <thead>
        <tr>
          <!--------Kiểm tra có selectable = true-->
          <th v-if="selectable" class="col-checkbox">
            <input
              type="checkbox"
              :checked="isAllSelected"
              :indeterminate="isSomeSelected"
              @change="handleSelectAll"
            />
          </th>

          <!-------loop qua các columns()-->
          <th
            v-for="field in fields"
            :key="field.key"
            :class="[field.class, { sortable: field.sortable }]"
            :style="{ width: field.width }"
            @click="field.sortable && handleSort(field.key)"
          >
            <!-----------Column label---------->
            <div class="th-content">
              <span>{{ field.label }}</span>

              <!-------Hiển thị icon sort nếu sortable = true-->
              <span
                v-if="field.sortable"
                class="sort-icon"
                :class="{
                  'sort-asc': sortColumn === field.key && sortOrder === 'asc',
                  'sort-desc': sortColumn === field.key && sortOrder === 'desc',
                }"
              >
                ▲▼
              </span>
            </div>
          </th>
          <th v-if="showActions" class="col-sticky-right">Thao tác</th>
        </tr>
      </thead>

      <!-- ============ BODY SECTION ============ -->
      <tbody>
        <!--------Loading state-->
        <tr v-if="loading && rows.length === 0">
          <td :colspan="totalColumns" class="text-center">
            {{ loadingText }}
          </td>
        </tr>

        <!--------No data state-->
        <tr v-else-if="processedRows.length === 0">
          <td :colspan="totalColumns" class="text-center empty-state">
            {{ emptyText }}
          </td>
        </tr>

        <!--------Loop qua các row đã xử lý-->
        <tr
          v-else
          v-for="(row, rowIndex) in processedRows"
          :key="getRowKey(row, rowIndex)"
          class="table-row"
          :class="{ 'row-selected': isRowSelected(row) }"
          @click="handleRowClick(row)"
        >
          <!----------Checkbox-cell-->
          <td v-if="selectable" class="col-checkbox">
            <input
              type="checkbox"
              :checked="isRowSelected(row)"
              @change.stop="handleSelectRow(row)"
            />
          </td>

          <!----------Loop qua các columns để hiển thị dữ liệu-->
          <td v-for="field in fields" :key="field.key" :class="field.class">
            <template v-if="field.type === 'custom'">
              <slot :name="field.key" :row="row" :field="field" :value="row[field.key]">
                {{ formatValue(row[field.key], field.type) }}
              </slot>
            </template>
            <template v-else>
              {{ formatValue(row[field.key], field.type) }}
            </template>
          </td>

          <td v-if="showActions" class="col-sticky-right">
            <div class="row-actions-container">
              <slot name="row-action" :row="row" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  // Cấu hình columns
  fields: {
    type: Array,
    required: true,
    // Validator: Kiểm tra cấu trúc fields hợp lệ
    validator: (value) => {
      return value.every((field) => {
        // Mỗi field phải có key và label
        const hasRequired = field.key && field.label
        // Type phải thuộc danh sách cho phép
        const validTypes = ['text', 'number', 'date', 'custom', 'boolean']
        const hasValidType = !field.type || validTypes.includes(field.type)
        return hasRequired && hasValidType
      })
    },
  },
  // Dữ liệu hiển thị (array of objects)
  rows: {
    type: Array,
    required: true,
    default: () => [],
  },

  // Cho phép select rows
  selectable: {
    type: Boolean,
    default: false,
  },

  // Hiển thị action buttons
  showActions: {
    type: Boolean,
    default: true,
  },

  // Cho phép scroll ngang
  scrollable: {
    type: Boolean,
    default: false,
  },

  // Trạng thái loading
  loading: {
    type: Boolean,
    default: false,
  },

  // Text hiển thị khi loading
  loadingText: {
    type: String,
    default: 'Đang tải dữ liệu...',
  },

  // Text hiển thị khi không có data
  emptyText: {
    type: String,
    default: 'Không có dữ liệu',
  },

  // Field làm unique key (mặc định là 'id')
  rowKey: {
    type: String,
    default: 'id',
  },

  // Rows đang được chọn (dùng với v-model:selected)
  selected: {
    type: Array,
    default: () => [],
  },

  // Hỗ trợ sorting
  sortable: {
    type: Boolean,
    default: false,
  },
})

// =====================================================
// PHẦN 2: ĐỊNH NGHĨA EVENTS (Output đến parent)
// =====================================================
const emit = defineEmits([
  'row-click', // Click vào row
  'edit', // Click edit button
  'delete', // Click delete button
  'update:selected', // Update selected rows (v-model)
  'sort-change', // Sort thay đổi
])

// =====================================================
// PHẦN 3: STATE MANAGEMENT (Reactive data nội bộ)
// =====================================================

// Rows đang được chọn
const selectedRows = ref([...props.selected])
// Cột đang sort
const sortColumn = ref(null)
// Thứ tự sort: 'asc' (tăng dần) hoặc 'desc' (giảm dần)
const sortOrder = ref('asc')

// =====================================================
// PHẦN 4: COMPUTED PROPERTIES (Tính toán từ state/props)
// =====================================================

/**
 * Tính tổng số cột (bao gồm checkbox nếu có)
 */
const totalColumns = computed(() => {
  let count = props.fields.length
  if (props.selectable) count++
  if (props.showActions) count++
  return count
})

/**
 * Kiểm tra TẤT CẢ rows có được chọn không
 */
const isAllSelected = computed(() => {
  if (props.rows.length === 0) return false
  return selectedRows.value.length === props.rows.length
})

/**
 * Kiểm tra MỘT SỐ (nhưng không phải tất cả) rows được chọn
 * Dùng cho indeterminate state của checkbox header
 */
const isSomeSelected = computed(() => {
  const count = selectedRows.value.length
  return count > 0 && count < props.rows.length
})

/**
 * Xử lý data: sort + filter
 * Đây là nơi áp dụng các transformation lên data
 */
const processedRows = computed(() => {
  let result = [...props.rows]
  if (sortColumn.value && props.sortable) {
    result.sort((a, b) => {
      const aVal = a[sortColumn.value]
      const bVal = b[sortColumn.value]
      let comparison = 0
      if (aVal > bVal) comparison = 1
      if (aVal < bVal) comparison = -1
      return sortOrder.value === 'asc' ? comparison : -comparison
    })
  }
  return result
})

// =====================================================
// PHẦN 5: WATCHERS (Theo dõi thay đổi)
// =====================================================

/**
 * Đồng bộ selected từ parent (v-model)
 */
watch(
  () => props.selected,
  (newVal) => {
    if (newVal) selectedRows.value = [...newVal]
  },
  { deep: true },
)

// =====================================================
// PHẦN 6: METHODS (Các hàm xử lý logic)
// =====================================================

/**
 * Lấy unique key của row
 */
const getRowKey = (row, index) => {
  return row[props.rowKey] !== undefined ? row[props.rowKey] : index
}

/**
 * Kiểm tra row có được chọn không
 */
const isRowSelected = (row) => {
  const key = getRowKey(row)
  return selectedRows.value.some((r) => getRowKey(r) === key)
}

/**
 * Format giá trị dựa vào type
 */
const formatValue = (value, type = 'text') => {
  if (value === null || value === undefined) return '-'

  switch (type) {
    case 'number':
      return new Intl.NumberFormat('vi-VN').format(value)
    case 'date':
      if (!value) return '-'
      const date = new Date(value)
      return date.toLocaleDateString('vi-VN')
    case 'boolean':
      return value ? 'Có' : 'Không'
    default:
      return String(value)
  }
}

/**
 * Xử lý chọn/bỏ chọn TẤT CẢ rows
 */
const handleSelectAll = (event) => {
  if (event.target.checked) {
    selectedRows.value = [...props.rows]
  } else {
    selectedRows.value = []
  }
  emit('update:selected', selectedRows.value)
}

/**
 * Xử lý chọn/bỏ chọn MỘT row
 */
const handleSelectRow = (row) => {
  const key = getRowKey(row)
  const index = selectedRows.value.findIndex((r) => getRowKey(r) === key)
  if (index > -1) {
    selectedRows.value.splice(index, 1)
  } else {
    selectedRows.value.push(row)
  }
  emit('update:selected', selectedRows.value)
}

/**
 * Xử lý click vào row
 */
const handleRowClick = (row) => {
  emit('row-click', row)
}

/**
 * Xử lý sort column
 */
const handleSort = (columnKey) => {
  if (!props.sortable) return
  if (sortColumn.value === columnKey) {
    if (sortOrder.value === 'asc') {
      sortOrder.value = 'desc'
    } else {
      sortColumn.value = null
      sortOrder.value = 'asc'
    }
  } else {
    sortColumn.value = columnKey
    sortOrder.value = 'asc'
  }
  emit('sort-change', { column: sortColumn.value, order: sortOrder.value })
}
</script>
<style scoped>
/* Container */
.base-table {
  background-color: #ffffff;
  overflow: auto;
  border: 1px solid #e5e5e5;
  position: relative;
}

/* Table base */
table {
  width: 100%;
  border-collapse: separate; /* Quan trọng để sticky hoạt động tốt */
  border-spacing: 0;
}

/* Header */
thead th {
  position: sticky;
  top: 0;
  z-index: 3;
  background: #fafafa;
  padding: 12px 16px;
  border-bottom: 2px solid #f0f0f0;
}

th {
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  white-space: nowrap;
}

/* Style cho cột Sticky bên phải */
.col-sticky-right {
  position: sticky;
  right: 0;
  background-color: #ffffff; /* Bắt buộc có màu nền để không bị lộ chữ lớp dưới */
  z-index: 2;
  width: 100px;
  border-left: 1px solid #f0f0f0;
}

.header-sticky {
  z-index: 4; /* Cao hơn các th khác */
  background: #fafafa;
}

/* Đảm bảo khi hover dòng thì cột sticky cũng đổi màu theo */
.table-row:hover td {
  background-color: #f5f7fa;
}

/* Ẩn hiện icon: Mặc định ẩn, chỉ hiện khi hover vào dòng */
.row-actions-container {
  display: none;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.table-row:hover .row-actions-container {
  display: flex;
}

/* Checkbox column */
.col-checkbox {
  width: 48px;
  text-align: center;
}

/* Row states */
.table-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.row-selected td {
  background: #e6f7ff !important;
}

/* Empty & Loading State */
.text-center {
  text-align: center;
  padding: 40px 20px;
  color: rgba(0, 0, 0, 0.45);
}

.table-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.th-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-icon {
  font-size: 10px;
  color: #bfbfbf;
}
.sort-asc,
.sort-desc {
  color: #1890ff;
}
</style>
