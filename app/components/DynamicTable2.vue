<script setup lang="ts">
import { ref, h, resolveComponent } from "vue";
import { useNuxtApp } from "#app";
import { useToast } from "#imports";
import type { TableColumn } from "@nuxt/ui";

/* Componentes Nuxt UI */
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UButton = resolveComponent("UButton");
const UInput = resolveComponent("UInput");
const UModal = resolveComponent("UModal");
const UProgress = resolveComponent("UProgress");
const UTable = resolveComponent("UTable");

/* Emit para eventos */
const emit = defineEmits<{
  (e: "edit", row: any): void;
}>();

/* Toast helper */
const toast = useToast();
function showToast({
  title,
  description = "",
  color = "primary",
}: {
  title: string;
  description?: string;
  color?: "primary" | "success" | "error" | "warning" | "info";
}) {
  toast.add({ title, description, color });
}

/* Props y tipos */
interface Column {
  key: string;
  label: string;
}
interface Field {
  key: string;
  label: string;
}
interface Action {
  label: string;
  handle: (row: any) => Promise<void>;
}
interface Props {
  apiUrl: string;
  columns: Column[];
  formFields: Field[];
  keyField: string;
  actions: Action[];
  showSearch?: boolean;
  perPage?: number;
}
const props = defineProps<Props>();
const { $api } = useNuxtApp();

/* State */
const data = ref<any[]>([]);
const page = ref(1);
const totalPages = ref(1);
const searchQuery = ref("");
const loading = ref(false);

const confirmVisible = ref(false);
const confirmMessage = ref("");
const confirmAction = ref<null | (() => Promise<void>)>(null);

/* Columnas dinámicas */
const columns: TableColumn<any>[] = [
  ...props.columns.map((col) => ({ accessorKey: col.key, header: col.label })),
  {
    id: "actions",
    header: "Acciones",
    cell: (info) =>
      h(
        UDropdownMenu,
        {
          content: { align: "end" },
          items: props.actions.map((a) => ({
            label: a.label,
            onSelect: () => handleAction(a, info.row.original),
          })),
        },
        () =>
          h(UButton, {
            icon: "i-lucide-ellipsis-vertical",
            variant: "ghost",
            color: "neutral",
            size: "sm",
          })
      ),
  },
];

/* Fetch data */
async function fetchData() {
  loading.value = true;
  try {
    const res = await $api.get(props.apiUrl, {
      params: {
        page: page.value,
        per_page: props.perPage || 10,
        search: searchQuery.value,
      },
    });
    data.value = res.data.data.data;
    page.value = res.data.data.current_page;
    totalPages.value = res.data.data.last_page;
  } catch {
    showToast({ title: "Error al cargar datos", color: "error" });
  } finally {
    loading.value = false;
  }
}

/* Exponer fetchData al padre */
defineExpose({ fetchData });

/* Paginación */
function prevPage() {
  if (page.value > 1) {
    page.value--;
    fetchData();
  }
}
function nextPage() {
  if (page.value < totalPages.value) {
    page.value++;
    fetchData();
  }
}

/* Acciones por fila */
async function handleAction(action: Action, row: any) {
  if (action.label.toLowerCase() === "editar") {
    emit("edit", row);
    return;
  }

  confirmMessage.value = `¿Seguro que deseas ejecutar "${action.label}"?`;
  confirmVisible.value = true;
  confirmAction.value = async () => {
    loading.value = true;
    try {
      await action.handle(row);
      showToast({
        title: "Completado",
        description: "Acción realizada correctamente.",
        color: "success",
      });
      fetchData(); // 🔹 refresca los datos automáticamente
    } catch (err: any) {
      showToast({
        title: "Error",
        description: err?.message || "Error inesperado.",
        color: "error",
      });
    } finally {
      loading.value = false;
      confirmVisible.value = false;
    }
  };
}

fetchData();
export type { Column, Field, Action };
</script>

<template>
  <div class="p-4 relative">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-2">
        <UInput
          v-if="props.showSearch !== false"
          v-model="searchQuery"
          placeholder="Buscar..."
          @keyup.enter="fetchData"
          class="w-64"
        />
        <UButton color="primary" icon="i-lucide-search" @click="fetchData" />
      </div>
      <UButton color="primary" label="Nuevo" @click="$emit('edit', null)" />
    </div>

    <UTable :data="data" :columns="columns" sticky />

    <div class="flex justify-end gap-2 mt-4">
      <UButton label="Anterior" @click="prevPage" :disabled="page === 1" />
      <span>{{ page }} / {{ totalPages }}</span>
      <UButton
        label="Siguiente"
        @click="nextPage"
        :disabled="page === totalPages"
      />
    </div>

    <UModal v-model:open="confirmVisible" size="sm">
      <template #header
        ><h3 class="text-lg font-semibold text-red-600">
          Confirmación
        </h3></template
      >
      <template #body
        ><p class="text-gray-700">{{ confirmMessage }}</p></template
      >
      <template #footer>
        <UButton
          label="Cancelar"
          variant="outline"
          @click="confirmVisible = false"
        />
        <UButton
          label="Confirmar"
          color="red"
          @click="confirmAction && confirmAction()"
        />
      </template>
    </UModal>

    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-white/50 z-50"
    >
      <UProgress linear indeterminate />
    </div>
  </div>
</template>
