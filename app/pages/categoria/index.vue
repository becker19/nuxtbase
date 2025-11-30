<script setup lang="ts">
import DataTable2 from "@/components/DynamicTable2.vue";
import type { Column, Field, Action } from "@/components/DynamicTable2.vue";
import { useNuxtApp } from "#app";
import { useConfirm } from "~/composables/useConfirm"; // ✅ IMPORTANTE

// Obtener función para abrir el modal
const { ask } = useConfirm(); // ✅

const columns: Column[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripcion" },
];

const formFields: Field[] = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripcion" },
];

// Tipo usuario
interface User {
  id: number;
  name: string;
  description: string;
  status: string;
}

// Acciones por fila
const actions: Action[] = [
  {
    label: "Eliminar",
    handle: async (row: User) => {
      const { $api } = useNuxtApp();
      const toast = useToast();

      try {
        const res = await $api.delete(`/categoria/${row.id}`);

        toast.add({
          title: "Éxito",
          description: res.data.message, // 👈 mensaje del backend
          color: "success",
        });
      } catch (err: any) {
        toast.add({
          title: "Error",
          description: err?.response?.data?.message || "Ocurrió un error",
          color: "error",
        });
      }
    },
  },
  {
    label: "Activar",
    handle: async (row: User) => {
      ask(async () => {
        const { $api } = useNuxtApp();
        try {
          await $api.put(`/users/${row.id}/activate`);
          console.log(`Usuario ${row.name} activado`);
        } catch (err: any) {
          console.error(err);
        }
      }, `¿Activar al usuario "${row.name}"?`);
    },
  },
];
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Categoria</h1>

    <DataTable2
      api-url="/categoria"
      :columns="columns"
      :form-fields="formFields"
      key-field="id"
      :actions="actions"
      :per-page="5"
      :show-search="true"
    />
  </div>
</template>
