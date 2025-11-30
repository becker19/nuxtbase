<script setup lang="ts">
import DataTable2 from "@/components/DynamicTable2.vue";
import type { Column, Field, Action } from "@/components/DynamicTable2.vue";
import { useNuxtApp } from "#app";

// ---------------------------
// Definición de columnas
// ---------------------------
const columns: Column[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripcion" },
  // { key: "status", label: "Estado" },
];

// ---------------------------
// Campos del formulario
// ---------------------------
const formFields: Field[] = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripcion" },
  // { key: "status", label: "Estado" },
];

// ---------------------------
// Acciones por fila
// ---------------------------
interface User {
  id: number;
  name: string;
  description: string;
  status: string;
}

const actions: Action[] = [
  {
    label: "Eliminar",
    handle: async (row: User) => {
      const { $api } = useNuxtApp();
      try {
        await $api.delete(`/users/${row.id}`);
        alert(`Usuario ${row.name} eliminado`);
      } catch (err: any) {
        alert(err?.message || "Error al eliminar");
      }
    },
  },
  {
    label: "Activar",
    handle: async (row: User) => {
      const { $api } = useNuxtApp();
      try {
        await $api.put(`/users/${row.id}/activate`);
        alert(`Usuario ${row.name} activado`);
      } catch (err: any) {
        alert(err?.message || "Error al activar");
      }
    },
  },
];
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Categoria</h1>

    <!-- Componente hijo -->
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
