// composables/useDarkMode.ts
import { ref, watch, onMounted } from "vue";

export const useDarkMode = () => {
  const isDark = ref(false);

  onMounted(() => {
    // Revisar preferencia guardada o sistema
    const saved = localStorage.getItem("dark-mode");
    isDark.value =
      saved === "true" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    updateHtmlClass();
  });

  const toggle = () => {
    isDark.value = !isDark.value;
  };

  const updateHtmlClass = () => {
    const html = document.documentElement;
    if (isDark.value) html.classList.add("dark");
    else html.classList.remove("dark");
    localStorage.setItem("dark-mode", String(isDark.value));
  };

  watch(isDark, () => {
    updateHtmlClass();
  });

  return { isDark, toggle };
};
