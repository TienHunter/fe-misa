import { createRouter, createWebHistory } from "vue-router";

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  {
    path: "/DI/employee",
    name: "Employee",
    meta: {
      layout: "default",
    },
    component: () =>
      import(
        /* webpackChunkName: "home" */ "@/views/employee/EmployeeList/EmployeeList.vue"
      ),
  },
  {
    path: "/DI",
    name: "Directory",
    meta: {
      layout: "default",
    },
    component: () =>
      import(/* webpackChunkName: "home" */ "@/views/DirectoryPage.vue"),
    children: [
      {
        path: "/DI/account-system",
        name: "DIAccountSystem",
        meta: {
          layout: "default",
        },
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/account/AccountList/AccountList.vue"
          ),
      },
      {
        path: "/DI/supplier",
        name: "DISupplier",
        meta: {
          layout: "default",
        },
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/supplier/SupplierList/SupplierList.vue"
          ),
      },
    ],
  },

  {
    path: "/CA",
    name: "Cast",
    meta: {
      layout: "default",
    },
    redirect: "/CA/CAProcess",
    component: () => import("@/views/cast/CastContainer.vue"),
    children: [
      {
        path: "CAProcess",
        name: "CastProcess",
        component: () => import("@/views/cast/procedure/CastProcedure.vue"),
      },
      {
        path: "CAReceipt/DepositWidthdrawList",
        name: "DepositWidthdrawList",
        component: () =>
          import(
            "@/views/cast/deposit-withdraw/DepositWithdrawList/DepositWithdrawList.vue"
          ),
      },
    ],
  },
  {
    path: "/CA",
    redirect: "/CA/CAProcess",
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
    redirect: "/DI",
    // component: () => <div>NotFound</div>,
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
