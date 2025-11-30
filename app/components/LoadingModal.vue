<template>
  <div
    v-if="props.show"
    class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
  >
    <div class="bg-white p-6 rounded flex flex-col items-center gap-4">
      <p>{{ props.message || "Cargando..." }}</p>
      <div
        class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface LoadingModalProps {
  show: boolean;
  message?: string;
}

const props = defineProps<LoadingModalProps>();
</script>
