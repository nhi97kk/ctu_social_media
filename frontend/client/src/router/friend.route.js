import Friend from "@/views/Friend.vue";
import FriendAll from "@/components/friend/FriendAll.vue";
import FriendRes from "@/components/friend/FriendRes.vue";
import FriendFriend from "@/components/friend/FriendFriend.vue";

export default {
  path: "/friends",
  name: "friend-page",
  component: Friend,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: "",
      name: "friend-friend",
      component: FriendFriend,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "all",
      name: "friend-all",
      component: FriendAll,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "res",
      name: "friend-res",
      component: FriendRes,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};
