import Groups from "@/views/Groups.vue";
import GroupFeed from "@/components/group/GroupFeed.vue";
import GroupJoined from "@/components/group/GroupJoined.vue";
import GroupSuggest from "@/components/group/GroupSuggest.vue";
import GroupYour from "@/components/group/GroupYour.vue";

export default {
  path: "/groups",
  name: "page-group",
  component: Groups,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: "",
      name: "group-feed",
      component: GroupFeed,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "joined",
      name: "group-joined",
      component: GroupJoined,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "suggest",
      name: "group-suggest",
      component: GroupSuggest,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "your",
      name: "group-your",
      component: GroupYour,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};
