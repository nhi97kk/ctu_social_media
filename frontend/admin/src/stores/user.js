import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import userService from '@/services/user.service.js';
import Swal from 'sweetalert2';

export const useUserStore = defineStore('user', () => {
  const email = ref('');
  const role = ref('');
  //   const photo = ref('');

  const isAuth = computed(() => {
    return email.value !== '' && role.value !== '';
  });

  async function login(data) {
    try {
      const response = data
        ? await userService.login(data)
        : await userService.getMe();

      if (response.data?.user?.role === 'admin') {
        email.value = response.data.user.email;
        role.value = response.data.user.role;
        // photo.value = response.user.photo;
        localStorage.setItem('hiworld201-isLogin', true);

        await Swal.fire({
          icon: 'success',
          title: response.message || 'Log in successfully.',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        throw new Error('Invalid login information');
      }
    } catch (err) {
      email.value = '';
      role.value = '';
      //   photo.value = '';
      localStorage.removeItem('hiworld201-isLogin');

      await Swal.fire({
        icon: 'error',
        title: err.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  async function logout() {
    try {
      await userService.logout();
      email.value = '';
      role.value = '';
      localStorage.removeItem('hiworld201-isLogin');

      await Swal.fire({
        icon: 'success',
        title: 'Log out successfully.',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: err.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  return { email, role, isAuth, login, logout };
});

