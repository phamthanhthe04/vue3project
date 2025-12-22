/**
 * ENUM - Trạng thái tuyển dụng
 */
export const CandidateStatus = {
  HIRED: 'Đã tuyển',
  INTERVIEW: 'Phỏng vấn',
  INTERVIEW_2: 'Phỏng vấn lần 2',
  SUBMITTED: 'Nộp hồ sơ',
  REVIEWING: 'Đang xem xét',
  REJECTED: 'Từ chối',
  PENDING: 'Chờ xử lý',
}

/**
 * ENUM - Nguồn ứng viên
 */
export const CandidateSource = {
  WEBSITE: 'Website',
  FACEBOOK: 'Facebook',
  LINKEDIN: 'LinkedIn',
  TOPCV: 'TopCV',
  VIETNAMWORKS: 'VietnamWorks',
  CAREERBUILDER: 'CareerBuilder',
  REFERRAL: 'Giới thiệu',
  OTHER: 'Khác',
}

/**
 * ENUM - Giới tính
 */
export const Gender = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
  OTHER: 'Khác',
}

/**
 * ENUM - Trình độ học vấn
 */
export const EducationLevel = {
  HIGH_SCHOOL: 'Trung học phổ thông',
  VOCATIONAL: 'Trung cấp',
  COLLEGE: 'Cao đẳng',
  BACHELOR: 'Đại học',
  MASTER: 'Thạc sĩ',
  PHD: 'Tiến sĩ',
}

/**
 * ENUM - Màu avatar
 */
export const AvatarColor = {
  PINK: 'pink',
  BLUE: 'blue',
  ORANGE: 'orange',
  CYAN: 'cyan',
  TEAL: 'teal',
  PURPLE: 'purple',
  GREEN: 'green',
}

/**
 * ENUM - Khu vực
 */
export const Area = {
  HANOI: 'Hà Nội',
  HCM: 'TP. Hồ Chí Minh',
  DANANG: 'Đà Nẵng',
  HAIPHONG: 'Hải Phòng',
  CANTHO: 'Cần Thơ',
  OTHER: 'Khác',
}

/**
 * Helper - Lấy tất cả giá trị của Enum
 */
export function getEnumValues(enumObj) {
  return Object.values(enumObj)
}

/**
 * Helper - Kiểm tra giá trị có hợp lệ không
 */
export function isValidEnumValue(enumObj, value) {
  return Object.values(enumObj).includes(value)
}

/**
 * Helper - Lấy key từ value
 */
export function getEnumKey(enumObj, value) {
  return Object.keys(enumObj).find((key) => enumObj[key] === value)
}

/**
 * Helper - Lấy class CSS cho trạng thái
 */
export function getStatusClass(status) {
  const statusMap = {
    [CandidateStatus.HIRED]: 'status-hired',
    [CandidateStatus.INTERVIEW]: 'status-interview',
    [CandidateStatus.INTERVIEW_2]: 'status-interview',
    [CandidateStatus.SUBMITTED]: 'status-submitted',
    [CandidateStatus.REVIEWING]: 'status-reviewing',
    [CandidateStatus.REJECTED]: 'status-rejected',
    [CandidateStatus.PENDING]: 'status-pending',
  }
  return statusMap[status] || 'status-pending'
}

/**
 * Helper - Lấy class CSS cho màu avatar
 */
export function getAvatarColorClass(color) {
  return `avatar-${color}`
}
