<template>
    <div
        class="section content container"
        v-if="exercise">
        <router-link
            class="button"
            v-bind:to="backRoute">
            ◀ Exercises
        </router-link>

        <hr>

        <workout-exercise
            v-bind:exercise="exercise"></workout-exercise>
    </div>
</template>

<script>
    import WorkoutExercise from './workout-exercise.vue';

    export default {
        components : {
            WorkoutExercise
        },

        data() {
            const workoutId = parseInt(this.$route.params.workoutId);
            const { exercise, workout } = this.getExercise();

            return {
                backRoute : {
                    name : 'workout',
                    params : {
                        workoutId
                    }
                },

                exercise
            };
        },

        methods : {
            // FIXME: this should be easier
            getExercise() {
                const workoutId = parseInt(this.$route.params.workoutId);
                const exerciseId = parseInt(this.$route.params.exerciseId);
                const workout = this.$store.state.workouts[workoutId];
                const exercise = workout.exercises[exerciseId];
                return { exercise, workout };
            }
        }
    };
</script>