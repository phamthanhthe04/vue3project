/**
 * Cấu hình columns cho Candidate Table
 * Tách riêng để dễ maintain và reuse
 */
export const candidateFields = [
  // Cột 1: Số điện thoại
  {
    key: 'phone',
    label: 'Số điện thoại',
    type: 'text',
    width: '140px',
    class: 'col-phone',
    sortable: false,
  },

  // Cột 2: Nguồn ứng viên
  {
    key: 'source',
    label: 'Nguồn ứng viên',
    type: 'text',
    width: '150px',
    class: 'col-source',
    sortable: false,
  },

  // Cột 3: Họ và tên - CUSTOM (vì có avatar phức tạp)
  {
    key: 'fullName',
    label: 'Họ và tên',
    type: 'custom', //Phải là 'custom' để dùng slot
    width: '300px',
    class: 'col-name',
    sortable: false,
  },

  // Cột 4: Email
  {
    key: 'email',
    label: 'Email',
    type: 'text',
    width: '200px',
    class: 'col-email',
    sortable: false,
  },

  // Cột 5: Chiến dịch tuyển dụng
  {
    key: 'campaign',
    label: 'Chiến dịch tuyển dụng',
    type: 'text',
    width: '180px',
    class: 'col-campaign',
    sortable: false,
  },

  // Cột 6: Vị trí tuyển dụng
  {
    key: 'position',
    label: 'Vị trí tuyển dụng',
    type: 'text',
    width: '180px',
    class: 'col-position',
    sortable: false,
  },

  // Cột 7: Tin tuyển dụng
  {
    key: 'job',
    label: 'Tin tuyển dụng',
    type: 'text',
    width: '180px',
    class: 'col-job',
    sortable: false,
  },

  // Cột 8: Vòng tuyển dụng - CUSTOM (status badge)
  {
    key: 'status',
    label: 'Vòng tuyển dụng',
    type: 'custom',
    width: '160px',
    class: 'col-status',
    sortable: false,
  },

  // Cột 9: Đánh giá - CUSTOM (rating stars)
  {
    key: 'rating',
    label: 'Đánh giá',
    type: 'custom',
    width: '120px',
    class: 'col-rating',
    sortable: false,
  },

  // Cột 10: Ngày ứng tuyển
  {
    key: 'dateApplied',
    label: 'Ngày ứng tuyển',
    type: 'text',
    width: '140px',
    class: 'col-date-applied',
    sortable: false,
  },

  // Cột 11: Trình độ đào tạo
  {
    key: 'educationLevel',
    label: 'Trình độ đào tạo',
    type: 'text',
    width: '160px',
    class: 'col-education-level',
    sortable: false,
  },

  // Cột 12: Nơi đào tạo
  {
    key: 'educationPlace',
    label: 'Nơi đào tạo',
    type: 'text',
    width: '200px',
    class: 'col-education-place',
    sortable: false,
  },

  // Cột 13: Chuyên ngành
  {
    key: 'major',
    label: 'Chuyên ngành',
    type: 'text',
    width: '180px',
    class: 'col-major',
    sortable: false,
  },

  // Cột 14: Nơi làm việc gần đây
  {
    key: 'recentWorkplace',
    label: 'Nơi làm việc gần đây',
    type: 'text',
    width: '200px',
    class: 'col-recent-workplace',
    sortable: false,
  },

  // Cột 15: Nhân sự khai thác
  {
    key: 'recruiter',
    label: 'Nhân sự khai thác',
    type: 'text',
    width: '160px',
    class: 'col-recruiter',
    sortable: false,
  },

  // Cột 16: Đơn vị sử dụng
  {
    key: 'usingUnit',
    label: 'Đơn vị sử dụng',
    type: 'text',
    width: '160px',
    class: 'col-using-unit',
    sortable: false,
  },

  // Cột 17: Phù hợp với chân dung - CUSTOM (Yes/No)
  {
    key: 'fitProfile',
    label: 'Phù hợp với chân dung',
    type: 'boolean', // MSTable sẽ format thành Có/Không
    width: '160px',
    class: 'col-fit-profile',
    sortable: false,
  },

  // Cột 18: Khu vực
  {
    key: 'area',
    label: 'Khu vực',
    type: 'text',
    width: '120px',
    class: 'col-area',
    sortable: false,
  },

  // Cột 19: Người giới thiệu
  {
    key: 'referrer',
    label: 'Người giới thiệu',
    type: 'text',
    width: '180px',
    class: 'col-referrer',
    sortable: false,
  },

  // Cột 20: Thông tin tiếp cận
  {
    key: 'contactInfo',
    label: 'Thông tin tiếp cận',
    type: 'text',
    width: '180px',
    class: 'col-contact-info',
    sortable: false,
  },

  // Cột 21: Thuộc kho tiềm năng - CUSTOM (Yes/No)
  {
    key: 'potentialWarehouse',
    label: 'Thuộc kho tiềm năng',
    type: 'boolean',
    width: '160px',
    class: 'col-potential-warehouse',
    sortable: false,
  },
]

/**
 * Helper: Format giá trị null/undefined thành '-'
 */
export const formatCellValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return '-'
  }
  return value
}
