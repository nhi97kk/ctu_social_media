import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user.js';

// Components
import LoginPage from '@/views/auth/LoginPage.vue';
import ForgotPassword from '@/views/auth/ForgotPassword.vue';
import ResetPassword from '@/views/auth/ResetPassword.vue';
import HomePage from '@/views/HomePage.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import PdfContentPage from '@/views/PdfContentPage.vue';

import NotFound from '@/views/NotFound.vue';

// Routes
import reportRoutes from '@/router/report.route.js';
import answerRoutes from '@/router/answer.route.js';
import questionRoutes from '@/router/question.route.js';
import topicRoutes from '@/router/topic.route.js';
import groupRoutes from '@/router/group.route.js';
import pageRoutes from '@/router/page.route.js';
import commentRoutes from '@/router/comment.route.js';
import productRoutes from '@/router/product.route.js';
import postRoutes from '@/router/post.route.js';
import userRoutes from '@/router/user.route.js';
import majorRoutes from '@/router/major.route.js';

const routes = [
  {
    path: '/login',
    name: 'login-page',
    component: LoginPage,
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/reset-password/:resetToken',
    name: 'reset-password',
    component: ResetPassword,
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/home',
    alias: '/',
    name: 'home-page',
    component: HomePage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile',
    name: 'profile-page',
    component: ProfilePage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/pdfContent',
    name: 'pdfContent-page',
    component: PdfContentPage,
    meta: {
      requiresAuth: true,
    },
  },
  reportRoutes,
  topicRoutes,
  questionRoutes,
  answerRoutes,
  groupRoutes,
  pageRoutes,
  commentRoutes,
  productRoutes,
  userRoutes,
  majorRoutes,
  postRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
});

router.beforeEach(async (to, from) => {
  const store = useUserStore();
  const isLogin = localStorage.getItem('hiworld201-isLogin');

  if (to.meta.authRoute && isLogin) {
    await store.login();
    if (store.isAuth) {
      return '/home';
    }
  }

  if (to.meta.requiresAuth && !store.isAuth) {
    return '/login';
  }

  if (to.meta.authRoute && store.isAuth) {
    return false;
  }

  return true;
});

export default router;

