<script setup>
import { ref, computed } from 'vue'

// Search state
const searchQuery = ref('')

// Header action items configuration
const headerActions = [
  {
    id: 'website',
    icon: 'icon-hd-global',
    label: 'Website tuyển dụng',
    hasLabel: true,
  },
  {
    id: 'speaker',
    icon: 'icon-hd-speaker',
    ariaLabel: 'Thông báo âm thanh',
  },
  {
    id: 'store',
    icon: 'icon-hd-store',
    ariaLabel: 'Cửa hàng',
  },
  {
    id: 'adduser',
    icon: 'icon-hd-adduser',
    ariaLabel: 'Thêm người dùng',
  },
  {
    id: 'notification',
    icon: 'icon-hd-notification',
    ariaLabel: 'Thông báo',
    badge: 3,
  },
  {
    id: 'message',
    icon: 'icon-hd-message',
    ariaLabel: 'Tin nhắn',
    badge: 1,
  },
  {
    id: 'help',
    icon: 'icon-hd-help',
    ariaLabel: 'Trợ giúp',
  },
  {
    id: 'moremenu',
    icon: 'icon-hd-moremenu',
    ariaLabel: 'Thêm menu',
  },
  {
    id: 'knowledge',
    icon: 'icon-hd-knowledge',
    ariaLabel: 'Kiến thức',
  },
]

// Handle search
const handleSearch = () => {
  console.log('Searching:', searchQuery.value)
  // Implement search logic
}

// Handle action click
const handleActionClick = (actionId) => {
  console.log('Action clicked:', actionId)
  // Implement action handlers
}
</script>

<template>
  <header class="header img-hd-background">
    <!-- Left Section -->
    <div class="header-left">
      <div class="header-branding">
        <div class="header-app-icon">
          <div class="icon icon-hd-app"></div>
        </div>
        <div class="header-logo img-hd-logo-recruitment"></div>
        <h1 class="header-title">Tuyển dụng</h1>
      </div>

      <!-- Search -->
      <div class="header-search">
        <div class="search-icon-wrapper">
          <div class="icon icon-hd-search"></div>
        </div>
        <input
          v-model="searchQuery"
          type="search"
          class="search-input"
          placeholder="Tìm kiếm tin tuyển dụng, ứng viên, nhân tài, ..."
          @keyup.enter="handleSearch"
          aria-label="Tìm kiếm"
        />
      </div>
    </div>

    <!-- Right Section -->
    <div class="header-right">
      <button
        v-for="action in headerActions"
        :key="action.id"
        class="header-action"
        :class="{ 'has-label': action.hasLabel, 'has-badge': action.badge }"
        :aria-label="action.ariaLabel"
        @click="handleActionClick(action.id)"
      >
        <div class="icon" :class="action.icon"></div>
        <span v-if="action.label" class="action-label">{{ action.label }}</span>
        <span v-if="action.badge" class="badge-count">{{ action.badge }}</span>
      </button>

      <div class="header-avatar">
        <div class="img-hd-avatar"></div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ==================== HEADER ==================== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  padding: 0 16px;
}

/* ==================== LEFT SECTION ==================== */
.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 48px;
}

/* Branding */
.header-branding {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-app-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
}

.header-logo {
  padding-left: 50px;
}

.header-title {
  font-weight: 600;
  font-size: 16px;
  color: #111111;
  margin: 0;
  margin-left: 8px;
}

/* Search */
.header-search {
  position: relative;
  width: 365px;
}

.search-icon-wrapper {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  pointer-events: none;
}

.search-icon-wrapper .icon {
  background-color: #666666;
}

.search-input {
  width: 100%;
  height: 32px;
  padding: 6px 12px 6px 36px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  color: #111111;
  background-color: #f2f2f2;
  transition: all 0.2s;
}

.search-input::placeholder {
  color: #999999;
  font-weight: 400;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #1890ff;
  background-color: #ffffff;
}

/* ==================== RIGHT SECTION ==================== */
.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Action Buttons */
.header-action {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #111111;
  transition: background-color 0.2s;
}

.header-action:hover {
  background-color: #f5f5f5;
}

.header-action:focus-visible {
  outline: 2px solid #1890ff;
  outline-offset: 2px;
}

.header-action.has-label {
  padding: 6px 12px;
}

.header-action .icon {
  background-color: #111111;
}

.action-label {
  white-space: nowrap;
}

/* Badge */
.badge-count {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: #ff4d4f;
  color: white;
  font-size: 10px;
  font-weight: 600;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid #ffffff;
}

/* Avatar */
.header-avatar {
  border-radius: 50%;
  cursor: pointer;
  margin-left: 4px;
}

.header-avatar:hover {
  opacity: 0.8;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 1024px) {
  .header-search {
    width: 280px;
  }

  .action-label {
    display: none;
  }

  .header-action.has-label {
    padding: 8px;
  }
}

@media (max-width: 768px) {
  .header-branding {
    gap: 8px;
  }

  .header-logo {
    display: none;
  }

  .header-search {
    width: 200px;
  }

  .search-input {
    font-size: 12px;
  }
}
</style>
