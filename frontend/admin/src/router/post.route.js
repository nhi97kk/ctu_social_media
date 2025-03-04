import PostPage from '@/views/PostPage.vue';
import PostDetail from '@/components/post/PostDetail.vue';
import PostList from '@/components/post/PostList.vue';

export default {
  path: '/posts',
  name: 'post-page',
  component: PostPage,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      name: 'post-list',
      component: PostList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: ':postId',
      name: 'post-detail',
      component: PostDetail,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};
