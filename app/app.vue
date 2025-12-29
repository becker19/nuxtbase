<script setup lang="ts">
import { useSetting } from "@/composables/services/useSetting";

const { settingApp, fetchSettingApp } = useSetting();

await fetchSettingApp();

watch(
  () => settingApp.value?.theme,
  (theme) => {
    if (theme) {
      document.documentElement.style.setProperty("--ui-primary", theme);
    }
  },
  { immediate: true }
);
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ConfirmDialog />
  </UApp>
</template>

<!-- <script setup lang="ts">
import { useSetting } from "@/composables/services/useSetting";

const { fetchSettingApp } = useSetting();
await fetchSettingApp();
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ConfirmDialog />
  </UApp>
</template> -->
