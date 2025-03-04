import { ref, computed } from "vue";
import { defineStore } from "pinia";
import userService from "@/services/user.service.js";
import Swal from "sweetalert2";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const $toast = useToast();

export const useUserStore = defineStore("user", () => {
  const email = ref("");
  const role = ref("");
  const user = ref(null);

  const isAuth = computed(() => {
    return email.value !== "" && role.value !== "";
  });

  async function login(data) {
    try {
      const response = data
        ? await userService.login(data)
        : await userService.getMe();

      if (
        response.data?.user?.role === "user" ||
        response.data?.user?.role === "teacher" ||
        response.data?.user?.role === "admin"
      ) {
        email.value = response.data.user.email;
        role.value = response.data.user.role;
        localStorage.setItem("ctu-social-isLogin", true);

        await Swal.fire({
          icon: "success",
          title: response.message || "Log in successfully!",
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        throw new Error("The login information is invalid.");
      }
    } catch (err) {
      email.value = "";
      role.value = "";
      localStorage.removeItem("ctu-social-isLogin");

      $toast.error(
        err.message || "An error occurred! Please try again later.",
        {
          position: "top-right",
        }
      );
    }
  }

  async function getMe() {
    try {
      const response = await userService.getMe();

      if (response.status === "success") {
        user.value = response.data.user;
      } else {
        $toast.error("An error occurred! Please try again later.", {
          position: "top-right",
        });
      }
    } catch (err) {
      $toast.error("An error occurred! Please try again later.", {
        position: "top-right",
      });
    }
  }

  async function logout() {
    try {
      await userService.logout();
      email.value = "";
      role.value = "";
      localStorage.removeItem("ctu-social-isLogin");

      await Swal.fire({
        icon: "success",
        title: "Logout successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      $toast.error("An error occurred! Please try again later.", {
        position: "top-right",
      });
    }
  }

  return { email, role, user, isAuth, login, getMe, logout };
});
