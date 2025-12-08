<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import draggable from "vuedraggable";
import { GripVertical } from "lucide-vue-next";

interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  defaultOpen?: boolean;
  children?: MenuItem[];
}

// Estado del menú
const menu = ref<MenuItem[]>([]);

// Cargar menú desde localStorage al inicio
onMounted(() => {
  const savedMenu = localStorage.getItem("menu");
  if (savedMenu) {
    menu.value = JSON.parse(savedMenu);
  }
});

// Guardado automático: cada vez que menu cambie, se sincroniza
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
    <!-- Drag & Drop recursivo -->
    <draggable
      v-model="menu"
      item-key="label"
      handle=".drag-handle"
      class="space-y-1"
    >
      <template #item="{ element }">
        <div>
          <UCard class="p-2 w-full">
            <div class="flex items-center gap-2">
              <GripVertical class="w-5 h-5 cursor-move drag-handle" />
              <span class="flex-1">{{ element.label }}</span>
            </div>
          </UCard>

          <!-- Submenús recursivos -->
          <div
            v-if="element.children?.length"
            :style="{ marginLeft: '20px' }"
            class="mt-1"
          >
            <draggable
              v-model="element.children"
              item-key="label"
              handle=".drag-handle"
              class="space-y-1"
            >
              <template #item="{ element: child }">
                <div>
                  <UCard class="p-2 w-full">
                    <div class="flex items-center gap-2">
                      <GripVertical class="w-5 h-5 cursor-move drag-handle" />
                      <span class="flex-1">{{ child.label }}</span>
                    </div>
                  </UCard>

                  <!-- Nietos -->
                  <div
                    v-if="child.children?.length"
                    :style="{ marginLeft: '20px' }"
                    class="mt-1"
                  >
                    <draggable
                      v-model="child.children"
                      item-key="label"
                      handle=".drag-handle"
                      class="space-y-1"
                    >
                      <template #item="{ element: grandchild }">
                        <UCard class="p-2 w-full">
                          <div class="flex items-center gap-2">
                            <GripVertical
                              class="w-5 h-5 cursor-move drag-handle"
                            />
                            <span class="flex-1">{{ grandchild.label }}</span>
                          </div>
                        </UCard>
                      </template>
                    </draggable>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<style scoped>
.drag-handle {
  cursor: grab;
}
</style>
