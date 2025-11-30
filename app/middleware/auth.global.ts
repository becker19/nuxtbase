// /middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const publicPages = ["/login", "/register"];

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    // Si no hay token y es página privada → redirige a login
    if (!token && !publicPages.includes(to.path)) {
      return navigateTo("/login");
    }

    // Si hay token y intenta acceder a login/register → redirige a dashboard
    if (token && publicPages.includes(to.path)) {
      return navigateTo("/dashboard"); // Ajusta según tu ruta real
    }
  }
});
