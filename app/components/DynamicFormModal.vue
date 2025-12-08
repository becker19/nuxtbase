<script setup lang="ts">
import { ref, reactive, watch } from "vue";

// ----------------------
// Tipos
// ----------------------
interface Field {
  key: string;
  label: string;
  type: "input" | "textarea" | "select" | "date";
  props?: {
    options?: { label: string; value: string | number | null }[];
    [key: string]: any;
  };
}

// ----------------------
// Props
// ----------------------
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: "Formulario" },
  size: { type: String, default: "md" },
  submitText: { type: String, default: "Guardar" },
  cancelText: { type: String, default: "Cancelar" },
  initialData: { type: Object, default: () => ({}) },
  fields: { type: Array as () => Field[], default: () => [] },
});

const emit = defineEmits(["update:modelValue", "submit"]);

// ----------------------
// Estado
// ----------------------
const isOpen = ref(props.modelValue);
const formData = reactive({ ...props.initialData });

// Sincronización con modelValue
watch(
  () => props.modelValue,
  (val) => (isOpen.value = val)
);
watch(isOpen, (val) => emit("update:modelValue", val));
watch(
  () => props.initialData,
  (val) => Object.assign(formData, val)
);

// ----------------------
// Funciones
// ----------------------
const close = (): void => {
  isOpen.value = false;
};

const submit = (): void => {
  emit("submit", { ...formData });
  close();
};
</script>

<template>
  <UModal v-model:open="isOpen" :size="size">
    <!-- Header -->
    <template #header>
      <h3 class="text-lg font-semibold">{{ title }}</h3>
    </template>

    <!-- Body -->
    <template #body>
      <div class="flex flex-col gap-4 p-4">
        <component
          v-for="field in fields"
          :key="field.key"
          :is="
            field.type === 'input'
              ? 'UInput'
              : field.type === 'textarea'
              ? 'UTextarea'
              : field.type === 'select'
              ? 'USelect'
              : field.type === 'date'
              ? 'UDatepicker'
              : 'UInput'
          "
          v-model="formData[field.key]"
          :placeholder="field.label"
          v-bind="field.props"
        />
      </div>
    </template>

    <!-- Footer -->
    <template #footer>
      <UButton :label="cancelText" variant="outline" @click="close" />
      <UButton :label="submitText" color="primary" @click="submit" />
    </template>
  </UModal>
</template>
