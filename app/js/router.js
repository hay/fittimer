import Vue from 'vue';
import VueRouter from 'vue-router';
import ScreenExercise from '../components/screen-exercise.vue';
import ScreenOverview from '../components/screen-overview.vue';
import ScreenWorkout from '../components/screen-workout.vue';

Vue.use(VueRouter);

export default function(store) {
    return new VueRouter({
        routes : [
            {
                name : 'overview',
                path : '/',
                component : ScreenOverview
            },
            {
                name : 'workout',
                path : '/workout/:workoutId',
                component : ScreenWorkout
            },
            {
                name : 'exercise',
                path : '/workout/:workoutId/exercise/:exerciseId',
                component : ScreenExercise
            }
        ]
    });
};