<script setup>
import { ref, computed, onMounted } from 'vue'
import { Gender, Area, CandidateSource, EducationLevel, CandidateStatus } from '@/utils/enums'
import { getAvatarText, getRandomAvatarColor } from '@/utils/avatarHelper'
import { VALIDATION_PATTERNS, VALIDATION_MESSAGES, DEFAULT_VALUES } from '@/constants'
import { useToast } from '@/composables/useToast'
import MSButton from '@/components/controls/ms-button/MSButton.vue'
import MSDateInput from '@/components/controls/ms-input/MSDateInput.vue'

const { success, error } = useToast()

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'save'])

// Lấy ngày hiện tại dd/MM/yyyy
function getCurrentDate() {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = today.getFullYear()
  return `${day}/${month}/${year}`
}

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
  recruiter: DEFAULT_VALUES.RECRUITER,
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

// Xử lý upload avatar
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
    recruiter: DEFAULT_VALUES.RECRUITER,
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

// Handle close
const handleClose = () => emit('close')

const handleCancel = () => {
  resetForm()
  emit('close')
}

const handleSave = () => {
  // Validation
  if (!formData.value.fullName.trim()) {
    error(VALIDATION_MESSAGES.REQUIRED_FULLNAME)
    return
  }

  if (formData.value.phone.trim() && !VALIDATION_PATTERNS.PHONE.test(formData.value.phone.trim())) {
    error(VALIDATION_MESSAGES.INVALID_PHONE)
    return
  }

  // Chuẩn bị dữ liệu
  const candidateData = {
    ...formData.value,
    status: CandidateStatus.SUBMITTED,
    rating: DEFAULT_VALUES.RATING,
    campaign: '',
    position: formData.value.jobTitle || '',
    job: formData.value.jobTitle || '',
    fitProfile: DEFAULT_VALUES.FIT_PROFILE,
    referrer: '',
    contactInfo: DEFAULT_VALUES.CONTACT_INFO,
    potentialWarehouse: DEFAULT_VALUES.POTENTIAL_WAREHOUSE,
    workPeriod: {
      from: formData.value.workPeriodFrom,
      to: formData.value.workPeriodTo,
    },
    avatar: avatarPreview.value, // Lưu base64 string thay vì File object
    avatarText: getAvatarText(formData.value.fullName),
    avatarColor: getRandomAvatarColor(),
    isEmployee: DEFAULT_VALUES.IS_EMPLOYEE,
    usingUnit: '',
  }

  emit('save', candidateData)
  success('Thêm ứng viên thành công!')
  resetForm()
  emit('close')
}

// Xử lý click bên ngoài modal
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}

onMounted(() => {
  formData.value.dateApplied = getCurrentDate()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay active" @click="handleOverlayClick">
      <div class="modal-container" @click.stop">
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
            <!-- Avatar Section -->
            <div class="form-add-candidate-left">
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
                  @click="handleAvatarClick"
                  title="Click để tải ảnh lên"
                >
                  <img
                    v-if="avatarPreview"
                    :src="avatarPreview"
                    alt="Avatar"
                    class="avatar-image show"
                  />
                  <span v-else class="avatar-placeholder-text">Ảnh</span>
                </button>
              </div>
            </div>

            <!-- Form Fields -->
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
            <MSDateInput
              v-model="formData.dateOfBirth"
              label="Ngày sinh"
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
            <label class="form-label"> Số điện thoại <span class="required-star">*</span> </label>
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
                  <option v-for="level in educationLevelOptions" :key="level" :value="level" />
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
            <label class="form-label"> Ngày ứng tuyển <span class="required-star">*</span> </label>
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
@import '../../../assets/css/variables.css';
@import '../../../assets/css/modal-add-candidate.css';
</style>
