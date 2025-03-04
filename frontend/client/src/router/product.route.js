import ProductPage from "@/views/ProductPage.vue";
import ProductList from "@/components/product/ProductList.vue";

export default {
  path: "/products",
  name: "product-page",
  component: ProductPage,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: "",
      name: "product-list",
      component: ProductList,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};
