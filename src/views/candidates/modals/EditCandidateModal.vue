<script setup>
import { ref, computed, watch } from 'vue'
import {
  Gender,
  GenderLabel,
  Area,
  AreaLabel,
  CandidateSource,
  EducationLevel,
  CandidateStatus,
  getEnumOptions,
} from '@/utils/enums'
import { VALIDATION_PATTERNS, VALIDATION_MESSAGES } from '@/constants'
import { useToast } from '@/composables/useToast'
import MSButton from '@/components/controls/ms-button/MSButton.vue'
import MSDateInput from '@/components/controls/ms-input/MSDateInput.vue'
import MSInput from '@/components/controls/ms-input/MSInput.vue'
import MSInputGroup from '@/components/controls/ms-input/MSInputGroup.vue'
import MSSelect from '@/components/controls/ms-input/MSSelect.vue'
import MSFormRow from '@/components/controls/form/FormRow.vue'
import MSTextarea from '@/components/controls/ms-input/MSTextarea.vue'
import MSLabel from '@/components/controls/form/MSLabel.vue'

const { success, error } = useToast()

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

// Chuyển đổi dd/MM/yyyy sang yyyy-MM-dd cho input type="date"
function convertToDateInput(dateStr) {
  if (!dateStr) return ''
  const parts = dateStr.split('/')
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`
  }
  return dateStr
}

// Chuyển đổi yyyy-MM-dd sang dd/MM/yyyy
function convertToDisplayDate(dateStr) {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }
  return dateStr
}

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
const genderOptions = getEnumOptions(GenderLabel)
const areaOptions = getEnumOptions(AreaLabel)
const sourceOptions = Object.values(CandidateSource)
const educationLevelOptions = Object.values(EducationLevel)
const statusOptions = Object.values(CandidateStatus)

// Watch candidate để populate form
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

      // Set avatar
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

// Avatar display computed
const hasImageAvatar = computed(() => !!avatarPreview.value)
const hasTextAvatar = computed(() => !avatarPreview.value && !!avatarText.value)
const showUploadPlaceholder = computed(() => !avatarPreview.value && !avatarText.value)

// Handle close
const handleClose = () => emit('close')
const handleCancel = () => emit('close')

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

  // Chuẩn bị dữ liệu đã cập nhật
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

// Xử lý click bên ngoài modal
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}
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
                      <img
                        v-if="hasImageAvatar"
                        :src="avatarPreview"
                        alt="Avatar"
                        class="avatar-image show"
                      />
                      <span v-else-if="hasTextAvatar" class="avatar-text-display">
                        {{ avatarText }}
                      </span>
                      <span v-else class="avatar-placeholder-text">Tải ảnh lên</span>
                    </button>
                  </div>
                </div>

                <!-- Form fields bên phải -->
                <div class="form-edit-right">
                  <!-- Họ và tên -->
                  <MSFormRow layout="vertical">
                    <MSLabel forId="fullName" required>Họ và tên</MSLabel>
                    <MSInput
                      id="fullName"
                      v-model="formData.fullName"
                      type="text"
                      width="100%"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </MSFormRow>

                  <!-- Ngày sinh & Giới tính -->
                  <MSFormRow layout="split" :gap="'16px'">
                    <div style="flex: 1; display: flex; flex-direction: column">
                      <MSLabel forId="dateOfBirth">Ngày sinh</MSLabel>
                      <MSDateInput
                        id="dateOfBirth"
                        v-model="formData.dateOfBirth"
                        placeholder="dd/MM/yyyy"
                        width="100%"
                      />
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column">
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

                  <!-- Nguồn ứng viên & Ngày ứng tuyển -->
                  <MSFormRow layout="split" :gap="'16px'">
                    <div style="flex: 1; display: flex; flex-direction: column">
                      <MSLabel forId="source">Nguồn ứng viên</MSLabel>
                      <MSInputGroup
                        id="source"
                        v-model="formData.source"
                        :options="sourceOptions"
                        placeholder="Chọn nguồn ứng viên"
                        width="100%"
                      />
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column">
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
                  </MSFormRow>

                  <!-- Khu vực -->
                  <MSFormRow layout="vertical">
                    <MSLabel forId="area">Khu vực</MSLabel>
                    <MSInputGroup
                      id="area"
                      v-model="formData.area"
                      :options="areaOptions"
                      placeholder="Chọn hoặc nhập khu vực"
                      width="100%"
                    />
                  </MSFormRow>

                  <!-- Nhân sự khai thác -->
                  <MSFormRow layout="vertical">
                    <MSLabel forId="recruiter">Nhân sự khai thác</MSLabel>
                    <MSInput
                      id="recruiter"
                      v-model="formData.recruiter"
                      type="text"
                      width="100%"
                      placeholder="Nhập nhân sự khai thác"
                    />
                  </MSFormRow>

                  <!-- Cộng tác viên -->
                  <MSFormRow layout="vertical">
                    <MSLabel forId="collaborator">Cộng tác viên</MSLabel>
                    <MSInput
                      id="collaborator"
                      v-model="formData.collaborator"
                      type="text"
                      width="100%"
                      placeholder="Nhập cộng tác viên"
                    />
                  </MSFormRow>
                  <a href="#" class="form-link-action" @click.prevent>+ Thêm người giới thiệu</a>
                </div>
              </div>
            </div>

            <!-- THÔNG TIN LIÊN HỆ -->
            <div class="form-section-edit">
              <h3 class="form-section-title-edit">THÔNG TIN LIÊN HỆ</h3>

              <!-- Số điện thoại -->
              <MSFormRow layout="vertical">
                <MSLabel forId="phone">Số điện thoại</MSLabel>
                <MSInput
                  id="phone"
                  v-model="formData.phone"
                  iconLabel="icon icon-phone-number"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  width="100%"
                  layout="inline"
                />
              </MSFormRow>
              <!-- Email -->
              <MSFormRow layout="vertical">
                <MSLabel forId="email">Email</MSLabel>
                <MSInput
                  id="email"
                  v-model="formData.email"
                  iconLabel="icon icon-email"
                  type="email"
                  placeholder="Nhập email"
                  width="100%"
                  layout="inline"
                />
              </MSFormRow>

              <!-- Địa chỉ -->
              <MSFormRow layout="vertical">
                <MSLabel forId="address">Địa chỉ</MSLabel>
                <MSInput
                  id="address"
                  v-model="formData.address"
                  iconLabel="icon icon-address"
                  type="text"
                  placeholder="Nhập địa chỉ"
                  width="100%"
                  layout="inline"
                />
              </MSFormRow>

              <!-- Skype -->
              <MSFormRow layout="vertical">
                <MSLabel forId="skype">Skype</MSLabel>
                <MSInput
                  id="skype"
                  v-model="formData.skype"
                  iconLabel="icon icon-skype"
                  type="text"
                  placeholder="Nhập Skype"
                  width="100%"
                  layout="inline"
                />
              </MSFormRow>

              <!-- Facebook -->
              <MSFormRow layout="vertical">
                <MSLabel forId="facebook">Facebook</MSLabel>
                <MSInput
                  id="facebook"
                  v-model="formData.facebook"
                  iconLabel="icon icon-facebook"
                  type="text"
                  placeholder="Nhập Facebook"
                  width="100%"
                  layout="inline"
                />
              </MSFormRow>

              <!-- Zalo -->
              <MSFormRow layout="vertical">
                <MSLabel forId="zalo">Zalo</MSLabel>
                <MSInput
                  id="zalo"
                  v-model="formData.zalo"
                  iconLabel="icon icon-zalo"
                  type="text"
                  placeholder="Nhập Zalo"
                  width="100%"
                  layout="inline"
                />
              </MSFormRow>

              <!-- LinkedIn/Khác -->
              <MSFormRow layout="vertical">
                <MSLabel forId="linkedinOther">LinkedIn/Khác</MSLabel>
                <MSInput
                  id="linkedinOther"
                  v-model="formData.linkedinOther"
                  iconLabel="icon icon-linker-other"
                  type="text"
                  placeholder="Nhập LinkedIn/Khác"
                  width="100%"
                  layout="inline"
                />
              </MSFormRow>
            </div>

            <!-- HỌC VẤN -->
            <div class="form-section-edit">
              <h3 class="form-section-title-edit">HỌC VẤN</h3>

              <!-- Trình độ đào tạo -->
              <MSFormRow>
                <MSLabel forId="educationLevel">Trình độ đào tạo</MSLabel>
                <MSInputGroup
                  id="educationLevel"
                  v-model="formData.educationLevel"
                  iconLabel="icon-circle-edit"
                  :options="educationLevelOptions"
                  placeholder="Chọn hoặc nhập trình độ đào tạo"
                  width="100%"
                  labelInline
                />
              </MSFormRow>
              <!-- Nơi đào tạo -->
              <MSFormRow>
                <MSLabel forId="educationPlace">Nơi đào tạo</MSLabel>
                <MSInput
                  id="educationPlace"
                  v-model="formData.educationPlace"
                  iconLabel="icon-circle-edit"
                  type="text"
                  placeholder="Nhập nơi đào tạo"
                  width="100%"
                  layout="inline"
                />
              </MSFormRow>
              <!-- Chuyên ngành -->
              <MSFormRow>
                <MSLabel forId="major">Chuyên ngành</MSLabel>
                <MSInput
                  id="major"
                  v-model="formData.major"
                  iconLabel="icon-circle-edit"
                  type="text"
                  placeholder="Nhập chuyên ngành"
                  width="100%"
                  layout="inline"
                />
              </MSFormRow>
            </div>

            <!-- KINH NGHIỆM LÀM VIỆC -->
            <div class="form-section-edit">
              <h3 class="form-section-title-edit">KINH NGHIỆM LÀM VIỆC</h3>

              <!-- Nơi làm việc gần đây -->
              <MSFormRow layout="vertical">
                <MSLabel forId="recentWorkplace">Nơi làm việc gần đây</MSLabel>
                <MSInput
                  id="recentWorkplace"
                  v-model="formData.recentWorkplace"
                  iconLabel="icon-circle-edit"
                  type="text"
                  placeholder="Nhập nơi làm việc gần đây"
                  layout="inline"
                />
              </MSFormRow>

              <!-- Nơi làm việc -->
              <MSFormRow layout="vertical">
                <MSLabel forId="workplace">Nơi làm việc</MSLabel>
                <MSInput
                  id="workplace"
                  v-model="formData.workplace"
                  iconLabel="icon-circle-edit"
                  type="text"
                  placeholder="Nhập nơi làm việc"
                  layout="inline"
                />
              </MSFormRow>
              <!-- Thời gian -->
              <MSFormRow layout="split" :gap="'16px'">
                <div style="flex: 1; display: flex; flex-direction: column">
                  <MSLabel forId="workPeriodFrom">Thời gian</MSLabel>
                  <MSInput
                    id="workPeriodFrom"
                    v-model="formData.workPeriodFrom"
                    iconLabel="icon-circle-edit"
                    type="text"
                    placeholder="MM/yyyy"
                    layout="inline"
                  />
                </div>
                <div style="flex: 1; display: flex; flex-direction: column">
                  <MSLabel forId="workPeriodTo">&nbsp;</MSLabel>
                  <MSInput
                    id="workPeriodTo"
                    v-model="formData.workPeriodTo"
                    type="text"
                    placeholder="MM/yyyy"
                  />
                </div>
              </MSFormRow>
              <!-- Vị trí công việc -->
              <MSFormRow layout="vertical">
                <MSLabel forId="jobTitle">Vị trí công việc</MSLabel>
                <MSInput
                  id="jobTitle"
                  v-model="formData.jobTitle"
                  iconLabel="icon-circle-edit"
                  type="text"
                  placeholder="Nhập vị trí công việc"
                  layout="inline"
                />
              </MSFormRow>
              <!-- Mô tả công việc -->
              <MSFormRow layout="vertical">
                <MSLabel forId="jobDescription">Mô tả công việc</MSLabel>
                <MSTextarea
                  id="jobDescription"
                  v-model="formData.jobDescription"
                  iconLabel="icon-circle-edit"
                  placeholder="Nhập mô tả công việc"
                  :rows="4"
                  width="100%"
                  layout="inline"
                />
              </MSFormRow>
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
@import '../../../assets/css/variables.css';
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
