import { ref, computed, onMounted } from 'vue'
import { candidatesData } from '../utils/candidateData'

const STORAGE_KEY = 'candidates-data'

/**
 * Composable để quản lý ứng viên với localStorage
 */
export function useCandidates() {
  const candidates = ref([])
  const loading = ref(false)
  const searchKeyword = ref('')

  // Filter state
  const filters = ref({
    status: '',
    source: '',
    educationLevel: '',
    position: '',
  })

  /**
   * Khởi tạo localStorage từ dữ liệu mẫu
   */
  const initializeStorage = () => {
    const existingData = localStorage.getItem(STORAGE_KEY)
    if (!existingData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(candidatesData))
      console.log('Đã khởi tạo dữ liệu ứng viên mẫu trong localStorage')
    } else {
      console.log('Dữ liệu ứng viên đã tồn tại trong localStorage')
    }
  }

  /**
   * Lấy tất cả ứng viên từ localStorage
   */
  const getAllCandidates = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) {
        console.warn('Không có dữ liệu ứng viên trong localStorage')
        return []
      }
      return JSON.parse(data)
    } catch (error) {
      console.error('Lỗi khi đọc dữ liệu từ localStorage:', error)
      return []
    }
  }

  /**
   * Load dữ liệu từ localStorage
   */
  const loadCandidates = () => {
    loading.value = true
    try {
      candidates.value = getAllCandidates()
      console.log(`Đã load ${candidates.value.length} ứng viên`)
    } catch (error) {
      console.error('Lỗi khi load ứng viên:', error)
      candidates.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * Lấy ứng viên theo ID
   */
  const getCandidateById = (id) => {
    return candidates.value.find((c) => c.id === id) || null
  }

  /**
   * Thêm ứng viên mới
   */
  const addCandidate = (candidateData) => {
    try {
      const allCandidates = getAllCandidates()
      const newId = allCandidates.length > 0 ? Math.max(...allCandidates.map((c) => c.id)) + 1 : 1

      const newCandidate = {
        id: newId,
        ...candidateData,
        dateApplied: new Date().toLocaleDateString('vi-VN'),
      }

      allCandidates.push(newCandidate)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allCandidates))

      // Cập nhật state
      candidates.value = allCandidates
      console.log('Đã thêm ứng viên mới:', newCandidate.fullName)

      return newCandidate
    } catch (error) {
      console.error('Lỗi khi thêm ứng viên:', error)
      return null
    }
  }

  /**
   * Cập nhật thông tin ứng viên
   */
  const updateCandidate = (id, updatedData) => {
    try {
      const allCandidates = getAllCandidates()
      const index = allCandidates.findIndex((c) => c.id === id)

      if (index === -1) {
        console.warn('Không tìm thấy ứng viên với ID:', id)
        return null
      }

      allCandidates[index] = {
        ...allCandidates[index],
        ...updatedData,
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(allCandidates))

      // Cập nhật state
      candidates.value = allCandidates
      console.log('Đã cập nhật ứng viên:', allCandidates[index].fullName)

      return allCandidates[index]
    } catch (error) {
      console.error('Lỗi khi cập nhật ứng viên:', error)
      return null
    }
  }

  /**
   * Xóa ứng viên
   */
  const deleteCandidate = (id) => {
    try {
      const allCandidates = getAllCandidates()
      const index = allCandidates.findIndex((c) => c.id === id)

      if (index === -1) {
        console.warn('Không tìm thấy ứng viên với ID:', id)
        return false
      }

      const deletedCandidate = allCandidates.splice(index, 1)[0]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allCandidates))

      // Cập nhật state
      candidates.value = allCandidates
      console.log('Đã xóa ứng viên:', deletedCandidate.fullName)

      return true
    } catch (error) {
      console.error('Lỗi khi xóa ứng viên:', error)
      return false
    }
  }

  /**
   * Tìm kiếm ứng viên
   */
  const searchCandidates = (keyword) => {
    searchKeyword.value = keyword
  }

  /**
   * Danh sách ứng viên đã lọc theo từ khóa tìm kiếm, bộ lọc và sắp xếp mới nhất lên đầu
   */
  const filteredCandidates = computed(() => {
    let result = candidates.value

    // Lọc theo từ khóa tìm kiếm
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      const k = searchKeyword.value.toLowerCase()
      result = result.filter(
        (candidate) =>
          candidate.fullName.toLowerCase().includes(k) ||
          candidate.email.toLowerCase().includes(k) ||
          candidate.phone.includes(searchKeyword.value) ||
          candidate.position.toLowerCase().includes(k),
      )
    }

    // Lọc theo vòng tuyển dụng
    if (filters.value.status) {
      result = result.filter((candidate) => candidate.status === filters.value.status)
    }

    // Lọc theo nguồn ứng viên
    if (filters.value.source) {
      result = result.filter((candidate) => candidate.source === filters.value.source)
    }

    // Lọc theo trình độ đào tạo
    if (filters.value.educationLevel) {
      result = result.filter(
        (candidate) => candidate.educationLevel === filters.value.educationLevel,
      )
    }

    // Lọc theo vị trí tuyển dụng
    if (filters.value.position) {
      result = result.filter((candidate) => candidate.position === filters.value.position)
    }

    // Sắp xếp theo ID giảm dần (mới nhất lên đầu)
    return [...result].sort((a, b) => b.id - a.id)
  })

  /**
   * Lọc ứng viên theo điều kiện
   */
  const filterCandidates = (filters) => {
    return candidates.value.filter((candidate) =>
      Object.keys(filters).every((key) => candidate[key] === filters[key]),
    )
  }

  /**
   * Cập nhật bộ lọc
   */
  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  /**
   * Reset bộ lọc
   */
  const resetFilters = () => {
    filters.value = {
      status: '',
      source: '',
      educationLevel: '',
      position: '',
    }
  }

  /**
   * Đếm số bộ lọc đang được áp dụng
   */
  const activeFiltersCount = computed(() => {
    return Object.values(filters.value).filter((value) => value !== '').length
  })

  /**
   * Reset dữ liệu về mẫu
   */
  const resetToSampleData = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidatesData))
    loadCandidates()
    console.log('🔄 Đã reset về dữ liệu mẫu')
  }

  /**
   * Xóa tất cả dữ liệu
   */
  const clearAllData = () => {
    localStorage.removeItem(STORAGE_KEY)
    candidates.value = []
    console.log('Đã xóa tất cả dữ liệu')
  }

  // Khởi tạo khi component mount
  onMounted(() => {
    initializeStorage()
    loadCandidates()
  })

  return {
    // State
    candidates,
    loading,
    searchKeyword,
    filters,
    filteredCandidates,
    activeFiltersCount,

    // Methods
    loadCandidates,
    getCandidateById,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    searchCandidates,
    filterCandidates,
    updateFilters,
    resetFilters,
    resetToSampleData,
    clearAllData,
  }
}
