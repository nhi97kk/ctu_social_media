import { createWebHistory, createRouter } from "vue-router";
import { useUserStore } from "@/stores/user.js";

import Home from "@/views/Home.vue";
import LogIn from "@/views/auth/LogIn.vue";
import SignUp from "@/views/auth/SignUp.vue";
import NotFound from "@/views/NotFound.vue";
import Profile from "@/views/Profile.vue";
import Me from "@/views/Me.vue";
import EditMe from "@/components/me/EditMe.vue";
import Chatbot from "@/views/Chatbot.vue";
import Chat from "@/views/Chat.vue";
import ChatO from "@/components/chat/ChatO.vue";
import ChatSide from "@/components/chat/ChatSide.vue";
import Page from "@/views/Page.vue";
import Group from "@/views/Group.vue";
import GroupPost from "@/components/group/GroupPost.vue";
import GroupPending from "@/components/group/GroupPending.vue";
import GroupMember from "@/components/group/GroupMember.vue";
import Forum from "@/views/Forum.vue";
import ForumTopic from "@/views/ForumTopic.vue";
import ForumQuestion from "@/views/ForumQuestion.vue";
import PostPage from "@/views/PostPage.vue";

//routes
import groupRoutes from "@/router/group.route.js";
import friendRoutes from "@/router/friend.route.js";
import pageRoutes from "@/router/page.route.js";
import productRoute from "@/router/product.route.js";

const routes = [
  {
    path: "/login",
    name: "login-page",
    component: LogIn,
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/signup",
    name: "signup-page",
    component: SignUp,
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/home",
    alias: "/",
    name: "home-page",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/chatbot",
    alias: "/",
    name: "chatbot-page",
    component: Chatbot,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/me",
    name: "me-page",
    component: Me,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/edit-me",
    name: "edit-me-page",
    component: EditMe,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/profile/:id",
    name: "profile",
    component: Profile,
    props: true,
    meta: {
      requiresAuth: true,
    }, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/post/:id",
    name: "post",
    component: PostPage,
    props: true,
    meta: {
      requiresAuth: true,
    }, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/forum",
    meta: {
      requiresAuth: true,
    }, // Truyền các biến trong $route.params vào làm props
    children: [
      {
        path: "",
        name: "forum",
        component: Forum,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/topic/:topicId",
        name: "forum-topic",
        component: ForumTopic,
        props: true,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/question/:questionId",
        name: "forum-question",
        component: ForumQuestion,
        props: true,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: "/chat",
    name: "chat-page",
    component: Chat,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "chat",
        component: ChatO,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: ":chatId",
        name: "chat-message",
        component: ChatSide,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: "/page/:id",
    name: "page",
    component: Page,
    props: true,
    meta: {
      requiresAuth: true,
    }, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/group/:id",
    name: "group",
    component: Group,
    props: true,
    meta: {
      requiresAuth: true,
    }, // Truyền các biến trong $route.params vào làm props
    children: [
      {
        path: "",
        name: "group-discussion",
        component: GroupPost,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "resquest",
        name: "group-resquest",
        component: GroupPending,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "member",
        name: "group-member",
        component: GroupMember,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  friendRoutes,
  productRoute,
  pageRoutes,
  groupRoutes,
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
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
  const isLogin = localStorage.getItem("ctu-social-isLogin");

  if (to.meta.authRoute && isLogin) {
    await store.login();
    if (store.isAuth) {
      return "/home";
    }
  }

  if (to.meta.requiresAuth && !store.isAuth) {
    return "/login";
  }

  if (to.meta.authRoute && store.isAuth) {
    return false;
  }

  return true;
});

export default router;
