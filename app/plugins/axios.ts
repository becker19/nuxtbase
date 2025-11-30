// // /plugins/axios.ts
// import axios from "axios";
// import { defineNuxtPlugin } from "#app";

// export default defineNuxtPlugin(() => {
//   const config = useRuntimeConfig();

//   const api = axios.create({
//     baseURL: config.public.apiBase as string, // tu API principal
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   return {
//     provide: {
//       api, // ahora disponible como $api
//     },
//   };
// });
// /plugins/axios.ts
// /plugins/axios.ts
import axios from "axios";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: config.public.apiBase as string,
    headers: { "Content-Type": "application/json" },
  });

  api.interceptors.request.use((request) => {
    let token: string | null = null;

    // Revisa token desde composable
    try {
      token = useAuth().token.value;
    } catch {
      // fallback a localStorage en cliente
      if (import.meta.client) {
        token = localStorage.getItem("token");
      }
    }

    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  });

  return {
    provide: {
      api,
    },
  };
});
