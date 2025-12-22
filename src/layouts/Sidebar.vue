<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isCollapsed = ref(false)

// Menu items
const menuItems = [
  {
    id: 'recruitment-news',
    label: 'Tin tuyển dụng',
    icon: 'icon-sb-recruiment',
    route: '/recruitment-news',
  },
  {
    id: 'candidates',
    label: 'Ứng viên',
    icon: 'icon-sb-candidate',
    route: '/candidates',
  },
  {
    id: 'calendar',
    label: 'Lịch',
    icon: 'icon-sb-calendar',
    route: '/calendar',
  },
  {
    id: 'potential',
    label: 'Kho tiềm năng',
    icon: 'icon-sb-potential',
    route: '/potential',
  },
  {
    id: 'campaign',
    label: 'Chiến dịch tuyển dụng',
    icon: 'icon-sb-campaign',
    route: '/campaign',
  },
  {
    id: 'jobs',
    label: 'Công việc',
    icon: 'icon-sb-job',
    route: '/jobs',
  },
  {
    id: 'ai-marketing',
    label: 'AI Marketing',
    icon: 'icon-sb-aimarketing',
    route: '/ai-marketing',
  },
  {
    id: 'communication',
    label: 'Trao đổi với ứng viên',
    icon: 'icon-sb-communication',
    route: '/communication',
  },
  {
    id: 'reports',
    label: 'Báo cáo',
    icon: 'icon-sb-report',
    route: '/reports',
  },
  {
    id: 'other',
    label: 'Khác',
    icon: 'icon-sb-other',
    route: '/other',
  },
]

// Check active item based on current route
const isActiveItem = (itemRoute) => {
  return route.path.startsWith(itemRoute)
}

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

// Handle navigation
const navigateTo = (itemRoute) => {
  // Router navigation will be handled by router-link
}
</script>

<template>
  <div class="sidebar img-sb-background" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-container">
      <div class="sidebar-list">
        <!-----loop menu item sidebar-->
        <router-link
          v-for="item in menuItems"
          :key="item.id"
          :to="item.route"
          class="sidebar-item"
          :class="{ active: isActiveItem(item.route) }"
          custom
          v-slot="{ navigate, isActive }"
        >
          <div
            class="sidebar-item-wrapper"
            :class="{ active: isActive }"
            @click="navigate"
            role="button"
            :aria-label="item.label"
            tabindex="0"
            @keydown.enter="navigate"
            @keydown.space.prevent="navigate"
          >
            <div class="sidebar-content display-flex align-items-center">
              <div class="sidebar-item-icon icon" :class="item.icon"></div>
              <div class="sidebar-label">{{ item.label }}</div>
            </div>
          </div>
        </router-link>
      </div>
      <!--collapse sidebar-->
      <div class="collapse-sidebar" id="collapse-sidebar-id">
        <div class="collapse-content display-flex align-items-center" @click="toggleSidebar">
          <!-- Icon mở rộng - Hiện khi collapsed -->
          <div v-if="isCollapsed" class="icon icon-arrow-right collapse-icon-expand"></div>
          <!-- Icon thu gọn - Hiện khi không collapsed -->
          <div v-if="!isCollapsed" class="icon icon-arrow-left collapse-icon-collapse"></div>
          <!-- Label - Chỉ hiện khi không collapsed -->
          <div v-if="!isCollapsed" class="collapse-label">Thu gọn</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* ==================== SIDEBAR ==================== */
.content .sidebar {
  width: 230px;
  padding: 20px 8px 8px;
}

.sidebar.collapsed .collapse-icon-expand {
  display: block;
  justify-content: center;
}

.sidebar.collapsed .collapse-content {
  padding: 0;
}

.sidebar.collapsed .collapse-icon-collapse {
  display: none;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar.collapsed .sidebar-label,
.sidebar.collapsed .collapse-label {
  opacity: 0;
  visibility: hidden;
  width: 0;
}

.sidebar.collapsed .sidebar-content,
.sidebar.collapsed .collapse-content {
  justify-content: center;
}

.sidebar .sidebar-item {
  color: #fff;
  cursor: pointer;
  font-weight: 500;
  font-size: 13px;
  width: 100%;
  padding: 8px;
}

.sidebar .sidebar-content {
  width: 100%;
  height: 40px;
  border-radius: 4px;
  padding: 0 12px;
  gap: 12px;
  transition: background-color 0.2s;
}

.sidebar .sidebar-item:hover .sidebar-content {
  background-color: rgba(255, 255, 255, 0.08);
}

.sidebar .sidebar-item.active .sidebar-content {
  background-color: #3d75de;
}

.sidebar .sidebar-item.active:hover .sidebar-content {
  background-color: #4d85ee;
}

.sidebar .sidebar-item-icon {
  margin: 0;
  flex-shrink: 0;
}

.sidebar .sidebar-item-icon .icon {
  background-color: #ffffff;
}

.sidebar .sidebar-label {
  margin: 0;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

/* Collapse */
.collapse-sidebar {
  width: 100%;
  padding: 8px 0 0 0;
  margin-top: 8px;
}

.collapse-content {
  width: 100%;
  height: 36px;
  border-radius: 4px;
  cursor: pointer;
  padding: 0 12px;
  gap: 12px;
  color: #ffffff;
  transition: background-color 0.2s;
  border: solid 1px #ffffff;
}

.collapse-content:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.collapse-content .icon {
  background-color: #ffffff;
}

.collapse-label {
  font-size: 13px;
  color: #ffffff;
}
.sidebar-item-wrapper {
  color: #fff;
  cursor: pointer;
  font-weight: 500;
  font-size: 13px;
  width: 100%;
  padding: 8px;
  text-decoration: none;
  display: block;
}
/* Đổi button collapse thành button thật */
.collapse-content {
  background: none;
  width: 100%;
  height: 36px;
  border-radius: 4px;
  cursor: pointer;
  padding: 0 12px;
  gap: 12px;
  color: #ffffff;
  transition: background-color 0.2s;
}

.collapse-content:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}
</style>
