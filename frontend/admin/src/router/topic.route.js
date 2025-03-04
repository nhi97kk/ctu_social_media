import TopicPage from '@/views/TopicPage.vue';
import TopicEdit from '@/components/topic/TopicEdit.vue';
import TopicAdd from '@/components/topic/TopicAdd.vue';
import TopicList from '@/components/topic/TopicList.vue';

export default {
  path: '/topics',
  name: 'topic-page',
  component: TopicPage,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      name: 'topic-list',
      component: TopicList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: 'edit/:topicId',
      name: 'topic-edit',
      component: TopicEdit,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: 'add',
      name: 'topic-add',
      component: TopicAdd,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};
