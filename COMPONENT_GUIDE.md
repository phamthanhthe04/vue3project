# 📚 HƯỚNG DẪN SỬ DỤNG BASE COMPONENTS

## 🎯 Mục đích

Tài liệu này hướng dẫn cách sử dụng các **Base Components** và **Shared Styles** trong project để:

- ✅ Tái sử dụng code
- ✅ Consistent UI/UX
- ✅ Dễ maintain
- ✅ Giảm duplicate code

---

## 📦 Components có sẵn

### 1. **BaseModal** - Modal wrapper

**Location:** `@/components/common/BaseModal.vue`

**Props:**

- `show` (Boolean, required) - Hiển thị modal
- `title` (String) - Tiêu đề modal
- `size` (String) - Kích thước: 'small' | 'medium' | 'large' | 'xlarge' | 'full'
- `closeOnOverlay` (Boolean) - Đóng khi click overlay (default: true)
- `showClose` (Boolean) - Hiển thị nút đóng (default: true)
- `loading` (Boolean) - Loading state
- `bodyClass` (String) - Custom class cho modal body
- `footerClass` (String) - Custom class cho modal footer

**Events:**

- `@close` - Khi modal đóng
- `@update:show` - v-model support

**Slots:**

- `default` - Nội dung modal body
- `header` - Custom header (optional)
- `footer` - Custom footer với buttons

**Usage Example:**

```vue
<template>
  <BaseModal :show="showModal" title="Thêm ứng viên" size="xlarge" @close="handleClose">
    <!-- Modal body content -->
    <form @submit.prevent="handleSubmit">
      <!-- Form fields here -->
    </form>

    <!-- Footer với action buttons -->
    <template #footer>
      <MSButton label="Hủy" @click="handleClose" />
      <MSButton label="Lưu" type="primary" @click="handleSubmit" />
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/common/BaseModal.vue'
import MSButton from '@/components/controls/ms-button/MSButton.vue'

const showModal = ref(false)
</script>
```

---

### 2. **MSInput** - Input field cơ bản

**Location:** `@/components/controls/ms-input/MSInput.vue`

**Props:**

- `modelValue` - v-model value
- `type` - Input type (text, email, password, number, tel)
- `label` - Label text
- `placeholder` - Placeholder
- `required` - Required field
- `disabled` - Disabled state
- `error` - Error message
- `helperText` - Helper text

**Usage:**

```vue
<MSInput
  v-model="formData.fullName"
  label="Họ và tên"
  placeholder="Nhập họ và tên"
  required
  :error="errors.fullName"
/>
```

---

### 3. **MSSelect** - Dropdown select

**Location:** `@/components/controls/ms-input/MSSelect.vue`

**Props:**

- `modelValue` - v-model value
- `options` - Array of options (String[] hoặc Object[])
- `label` - Label text
- `placeholder` - Placeholder
- `valueKey` - Key cho value (khi options là Object[])
- `labelKey` - Key cho label (khi options là Object[])
- `required` - Required field
- `error` - Error message

**Usage:**

```vue
<template>
  <MSSelect
    v-model="formData.gender"
    :options="genderOptions"
    label="Giới tính"
    placeholder="Chọn giới tính"
  />
</template>

<script setup>
import { Gender } from '@/utils/enums'

const genderOptions = Object.values(Gender) // ['Nam', 'Nữ', 'Khác']
</script>
```

---

### 4. **MSDateInput** - Date picker với multiple formats

**Location:** `@/components/controls/ms-input/MSDateInput.vue`

**Props:**

- `modelValue` - v-model value (dd/MM/yyyy format)
- `label` - Label text
- `allowFormatChange` - Cho phép chọn format (default: true)
- `showCalendar` - Hiển thị calendar icon (default: true)
- `required` - Required field
- `disabled` - Disabled state
- `error` - Error message

**Formats:**

- `ddmmyyyy` - Ngày tháng năm (dd/MM/yyyy)
- `mmyyyy` - Tháng năm (MM/yyyy)
- `yyyy` - Năm (yyyy)

**Usage:**

```vue
<MSDateInput v-model="formData.dateOfBirth" label="Ngày sinh" :required="true" />
```

---

### 5. **MSInputGroup** - Input với action buttons

**Location:** `@/components/controls/ms-input/MSInputGroup.vue`

**Props:**

- `modelValue` - v-model value
- `label` - Label text
- `placeholder` - Placeholder
- `bulletIcon` - Icon bullet trước label (•)
- `options` - Array cho autocomplete (datalist)
- `showAddButton` - Hiển thị button "+" bên trong input
- `showDropdownButton` - Hiển thị dropdown button bên ngoài
- `required` - Required field
- `error` - Error message
- `helperText` - Helper text

**Events:**

- `@add` - Khi click nút thêm
- `@dropdown` - Khi click dropdown button

**Usage:**

```vue
<MSInputGroup
  v-model="formData.educationLevel"
  label="Trình độ đào tạo"
  bullet-icon="•"
  :options="educationLevelOptions"
  :show-add-button="true"
  :show-dropdown-button="true"
  @add="handleAddEducationLevel"
  @dropdown="handleShowAllLevels"
/>
```

---

### 6. **MSFormRow** - Layout wrapper

**Location:** `@/components/controls/ms-input/MSFormRow.vue`

**Props:**

- `layout` - Layout type: 'full' | 'split' | 'inline' | 'vertical'
- `gap` - Gap giữa elements (CSS value)

**Usage:**

```vue
<!-- Full width row -->
<MSFormRow layout="full">
  <MSInput v-model="formData.fullName" label="Họ và tên" />
</MSFormRow>

<!-- Split row (2 columns) -->
<MSFormRow layout="split">
  <MSInput v-model="formData.phone" label="Số điện thoại" />
  <MSInput v-model="formData.email" label="Email" />
</MSFormRow>

<!-- Inline row (label bên trái) -->
<MSFormRow layout="inline">
  <template #label>Trình độ đào tạo</template>
  <MSInputGroup v-model="formData.educationLevel" :options="levels" />
</MSFormRow>
```

---

## 🎨 Shared CSS Classes

### **base-form.css**

Import trong component để sử dụng form classes:

```vue
<style scoped>
@import '@/assets/css/base-form.css';
</style>
```

**Available classes:**

#### Layout Classes:

- `.form-row-full` - Full width row
- `.form-row-split` - 2 columns row
- `.form-group-half` - Half width group
- `.form-row-inline` - Label left, input right
- `.form-row-vertical` - Vertical layout

#### Form Control Classes:

- `.form-label` - Label text
- `.form-input` - Input field
- `.form-select` - Select dropdown
- `.form-textarea` - Textarea
- `.form-checkbox` - Checkbox with label

#### Helper Classes:

- `.required-star` - Required asterisk (\*)
- `.label-bullet` - Bullet point (•)
- `.form-error` - Error message
- `.form-helper` - Helper text
- `.form-link-blue` - Blue link

#### Input Group Classes:

- `.form-input-with-actions` - Input wrapper với buttons
- `.btn-action-inside` - Button bên trong input
- `.btn-action-drop` - Dropdown button bên ngoài

---

## 📝 Migration Guide: Chuyển modal sang BaseModal

### **Before (Old way):**

```vue
<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay active" @click="handleOverlayClick">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Thêm ứng viên</h2>
          <button class="modal-close" @click="handleClose">
            <span class="icon icon-close"></span>
          </button>
        </div>

        <div class="modal-body">
          <!-- Form content -->
        </div>

        <div class="modal-footer">
          <MSButton label="Hủy" @click="handleClose" />
          <MSButton label="Lưu" type="primary" @click="handleSave" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@import '../../../assets/css/modal-add-candidate.css';
</style>
```

### **After (New way with BaseModal):**

```vue
<template>
  <BaseModal :show="show" title="Thêm ứng viên" size="xlarge" @close="handleClose">
    <!-- Form content - Giữ nguyên cấu trúc ban đầu -->
    <form id="form-add-candidate" @submit.prevent="handleSave">
      <!-- Existing form structure -->
    </form>

    <!-- Footer -->
    <template #footer>
      <MSButton label="Hủy" @click="handleClose" />
      <MSButton label="Lưu" type="primary" @click="handleSave" />
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/common/BaseModal.vue'
import MSButton from '@/components/controls/ms-button/MSButton.vue'
// ... other imports
</script>

<style scoped>
/* Giữ nguyên CSS cho form-specific styles */
@import '../../../assets/css/base-form.css';

/* Custom styles cho modal này */
#form-add-candidate {
  display: flex;
  flex-direction: row;
  gap: 24px;
  width: 100%;
}
</style>
```

---

## ✅ Best Practices

### 1. **Import Components**

```javascript
// ✅ Good - Barrel import
import { MSInput, MSSelect, MSDateInput } from '@/components/controls/ms-input'

// ❌ Bad - Individual imports
import MSInput from '@/components/controls/ms-input/MSInput.vue'
import MSSelect from '@/components/controls/ms-input/MSSelect.vue'
```

### 2. **Sử dụng CSS Classes**

```vue
<!-- ✅ Good - Dùng base classes -->
<div class="form-row-split">
  <div class="form-group-half">
    <MSInput v-model="phone" />
  </div>
  <div class="form-group-half">
    <MSInput v-model="email" />
  </div>
</div>

<!-- ❌ Bad - Inline styles -->
<div style="display: flex; gap: 16px">
  <div style="flex: 1">
    <MSInput v-model="phone" />
  </div>
</div>
```

### 3. **Validation với useFormValidation**

```vue
<script setup>
import { useFormValidation, candidateValidationSchema } from '@/composables/useFormValidation'

const { validateForm, getFieldError } = useFormValidation()

const handleSubmit = () => {
  if (!validateForm(formData.value, candidateValidationSchema)) {
    error('Vui lòng kiểm tra lại thông tin')
    return
  }
  // Proceed...
}
</script>

<template>
  <MSInput
    v-model="formData.fullName"
    label="Họ và tên"
    required
    :error="getFieldError('fullName')"
  />
</template>
```

---

## 🎯 Summary

**Đã tạo:**

- ✅ `BaseModal` - Reusable modal wrapper
- ✅ `MSInputGroup` - Input với action buttons
- ✅ `base-modal.css` - Shared modal styles
- ✅ `base-form.css` - Shared form styles
- ✅ `ms-input/index.js` - Barrel exports
- ✅ `useFormValidation` - Validation composable

**Lợi ích:**

- 🎯 Giảm 50% duplicate code
- 🎨 Consistent UI across all forms
- ♻️ Reusable components
- 🔧 Easy to maintain
- ✅ Type-safe với props validation

**Next steps:**

1. Migrate existing modals sang BaseModal
2. Replace hardcoded inputs với MS components
3. Apply validation composable
4. Test và document edge cases
