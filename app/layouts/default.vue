<script setup lang="ts">
import { ref } from "vue";
import type { NavigationMenuItem, TabsItem } from "@nuxt/ui";
import UserMenu from "@/components/UserMenu.vue";
import DarkModeButton from "@/components/DarkModeButton.vue";

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
        <UNavigationMenu
          :collapsed="collapsed"
          :items="sidebarItems[0]"
          orientation="vertical"
        />
        <UNavigationMenu
          :collapsed="collapsed"
          :items="sidebarItems[1]"
          orientation="vertical"
          class="mt-auto"
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
