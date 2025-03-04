import Pages from "@/views/Pages.vue";
import PageFeed from "@/components/page/PageFeed.vue";
import PageLiked from "@/components/page/PageLiked.vue";
import PageSuggest from "@/components/page/PageSuggest.vue";
import PageYour from "@/components/page/PageYour.vue";

export default {
  path: "/pages",
  name: "page-page",
  component: Pages,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: "",
      name: "page-feed",
      component: PageFeed,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "liked",
      name: "page-liked",
      component: PageLiked,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "suggest",
      name: "page-suggest",
      component: PageSuggest,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "your",
      name: "page-your",
      component: PageYour,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};
