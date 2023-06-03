import { createRouter, createWebHistory } from "vue-router";

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  {
    path: "/",
    name: "Home",
    meta: {
      layout: "default",
    },
    component: () =>
      import(/* webpackChunkName: "home" */ "@/views/HomePage.vue"),
  },
  {
    path: "/fake",
    name: "Fake",
    meta: {
      layout: "default",
    },
    component: () =>
      import(/* webpackChunkName: "fake" */ "@/views/FakePage.vue"),
  },
  {
    path: "/components",
    name: "Components",
    component: () =>
      import(/* webpackChunkName: "home" */ "@/views/ComponentPage.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    meta: {
      layout: "notfound",
    },
    component: () => <div>NotFound</div>,
  },
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

export default router;
