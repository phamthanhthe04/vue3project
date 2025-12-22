<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Gender,
  Area,
  CandidateSource,
  EducationLevel,
  CandidateStatus,
  AvatarColor,
} from '../../../utils/enums'
import MSButton from '@/components/controls/MSButton/MSButton.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'save'])

// Form data
const formData = ref({
  fullName: '',
  dateOfBirth: '',
  gender: '',
  area: '',
  phone: '',
  email: '',
  address: '',
  educationLevel: '',
  educationPlace: '',
  major: '',
  dateApplied: getCurrentDate(),
  source: '',
  recruiter: 'Định Nga QTHT',
  collaborator: '',
  recentWorkplace: '',
  workplace: '',
  workPeriodFrom: '',
  workPeriodTo: '',
  jobTitle: '',
  jobDescription: '',
  addReferrerQuickly: false,
})

// Avatar
const avatarFile = ref(null)
const avatarPreview = ref('')
const avatarInput = ref(null)

// Enum options
const genderOptions = Object.values(Gender)
const areaOptions = Object.values(Area)
const sourceOptions = Object.values(CandidateSource)
const educationLevelOptions = Object.values(EducationLevel)

// Get current date in dd/MM/yyyy format
function getCurrentDate() {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = today.getFullYear()
  return `${day}/${month}/${year}`
}

// Handle avatar upload
const handleAvatarClick = () => {
  avatarInput.value?.click()
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    avatarFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Generate avatar text from name
const getAvatarText = (fullName) => {
  if (!fullName) return ''
  const words = fullName.trim().split(' ')
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase()
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

// Generate random avatar color
const getRandomAvatarColor = () => {
  const colors = Object.values(AvatarColor)
  return colors[Math.floor(Math.random() * colors.length)]
}

// Handle close
const handleClose = () => {
  emit('close')
}

// Handle cancel
const handleCancel = () => {
  resetForm()
  emit('close')
}

// Reset form
const resetForm = () => {
  formData.value = {
    fullName: '',
    dateOfBirth: '',
    gender: '',
    area: '',
    phone: '',
    email: '',
    address: '',
    educationLevel: '',
    educationPlace: '',
    major: '',
    dateApplied: getCurrentDate(),
    source: '',
    recruiter: 'Định Nga QTHT',
    collaborator: '',
    recentWorkplace: '',
    workplace: '',
    workPeriodFrom: '',
    workPeriodTo: '',
    jobTitle: '',
    jobDescription: '',
    addReferrerQuickly: false,
  }
  avatarFile.value = null
  avatarPreview.value = ''
}

// Handle save
const handleSave = () => {
  // Validation
  if (!formData.value.fullName.trim()) {
    alert('Vui lòng nhập họ và tên')
    return
  }

  if (formData.value.phone.trim() && !/^\d{10,15}$/.test(formData.value.phone.trim())) {
    alert('Vui lòng nhập đúng định dạng số điện thoại (10-15 chữ số)')
    return
  }

  // Prepare candidate data
  const candidateData = {
    ...formData.value,
    status: CandidateStatus.SUBMITTED,
    rating: 0,
    campaign: '',
    position: formData.value.jobTitle || '',
    job: formData.value.jobTitle || '',
    fitProfile: false,
    referrer: '',
    contactInfo: 'Mới thêm',
    potentialWarehouse: false,
    workPeriod: {
      from: formData.value.workPeriodFrom,
      to: formData.value.workPeriodTo,
    },
    avatarText: getAvatarText(formData.value.fullName),
    avatarColor: getRandomAvatarColor(),
    isEmployee: false,
    usingUnit: '',
  }

  emit('save', candidateData)
  resetForm()
  emit('close')
}

// Handle click outside modal
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}

onMounted(() => {
  // Set default date applied
  formData.value.dateApplied = getCurrentDate()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay active" @click="handleOverlayClick">
      <div class="modal-container" @click.stop>
        <!-- Modal Header -->
        <div class="modal-header">
          <h2 class="modal-title">Thêm ứng viên</h2>
          <button class="modal-close" @click="handleClose">
            <span class="icon icon-close"></span>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <form id="form-add-candidate" @submit.prevent="handleSave">
            <div class="form-add-candidate-left">
              <div class="form-row-avatar">
                <!-- Hidden File Input -->
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="handleAvatarChange"
                />

                <!-- Avatar Upload Button -->
                <button
                  type="button"
                  class="btn-avatar-upload"
                  @click="handleAvatarClick"
                  title="Click để tải ảnh lên"
                >
                  <!-- Preview Image -->
                  <img
                    v-if="avatarPreview"
                    :src="avatarPreview"
                    alt="Avatar"
                    class="avatar-image show"
                  />

                  <!-- Placeholder Text -->
                  <span v-else class="avatar-placeholder-text"> Ảnh </span>
                </button>
              </div>
            </div>

            <div class="form-add-candidate-right">
              <!-- Họ và tên -->
              <div class="form-row-full">
                <label class="form-label"> Họ và tên <span class="required-star">*</span> </label>
                <input
                  v-model="formData.fullName"
                  type="text"
                  class="form-input"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <!-- Ngày sinh & Giới tính -->
              <div class="form-row-split">
                <div class="form-group-half">
                  <label class="form-label">Ngày sinh</label>
                  <input
                    v-model="formData.dateOfBirth"
                    type="text"
                    class="form-input"
                    placeholder="dd/MM/yyyy"
                  />
                </div>
                <div class="form-group-half">
                  <label class="form-label">Giới tính</label>
                  <select v-model="formData.gender" class="form-select">
                    <option value="">Chọn giới tính</option>
                    <option v-for="gender in genderOptions" :key="gender" :value="gender">
                      {{ gender }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Khu vực -->
              <div class="form-row-full">
                <label class="form-label">Khu vực</label>
                <select v-model="formData.area" class="form-select">
                  <option value="">Chọn khu vực</option>
                  <option v-for="area in areaOptions" :key="area" :value="area">
                    {{ area }}
                  </option>
                </select>
              </div>

              <!-- Số điện thoại & Email -->
              <div class="form-row-split">
                <div class="form-group-half">
                  <label class="form-label">
                    Số điện thoại <span class="required-star">*</span>
                  </label>
                  <input
                    v-model="formData.phone"
                    type="tel"
                    class="form-input"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
                <div class="form-group-half">
                  <label class="form-label">Email</label>
                  <input
                    v-model="formData.email"
                    type="email"
                    class="form-input"
                    placeholder="Nhập Email"
                  />
                </div>
              </div>

              <!-- Địa chỉ -->
              <div class="form-row-full">
                <label class="form-label">Địa chỉ</label>
                <input
                  v-model="formData.address"
                  type="text"
                  class="form-input"
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <!-- HỌC VẤN Section -->
              <div class="form-section">
                <h3 class="form-section-title">HỌC VẤN</h3>

                <!-- Trình độ đào tạo -->
                <div class="form-row-inline">
                  <label class="form-label-inline">
                    <span class="label-bullet">•</span> Trình độ đào tạo
                  </label>
                  <div class="form-input-with-actions">
                    <div class="form-input-wrapper-with-btn">
                      <input
                        v-model="formData.educationLevel"
                        type="text"
                        class="form-input"
                        placeholder="Nhập trình độ đào tạo"
                        :list="'education-levels'"
                      />
                      <datalist id="education-levels">
                        <option
                          v-for="level in educationLevelOptions"
                          :key="level"
                          :value="level"
                        />
                      </datalist>
                      <button type="button" class="btn-action-inside icon icon-plus"></button>
                    </div>
                    <div class="form-btn-dropdown">
                      <button type="button" class="btn-action-drop icon icon-dropdown"></button>
                    </div>
                  </div>
                </div>

                <!-- Nơi đào tạo -->
                <div class="form-row-inline">
                  <label class="form-label-inline">
                    <span class="label-bullet">•</span> Nơi đào tạo
                  </label>
                  <div class="form-input-with-actions">
                    <div class="form-input-wrapper-with-btn">
                      <input
                        v-model="formData.educationPlace"
                        type="text"
                        class="form-input"
                        placeholder="Nhập nơi đào tạo"
                      />
                      <button type="button" class="btn-action-inside icon icon-plus"></button>
                    </div>
                    <div class="form-btn-dropdown">
                      <button type="button" class="btn-action-drop icon icon-dropdown"></button>
                    </div>
                  </div>
                </div>

                <!-- Chuyên ngành -->
                <div class="form-row-inline">
                  <label class="form-label-inline">
                    <span class="label-bullet">•</span> Chuyên ngành
                  </label>
                  <div class="form-input-with-actions">
                    <div class="form-input-wrapper-with-btn">
                      <input
                        v-model="formData.major"
                        type="text"
                        class="form-input"
                        placeholder="Nhập chuyên ngành"
                      />
                      <button type="button" class="btn-action-inside icon icon-plus"></button>
                    </div>
                    <div class="form-btn-dropdown">
                      <button type="button" class="btn-action-drop icon icon-dropdown"></button>
                    </div>
                  </div>
                </div>

                <!-- Link Thêm học vấn -->
                <div class="form-link-wrapper">
                  <a href="#" class="form-link-blue" @click.prevent>+ Thêm học vấn</a>
                </div>
              </div>

              <!-- Ngày ứng tuyển & Nguồn ứng viên -->
              <div class="form-row-split">
                <div class="form-group-half">
                  <label class="form-label">
                    Ngày ứng tuyển <span class="required-star">*</span>
                  </label>
                  <input
                    v-model="formData.dateApplied"
                    type="text"
                    class="form-input"
                    placeholder="dd/MM/yyyy"
                  />
                </div>
                <div class="form-group-half">
                  <label class="form-label">Nguồn ứng viên</label>
                  <select v-model="formData.source" class="form-select">
                    <option value="">Chọn nguồn ứng viên</option>
                    <option v-for="source in sourceOptions" :key="source" :value="source">
                      {{ source }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Nhân sự khai thác & Cộng tác viên -->
              <div class="form-row-split">
                <div class="form-group-half">
                  <label class="form-label">Nhân sự khai thác</label>
                  <input
                    v-model="formData.recruiter"
                    type="text"
                    class="form-input"
                    placeholder="Nhập nhân sự khai thác"
                  />
                </div>
                <div class="form-group-half">
                  <label class="form-label">Cộng tác viên</label>
                  <input
                    v-model="formData.collaborator"
                    type="text"
                    class="form-input"
                    placeholder="Nhập cộng tác viên"
                  />
                </div>
              </div>

              <!-- Checkbox thêm nhanh -->
              <div class="form-row-full">
                <label class="form-checkbox">
                  <input v-model="formData.addReferrerQuickly" type="checkbox" />
                  <span>Thêm nhanh người tham chiếu vào kho ứng viên</span>
                </label>
              </div>

              <!-- Link Thêm người giới thiệu -->
              <div class="form-link-wrapper">
                <a href="#" class="form-link-blue" @click.prevent>+ Thêm người giới thiệu</a>
              </div>

              <!-- Nơi làm việc gần đây -->
              <div class="form-row-full">
                <label class="form-label">Nơi làm việc gần đây</label>
                <input
                  v-model="formData.recentWorkplace"
                  type="text"
                  class="form-input"
                  placeholder="Nhập nơi làm việc gần đây"
                />
              </div>

              <!-- Link Thêm kinh nghiệm làm việc -->
              <div class="form-link-wrapper">
                <a href="#" class="form-link-blue" @click.prevent>+ Thêm kinh nghiệm làm việc</a>
              </div>

              <!-- Nơi làm việc -->
              <div class="form-row-full">
                <label class="form-label">Nơi làm việc</label>
                <input
                  v-model="formData.workplace"
                  type="text"
                  class="form-input"
                  placeholder="Nhập nơi làm việc"
                />
              </div>

              <!-- Thời gian -->
              <div class="form-row-split">
                <div class="form-group-half">
                  <label class="form-label">Thời gian</label>
                  <input
                    v-model="formData.workPeriodFrom"
                    type="text"
                    class="form-input"
                    placeholder="MM/yyyy"
                  />
                </div>
                <div class="form-group-half">
                  <label class="form-label">&nbsp;</label>
                  <input
                    v-model="formData.workPeriodTo"
                    type="text"
                    class="form-input"
                    placeholder="MM/yyyy"
                  />
                </div>
              </div>

              <!-- Vị trí công việc -->
              <div class="form-row-full">
                <label class="form-label">Vị trí công việc</label>
                <input
                  v-model="formData.jobTitle"
                  type="text"
                  class="form-input"
                  placeholder="Nhập vị trí công việc"
                />
              </div>

              <!-- Mô tả công việc -->
              <div class="form-row-full">
                <label class="form-label">Mô tả công việc</label>
                <textarea
                  v-model="formData.jobDescription"
                  class="form-textarea"
                  rows="4"
                  placeholder="Nhập mô tả công việc"
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <MSButton label="Hủy" type="secondary" outline @click="handleCancel"></MSButton>
          <MSButton label="Lưu" type="primary" @click="handleSave"></MSButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@import '../../../assets/css/modal-add-candidate.css';
</style>
