import ReportPage from '@/views/ReportPage.vue';
import ReportList from '@/components/report/ReportList.vue';

export default {
  path: '/reports',
  name: 'report-page',
  component: ReportPage,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      name: 'report-list',
      component: ReportList,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};
