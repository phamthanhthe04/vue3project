<script setup>
import { ref, computed, onMounted } from 'vue'
import { Gender, GenderLabel, getEnumOptions, Area, AreaLabel, CandidateSource, EducationLevel, CandidateStatus } from '@/utils/enums'
import { getAvatarText, getRandomAvatarColor } from '@/utils/avatarHelper'
import { VALIDATION_PATTERNS, VALIDATION_MESSAGES, DEFAULT_VALUES } from '@/constants'
import { useToast } from '@/composables/useToast'
import MSButton from '@/components/controls/ms-button/MSButton.vue'
import MSDateInput from '@/components/controls/ms-input/MSDateInput.vue'
import MSInput from '@/components/controls/ms-input/MSInput.vue'
import MSFormRow from '@/components/controls/form/FormRow.vue'
import MSInputGroup from '@/components/controls/ms-input/MSInputGroup.vue'
import MSSelect from '@/components/controls/ms-input/MSSelect.vue'
import MSLabel from '@/components/controls/form/MSLabel.vue'

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
const genderOptions = getEnumOptions(GenderLabel)
const areaOptions = getEnumOptions(AreaLabel)
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
              <MSFormRow class="inline">
                <MSLabel forId="fullName" required>Họ và tên</MSLabel>
                <MSInput 
                  id="fullName"
                  v-model="formData.fullName"
                  type="text"
                  width="425"
                  placeholder="Nhập họ và tên"
                  required
                />
              </MSFormRow>
              
          
              <!-- Ngày sinh & Giới tính -->
              <MSFormRow layout="split" :gap="'8px'" :style="{width: '100%'}">
                <div style="flex:1; display:flex; flex-direction:column;">
                  <MSLabel forId="dateOfBirth">Ngày sinh</MSLabel>
                  <MSDateInput
                    id="dateOfBirth"
                    v-model="formData.dateOfBirth"
                    placeholder="dd/MM/yyyy"
                    width="100%"
                  />
                </div>
                <div style="flex:1; display:flex; flex-direction:column;">
                  <MSLabel forId="gender">Giới tính</MSLabel>
                  <MSSelect
                    id="gender"
                    v-model="formData.gender"
                    :options="genderOptions"
                    placeholder="Chọn giới tính"
                    width="100%"
                  />
                </div>
              </MSFormRow>
              
              <!-- Khu vực -->
              <MSFormRow>
                <MSLabel forId="area">Khu vực</MSLabel>
                <MSInputGroup
                  id="area"
                  v-model="formData.area"
                  :options="areaOptions"
                  placeholder="Chọn hoặc nhập khu vực"
                  width="425"
                />
              </MSFormRow>

              <!-- Số điện thoại & Email -->
              <MSFormRow layout="split" :gap="'8px'" :style="{width: '100%'}">
                <div style="flex:1; display:flex; flex-direction:column;">
                  <MSLabel forId="phone">Số điện thoại</MSLabel>
                  <MSInput 
                    id="phone"
                    v-model="formData.phone"
                    type="tel"
                    width="100%"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div style="flex:1; display:flex; flex-direction:column;">
                  <MSLabel forId="email">Email</MSLabel>
                  <MSInput 
                    id="email"
                    v-model="formData.email"
                    type="email"
                    width="100%"
                    placeholder="Nhập Email"
                  />
                </div>
              </MSFormRow>
              <!-- Địa chỉ -->
              <MSFormRow>
                <MSLabel forId="address">Địa chỉ</MSLabel>
                <MSInput 
                  id="address"
                  v-model="formData.address"
                  type="text"
                  width="425"
                  placeholder="Nhập địa chỉ"
                />
              </MSFormRow>
              <!-- HỌC VẤN Section -->
              <div class="form-section">
                <h3 class="form-section-title">HỌC VẤN</h3>
                <MSFormRow layout="inline">
                  <MSLabel forId="educationLevel">Trình độ đào tạo</MSLabel>
                  <MSInputGroup
                    id="educationLevel"
                    bulletIcon="•"
                    v-model="formData.educationLevel"
                    :options="educationLevelOptions"
                    placeholder="Nhập trình độ đào tạo"
                    showAddButton
                    showDropdownButton
                    :addIcon="'icon-plus'"
                    :dropdownIcon="'icon-arrow-down'"
                    labelInline
                    width="100%"
                  />
                </MSFormRow>
                <MSFormRow layout="inline">
                  <MSLabel forId="educationPlace">Nơi đào tạo</MSLabel>
                  <MSInputGroup
                    id="educationPlace"
                    bulletIcon="•"
                    v-model="formData.educationPlace"
                    :options="[]"
                    placeholder="Nhập nơi đào tạo"
                    showAddButton
                    showDropdownButton
                    labelInline
                    width="100%"
                  />
                </MSFormRow>
                <MSFormRow layout="inline">
                  <MSLabel forId="major">Chuyên ngành</MSLabel>
                  <MSInputGroup
                    id="major"
                    bulletIcon="•"
                    v-model="formData.major"
                    :options="[]"
                    placeholder="Nhập chuyên ngành"
                    showAddButton
                    showDropdownButton
                    labelInline
                    width="100%"
                  />
                </MSFormRow>
                <!-- Link Thêm học vấn -->
                <div class="form-link-wrapper">
                  <a href="#" class="form-link-blue" @click.prevent>+ Thêm học vấn</a>
                </div>
              </div>


              <!-- Ngày ứng tuyển & Nguồn ứng viên -->
              <MSFormRow layout="split" :gap="'8px'" :style="{width: '100%'}">
                <div style="flex:1; display:flex; flex-direction:column;">
                  <MSLabel forId="dateApplied" required>Ngày ứng tuyển</MSLabel>
                  <MSDateInput
                    id="dateApplied"
                    v-model="formData.dateApplied"
                    placeholder="dd/MM/yyyy"
                    :showCalendar="true"
                    :allowFormatChange="false"
                    width="100%"
                  />
                </div>
                <div style="flex:1; display:flex; flex-direction:column;">
                  <MSLabel forId="source">Nguồn ứng viên</MSLabel>
                  <MSInputGroup
                    id="source"
                    v-model="formData.source"
                    :options="sourceOptions"
                    placeholder="Chọn nguồn ứng viên"
                    width="100%"
                  />
                </div>
              </MSFormRow>

              <!-- Nhân sự khai thác & Cộng tác viên -->
              <MSFormRow layout="split" :gap="'8px'" :style="{width: '100%'}">
                <div style="flex:1; display:flex; flex-direction:column;">
                  <MSLabel forId="recruiter">Nhân sự khai thác</MSLabel>
                  <MSSelect
                    id="recruiter"
                    v-model="formData.recruiter"
                    :options="recruiterOptions"
                    placeholder="Chọn nhân sự khai thác"
                    width="100%"
                  />
                </div>
                <div style="flex:1; display:flex; flex-direction:column;">
                  <MSLabel forId="collaborator">Cộng tác viên</MSLabel>
                  <MSInputGroup
                    id="collaborator"
                    v-model="formData.collaborator"
                    :options="collaboratorOptions"
                    placeholder="Chọn cộng tác viên"
                    width="100%"
                  />
                </div>
              </MSFormRow>
            
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
              <MSFormRow>
                <MSLabel forId="recentWorkplace">Nơi làm việc gần đây</MSLabel>
                <MSInput
                  id="recentWorkplace"
                  v-model="formData.recentWorkplace"
                  type="text"
                  placeholder="Nhập nơi làm việc gần đây"
                  width="100%"
                />
              </MSFormRow>

              <!-- Link Thêm kinh nghiệm làm việc -->
              <div class="form-link-wrapper">
                <a href="#" class="form-link-blue" @click.prevent>+ Thêm kinh nghiệm làm việc</a>
              </div>

              <!-- Nơi làm việc -->
              <MSFormRow>
                <MSLabel forId="workplace">Nơi làm việc</MSLabel>
                <MSInput
                  id="workplace"
                  v-model="formData.workplace"
                  type="text"
                  placeholder="Nhập nơi làm việc"
                  width="100%"
                />
              </MSFormRow>

              <!-- Thời gian -->
              <MSFormRow layout="split" :gap="'8px'" :style="{width: '100%'}">
                <div style="flex:1; display:flex; flex-direction:column;">
                  <MSLabel forId="workPeriodFrom">Thời gian</MSLabel>
                  <MSDateInput
                    id="workPeriodFrom"
                    v-model="formData.workPeriodFrom"
                    placeholder="MM/yyyy"
                    width="100%"
                    :allowFormatChange="false"
                  />
                </div>
                <div style="flex:1; display:flex; flex-direction:column;">
                  <MSLabel forId="workPeriodTo">&nbsp;</MSLabel>
                  <MSDateInput
                    id="workPeriodTo"
                    v-model="formData.workPeriodTo"
                    placeholder="MM/yyyy"
                    width="100%"
                    :allowFormatChange="false"
                  />
                </div>
              </MSFormRow>

              <!-- Vị trí công việc -->
              <MSFormRow>
                <MSLabel forId="jobTitle">Vị trí công việc</MSLabel>
                <MSInput
                  id="jobTitle"
                  v-model="formData.jobTitle"
                  type="text"
                  placeholder="Nhập vị trí công việc"
                  width="100%"
                />
              </MSFormRow>
          
              <!-- Mô tả công việc -->
              <div class="form-row-full">
                <MSLabel forId="jobDescription">Mô tả công việc</MSLabel>
                <MSTextarea
                  id="jobDescription"
                  v-model="formData.jobDescription"
                  rows="4"
                  placeholder="Nhập mô tả công việc"
                  width="100%"
                />
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
