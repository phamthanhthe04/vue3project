/**
 * ENUM - Trạng thái tuyển dụng (numeric codes)
 */
export const CandidateStatus = {
  HIRED: 0,
  INTERVIEW: 1,
  INTERVIEW_2: 2,
  SUBMITTED: 3,
  REVIEWING: 4,
  REJECTED: 5,
  PENDING: 6,
}

/**
 * Label map - CandidateStatus (code -> label)
 */
export const CandidateStatusLabel = {
  [CandidateStatus.HIRED]: 'Đã tuyển',
  [CandidateStatus.INTERVIEW]: 'Phỏng vấn',
  [CandidateStatus.INTERVIEW_2]: 'Phỏng vấn lần 2',
  [CandidateStatus.SUBMITTED]: 'Nộp hồ sơ',
  [CandidateStatus.REVIEWING]: 'Đang xem xét',
  [CandidateStatus.REJECTED]: 'Từ chối',
  [CandidateStatus.PENDING]: 'Chờ xử lý',
}

/**
 * ENUM - Nguồn ứng viên (numeric codes)
 */
export const CandidateSource = {
  WEBSITE: 0,
  FACEBOOK: 1,
  LINKEDIN: 2,
  TOPCV: 3,
  VIETNAMWORKS: 4,
  CAREERBUILDER: 5,
  REFERRAL: 6,
  OTHER: 7,
}

export const CandidateSourceLabel = {
  [CandidateSource.WEBSITE]: 'Website',
  [CandidateSource.FACEBOOK]: 'Facebook',
  [CandidateSource.LINKEDIN]: 'LinkedIn',
  [CandidateSource.TOPCV]: 'TopCV',
  [CandidateSource.VIETNAMWORKS]: 'VietnamWorks',
  [CandidateSource.CAREERBUILDER]: 'CareerBuilder',
  [CandidateSource.REFERRAL]: 'Giới thiệu',
  [CandidateSource.OTHER]: 'Khác',
}

/**
 * ENUM - Giới tính (numeric codes)
 */
export const Gender = {
  MALE: 0,
  FEMALE: 1,
  OTHER: 2,
}

export const GenderLabel = {
  [Gender.MALE]: 'Nam',
  [Gender.FEMALE]: 'Nữ',
  [Gender.OTHER]: 'Khác',
}

/**
 * ENUM - Trình độ học vấn (numeric codes)
 */
export const EducationLevel = {
  HIGH_SCHOOL: 0,
  VOCATIONAL: 1,
  COLLEGE: 2,
  BACHELOR: 3,
  MASTER: 4,
  PHD: 5,
}

export const EducationLevelLabel = {
  [EducationLevel.HIGH_SCHOOL]: 'Trung học phổ thông',
  [EducationLevel.VOCATIONAL]: 'Trung cấp',
  [EducationLevel.COLLEGE]: 'Cao đẳng',
  [EducationLevel.BACHELOR]: 'Đại học',
  [EducationLevel.MASTER]: 'Thạc sĩ',
  [EducationLevel.PHD]: 'Tiến sĩ',
}

/**
 * ENUM - Màu avatar (numeric codes)
 */
export const AvatarColor = {
  PINK: 0,
  BLUE: 1,
  ORANGE: 2,
  CYAN: 3,
  TEAL: 4,
  PURPLE: 5,
  GREEN: 6,
}

export const AvatarColorLabel = {
  [AvatarColor.PINK]: 'pink',
  [AvatarColor.BLUE]: 'blue',
  [AvatarColor.ORANGE]: 'orange',
  [AvatarColor.CYAN]: 'cyan',
  [AvatarColor.TEAL]: 'teal',
  [AvatarColor.PURPLE]: 'purple',
  [AvatarColor.GREEN]: 'green',
}

/**
 * ENUM - Khu vực (numeric codes)
 */
export const Area = {
  HANOI: 0,
  HCM: 1,
  DANANG: 2,
  HAIPHONG: 3,
  CANTHO: 4,
  OTHER: 5,
}

export const AreaLabel = {
  [Area.HANOI]: 'Hà Nội',
  [Area.HCM]: 'TP. Hồ Chí Minh',
  [Area.DANANG]: 'Đà Nẵng',
  [Area.HAIPHONG]: 'Hải Phòng',
  [Area.CANTHO]: 'Cần Thơ',
  [Area.OTHER]: 'Khác',
}

/**
 * Helper - Lấy tất cả giá trị của Enum (numeric codes)
 */
export function getEnumValues(enumObj) {
  return Object.values(enumObj)
}

/**
 * Helper - Tạo options cho select từ label map
 */
export function getEnumOptions(labelMap) {
  return Object.entries(labelMap).map(([key, label]) => ({ value: Number(key), label }))
}

/**
 * Helper - Kiểm tra giá trị có hợp lệ không (code hoặc label)
 */
export function isValidEnumValue(enumObjOrLabelMap, value) {
  // Accept either numeric codes (enumObj values) or labels (labelMap values)
  if (value == null) return false
  if (typeof value === 'number') return Object.values(enumObjOrLabelMap).includes(value)
  const n = Number(value)
  if (!Number.isNaN(n) && Object.values(enumObjOrLabelMap).includes(n)) return true
  return Object.values(enumObjOrLabelMap).includes(value)
}

/**
 * Helper - Lấy key từ value (keeps behavior similar to previous implementation)
 */
export function getEnumKey(enumObj, value) {
  return Object.keys(enumObj).find((key) => enumObj[key] === value)
}

/**
 * Helper - Lấy code từ label (labelMap)
 */
export function getCodeFromLabel(labelMap, value) {
  if (value == null) return null
  if (typeof value === 'number') return value
  const n = Number(value)
  if (!Number.isNaN(n) && labelMap[n]) return n
  const found = Object.entries(labelMap).find(([, v]) => v === value)
  return found ? Number(found[0]) : null
}

/**
 * Helper - Lấy label từ code hoặc trả chính label nếu đã truyền label
 */
export function getLabelFromMap(labelMap, value) {
  const code = getCodeFromLabel(labelMap, value)
  if (code != null) return labelMap[code]
  // fallback: if value is already a label and exists
  return Object.values(labelMap).includes(value) ? value : ''
}

/**
 * Helper - Lấy class CSS cho trạng thái (accepts code or label)
 */
export function getStatusClass(status) {
  const statusCode = getCodeFromLabel(CandidateStatusLabel, status)
  const statusMap = {
    [CandidateStatus.HIRED]: 'status-hired',
    [CandidateStatus.INTERVIEW]: 'status-interview',
    [CandidateStatus.INTERVIEW_2]: 'status-interview',
    [CandidateStatus.SUBMITTED]: 'status-submitted',
    [CandidateStatus.REVIEWING]: 'status-reviewing',
    [CandidateStatus.REJECTED]: 'status-rejected',
    [CandidateStatus.PENDING]: 'status-pending',
  }
  return statusMap[statusCode] || 'status-pending'
}

/**
 * Helper - Lấy class CSS cho màu avatar (accepts code or color string)
 */
export function getAvatarColorClass(color) {
  if (color == null) return ''
  if (typeof color === 'number') {
    return `avatar-color-${AvatarColorLabel[color] || ''}`
  }
  // If a string like 'pink' is passed (old behavior), keep it working
  if (typeof color === 'string') return `avatar-color-${color}`
  return ''
}
