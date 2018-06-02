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
        },

        computed : {
            playExercise() {
                return this.$store.state.playExercise;
            }
        },

        watch : {
            async playExercise(exercise) {
                if (exercise === -1) {
                    this.$router.push({
                        name : 'workout',
                        params : {
                            workoutId : this.$store.state.workoutId
                        }
                    });
                } else {
                    this.$router.push({
                        name : 'exercise',

                        params : {
                            exerciseId : exercise,
                            workoutId : this.$store.state.workoutId
                        }
                    });
                }
            }
        }
    });
};