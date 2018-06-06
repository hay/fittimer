import Vue from 'vue';
import Vuex from 'vuex';
import { Howl } from 'howler';
import Router from './router.js';
import Store from './store.js';
import SoundManager from './soundmanager.js';

Vue.use(Vuex);

export default function(data) {
    const store = new Store(data);
    const router = new Router(store);

    Vue.prototype.$sound = new SoundManager(store.state.sounds);

    return new Vue({
        el : 'main',

        router,

        store,

        mounted() {
            if (window.location.href.includes('debug')) {
                this.$store.commit('debug');
            }
        }
    });
};