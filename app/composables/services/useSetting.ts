export const useSetting = () => {
  // 🌍 Estado global
  const settingApp = useState<any>("settingApp", () => null);
  const loading = useState<boolean>("settingLoading", () => false);
  const error = useState<string | null>("settingError", () => null);

  const nuxtApp = useNuxtApp();

  const fetchSettingApp = async () => {
    // Evitar llamadas duplicadas
    if (settingApp.value) return;

    loading.value = true;
    error.value = null;

    try {
      const response = await nuxtApp.$api.get("/app-setting");
      const data = response.data?.data;
      console.log("🚀 ~ fetchSettingApp ~ data:", data);

      if (Array.isArray(data) && data.length > 0) {
        settingApp.value = data[0];
      }
    } catch (err) {
      error.value = "Error al obtener la configuración";
      console.error("fetchSettingApp:", err);
    } finally {
      loading.value = false;
    }
  };

  const updateSetting = async (id: any, payload: any) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await nuxtApp.$api.put(`/setting/${id}`, payload);

      // Actualiza el estado global con la respuesta
      settingApp.value = response.data?.data;
      return response.data;
    } catch (err) {
      error.value = "Error al actualizar la configuración";
      console.error("updateSetting:", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchMenu = async () => {
    try {
      await nuxtApp.$api.get("/menu");
    } catch (err) {
      console.error("fetchMenu:", err);
    }
  };

  return {
    // estado
    settingApp,
    loading,
    error,

    // acciones
    fetchSettingApp,
    updateSetting,
    fetchMenu,
  };
};
