// validation patterns
export const VALIDATION_PATTERNS = {
  PHONE: /^0\d{9,10}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  DATE_DDMMYY: /^\d{2}\/\d{2}\/\d{4}$/,
  DATE_MMYYYY: /^\d{2}\/\d{4}$/,
}

// error messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FULLNAME: 'Vui lòng nhập họ và tên',
  REQUIRED_PHONE: 'Vui lòng nhập số điện thoại',
  INVALID_PHONE: 'Số điện thoại phải từ 10-15 chữ số',
  INVALID_EMAIL: 'Email không đúng định dạng',
  REQUIRED_DATE: 'Vui lòng chọn ngày',
}

// maximum lengths
export const VALIDATION_LENGTHS = {
  PHONE_MIN: 10,
  PHONE_MAX: 15,
  NAME_MIN: 2,
  NAME_MAX: 100,
}
