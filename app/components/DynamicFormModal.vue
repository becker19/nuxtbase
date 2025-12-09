<script setup lang="ts">
import { ref, reactive, watch } from "vue";

interface Field {
  key: string;
  label: string;
  type: "input" | "textarea" | "select" | "date";
  props?: {
    options?: { label: string; value: string | number | null }[];
    [key: string]: any;
  };
}

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

const isOpen = ref(props.modelValue);

// Creamos formData asegurando que todas las keys existen
const formData = reactive<Record<string, any>>({});
props.fields.forEach((f) => {
  formData[f.key] =
    props.initialData[f.key] ?? (f.type === "select" ? null : "");
});

// Sincronización con modelValue
watch(
  () => props.modelValue,
  (val) => (isOpen.value = val)
);
watch(isOpen, (val) => emit("update:modelValue", val));

// Sincronización con initialData
watch(
  () => props.initialData,
  (val) => {
    props.fields.forEach((f) => {
      formData[f.key] = val[f.key] ?? formData[f.key];
    });
  }
);

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
        <div v-for="field in fields" :key="field.key" class="flex flex-col">
          <!-- Renderizamos label explícitamente -->
          <label class="mb-1 font-medium text-gray-700">{{
            field.label
          }}</label>

          <UInput
            v-if="field.type === 'input'"
            v-model="formData[field.key]"
            v-bind="field.props"
          />
          <UTextarea
            v-else-if="field.type === 'textarea'"
            v-model="formData[field.key]"
            v-bind="field.props"
          />
          <USelect
            v-else-if="field.type === 'select'"
            v-model="formData[field.key]"
            :options="field.props?.options || []"
            v-bind="field.props"
          />
          <UDatepicker
            v-else-if="field.type === 'date'"
            v-model="formData[field.key]"
            v-bind="field.props"
          />
        </div>
      </div>
    </template>

    <!-- Footer -->
    <template #footer>
      <UButton :label="cancelText" variant="outline" @click="close" />
      <UButton :label="submitText" color="primary" @click="submit" />
    </template>
  </UModal>
</template>
