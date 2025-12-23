import { AvatarColor } from './enums'

/**
 * Tạo text avatar từ tên đầy đủ
 * Ví dụ: "Nguyễn Văn A" => "NA"
 */
export function getAvatarText(fullName) {
  if (!fullName) return ''
  const words = fullName.trim().split(' ')
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase()
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

/**
 * Tạo màu avatar ngẫu nhiên
 */
export function getRandomAvatarColor() {
  const colors = Object.values(AvatarColor)
  return colors[Math.floor(Math.random() * colors.length)]
}
