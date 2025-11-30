<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <input
        v-if="props.showSearch"
        v-model="searchQuery"
        @input="fetchData"
        type="text"
        placeholder="Buscar..."
        class="border rounded p-2"
      />
      <button
        v-if="!headerSlot"
        @click="openModal()"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Nuevo registro
      </button>
      <slot name="header" v-if="headerSlot" />
    </div>

    <!-- Tabla -->
    <table class="min-w-full border">
      <thead>
        <tr>
          <th
            v-for="col in props.columns"
            :key="String(col.key)"
            class="border p-2 text-left"
          >
            {{ col.label }}
          </th>
          <th class="border p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item[props.keyField]">
          <td
            v-for="col in props.columns"
            :key="String(col.key)"
            class="border p-2"
          >
            {{ item[col.key] }}
          </td>
          <td class="border p-2 flex gap-2">
            <button
              v-for="action in props.actions"
              :key="action.label"
              :class="`px-3 py-1 rounded ${
                action.color || 'bg-gray-200 text-black'
              }`"
              @click="handleAction(action, item)"
            >
              {{ action.label }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación -->
    <div class="flex justify-end mt-4 gap-2">
      <button
        @click="prevPage"
        :disabled="page === 1"
        class="px-3 py-1 border rounded"
      >
        Anterior
      </button>
      <span>{{ page }} / {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="page === totalPages"
        class="px-3 py-1 border rounded"
      >
        Siguiente
      </button>
    </div>

    <!-- Modal Formulario -->
    <DynamicModal
      :show="modalVisible"
      :title="modalTitle"
      @close="modalVisible = false"
      @confirm="submitForm"
    >
      <template #body>
        <div
          v-for="field in props.formFields"
          :key="String(field.key)"
          class="mb-2"
        >
          <input
            v-model="form[field.key]"
            :placeholder="field.label"
            class="border p-2 rounded w-full"
          />
        </div>
      </template>
    </DynamicModal>

    <!-- Modal de carga -->
    <LoadingModal :show="loading" message="Procesando..." />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots } from "vue";
import type { AxiosInstance } from "axios";
import DynamicModal from "./DynamicModal.vue";
import LoadingModal from "./LoadingModal.vue";

// ------------------- Interfaces genéricas -------------------
interface Column<T> {
  key: Extract<keyof T, string | number>;
  label: string;
}

interface Field<T> {
  key: Extract<keyof T, string | number>;
  label: string;
}

interface Action<T> {
  label: string;
  color?: string;
  handle: (row: T) => Promise<void>;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: T[];
    last_page: number;
    total: number;
    per_page: number;
    links: any[];
  };
}

interface Props<T> {
  columns: Column<T>[];
  apiUrl: string;
  showSearch?: boolean;
  perPage?: number;
  formFields: Field<T>[];
  keyField: Extract<keyof T, string | number>;
  actions: Action<T>[];
}

const props = defineProps<Props<any>>();
const { $api } = useNuxtApp() as { $api: AxiosInstance };

// ------------------- Refs -------------------
const slots = useSlots();
const headerSlot = computed(() => !!slots.header);

const data = ref<any[]>([]);
const page = ref<number>(1);
const perPage = ref<number>(props.perPage || 10);
const total = ref<number>(0);
const totalPages = ref<number>(1);
const searchQuery = ref<string>("");
const modalVisible = ref<boolean>(false);
const modalTitle = ref<string>("Nuevo registro");
const form = ref<Record<string, any>>({});
const loading = ref<boolean>(false);

// ------------------- Funciones -------------------
async function fetchData() {
  loading.value = true;
  try {
    const res = await $api.get<ApiResponse<any>>(props.apiUrl, {
      params: {
        page: page.value,
        per_page: perPage.value,
        search: searchQuery.value,
      },
    });
    const apiData = res.data.data;
    data.value = apiData.data;
    total.value = apiData.total;
    page.value = apiData.current_page;
    perPage.value = apiData.per_page;
    totalPages.value = apiData.last_page;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

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

function openModal(item: any = null) {
  modalVisible.value = true;
  if (item) {
    modalTitle.value = "Editar registro";
    form.value = { ...item };
  } else {
    modalTitle.value = "Nuevo registro";
    form.value = Object.fromEntries(props.formFields.map((f) => [f.key, ""]));
  }
}

async function submitForm() {
  loading.value = true;
  try {
    if (form.value[props.keyField]) {
      await $api.put(
        `${props.apiUrl}/${form.value[props.keyField]}`,
        form.value
      );
    } else {
      await $api.post(props.apiUrl, form.value);
    }
    modalVisible.value = false;
    fetchData();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function handleAction(action: Action<any>, row: any) {
  loading.value = true;
  try {
    await action.handle(row);
    fetchData();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// Fetch inicial
fetchData();
</script>
