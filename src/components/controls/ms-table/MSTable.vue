<template>
  <div class="ms-table" :class="{ 'ms-table--scrollable': scrollable }">
    <table>
      <thead>
        <tr>
          <!-- Checkbox column -->
          <th v-if="selectable" class="col-checkbox">
            <input type="checkbox" :checked="isAllSelected" @change="handleSelectAll" />
          </th>
          <!-- Regular columns -->
          <th
            v-for="field in fields"
            :key="field.key"
            :class="field.class"
            :style="field.width ? { width: field.width } : {}"
          >
            {{ field.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Loading state -->
        <tr v-if="loading">
          <td :colspan="colspan" style="text-align: center; padding: 40px">
            <span>{{ loadingText }}</span>
          </td>
        </tr>
        <!-- Empty state -->
        <tr v-else-if="rows.length === 0">
          <td :colspan="colspan" style="text-align: center; padding: 40px">
            <span>{{ emptyText }}</span>
          </td>
        </tr>
        <!-- Data rows -->
        <tr
          v-else
          v-for="(row, rowIndex) in rows"
          :key="getRowKey(row, rowIndex)"
          class="table-row"
          :class="{ 'table-row--selected': isRowSelected(row) }"
          @mouseenter="handleRowMouseEnter($event, row)"
          @mouseleave="handleRowMouseLeave"
        >
          <!-- Checkbox cell -->
          <td v-if="selectable" class="col-checkbox">
            <input type="checkbox" :checked="isRowSelected(row)" @change="handleSelectRow(row)" />
          </td>

          <!-- Data cells -->
          <td v-for="field in fields" :key="field.key" :class="field.class">
            <!-- Custom type with slot -->
            <template v-if="field.type === 'custom'">
              <slot :name="field.key" :row="row" :field="field" :value="row[field.key]">
                {{ handleFormat(row[field.key], 'text') }}
              </slot>
            </template>

            <!-- Other types -->
            <template v-else>
              {{ handleFormat(row[field.key], field.type || 'text') }}
            </template>
          </td>

          <!-- Floating action buttons -->
          <div
            v-if="showActions && hoveredRowKey === getRowKey(row, rowIndex)"
            class="action-buttons"
          >
            <slot name="actions" :row="row">
              <button @click="handleEdit(row)" class="edit-btn" title="Sửa">
                <span class="icon icon-edit"></span>
              </button>
              <button @click="handleDelete(row)" class="delete-btn" title="Xóa">
                <span class="icon icon-delete"></span>
              </button>
            </slot>
          </div>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

//#region Props
const props = defineProps({
  fields: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every((field) => {
        const validTypes = ['text', 'number', 'date', 'custom']
        return field.key && field.label && validTypes.includes(field.type || 'text')
      })
    },
  },
  rows: {
    type: Array,
    required: true,
  },
  // Enable checkbox selection
  selectable: {
    type: Boolean,
    default: false,
  },
  // Show action buttons on hover
  showActions: {
    type: Boolean,
    default: true,
  },
  // Enable horizontal scroll
  scrollable: {
    type: Boolean,
    default: false,
  },
  // Loading state
  loading: {
    type: Boolean,
    default: false,
  },
  // Loading text
  loadingText: {
    type: String,
    default: 'Đang tải dữ liệu...',
  },
  // Empty text
  emptyText: {
    type: String,
    default: 'Không có dữ liệu',
  },
  // Row key field
  rowKey: {
    type: String,
    default: 'id',
  },
  // Selected rows (for v-model:selected)
  selected: {
    type: Array,
    default: () => [],
  },
})
//#endregion

//#region Emits
const emit = defineEmits(['edit', 'delete', 'update:selected', 'row-click'])
//#endregion

//#region State
const hoveredRowKey = ref(null)
const selectedRows = ref([...props.selected])
//#endregion

//#region Computed
const colspan = computed(() => {
  let count = props.fields.length
  if (props.selectable) count++
  return count
})

const isAllSelected = computed(() => {
  return props.rows.length > 0 && selectedRows.value.length === props.rows.length
})
//#endregion

//#region Methods
/**
 * Get unique row key
 */
const getRowKey = (row, index) => {
  return row[props.rowKey] !== undefined ? row[props.rowKey] : index
}

/**
 * Check if row is selected
 */
const isRowSelected = (row) => {
  const key = getRowKey(row)
  return selectedRows.value.some((r) => getRowKey(r) === key)
}

/**
 * Handle select all
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
 * Handle select single row
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
 * Handle row mouse enter
 */
const handleRowMouseEnter = (event, row) => {
  hoveredRowKey.value = getRowKey(row)
}

/**
 * Handle row mouse leave
 */
const handleRowMouseLeave = () => {
  // Don't hide immediately, let action buttons handle it
}

/**
 * Hàm định dạng giá trị dựa trên kiểu
 */
const handleFormat = (value, type) => {
  if (value === null || value === undefined) return ''

  switch (type) {
    case 'number':
      return new Intl.NumberFormat('vi-VN').format(value)
    case 'date':
      if (!value) return ''
      const date = new Date(value)
      return date.toLocaleDateString('vi-VN')
    case 'text':
    default:
      return String(value)
  }
}

/**
 * Hàm xử lý sửa bản ghi
 */
const handleEdit = (row) => {
  emit('edit', row)
}

/**
 * Hàm xử lý xóa bản ghi
 */
const handleDelete = (row) => {
  emit('delete', row)
}
//#endregion
</script>

<style scoped>
.ms-table {
  width: 100%;
  position: relative;
}

.ms-table--scrollable {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

th,
td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
}

th {
  font-weight: 600;
  background-color: #fafafa;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
}

td {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

/* Checkbox column */
.col-checkbox {
  width: 40px;
  text-align: center;
}

.col-checkbox input[type='checkbox'] {
  cursor: pointer;
}

/* Table row */
.table-row {
  position: relative;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f5f5f5;
}

.table-row--selected {
  background-color: #e6f7ff;
}

.table-row--selected:hover {
  background-color: #d4edff;
}

/* Action buttons */
.action-buttons {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
  padding: 4px 12px;
  background: linear-gradient(to left, #f5f5f5 70%, transparent);
  z-index: 10;
}

.table-row--selected .action-buttons {
  background: linear-gradient(to left, #e6f7ff 70%, transparent);
}

.edit-btn,
.delete-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  transition: all 0.3s;
}

.edit-btn {
  background-color: #1890ff;
  color: white;
}

.edit-btn:hover {
  background-color: #40a9ff;
}

.delete-btn {
  background-color: #ff4d4f;
  color: white;
}

.delete-btn:hover {
  background-color: #ff7875;
}

.edit-btn .icon,
.delete-btn .icon {
  font-size: 16px;
}

/* Scrollable table */
.ms-table--scrollable table {
  min-width: 1200px;
}
</style>
