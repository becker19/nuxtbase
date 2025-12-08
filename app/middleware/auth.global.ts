export default defineNuxtRouteMiddleware((to) => {
  // Evitar acceso a localStorage en el servidor
  if (import.meta.server) return;

  const token = localStorage.getItem("token");
  const hasToken = Boolean(token && token !== "undefined" && token !== "");

  // Rutas públicas
  const publicPages = ["/login", "/register"];
  const isPublic = publicPages.includes(to.path);

  // Usuario NO logueado intentando ir a ruta privada
  if (!hasToken && !isPublic) {
    return navigateTo("/login");
  }

  // Usuario logueado intentando entrar a login/register
  if (hasToken && isPublic) {
    return navigateTo("/dashboard");
  }

  // Si entra a la raíz "/"
  if (to.path === "/") {
    return navigateTo(hasToken ? "/dashboard" : "/login");
  }
});
