import AnswerPage from '@/views/AnswerPage.vue';
import AnswerDetail from '@/components/answer/AnswerDetail.vue';
import AnswerList from '@/components/answer/AnswerList.vue';

export default {
  path: '/answers',
  name: 'answer-page',
  component: AnswerPage,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      name: 'answer-list',
      component: AnswerList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: ':answerId',
      name: 'answer-detail',
      component: AnswerDetail,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};
