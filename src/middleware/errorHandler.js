// Normalize API errors
export const handleApiError = (error) => {
  const status = error?.status || 0
  const message = error?.message || 'Đã có lỗi xảy ra'
  return { status, message, detail: error?.body }
}
