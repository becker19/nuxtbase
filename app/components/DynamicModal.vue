<template>
  <div
    v-if="props.show"
    class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
  >
    <div class="bg-white p-6 rounded w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">{{ props.title }}</h2>
      <slot name="body" />
      <div class="mt-4 flex justify-end gap-2">
        <button @click="close" class="px-4 py-2 border rounded">
          Cancelar
        </button>
        <button
          @click="confirm"
          class="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DynamicModalProps {
  show: boolean;
  title: string;
}

const props = defineProps<DynamicModalProps>();
const emit = defineEmits(["close", "confirm"]);

function close() {
  emit("close");
}
function confirm() {
  emit("confirm");
}
</script>
