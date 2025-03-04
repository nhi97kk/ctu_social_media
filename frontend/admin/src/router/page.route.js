import PagePage from '@/views/PagePage.vue';
import PageDetail from '@/components/page/PageDetail.vue';
import PageList from '@/components/page/PageList.vue';

export default {
  path: '/pages',
  name: 'page-page',
  component: PagePage,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      name: 'page-list',
      component: PageList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: ':pageId',
      name: 'page-detail',
      component: PageDetail,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};
