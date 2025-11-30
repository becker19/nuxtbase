export default defineNuxtRouteMiddleware((to) => {
  // Obtener token solo en cliente
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const hasToken = !!token && token !== "undefined" && token !== "";

  // Redirigir desde "/"
  if (to?.path === "/") {
    return hasToken ? navigateTo("/dashboard") : navigateTo("/login");
  }

  // Si la página requiere autenticación y no hay token → login
  if ((to.meta.requiresAuth as boolean) && !hasToken) {
    return navigateTo("/login");
  }

  // Si la página es pública y ya hay token → dashboard
  // Esto asegura que no puedas entrar a /login o /register si ya estás logeado
  const isPublic =
    to.meta.requiresAuth === false ||
    to.meta.public ||
    to.path === "/login" ||
    to.path === "/register";
  if (hasToken && isPublic) {
    return navigateTo("/dashboard");
  }

  // En cualquier otro caso, permitir navegación
});
