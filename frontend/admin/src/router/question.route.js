import QuestionPage from '@/views/QuestionPage.vue';
import QuestionDetail from '@/components/question/QuestionDetail.vue';
import QuestionList from '@/components/question/QuestionList.vue';

export default {
  path: '/questions',
  name: 'question-page',
  component: QuestionPage,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      name: 'question-list',
      component: QuestionList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: ':questionId',
      name: 'question-detail',
      component: QuestionDetail,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};
