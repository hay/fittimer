<template>
    <div class="section content container">
        <template v-if="!running">
            <router-link
                class="button"
                v-bind:to="{ name : 'overview' }">
                ◀ Workouts
            </router-link>

            <h1>{{workout.name}}</h1>

            <button class="button" v-on:click="start">
                👟Start workout
            </button>

            <ul class="exercise-list">
                <li v-for="(exercise, index) in exercises"
                    v-bind:key="index">
                    <router-link v-bind:to="exercise.to">{{exercise.name}}</router-link>
                </li>
            </ul>
        </template>

        <template v-if="running">
            <button
                class="button"
                v-on:click="stop">
                ✋Stop workout
            </button>

            <hr>

            <workout-exercise
                v-bind:exercise="exercise"
                v-bind:message="message"
                v-bind:second="second"></workout-exercise>
        </template>
    </div>
</template>

<script>
    import NoSleep from 'nosleep.js';
    import Workout from '../js/workout.js';
    import WorkoutExercise from './workout-exercise.vue';

    const nosleep = new NoSleep();
    const SECONDS_TO_PLAY = [1,2,3,4,5,10,20];

    export default {
        data() {
            const workoutId = parseInt(this.$route.params.workoutId);
            const workout = this.$store.state.workouts[workoutId];

            return {
                exercise : null,

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

                introTime : this.$store.state.introTime,

                message : null,

                running : false,

                secondInMs : this.$store.state.ONE_SECOND,

                second : null,

                workout,

                workoutId
            }
        },

        components : {
            WorkoutExercise
        },

        watch : {
            second(seconds) {
                if (SECONDS_TO_PLAY.includes(seconds)) {
                    this.$sound.play(`count/${seconds}`);
                }
            }
        },

        methods : {
            back() {
                this.$router.go(-1);
            },

            stop() {
                this.running = false;
            },

            start() {
                this.$sound.play('win');

                // This is obviously a horrible clutch
                nosleep.enable();

                const workout = new Workout({
                    introTime : this.introTime,
                    workout : this.workout
                });


                function go() {
                    if (workout.hasNext() && this.running) {
                        const step = workout.next();

                        this.exercise = step.exercise;
                        this.message = step.message;
                        this.second = step.second;

                        setTimeout(go.bind(this), this.secondInMs);
                    } else {
                        this.running = false;
                    }
                }

                this.running = true;
                go.call(this);
            }
        }
    }
</script>