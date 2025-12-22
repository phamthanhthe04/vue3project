<script setup>
import { ref, watch, computed } from 'vue'
import {
  Gender,
  Area,
  CandidateSource,
  EducationLevel,
  CandidateStatus,
} from '../../../utils/enums'
import MSButton from '@/components/controls/MSButton/MSButton.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  candidate: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'save'])

// Form data
const formData = ref({
  id: null,
  fullName: '',
  dateOfBirth: '',
  gender: '',
  area: '',
  phone: '',
  email: '',
  address: '',
  skype: '',
  facebook: '',
  zalo: '',
  linkedinOther: '',
  educationLevel: '',
  educationPlace: '',
  major: '',
  dateApplied: '',
  source: '',
  recruiter: '',
  collaborator: '',
  recentWorkplace: '',
  workplace: '',
  workPeriodFrom: '',
  workPeriodTo: '',
  jobTitle: '',
  jobDescription: '',
  status: '',
  rating: 0,
})

// Avatar
const avatarFile = ref(null)
const avatarPreview = ref('')
const avatarInput = ref(null)
const avatarText = ref('')
const avatarColor = ref('')

// Enum options
const genderOptions = Object.values(Gender)
const areaOptions = Object.values(Area)
const sourceOptions = Object.values(CandidateSource)
const educationLevelOptions = Object.values(EducationLevel)
const statusOptions = Object.values(CandidateStatus)

// Watch candidate prop to populate form
watch(
  () => props.candidate,
  (newCandidate) => {
    if (newCandidate) {
      formData.value = {
        id: newCandidate.id,
        fullName: newCandidate.fullName || '',
        dateOfBirth: convertToDateInput(newCandidate.dateOfBirth) || '',
        gender: newCandidate.gender || '',
        area: newCandidate.area || '',
        phone: newCandidate.phone || '',
        email: newCandidate.email || '',
        address: newCandidate.address || '',
        skype: newCandidate.skype || '',
        facebook: newCandidate.facebook || '',
        zalo: newCandidate.zalo || '',
        linkedinOther: newCandidate.linkedinOther || '',
        educationLevel: newCandidate.educationLevel || '',
        educationPlace: newCandidate.educationPlace || '',
        major: newCandidate.major || '',
        dateApplied: convertToDateInput(newCandidate.dateApplied) || '',
        source: newCandidate.source || '',
        recruiter: newCandidate.recruiter || '',
        collaborator: newCandidate.collaborator || '',
        recentWorkplace: newCandidate.recentWorkplace || '',
        workplace: newCandidate.workplace || '',
        workPeriodFrom: newCandidate.workPeriod?.from || '',
        workPeriodTo: newCandidate.workPeriod?.to || '',
        jobTitle: newCandidate.jobTitle || '',
        jobDescription: newCandidate.jobDescription || '',
        status: newCandidate.status || '',
        rating: newCandidate.rating || 0,
      }

      // Set avatar if exists
      avatarText.value = newCandidate.avatarText || ''
      avatarColor.value = newCandidate.avatarColor || 'blue'
      if (newCandidate.avatar) {
        avatarPreview.value = newCandidate.avatar
      } else {
        avatarPreview.value = ''
      }
    }
  },
  { immediate: true },
)

// Convert dd/MM/yyyy to yyyy-MM-dd for input type="date"
function convertToDateInput(dateStr) {
  if (!dateStr) return ''
  const parts = dateStr.split('/')
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`
  }
  return dateStr
}

// Convert yyyy-MM-dd to dd/MM/yyyy
function convertToDisplayDate(dateStr) {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }
  return dateStr
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

// Handle close
const handleClose = () => {
  emit('close')
}

// Handle cancel
const handleCancel = () => {
  emit('close')
}

// Handle save
const handleSave = () => {
  // Validation
  if (!formData.value.fullName.trim()) {
    alert('Vui lòng nhập họ và tên')
    return
  }

  if (formData.value.phone.trim() && !/^\d{10,15}$/.test(formData.value.phone.trim())) {
    alert('Vui lòng nhập đúng định đạng số điện thoại (10-15 chữ số)')
    return
  }

  // Prepare updated candidate data
  const updatedCandidate = {
    ...props.candidate,
    ...formData.value,
    dateOfBirth: convertToDisplayDate(formData.value.dateOfBirth),
    dateApplied: convertToDisplayDate(formData.value.dateApplied),
    workPeriod: {
      from: formData.value.workPeriodFrom,
      to: formData.value.workPeriodTo,
    },
    avatar: avatarPreview.value || props.candidate?.avatar,
  }

  emit('save', updatedCandidate)
}

// Handle click outside modal
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}

// Avatar display
const hasImageAvatar = computed(() => {
  return !!avatarPreview.value
})

const hasTextAvatar = computed(() => {
  return !avatarPreview.value && !!avatarText.value
})

const showUploadPlaceholder = computed(() => {
  return !avatarPreview.value && !avatarText.value
})
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay active" @click="handleOverlayClick">
      <div class="modal-container" @click.stop>
        <!-- Modal Header -->
        <div class="modal-header">
          <h2 class="modal-title">Chỉnh sửa thông tin ứng viên</h2>
          <button class="modal-close" @click="handleClose">
            <span class="icon icon-close"></span>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <form id="form-edit-candidate" @submit.prevent="handleSave">
            <!-- THÔNG TIN CƠ BẢN -->
            <div class="form-section-edit">
              <div class="form-edit-infobase">
                <!-- Avatar bên trái -->
                <div class="form-edit-left">
                  <div class="form-row-avatar">
                    <input
                      ref="avatarInput"
                      type="file"
                      accept="image/*"
                      style="display: none"
                      @change="handleAvatarChange"
                    />
                    <button
                      type="button"
                      class="btn-avatar-upload"
                      :class="{ [`avatar-color-${avatarColor}`]: hasTextAvatar }"
                      @click="handleAvatarClick"
                      title="Click để tải ảnh lên"
                    >
                      <!-- Image Avatar -->
                      <img
                        v-if="hasImageAvatar"
                        :src="avatarPreview"
                        alt="Avatar"
                        class="avatar-image show"
                      />
                      <!-- Text Avatar -->
                      <span v-else-if="hasTextAvatar" class="avatar-text-display">
                        {{ avatarText }}
                      </span>
                      <!-- Upload Placeholder -->
                      <span v-else class="avatar-placeholder-text"> Tải ảnh lên </span>
                    </button>
                  </div>
                </div>

                <!-- Form fields bên phải -->
                <div class="form-edit-right">
                  <!-- Họ và tên -->
                  <div class="form-row-vertical">
                    <label class="form-label">
                      Họ và tên <span class="required-star">*</span>
                    </label>
                    <input
                      v-model="formData.fullName"
                      type="text"
                      class="form-input"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>

                  <!-- Ngày sinh & Giới tính -->
                  <div class="form-row-split-edit">
                    <div class="form-group-half-edit">
                      <label class="form-label">Ngày sinh</label>
                      <input v-model="formData.dateOfBirth" type="date" class="form-input" />
                    </div>
                    <div class="form-group-half-edit">
                      <label class="form-label">Giới tính</label>
                      <select v-model="formData.gender" class="form-select">
                        <option value="">Chọn giới tính</option>
                        <option v-for="gender in genderOptions" :key="gender" :value="gender">
                          {{ gender }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Nguồn ứng viên & Ngày ứng tuyển -->
                  <div class="form-row-split-edit">
                    <div class="form-group-half-edit">
                      <label class="form-label">Nguồn ứng viên</label>
                      <select v-model="formData.source" class="form-select">
                        <option value="">Chọn nguồn ứng viên</option>
                        <option v-for="source in sourceOptions" :key="source" :value="source">
                          {{ source }}
                        </option>
                      </select>
                    </div>
                    <div class="form-group-half-edit">
                      <label class="form-label">
                        Ngày ứng tuyển <span class="required-star">*</span>
                      </label>
                      <input
                        v-model="formData.dateApplied"
                        type="date"
                        class="form-input"
                        required
                      />
                    </div>
                  </div>

                  <!-- Khu vực -->
                  <div class="form-row-vertical">
                    <label class="form-label">Khu vực</label>
                    <select v-model="formData.area" class="form-select">
                      <option value="">Chọn khu vực</option>
                      <option v-for="area in areaOptions" :key="area" :value="area">
                        {{ area }}
                      </option>
                    </select>
                  </div>

                  <!-- Nhân sự khai thác -->
                  <div class="form-row-vertical">
                    <label class="form-label">Nhân sự khai thác</label>
                    <input
                      v-model="formData.recruiter"
                      type="text"
                      class="form-input"
                      placeholder="Nhập nhân sự khai thác"
                    />
                  </div>

                  <!-- Cộng tác viên -->
                  <div class="form-row-vertical">
                    <label class="form-label">Cộng tác viên</label>
                    <input
                      v-model="formData.collaborator"
                      type="text"
                      class="form-input"
                      placeholder="Nhập cộng tác viên"
                    />
                  </div>

                  <a href="#" class="form-link-action" @click.prevent>+ Thêm người giới thiệu</a>
                </div>
              </div>
            </div>

            <!-- THÔNG TIN LIÊN HỆ -->
            <div class="form-section-edit">
              <h3 class="form-section-title-edit">THÔNG TIN LIÊN HỆ</h3>

              <!-- Số điện thoại -->
              <div class="form-row-horizontal">
                <div class="form-row-label-left">
                  <div class="icon icon-edit-candidate icon-phone-number"></div>
                  <label class="form-label-horizontal">Số điện thoại</label>
                </div>
                <input
                  v-model="formData.phone"
                  type="tel"
                  class="form-input"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <!-- Email -->
              <div class="form-row-horizontal">
                <div class="form-row-label-left">
                  <div class="icon icon-edit-candidate icon-email"></div>
                  <label class="form-label-horizontal">Email</label>
                </div>
                <input
                  v-model="formData.email"
                  type="email"
                  class="form-input"
                  placeholder="Nhập email"
                />
              </div>

              <!-- Địa chỉ -->
              <div class="form-row-horizontal">
                <div class="form-row-label-left">
                  <div class="icon icon-edit-candidate icon-address"></div>
                  <label class="form-label-horizontal">Địa chỉ</label>
                </div>
                <input
                  v-model="formData.address"
                  type="text"
                  class="form-input"
                  placeholder="Nhập địa chỉ"
                />
              </div>
              <!-- Skype -->
              <div class="form-row-horizontal">
                <div class="form-row-label-left">
                  <div class="icon icon-edit-candidate icon-skype"></div>
                  <label class="form-label-horizontal">Skype</label>
                </div>
                <input
                  v-model="formData.skype"
                  type="text"
                  class="form-input"
                  placeholder="Nhập Skype"
                />
              </div>
              <!-- Facebook -->
              <div class="form-row-horizontal">
                <div class="form-row-label-left">
                  <div class="icon icon-edit-candidate icon-facebook"></div>
                  <label class="form-label-horizontal">Facebook</label>
                </div>
                <input
                  v-model="formData.facebook"
                  type="text"
                  class="form-input"
                  placeholder="Nhập Facebook"
                />
              </div>
              <!-- Zalo -->
              <div class="form-row-horizontal">
                <div class="form-row-label-left">
                  <div class="icon icon-edit-candidate icon-zalo"></div>
                  <label class="form-label -horizontal">Zalo</label>
                </div>
                <input
                  v-model="formData.zalo"
                  type="text"
                  class="form-input"
                  placeholder="Nhập Zalo"
                />
              </div>
              <!-- LinkedIn/Khác -->
              <div class="form-row-horizontal">
                <div class="form-row-label-left">
                  <div class="icon icon-edit-candidate icon-linkedin-other"></div>
                  <label class="form-label -horizontal">LinkedIn/Khác</label>
                </div>
                <input
                  v-model="formData.linkedinOther"
                  type="text"
                  class="form-input"
                  placeholder="Nhập LinkedIn/Khác"
                />
              </div>
            </div>

            <!-- HỌC VẤN -->
            <div class="form-section-edit">
              <h3 class="form-section-title-edit">HỌC VẤN</h3>

              <!-- Trình độ đào tạo -->
              <div class="form-row-horizontal">
                <div class="form-row-label-left">
                  <div class="icon-circle-edit"></div>
                  <label class="form-label-horizontal-left">Trình độ đào tạo</label>
                </div>
                <input
                  v-model="formData.educationLevel"
                  type="text"
                  class="form-input"
                  placeholder="Nhập trình độ đào tạo"
                  :list="'education-levels-edit'"
                />
                <datalist id="education-levels-edit">
                  <option v-for="level in educationLevelOptions" :key="level" :value="level" />
                </datalist>
              </div>

              <!-- Nơi đào tạo -->
              <div class="form-row-horizontal">
                <div class="form-row-label-left">
                  <div class="icon-circle-edit"></div>
                  <label class="form-label-horizontal-left">Nơi đào tạo</label>
                </div>
                <input
                  v-model="formData.educationPlace"
                  type="text"
                  class="form-input"
                  placeholder="Nhập nơi đào tạo"
                />
              </div>

              <!-- Chuyên ngành -->
              <div class="form-row-horizontal">
                <div class="form-row-label-left">
                  <div class="icon-circle-edit"></div>
                  <label class="form-label-horizontal-left">Chuyên ngành</label>
                </div>
                <input
                  v-model="formData.major"
                  type="text"
                  class="form-input"
                  placeholder="Nhập chuyên ngành"
                />
              </div>
            </div>

            <!-- KINH NGHIỆM LÀM VIỆC -->
            <div class="form-section-edit">
              <h3 class="form-section-title-edit">KINH NGHIỆM LÀM VIỆC</h3>

              <!-- Nơi làm việc gần đây -->
              <div class="form-row-horizontal">
                <div class="form-row-label-left">
                  <div class="icon-circle-edit"></div>
                  <label class="form-label-horizontal-left">Nơi làm việc gần đây</label>
                </div>
                <input
                  v-model="formData.recentWorkplace"
                  type="text"
                  class="form-input"
                  placeholder="Nhập nơi làm việc gần đây"
                />
              </div>

              <!-- Nơi làm việc -->
              <div class="form-row-horizontal">
                <div class="form-row-label-left">
                  <div class="icon-circle-edit"></div>
                  <label class="form-label-horizontal-left">Nơi làm việc</label>
                </div>
                <input
                  v-model="formData.workplace"
                  type="text"
                  class="form-input"
                  placeholder="Nhập nơi làm việc"
                />
              </div>

              <!-- Thời gian -->
              <div class="form-row-horizontal">
                <div class="form-row-label-left">
                  <div class="icon-circle-edit"></div>
                  <label class="form-label-horizontal-left">Thời gian</label>
                </div>
                <div class="form-time-range">
                  <input
                    v-model="formData.workPeriodFrom"
                    type="text"
                    class="form-input"
                    placeholder="MM/yyyy"
                  />
                  <span class="time-separator">-</span>
                  <input
                    v-model="formData.workPeriodTo"
                    type="text"
                    class="form-input"
                    placeholder="MM/yyyy"
                  />
                </div>
              </div>

              <!-- Vị trí công việc -->
              <div class="form-row-horizontal">
                <div class="form-row-label-left">
                  <div class="icon-circle-edit"></div>
                  <label class="form-label-horizontal-left">Vị trí công việc</label>
                </div>
                <input
                  v-model="formData.jobTitle"
                  type="text"
                  class="form-input"
                  placeholder="Nhập vị trí công việc"
                />
              </div>

              <!-- Mô tả công việc -->
              <div class="form-row-horizontal">
                <div class="form-row-label-left">
                  <div class="icon-circle-edit"></div>
                  <label class="form-label-horizontal-left">Mô tả công việc</label>
                </div>
                <textarea
                  v-model="formData.jobDescription"
                  class="form-textarea"
                  rows="4"
                  placeholder="Nhập mô tả công việc"
                ></textarea>
              </div>
            </div>

            <!-- Trường tùy chỉnh -->
            <div class="form-section-edit">
              <h3 class="form-section-title-edit">TRƯỜNG TÙY CHỈNH</h3>
              <a href="#" class="form-link-action" @click.prevent>+ Thêm người giới thiệu</a>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <MSButton type="secondary" label="Hủy" outline @click="handleCancel"></MSButton>
          <MSButton type="primary" label="Lưu" @click="handleSave"></MSButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@import '../../../assets/css/modal-add-candidate.css';

/* Styles riêng cho edit modal */
.form-section-edit {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.form-section-edit:last-child {
  border-bottom: none;
}

.form-section-title-edit {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 16px 0;
  letter-spacing: 0.5px;
}

.form-edit-infobase {
  display: flex;
  gap: 24px;
}

.form-edit-left {
  width: 80px;
  flex-shrink: 0;
}

.form-edit-right {
  flex: 1;
}

.form-row-vertical {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row-split-edit {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group-half-edit {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row-horizontal {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.form-row-label-left {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  min-width: 150px;
}

.form-label-horizontal {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  white-space: nowrap;
}

.form-label-horizontal-left {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  min-width: 150px;
  white-space: nowrap;
}

.form-row-horizontal .form-input,
.form-row-horizontal .form-select,
.form-row-horizontal .form-textarea {
  flex: 1;
}

.form-link-action {
  color: #1890ff;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.3s;
  display: inline-flex;
  align-items: center;
  margin-top: 8px;
}

.form-link-action:hover {
  color: #40a9ff;
}

.form-time-range {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.form-time-range .form-input {
  flex: 1;
}

.time-separator {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

/* Avatar Text Display */
.avatar-text-display {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  text-transform: uppercase;
  user-select: none;
}

.btn-avatar-upload.avatar-color-pink {
  background-color: #f50057;
}

.btn-avatar-upload.avatar-color-blue {
  background-color: #2196f3;
}

.btn-avatar-upload.avatar-color-orange {
  background-color: #ff9800;
}

.btn-avatar-upload.avatar-color-cyan {
  background-color: #00bcd4;
}

.btn-avatar-upload.avatar-color-teal {
  background-color: #009688;
}

.btn-avatar-upload.avatar-color-purple {
  background-color: #9c27b0;
}

.btn-avatar-upload.avatar-color-green {
  background-color: #4caf50;
}

/* Hover effect cho avatar text */
.btn-avatar-upload:hover .avatar-text-display {
  opacity: 0.9;
}
</style>
