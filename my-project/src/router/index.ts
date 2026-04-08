import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "welcome",
      component: () => import("../views/WelcomeView.vue")
    },
    {
      path: "/chat",
      name: "chat",
      component: () => import("../views/ChatView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: { guestOnly: true }
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
      meta: { guestOnly: true }
    }
  ]
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (authStore.token && !authStore.user) {
    await authStore.bootstrap();
  }

  if (to.meta.requiresAuth && !authStore.token) {
    return { name: "login" };
  }

  if (to.meta.guestOnly && authStore.token) {
    return { name: "chat" };
  }

  return true;
});

export default router;
