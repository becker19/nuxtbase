import { ref } from "vue";
import { useRouter } from "vue-router";

interface SettingResponse {
  success: boolean;
  message: string;
  data: any;
}

export const useSetting = () => {
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

  const menuGet = async () => {
    try {
      await $api.get("menu");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return {
    menuGet,
  };
};
