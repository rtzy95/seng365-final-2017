import Vue from 'vue';
import App from './Vues/App.vue';
import Home from './Vues/Home.vue';
import Project from './Vues/Project.vue';
import Projects from './Vues/Projects.vue';
import Signup from './Vues/Signup.vue';
import Create from './Vues/Create.vue';
import Viewbacking from './Vues/Viewbacking.vue';
import Viewcreated from './Vues/Viewcreated.vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import VueSession from 'vue-session';
Vue.use(VueSession);

import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

// Vue.http.options.emulateJSON = true;
// Vue.http.options.emulateHTTP = true;

const routes = [
    {
        path: "/",
        name: "home",
        component: Home
    },
    {
        path: "/projects/:projectId",
        name: "project",
        component: Project
    },
    {
        path: "/projects",
        name: "projects",
        component: Projects
    },
    {
        path: "/signup",
        name: "signup",
        component: Signup
    },
    {
        path: "/create",
        name: "create",
        component: Create
    },
    {
        path: '/viewbacking',
        name: 'viewbacking',
        component: Viewbacking
    },
    {
        path: '/viewcreated',
        name: 'viewcreated',
        component: Viewcreated
    },
];

const router = new VueRouter({
    routes: routes,
    mode: 'history'
});

export default new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
