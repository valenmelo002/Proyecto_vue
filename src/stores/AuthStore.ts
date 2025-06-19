import router from '@/router';
import AuthService from '@/services/AuthService';
import { defineStore } from 'pinia';

export const authSetStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
  }),

  actions: {
    async login(userData: { email: string, password: string }): Promise<void> {
      const auth = new AuthService();
      const login = await auth.login(userData.email, userData.password);

      if (login.errors?.[0]) {
        alert(login.errors[0].message);
      } else {
        const token = login.token.token; // Accede al string del token
        const user = login.user;

        this.token = token;
        this.user = user;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        router.push('/dashboard');
      }
    },

    isAuthenticated(): boolean {
      return !!this.token;
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  }
});
