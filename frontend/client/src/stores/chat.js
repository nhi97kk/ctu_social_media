import { defineStore } from "pinia";
import { ref } from "vue";
import io from "socket.io-client";

export const useChatStore = defineStore("chat", () => {
  const socket = ref(null);
  const onlineUsers = ref([]);
  const isUserOnline = (userId) => {
    return onlineUsers.value.some(
      (user) => user.userId.toString() === userId.toString()
    );
  };

  const setupSocket = () => {
    socket.value = io(`${import.meta.env.VITE_BACKEND_URL}`);
    socket.value.on("get-users", (users) => {
      onlineUsers.value = users;
    });
  };

  return { socket, onlineUsers, setupSocket, isUserOnline };
});
