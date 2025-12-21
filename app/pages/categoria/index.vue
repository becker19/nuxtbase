<script setup lang="ts">
import DataTable2 from "@/components/DynamicTable2.vue";
import type { Column, Field, Action } from "@/components/DynamicTable2.vue";
import { useNuxtApp } from "#app";
import { useToast } from "#imports";
import { useConfirm } from "@/composables/useConfirm";

const { ask } = useConfirm();
const { $api } = useNuxtApp();
const toast = useToast();

interface User {
  id: number;
  name: string;
  description: string;
  status: string;
}

const columns: Column[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción" },
];

const formFields: Field[] = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción" },
];

const actions: Action[] = [
  {
    label: "Editar",
    handle: async (row: User) => {
      /* Ya emite 'edit' automáticamente */
    },
  },
  {
    label: "Eliminar",
    handle: async (row: User) => {
      await ask(async () => {
        await $api.delete(`/categoria/${row.id}`);
        toast.add({
          title: "Éxito",
          description: `Se eliminó ${row.name}`,
          color: "success",
        });
      }, `¿Eliminar al usuario "${row.name}"?`);
    },
  },
  {
    label: "Activar",
    handle: async (row: User) => {
      await ask(async () => {
        await $api.put(`/users/${row.id}/activate`);
        toast.add({
          title: "Éxito",
          description: `Usuario ${row.name} activado`,
          color: "success",
        });
      }, `¿Activar al usuario "${row.name}"?`);
    },
  },
];

const modalVisible = ref(false);
const modalTitle = ref("Nuevo registro");
const form = ref<Record<string, any>>({});
const tableRef = ref<any>(null);

/* Abrir modal */
function openModal(row: User | null = null) {
  if (row) {
    modalTitle.value = "Editar registro";
    form.value = { ...row };
  } else {
    modalTitle.value = "Nuevo registro";
    form.value = Object.fromEntries(formFields.map((f) => [f.key, ""]));
  }
  modalVisible.value = true;
}

/* Guardar registro */
async function submitForm() {
  try {
    if (form.value.id) {
      const res = await $api.put(`/categoria/${form.value.id}`, form.value);
      toast.add({
        title: "Actualizado",
        description: res.data.message,
        color: "success",
      });
    } else {
      const res = await $api.post("/categoria", form.value);
      toast.add({
        title: "Creado",
        description: res.data.message,
        color: "success",
      });
    }
    modalVisible.value = false;

    // 🔹 Refrescar tabla automáticamente
    tableRef.value?.fetchData?.();
  } catch (err: any) {
    toast.add({
      title: "Error",
      description: err?.response?.data?.message || "Ocurrió un error",
      color: "error",
    });
  }
}
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Categorías</h1>

    <DataTable2
      ref="tableRef"
      api-url="/categoria"
      :columns="columns"
      :form-fields="formFields"
      key-field="id"
      :actions="actions"
      :per-page="5"
      :show-search="true"
      @edit="openModal"
    />

    <UModal v-model:open="modalVisible" size="lg">
      <template #header
        ><h3 class="text-lg font-semibold">{{ modalTitle }}</h3></template
      >
      <template #body>
        <div class="flex flex-col gap-4 p-4">
          <UInput
            v-for="f in formFields"
            :key="f.key"
            v-model="form[f.key]"
            :placeholder="f.label"
          />
        </div>
      </template>
      <template #footer>
        <UButton
          label="Cancelar"
          variant="outline"
          @click="modalVisible = false"
        />
        <UButton label="Guardar" color="primary" @click="submitForm" />
      </template>
    </UModal>
  </div>
</template>
