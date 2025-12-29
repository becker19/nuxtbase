<script setup lang="ts">
definePageMeta({ layout: "auth" });

interface LoginForm {
  email: string;
  password: string;
}

import type { AuthFormField } from "@nuxt/ui";
import { useSetting } from "~/composables/services/useSetting";
import { useAuth } from "~/composables/useAuth";

const { settingApp } = useSetting();
const appSetting = settingApp.value;

const { login, error, loading } = useAuth();

const fields = ref<AuthFormField[]>([
  { name: "email", type: "text", label: "Email" },
  { name: "password", type: "password", label: "Password" },
]);

const onSubmit = async (formData: { data: LoginForm }) => {
  await login(formData.data.email, formData.data.password);
};
</script>

<template>
  <UAuthForm
    :title="appSetting?.name || 'Login'"
    :fields="fields"
    class="max-w-md"
    :loading="loading"
    @submit="onSubmit"
  />
  <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
</template>
