<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import draggable from "vuedraggable";
import { GripVertical } from "lucide-vue-next";
import DynamicFormModal from "~/components/DynamicFormModal.vue";

// ----------------------
// Tipos
// ----------------------
interface MenuItem {
  id: number;
  label: string;
  icon?: string;
  route?: string;
  order: number;
  parent_id: number | null;
  children?: MenuItem[];
}

interface Field {
  key: string;
  label: string;
  type: "input" | "textarea" | "select" | "date";
  props?: {
    options?: { label: string; value: number | string | null }[];
    [key: string]: any;
  };
}

// ----------------------
// Estado del menú
// ----------------------
const menu = ref<MenuItem[]>([]);

// ----------------------
// Modal dinámico
// ----------------------
const modalVisible = ref(false);
const modalTitle = ref("");
const editingItem = ref<MenuItem | null>(null);
const menuFormData = ref<Record<string, any>>({});

const menuFormFields: Field[] = [
  { key: "label", label: "Etiqueta", type: "input", props: {} },
  { key: "icon", label: "Icono", type: "input", props: {} },
  { key: "route", label: "Ruta", type: "input", props: {} },
  {
    key: "parent_id",
    label: "Padre",
    type: "select",
    props: { options: [{ label: "Ninguno", value: null }] },
  },
];

// ----------------------
// Funciones de jerarquía
// ----------------------
function sortMenu(items: MenuItem[]): MenuItem[] {
  items.sort((a, b) => a.order - b.order);
  items.forEach((item) => {
    if (item.children?.length) item.children = sortMenu(item.children);
  });
  return items;
}

function buildHierarchy(items: MenuItem[]): MenuItem[] {
  const map = new Map<number, MenuItem>();
  const roots: MenuItem[] = [];

  items.forEach((item) => {
    item.children = [];
    map.set(item.id, item);
  });

  items.forEach((item) => {
    if (item.parent_id) {
      const parent = map.get(item.parent_id);
      if (parent) parent.children!.push(item);
    } else {
      roots.push(item);
    }
  });

  return sortMenu(roots);
}

function updateOrder(items: MenuItem[]) {
  items.forEach((item, index) => {
    item.order = index + 1;
    if (item.children?.length) updateOrder(item.children);
  });
}

function flattenMenu(items: MenuItem[]): MenuItem[] {
  return items.reduce((acc: MenuItem[], item) => {
    acc.push(item);
    if (item.children?.length) acc.push(...flattenMenu(item.children));
    return acc;
  }, []);
}

// ----------------------
// Modal: Crear / Editar
// ----------------------
function openCreateModal(parentId: number | null = null) {
  modalTitle.value = "Nuevo Registro";
  editingItem.value = null;
  menuFormData.value = { label: "", icon: "", route: "", parent_id: parentId };
  updateParentOptions();
  modalVisible.value = true;
}

function openEditModal(item: MenuItem) {
  modalTitle.value = "Editar elemento del menú";
  editingItem.value = item;
  menuFormData.value = { ...item };
  updateParentOptions(item.id);
  modalVisible.value = true;
}

function updateParentOptions(excludeId?: number) {
  const options: { label: string; value: number | null }[] = [
    { label: "Ninguno", value: null },
  ];
  flattenMenu(menu.value)
    .filter((i) => i.id !== excludeId)
    .forEach((i) => options.push({ label: i.label, value: i.id }));

  const parentField = menuFormFields.find((f) => f.key === "parent_id");
  if (parentField && parentField.props) {
    parentField.props.options = options;
  }
}

function saveMenuItem(data: any) {
  if (editingItem.value) {
    // Editar
    Object.assign(editingItem.value, data);
  } else {
    // Crear
    const newId = Math.max(0, ...flattenMenu(menu.value).map((i) => i.id)) + 1;
    menu.value.push({
      ...data,
      id: newId,
      order: menu.value.length + 1,
      children: [],
    });
  }
  menu.value = buildHierarchy(flattenMenu(menu.value));
  updateOrder(menu.value);
  modalVisible.value = false;
}

// ----------------------
// Inicialización
// ----------------------
onMounted(() => {
  const savedMenu = localStorage.getItem("menu");
  if (savedMenu) {
    menu.value = JSON.parse(savedMenu);
  }
});

// Guardado automático
watch(
  menu,
  (newMenu) => {
    localStorage.setItem("menu", JSON.stringify(newMenu));
  },
  { deep: true }
);
</script>

<template>
  <div class="p-4">
    <UButton
      label="Nuevo Registro"
      color="primary"
      class="mb-4"
      @click="() => openCreateModal(null)"
    />

    <draggable
      v-model="menu"
      item-key="id"
      handle=".drag-handle"
      class="space-y-1"
      @end="() => updateOrder(menu)"
    >
      <template #item="{ element }">
        <div>
          <!-- Nodo principal -->
          <UCard class="p-2 w-full">
            <div class="flex w-full items-center">
              <!-- Contenido principal a la izquierda -->
              <div class="flex items-center gap-2 grow">
                <GripVertical class="w-5 h-5 cursor-move drag-handle" />
                <span>{{ element.order }} - {{ element.label }}</span>
              </div>

              <!-- Botones a la derecha -->
              <div class="flex gap-2">
                <UButton
                  size="sm"
                  variant="outline"
                  label="Editar"
                  @click="() => openEditModal(element)"
                />
                <UButton
                  size="sm"
                  variant="outline"
                  label="Agregar hijo"
                  @click="() => openCreateModal(element.id)"
                />
              </div>
            </div>
          </UCard>

          <!-- Submenús recursivos -->
          <div v-if="element.children?.length" class="ml-5 mt-1">
            <draggable
              v-model="element.children"
              item-key="id"
              handle=".drag-handle"
              class="space-y-1"
              @end="() => updateOrder(element.children)"
            >
              <template #item="{ element: child }">
                <UCard class="p-2 w-full">
                  <div class="flex w-full items-center">
                    <div class="flex items-center gap-2 grow">
                      <GripVertical class="w-5 h-5 cursor-move drag-handle" />
                      <span>{{ child.order }} - {{ child.label }}</span>
                    </div>
                    <div class="flex gap-2">
                      <UButton
                        size="sm"
                        variant="outline"
                        label="Editar"
                        @click="() => openEditModal(child)"
                      />
                    </div>
                  </div>
                </UCard>
              </template>
            </draggable>
          </div>
        </div>
      </template>
    </draggable>

    <!-- Modal dinámico -->
    <DynamicFormModal
      v-model="modalVisible"
      :title="modalTitle"
      :fields="menuFormFields"
      :initialData="menuFormData"
      submitText="Guardar"
      cancelText="Cancelar"
      @submit="saveMenuItem"
    />
  </div>
</template>

<style scoped>
.drag-handle {
  cursor: grab;
}
</style>
