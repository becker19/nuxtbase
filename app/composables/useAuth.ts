// /composables/useAuth.ts
import { ref } from "vue";
import { useRouter } from "vue-router";

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    token_type: string;
  };
}

export const useAuth = () => {
  const router = useRouter();
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Inicializar token desde localStorage en cliente
  if (import.meta.client) {
    const stored = localStorage.getItem("token");
    if (stored) token.value = stored;
  }

  const { $api } = useNuxtApp();

  // Función de login
  // const login = async (email: string, password: string) => {
  //   loading.value = true;
  //   error.value = null;

  //   try {
  //     const response = await $api.post<LoginResponse>("/login", {
  //       email,
  //       password,
  //     });

  //     const data = response.data;

  //     if (data.success) {
  //       token.value = data.data.access_token;
  //       me();

  //       // Guardar token en localStorage
  //       if (import.meta.client && token.value) {
  //         localStorage.setItem("token", token.value);
  //       }

  //       const menuGet = localStorage.getItem("menu");
  //       const meGet = localStorage.getItem("me");

  //       if (menuGet?.trim() && meGet?.trim()) {
  //         router.push("/dashboard");
  //       }
  //     } else {
  //       error.value = data.message || "Error al iniciar sesión";
  //     }
  //   } catch (err: any) {
  //     error.value = err.response?.data?.message || "Error al iniciar sesión";
  //   } finally {
  //     loading.value = false;
  //   }
  // };

  // Función de login mejorada
  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $api.post<LoginResponse>("/login", {
        email,
        password,
      });
      const data = response.data;

      if (data.success) {
        token.value = data.data.access_token;

        // Guardar token en localStorage
        if (import.meta.client && token.value) {
          localStorage.setItem("token", token.value);
        }

        // Esperar a que me() termine antes de verificar el storage
        await me();

        const menuGet = localStorage.getItem("menu");
        const meGet = localStorage.getItem("me");

        if (menuGet?.trim() && meGet?.trim()) {
          router.push("/dashboard");
        }
      } else {
        error.value = data.message || "Error al iniciar sesión";
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || "Error al iniciar sesión";
    } finally {
      loading.value = false;
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      // Token ya se envía automáticamente por el interceptor del plugin
      await $api.post("/logout");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }

    // Limpiar token local
    token.value = null;
    // if (import.meta.client) localStorage.removeItem("token");
    if (import.meta.client) localStorage.clear();

    // Redirigir al login
    router.push("/login");
  };

  // EXTRAER ME
  const me = async () => {
    try {
      const response = await $api.get("/me");
      const data = response.data.data;

      // Guardar como string
      if (import.meta.client) {
        localStorage.setItem("me", JSON.stringify(data.me));
        localStorage.setItem("menu", JSON.stringify(data.menu));
      }
    } catch (err) {
      console.error("Error al obtener /me:", err);
    }
  };

  return {
    token,
    loading,
    error,
    login,
    logout,
  };
};
