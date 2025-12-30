import { createRouter, createWebHistory } from 'vue-router'
import CandidateList from '../views/candidates/CandidateList.vue'
import RecruitmentNews from '../views/recruiments/RecruitmentNews.vue'
import CalendarView from '../views/calendar/CalendarView.vue'
import PlaceholderView from '../views/common/PlaceholderView.vue'
import JobView from '../views/job/JobList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/candidates',
    },
    {
      path: '/recruitment-news',
      name: 'recruitment-news',
      component: RecruitmentNews,
      meta: {
        title: 'Tin tuyển dụng',
      },
    },
    {
      path: '/candidates',
      name: 'candidates',
      component: CandidateList,
      meta: {
        title: 'Ứng viên',
      },
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
      meta: {
        title: 'Lịch',
      },
    },
    {
      path: '/potential',
      name: 'potential',
      component: PlaceholderView,
      meta: {
        title: 'Kho tiềm năng',
      },
    },
    {
      path: '/campaign',
      name: 'campaign',
      component: PlaceholderView,
      meta: {
        title: 'Chiến dịch tuyển dụng',
      },
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: JobView,
      meta: {
        title: 'Công việc',
      },
    },
    {
      path: '/ai-marketing',
      name: 'ai-marketing',
      component: PlaceholderView,
      meta: {
        title: 'AI Marketing',
      },
    },
    {
      path: '/communication',
      name: 'communication',
      component: PlaceholderView,
      meta: {
        title: 'Trao đổi với ứng viên',
      },
    },
    {
      path: '/reports',
      name: 'reports',
      component: PlaceholderView,
      meta: {
        title: 'Báo cáo',
      },
    },
    {
      path: '/other',
      name: 'other',
      component: PlaceholderView,
      meta: {
        title: 'Khác',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: PlaceholderView,
      meta: {
        title: 'Không tìm thấy trang',
      },
    },
  ],
})

export default router
