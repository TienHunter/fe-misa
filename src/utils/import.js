import { defineAsyncComponent } from "vue";

export function registerGlobalComponents(app) {
  app.component(
    "auth-layout",
    defineAsyncComponent(() => import("@/layouts/AuthLayout/AuthLayout.vue"))
  );
  app.component(
    "default-layout",
    defineAsyncComponent(() =>
      import("@/layouts/DefaultLayout/DefaultLayout.vue")
    )
  );
}
