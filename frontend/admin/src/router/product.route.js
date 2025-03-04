import ProductPage from '@/views/ProductPage.vue';
import ProductDetail from '@/components/product/ProductDetail.vue';
import ProductList from '@/components/product/ProductList.vue';

export default {
  path: '/products',
  name: 'product-page',
  component: ProductPage,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      name: 'product-list',
      component: ProductList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: ':productId',
      name: 'product-detail',
      component: ProductDetail,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};

