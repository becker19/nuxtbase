<script setup lang="ts">
import { ref } from "vue";
import type { NavigationMenuItem, TabsItem } from "@nuxt/ui";
import UserMenu from "@/components/UserMenu.vue";
import DarkModeButton from "@/components/DarkModeButton.vue";
import { useSetting } from "@/composables/services/useSetting";

const isSidebarCollapsed = ref(false);

const sidebarItems: NavigationMenuItem[][] = [
  [
    { label: "Home", icon: "i-lucide-house", active: true },
    { label: "Inbox", icon: "i-lucide-inbox", badge: "4" },
    { label: "Contacts", icon: "i-lucide-users" },
    {
      label: "Settings",
      icon: "i-lucide-settings",
      defaultOpen: true,
      children: [
        { label: "General" },
        { label: "Members" },
        { label: "Notifications" },
      ],
    },
  ],
  [
    {
      label: "Feedback",
      icon: "i-lucide-message-circle",
      to: "https://github.com/nuxt-ui-templates/dashboard",
      target: "_blank",
    },
    {
      label: "Help & Support",
      icon: "i-lucide-info",
      to: "https://github.com/nuxt/ui",
      target: "_blank",
    },
  ],
];
const menu = ref<NavigationMenuItem[]>([]);

onMounted(() => {
  loadMenuFromLocalStorage();
});

function loadMenuFromLocalStorage() {
  if (import.meta.client) {
    const menuRaw = localStorage.getItem("menu");
    if (!menuRaw) return;

    try {
      const menuParsed = JSON.parse(menuRaw);

      // Transformar al formato Nuxt UI
      menu.value = menuParsed.map((item: any) => ({
        label: item.label,
        icon: item.icon ?? "i-lucide-circle",
        to: item.route ?? null,
        children:
          item.children?.map((child: any) => ({
            label: child.label,
            icon: child.icon ?? "i-lucide-circle",
            to: child.route ?? null,
          })) ?? [],
      }));
      console.log("🚀 ~ loadMenuFromLocalStorage ~ menu.value:", menu.value);
    } catch (e) {
      console.error("Error parseando menú:", e);
    }
  }
}

const tabsItems: TabsItem[] = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
];

// Función toggle
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <UDashboardSidebar
      :collapsed="isSidebarCollapsed"
      :collapsible="true"
      :resizable="true"
      class="transition-all duration-300"
    >
      <template #header="{ collapsed }">
        <div class="flex items-center justify-center h-12">
          <UIcon name="i-simple-icons-nuxtdotjs" class="size-6 text-primary" />
          <span v-if="!collapsed" class="ml-2 font-bold text-white"
            >NuxtUI App</span
          >
        </div>
      </template>

      <template #default="{ collapsed }">
        <!-- ✔ MENÚ DINÁMICO -->
        <UNavigationMenu
          :collapsed="collapsed"
          :items="menu"
          orientation="vertical"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col">
      <!-- Navbar -->
      <UDashboardNavbar title="Dasboard">
        <template #leading>
          <!-- Botón toggle funcional -->
          <UButton
            icon="i-lucide-menu"
            variant="ghost"
            @click="toggleSidebar"
          />
        </template>

        <template #right>
          <DarkModeButton />
          <!-- <UTabs
            :items="tabsItems"
            default-value="all"
            size="sm"
            class="w-40"
            :content="false"
          /> -->
        </template>
      </UDashboardNavbar>

      <main class="p-4 flex-1 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
