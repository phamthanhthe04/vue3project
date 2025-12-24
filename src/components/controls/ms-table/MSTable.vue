<template>
  <!----
  -ccontainer chính của table
  - thêm class động dựa trên props
  -scrollable: cho phép scroll ngang khi table quá rộng
  -->
  <div
    class="base-table"
    :class="{ 'base-table--scrollable': scrollable, 'base-table--loading': loading }"
  >
    <!-------Loading overlay-->
    <div v-if="loading" class="table-loading">
      <span class="loading-spinner"></span>
      <p>{{ LoadingText }}</p>
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
            :class="[
              field.class,
              {
                sortable: field.sortable,
              },
            ]"
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
        </tr>
      </thead>
      <!-- ============ BODY SECTION ============ -->

      <tbody>
        <!--------Loading state-->
        <tr v-if="loading && row.length === 0">
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
          :class="{
            'row-selected': isRowSelected(row),
            'row-hovered': hoveredRowKey === getRowKey(row, rowIndex),
          }"
          @click="handleRowClick(row)"
          @mouseenter="handleRowMouseEnter(row, rowIndex)"
          @mouseleave="handleRowMouseLeave"
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
            <!-- 
              Rendering chiến lược:
              1. Nếu có slot custom -> dùng slot
              2. Nếu không -> format theo type
            -->

            <!-- Custom slot cho cell này -->

            <slot
              v-if="field.type === 'custom'"
              :name="field.key"
              :row="row"
              :field="field"
              :value="row[field.key]"
            >
              <!-- Fallback nếu không có slot -->
              {{ formatValue(row[field.key], field.type) }}
            </slot>
            <!-- Auto format theo type -->
            <template v-else>
              {{ formatValue(row[field.key], field.type) }}
            </template>
          </td>

          <!-- Floating action buttons (hiện khi hover) -->
          <div
            v-if="showActions && hoveredRowKey === getRowKey(row, rowIndex)"
            class="action-buttons"
          >
            <!-- 
              Cho phép parent custom actions thông qua slot
              Hoặc dùng default Edit/Delete buttons
            -->
            <slot name="actions" :row="row">
              <!-- Default actions -->
              <button class="btn-action btn-edit" @click.stop="handleEdit(row)" title="Sửa">
                <span class="icon-edit">✎</span>
              </button>
              <button class="btn-action btn-delete" @click.stop="handleDelete(row)" title="Xóa">
                <span class="icon-delete">×</span>
              </button>
            </slot>
          </div>
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

// Row đang được hover (lưu key của row)
const hoveredRowKey = ref(null)

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

  // Áp dụng sorting nếu có
  if (sortColumn.value && props.sortable) {
    result.sort((a, b) => {
      const aVal = a[sortColumn.value]
      const bVal = b[sortColumn.value]
    })

    // So sánh giá trị
    let comparison = 0
    if (aVal > bVal) comparison = 1
    if (aVal < bVal) comparison = -1

    // Đảo ngược nếu sort desc
    return sortOrder.value === 'asc' ? comparison : -comparison
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
    if (!newVal) {
      selectedRows.value = [...newVal]
    }
  },
)
// =====================================================
// PHẦN 6: METHODS (Các hàm xử lý logic)
// =====================================================

/**
 * Lấy unique key của row
 * - Ưu tiên dùng rowKey prop (mặc định 'id')
 * - Fallback dùng index nếu không có
 *
 * @param {Object} row - Row object
 * @param {Number} index - Index trong array
 * @returns {String|Number} - Unique key
 */
const getRowKey = (row, index) => {
  return row[props.rowKey] !== undefined ? row[props.rowKey] : index
}

/**
 * Kiểm tra row có được chọn không
 *
 * @param {Object} row - Row cần kiểm tra
 * @returns {Boolean}
 */
const isRowSelected = (row) => {
  const key = getRowKey(row)
  return selectedRows.value.some((r) => getRowKey(r) === key)
}

/**
 * Format giá trị dựa vào type
 *
 * @param {Any} value - Giá trị cần format
 * @param {String} type - Loại format (text, number, date, boolean)
 * @returns {String} - Giá trị đã format
 */
const formatValue = (value, type = 'text') => {
  // Xử lý null/undefined
  if (value === null || value === undefined) return '-'

  switch (type) {
    case 'number':
      // Format số với dấu phẩy ngăn cách hàng nghìn
      return new Intl.NumberFormat('vi-VN').format(value)

    case 'date':
      // Format ngày theo định dạng Việt Nam
      if (!value) return '-'
      const date = new Date(value)
      return date.toLocaleDateString('vi-VN')

    case 'boolean':
      // Hiển thị Yes/No cho boolean
      return value ? 'Có' : 'Không'

    case 'text':
    default:
      // Mặc định convert sang string
      return String(value)
  }
}

/**
 * Xử lý chọn/bỏ chọn TẤT CẢ rows
 *
 * @param {Event} event - Checkbox change event
 */
const handleSelectAll = (event) => {
  if (event.target.checked) {
    // Chọn tất cả: copy toàn bộ rows
    selectedRows.value = [...props.rows]
  } else {
    // Bỏ chọn tất cả: clear array
    selectedRows.value = []
  }

  // Emit event để parent biết (v-model)
  emit('update:selected', selectedRows.value)
}

/**
 * Xử lý chọn/bỏ chọn MỘT row
 *
 * @param {Object} row - Row được click
 */
const handleSelectRow = (row) => {
  const key = getRowKey(row)

  // Tìm index của row trong selectedRows
  const index = selectedRows.value.findIndex((r) => getRowKey(r) === key)

  if (index > -1) {
    // Đã được chọn -> Bỏ chọn (remove khỏi array)
    selectedRows.value.splice(index, 1)
  } else {
    // Chưa được chọn -> Thêm vào array
    selectedRows.value.push(row)
  }

  // Emit event
  emit('update:selected', selectedRows.value)
}

/**
 * Xử lý click vào row
 *
 * @param {Object} row - Row được click
 */
const handleRowClick = (row) => {
  emit('row-click', row)
}

/**
 * Xử lý hover vào row
 * - Lưu key của row đang hover
 * - Dùng để hiển thị action buttons
 */
const handleRowMouseEnter = (row, index) => {
  hoveredRowKey.value = getRowKey(row, index)
}

/**
 * Xử lý hover ra khỏi row
 */
const handleRowMouseLeave = () => {
  // Để null thay vì clear ngay để action buttons không bị nhấp nháy
  hoveredRowKey.value = null
}

/**
 * Xử lý sort column
 * - Click lần 1: sort asc
 * - Click lần 2: sort desc
 * - Click lần 3: clear sort
 *
 * @param {String} columnKey - Key của column cần sort
 */
const handleSort = (columnKey) => {
  if (!props.sortable) return

  if (sortColumn.value === columnKey) {
    // Đang sort column này -> Toggle order
    if (sortOrder.value === 'asc') {
      sortOrder.value = 'desc'
    } else {
      // Clear sort
      sortColumn.value = null
      sortOrder.value = 'asc'
    }
  } else {
    // Sort column mới
    sortColumn.value = columnKey
    sortOrder.value = 'asc'
  }

  // Emit event
  emit('sort-change', {
    column: sortColumn.value,
    order: sortOrder.value,
  })
}

/**
 * Xử lý click Edit button
 */
const handleEdit = (row) => {
  emit('edit', row)
}

/**
 * Xử lý click Delete button
 */
const handleDelete = (row) => {
  emit('delete', row)
}
</script>
<style scoped>
/* Container */
.base-table {
  width: 100%;
  position: relative;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

/* Scrollable table - cho phép scroll ngang */
.base-table--scrollable {
  overflow-x: auto;
}

.base-table--scrollable table {
  min-width: 1200px; /* Đảm bảo table đủ rộng để scroll */
}

/* Scrollable table */
.base-table--scrollable {
  overflow-x: auto;
}

/* Loading overlay */
.base-table--loading {
  position: relative;
}

.table-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Table base */
table {
  width: 100%;
  border-collapse: collapse;
}

/* Header */
thead {
  background: #fafafa;
  border-bottom: 2px solid #f0f0f0;
}

th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px; /* Đảm bảo width từ field.width được áp dụng */
}

/* Override max-width khi có width cụ thể từ config */
th[style*='width'] {
  max-width: unset;
}

th.sortable {
  cursor: pointer;
  user-select: none;
}

th.sortable:hover {
  background: #f0f0f0;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-icon {
  font-size: 10px;
  color: #bfbfbf;
  transition: all 0.3s;
}

.sort-icon.sort-asc {
  color: #1890ff;
  transform: rotate(0deg);
}

.sort-icon.sort-desc {
  color: #1890ff;
  transform: rotate(180deg);
}

/* Body */
tbody tr {
  border-bottom: 1px solid #f0f0f0;
}

td {
  padding: 12px 16px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

/* Override max-width cho td khi th có width cụ thể */
td:has(+ th[style*='width']),
th[style*='width'] + td {
  max-width: unset;
}

/* Checkbox column */
.col-checkbox {
  width: 48px;
  text-align: center;
}

.col-checkbox input[type='checkbox'] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* Row states */
.table-row {
  position: relative;
  transition: background-color 0.2s;
  cursor: pointer;
}

.table-row:hover {
  background: #fafafa;
}

.row-selected {
  background: #e6f7ff !important;
}

.row-hovered {
  background: #fafafa;
}

/* Empty state */
.text-center {
  text-align: center;
  padding: 40px 20px;
  color: rgba(0, 0, 0, 0.45);
}

.empty-state {
  font-style: italic;
}

/* Action buttons - Floating */
.action-buttons {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
  padding: 4px 12px;
  background: linear-gradient(to left, white 70%, transparent);
  z-index: 5;
}

.btn-action {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  color: white;
}

.btn-action .icon-edit,
.btn-action .icon-delete {
  font-size: 18px;
  font-weight: bold;
  line-height: 1;
}

.btn-edit {
  background: #1890ff;
}

.btn-edit:hover {
  background: #40a9ff;
  transform: scale(1.05);
}

.btn-delete {
  background: #ff4d4f;
}

.btn-delete:hover {
  background: #ff7875;
  transform: scale(1.05);
}
</style>
