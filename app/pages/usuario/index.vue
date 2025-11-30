<script setup lang="ts">
import DynamicTable from "@/components/DynamicTable.vue";
import { useNuxtApp } from "#app";

const { $api } = useNuxtApp();

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nombre" },
  { key: "email", label: "Email" },
];

const formFields = [
  { key: "name", label: "Nombre" },
  { key: "email", label: "Email" },
];

const actions = [
  {
    label: "Eliminar",
    color: "bg-red-500 text-white",
    handle: async (row: any) => {
      if (!confirm(`Eliminar ${row.name}?`)) return;
      await $api.delete(`/users/${row.id}`);
    },
  },
  {
    label: "Activar",
    color: "bg-green-500 text-white",
    handle: async (row: any) => {
      await $api.post(`/users/${row.id}/activar`);
    },
  },
];
</script>

<template>
  <DynamicTable
    :columns="columns"
    api-url="/users"
    :show-search="true"
    :form-fields="formFields"
    key-field="id"
    :actions="actions"
  />
</template>
