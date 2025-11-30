<script setup lang="ts">
import { ref, h } from "vue";
import { useNuxtApp } from "#app";
import { useToast } from "#imports";
import type { TableColumn } from "@nuxt/ui";

const UDropdownMenu = resolveComponent("UDropdownMenu");
const UButton = resolveComponent("UButton");
const UInput = resolveComponent("UInput");
const UModal = resolveComponent("UModal");
const UProgress = resolveComponent("UProgress");

const toast = useToast();

/* --------------------------------------------------
   Tipos
-------------------------------------------------- */
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

/* --------------------------------------------------
   Props
-------------------------------------------------- */
const props = defineProps<Props>();
const { $api } = useNuxtApp();

/* --------------------------------------------------
   State
-------------------------------------------------- */
const data = ref<any[]>([]);
const page = ref(1);
const totalPages = ref(1);
const searchQuery = ref("");
const loading = ref(false);

const modalVisible = ref(false);
const modalTitle = ref("Nuevo registro");
const form = ref<Record<string, any>>({});

/* --------------------------------------------------
   Modal de confirmación
-------------------------------------------------- */
const confirmVisible = ref(false);
const confirmMessage = ref("");
const confirmAction = ref<null | (() => Promise<void>)>(null);

/* --------------------------------------------------
   Columnas dinámicas
-------------------------------------------------- */
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

/* --------------------------------------------------
   Fetch data
-------------------------------------------------- */
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
  } catch (err) {
    toast.add({ title: "Error al cargar datos", color: "error" });
  } finally {
    loading.value = false;
  }
}

/* --------------------------------------------------
   Paginación
-------------------------------------------------- */
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

/* --------------------------------------------------
   Modal crear / editar
-------------------------------------------------- */
function openModal(item: any = null) {
  if (item) {
    modalTitle.value = "Editar registro";
    form.value = { ...item };
  } else {
    modalTitle.value = "Nuevo registro";
    form.value = Object.fromEntries(props.formFields.map((f) => [f.key, ""]));
  }
  modalVisible.value = true;
}

/* --------------------------------------------------
   Submit form
-------------------------------------------------- */
async function submitForm() {
  const toast = useToast();
  loading.value = true;

  try {
    let res;

    if (form.value[props.keyField]) {
      // UPDATE
      res = await $api.put(
        `${props.apiUrl}/${form.value[props.keyField]}`,
        form.value
      );

      toast.add({
        title: "Actualizado",
        description: res.data.message || "Actualizado correctamente",
        color: "success",
      });
    } else {
      // CREATE
      res = await $api.post(props.apiUrl, form.value);

      toast.add({
        title: "Creado",
        description: res.data.message || "Creado correctamente",
        color: "success",
      });
    }

    modalVisible.value = false;
    fetchData();
  } catch (err: any) {
    toast.add({
      title: "Error",
      description:
        err?.response?.data?.message || err?.message || "Error al guardar",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}

/* --------------------------------------------------
   Modal de confirmación antes de ejecutar acción
-------------------------------------------------- */
async function handleAction(action: Action, row: any) {
  const toast = useToast();

  confirmMessage.value = `¿Seguro que deseas ejecutar "${action.label}"?`;
  confirmVisible.value = true;

  confirmAction.value = async () => {
    loading.value = true;

    try {
      await action.handle(row);

      // 👇 Este toast se dispara si la acción se ejecuta sin errores
      toast.add({
        title: "Completado",
        description: "Acción realizada correctamente.",
        color: "success",
      });

      fetchData();
    } catch (err: any) {
      toast.add({
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

// ✅ Exportar tipos para el padre
export type { Column, Field, Action };
</script>

<template>
  <div class="p-4 relative">
    <!-- BUSCADOR + NUEVO -->
    <div class="flex justify-between mb-4">
      <UInput
        v-if="props.showSearch !== false"
        v-model="searchQuery"
        placeholder="Buscar..."
        @keyup.enter="fetchData"
      />

      <UButton color="primary" label="Nuevo registro" @click="openModal()" />
    </div>

    <!-- TABLA -->
    <UTable :data="data" :columns="columns" sticky class="h-96" />

    <!-- PAGINACIÓN -->
    <div class="flex justify-end gap-2 mt-4">
      <UButton label="Anterior" @click="prevPage" :disabled="page === 1" />
      <span>{{ page }} / {{ totalPages }}</span>
      <UButton
        label="Siguiente"
        @click="nextPage"
        :disabled="page === totalPages"
      />
    </div>

    <!-- MODAL FORM -->
    <UModal v-model:open="modalVisible" size="lg">
      <template #header>
        <h3 class="text-lg font-semibold">{{ modalTitle }}</h3>
      </template>

      <template #body>
        <div class="flex flex-col gap-4 p-4">
          <UInput
            v-for="f in props.formFields"
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

    <!-- MODAL DE CONFIRMACIÓN -->
    <UModal v-model:open="confirmVisible" size="sm">
      <template #header>
        <h3 class="text-lg font-semibold text-red-600">Confirmación</h3>
      </template>

      <template #body>
        <p class="text-gray-700">{{ confirmMessage }}</p>
      </template>

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

    <!-- LOADING OVERLAY -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-white/50 z-50"
    >
      <UProgress linear indeterminate />
    </div>
  </div>
</template>
