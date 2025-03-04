import CommentPage from '@/views/CommentPage.vue';
import CommentDetail from '@/components/comment/CommentDetail.vue';
import CommentList from '@/components/comment/CommentList.vue';

export default {
  path: '/comments',
  name: 'comment-page',
  component: CommentPage,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      name: 'comment-list',
      component: CommentList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: ':commentId',
      name: 'comment-detail',
      component: CommentDetail,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};
