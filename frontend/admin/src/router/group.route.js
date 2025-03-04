import GroupPage from '@/views/GroupPage.vue';
import GroupDetail from '@/components/group/GroupDetail.vue';
import GroupList from '@/components/group/GroupList.vue';

export default {
  path: '/groups',
  name: 'group-page',
  component: GroupPage,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      name: 'group-list',
      component: GroupList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: ':groupId',
      name: 'group-detail',
      component: GroupDetail,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};
