# 📊 PHÂN TÍCH VÀ TỐI ƯU MODAL COMPONENTS

**Ngày đánh giá:** 22/12/2025  
**Files:** AddCandidateModal.vue, EditCandidateModal.vue, modal-add-candidate.css

---

## 🔴 VẤN ĐỀ NGHIÊM TRỌNG

### 1. **Code Duplication - 90% giống nhau**

**AddCandidateModal.vue:** 549 lines  
**EditCandidateModal.vue:** 778 lines

**Vấn đề:**

- 90% template giống hệt nhau
- Cùng form fields, validation, avatar upload logic
- Chỉ khác: watch props (Edit) vs không (Add)
- Vi phạm DRY principle nghiêm trọng

**Impact:** 🔥🔥🔥 Rất cao

- Khó maintain: sửa 1 chỗ phải sửa 2 files
- Bug prone: dễ quên update cả 2
- Code bloat: 1327 lines thay vì ~600 lines

---

### 2. **CSS Import Pattern - Không tối ưu**

**Hiện tại:**

```vue
<!-- AddCandidateModal.vue -->
<style scoped>
@import '../../../assets/css/modal-add-candidate.css';
</style>

<!-- EditCandidateModal.vue -->
<style scoped>
@import '../../../assets/css/modal-add-candidate.css';
/* + 150 lines inline styles */
</style>
```

**Vấn đề:**

- Cùng import 1 file CSS → duplicate loading
- EditCandidateModal có thêm 150 lines inline styles
- Không consistent
- CSS file 628 lines quá lớn

**Impact:** 🔥🔥 Cao

- Performance: CSS được load 2 lần
- Maintainability: khó track styles ở đâu

---

### 3. **Hardcoded Values & Magic Numbers**

```javascript
// AddCandidateModal.vue
recruiter: 'Định Nga QTHT'  // ❌ Hardcoded

// Validation
if (!/^\d{10,15}$/.test(...)) // ❌ Magic numbers
```

**Impact:** 🔥 Trung bình

---

### 4. **Alert/Confirm - Poor UX**

```javascript
alert('Vui lòng nhập họ và tên')
alert('Vui lòng nhập đúng định dạng số điện thoại')
```

**Impact:** 🔥 Trung bình - UX xấu

---

### 5. **Missing Features**

- Không có loading state
- Không có form dirty checking
- Không có unsaved changes warning
- Validation không real-time

---

## ✅ GIẢI PHÁP ĐỀ XUẤT

### **Option 1: Refactor thành 1 Base Component (KHUYẾN NGHỊ)**

#### Cấu trúc mới:

```
components/
  └── candidates/
      └── modals/
          ├── BaseCandidateModal.vue (Base component)
          ├── AddCandidateModal.vue (Wrapper nhẹ)
          └── EditCandidateModal.vue (Wrapper nhẹ)
```

#### BaseCandidateModal.vue (~400 lines)

```vue
<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: Boolean,
  mode: {
    type: String,
    default: 'add',
    validator: (v) => ['add', 'edit'].includes(v),
  },
  candidate: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'save'])

// Shared logic cho cả Add và Edit
// - Form data management
// - Avatar upload
// - Validation
// - Save/Cancel handlers
</script>

<template>
  <!-- Shared template -->
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h2>{{ mode === 'add' ? 'Thêm ứng viên' : 'Chỉnh sửa ứng viên' }}</h2>
      </div>
      <!-- Form fields -->
    </div>
  </div>
</template>
```

#### AddCandidateModal.vue (~50 lines)

```vue
<script setup>
import BaseCandidateModal from './BaseCandidateModal.vue'

const props = defineProps({
  show: Boolean,
})

const emit = defineEmits(['close', 'save'])
</script>

<template>
  <BaseCandidateModal :show="show" mode="add" @close="emit('close')" @save="emit('save', $event)" />
</template>
```

#### EditCandidateModal.vue (~50 lines)

```vue
<script setup>
import BaseCandidateModal from './BaseCandidateModal.vue'

const props = defineProps({
  show: Boolean,
  candidate: Object,
})

const emit = defineEmits(['close', 'save'])
</script>

<template>
  <BaseCandidateModal
    :show="show"
    mode="edit"
    :candidate="candidate"
    @close="emit('close')"
    @save="emit('save', $event)"
  />
</template>
```

**Lợi ích:**

- ✅ Giảm từ 1327 → 500 lines (giảm 62%)
- ✅ DRY - sửa 1 chỗ, áp dụng cho cả Add/Edit
- ✅ Dễ maintain
- ✅ Dễ test
- ✅ Giữ được API hiện tại (không break existing code)

---

### **Option 2: CSS Optimization**

#### Tách CSS thành modules:

```
assets/css/
  └── modals/
      ├── base-modal.css (Shared modal styles)
      ├── form-elements.css (Form inputs, labels)
      └── candidate-modal.css (Specific styles)
```

#### base-modal.css (~150 lines)

```css
/* Modal overlay, container, header, footer */
.modal-overlay {
}
.modal-container {
}
.modal-header {
}
.modal-footer {
}
```

#### form-elements.css (~200 lines)

```css
/* Form inputs, labels, groups */
.form-input {
}
.form-select {
}
.form-label {
}
.form-row {
}
```

#### candidate-modal.css (~150 lines)

```css
/* Candidate-specific styles */
.form-add-candidate-left {
}
.btn-avatar-upload {
}
```

**Import trong component:**

```vue
<style scoped>
@import '../../../assets/css/modals/base-modal.css';
@import '../../../assets/css/modals/form-elements.css';
@import '../../../assets/css/modals/candidate-modal.css';
</style>
```

**Hoặc dùng CSS global:**

```javascript
// main.js
import './assets/css/modals/base-modal.css'
import './assets/css/modals/form-elements.css'
```

**Lợi ích:**

- ✅ Modular và reusable
- ✅ Không duplicate CSS
- ✅ Dễ maintain
- ✅ Better caching

---

### **Option 3: Form Validation Composable**

#### composables/useFormValidation.js

```javascript
export function useFormValidation() {
  const errors = ref({})

  const rules = {
    fullName: {
      required: true,
      message: 'Vui lòng nhập họ và tên',
    },
    phone: {
      required: true,
      pattern: /^\d{10,15}$/,
      message: 'Số điện thoại từ 10-15 chữ số',
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Email không đúng định dạng',
    },
  }

  const validate = (formData) => {
    errors.value = {}
    let isValid = true

    for (const [field, rule] of Object.entries(rules)) {
      const value = formData[field]

      if (rule.required && !value?.trim()) {
        errors.value[field] = rule.message
        isValid = false
      }

      if (rule.pattern && value && !rule.pattern.test(value)) {
        errors.value[field] = rule.message
        isValid = false
      }
    }

    return isValid
  }

  const validateField = (field, value) => {
    // Real-time validation
  }

  return {
    errors,
    validate,
    validateField,
  }
}
```

**Lợi ích:**

- ✅ Reusable validation logic
- ✅ Real-time validation
- ✅ Consistent error messages
- ✅ Easy to extend

---

### **Option 4: Replace Alert với Toast Notification**

#### Create ToastNotification.vue

```vue
<script setup>
import { ref } from 'vue'

const toasts = ref([])

const show = (message, type = 'info') => {
  const id = Date.now()
  toasts.value.push({ id, message, type })

  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, 3000)
}

defineExpose({ show })
</script>

<template>
  <div class="toast-container">
    <div v-for="toast in toasts" :key="toast.id" class="toast" :class="`toast-${toast.type}`">
      {{ toast.message }}
    </div>
  </div>
</template>
```

#### composables/useToast.js

```javascript
import { ref } from 'vue'

const toastInstance = ref(null)

export function useToast() {
  const setInstance = (instance) => {
    toastInstance.value = instance
  }

  const success = (message) => {
    toastInstance.value?.show(message, 'success')
  }

  const error = (message) => {
    toastInstance.value?.show(message, 'error')
  }

  const warning = (message) => {
    toastInstance.value?.show(message, 'warning')
  }

  return {
    setInstance,
    success,
    error,
    warning,
  }
}
```

**Sử dụng:**

```javascript
import { useToast } from '@/composables/useToast'

const { success, error } = useToast()

const handleSave = () => {
  if (!validate()) {
    error('Vui lòng kiểm tra lại thông tin')
    return
  }

  success('Thêm ứng viên thành công!')
}
```

---

## 📋 KẾ HOẠCH REFACTORING

### Phase 1: CSS Optimization (1-2 days)

- [ ] Tách modal-add-candidate.css thành modules
- [ ] Import CSS global trong main.js
- [ ] Remove duplicate imports
- [ ] Test rendering

### Phase 2: Create Base Component (2-3 days)

- [ ] Tạo BaseCandidateModal.vue
- [ ] Move shared logic vào base
- [ ] Convert Add/Edit thành wrappers
- [ ] Test Add flow
- [ ] Test Edit flow
- [ ] Fix bugs if any

### Phase 3: Validation Enhancement (1 day)

- [ ] Tạo useFormValidation composable
- [ ] Integrate vào BaseCandidateModal
- [ ] Add real-time validation
- [ ] Add error messages UI

### Phase 4: UX Improvements (1-2 days)

- [ ] Tạo Toast component
- [ ] Replace alerts
- [ ] Add loading states
- [ ] Add unsaved changes warning
- [ ] Add form dirty checking

### Phase 5: Testing & Polish (1 day)

- [ ] Test all flows
- [ ] Fix edge cases
- [ ] Update documentation
- [ ] Code review

**Total time: 6-9 days**

---

## 📊 SO SÁNH

### Trước refactor:

- **AddCandidateModal:** 549 lines
- **EditCandidateModal:** 778 lines
- **CSS:** 628 lines (import 2 lần)
- **Total:** 1955 lines
- **Duplication:** ~90%

### Sau refactor:

- **BaseCandidateModal:** 400 lines
- **AddCandidateModal:** 50 lines
- **EditCandidateModal:** 50 lines
- **CSS modules:** 500 lines (shared)
- **Composables:** 100 lines
- **Toast:** 80 lines
- **Total:** 1180 lines
- **Giảm:** 40% code
- **Duplication:** 0%

---

## 🎯 KHUYẾN NGHỊ

### ✅ NÊN LÀM NGAY:

1. **Phase 1 - CSS Optimization** (Low risk, high value)
2. **Phase 4 - Toast Notification** (Better UX, independent)

### ✅ NÊN LÀM SAU:

3. **Phase 2 - Base Component** (High value nhưng requires testing)
4. **Phase 3 - Validation** (Enhancement)

### ⚠️ CÂN NHẮC:

- Refactor khi có đủ test coverage
- Có backup code trước khi refactor
- Refactor từng phase, test kỹ
- Không rush, chất lượng quan trọng hơn tốc độ

---

## 💡 ALTERNATIVE: Quick Wins

Nếu không có time refactor lớn, làm quick wins:

### Quick Win 1: Extract Common Functions (30 mins)

```javascript
// utils/modalHelpers.js
export const validateCandidateForm = (formData) => {}
export const formatCandidateData = (formData) => {}
export const handleAvatarUpload = (file) => {}
```

### Quick Win 2: CSS Variables (1 hour)

```css
:root {
  --modal-padding: 24px;
  --modal-border-radius: 6px;
  --input-height: 32px;
}
```

### Quick Win 3: MSButton Integration (2 hours)

Replace các button cũ bằng MSButton đã có

### Quick Win 4: Constants File (30 mins)

```javascript
// constants/forms.js
export const PHONE_REGEX = /^\d{10,15}$/
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const DEFAULT_RECRUITER = 'Định Nga QTHT'
```

---

**Kết luận:** CÓ NÊN tối ưu và NÊN làm theo từng phase!
