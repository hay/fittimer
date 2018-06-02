<template>
    <div class="section content container">
        <router-link
            class="button"
            v-bind:to="{ name : 'overview' }">
            ◀ Workouts
        </router-link>

        <h1>{{workout.name}}</h1>

        <button class="button" v-on:click="runall">
            👟Run all
        </button>

        <ul class="exercise-list">
            <li v-for="(exercise, index) in exercises"
                v-bind:key="index">
                <router-link v-bind:to="exercise.to">{{exercise.name}}</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    import NoSleep from 'nosleep.js';

    const nosleep = new NoSleep();

    export default {
        data() {
            const workoutId = parseInt(this.$route.params.workoutId);
            const workout = this.$store.state.workouts[workoutId];

            return {
                exercises : workout.exercises.map((exercise, index) => {
                    exercise.to = {
                        name : 'exercise',
                        params : {
                            exerciseId : index,
                            workoutId : workoutId
                        }
                    };

                    return exercise;
                }),

                workout,

                workoutId
            }
        },

        methods : {
            back() {
                this.$router.go(-1);
            },

            runall() {
                // This is obviously a horrible clutch
                nosleep.enable();
                this.$sound.play('win');
                this.$store.commit('runWorkout', this.workoutId);
            }
        }
    }
</script>