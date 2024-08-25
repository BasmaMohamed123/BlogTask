

import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

import PostDetails from '@/views/PostDetails.vue';




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    
    {
      path: '/posts/:slug',
      name: 'PostDetails',
      component: PostDetails
    },
   

   
  
   

    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    { path: '/register', name:'register' ,
      component: () => import('../views/Register.vue')
     },
     
    { path: '/login', name:'login' ,component: () => import('../views/Login.vue')},
   
    {
      path: '/posts',
      component: () => import('../views/BlogPosts.vue'),


      beforeEnter: (to, from, next) => {
        const isAuthenticated = !!localStorage.getItem('authToken');
        if (isAuthenticated) {
          next();
        } else {
          next('/login');
        }
      },
    },

  ]
})


export default router
