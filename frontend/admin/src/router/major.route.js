import MajorPage from '@/views/MajorPage.vue';
import MajorEdit from '@/components/major/MajorEdit.vue';
import MajorAdd from '@/components/major/MajorAdd.vue';
import MajorList from '@/components/major/MajorList.vue';

export default {
  path: '/majors',
  name: 'major-page',
  component: MajorPage,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      name: 'major-list',
      component: MajorList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: 'edit/:majorId',
      name: 'major-edit',
      component: MajorEdit,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: 'add',
      name: 'major-add',
      component: MajorAdd,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};
