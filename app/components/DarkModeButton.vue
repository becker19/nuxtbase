<style scoped>
button {
  cursor: pointer;
}
</style>

<template>
  <button
    @click="toggle"
    class="p-2 rounded transition-colors bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
  >
    <component :is="isDark ? Sun : Moon" class="w-6 h-6" />
  </button>
</template>

<script setup lang="ts">
import { useDarkMode } from "~/composables/useDarkMode";
import { Sun, Moon } from "lucide-vue-next";

const { isDark, toggle } = useDarkMode();
</script>

<!-- <template>
  <button
    @click="toggle"
    class="px-4 py-2 rounded transition-colors bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 flex items-center gap-2"
  >
    <span v-if="isDark">🌞 Modo Claro</span>
    <span v-else>🌙 Modo Oscuro</span>
  </button>
</template>

<script setup lang="ts">
import { useDarkMode } from "~/composables/useDarkMode";

const { isDark, toggle } = useDarkMode();
</script>

<style scoped>
button {
  cursor: pointer;
}
</style> -->
