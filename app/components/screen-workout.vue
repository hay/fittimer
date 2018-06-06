<template>
    <div class="section content container">
        <template v-if="!inWorkout">
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

        <template v-if="inWorkout">
            <button
                class="button"
                v-on:click="toggle">

                <span v-show="running">
                    ✋Pause workout
                </span>

                <span v-show="!running">
                    👟Continue workout
                </span>
            </button>

            <button
                class="button"
                v-on:click="stop">
                🛑Stop workout
            </button>

            <hr>

            <workout-exercise
                v-if="exercise"
                v-bind:exercise="exercise"
                v-bind:message="message"
                v-bind:pauseBetweenSets="pauseBetweenSets"
                v-bind:second="second"></workout-exercise>
        </template>
    </div>
</template>

<script>
    import NoSleep from 'nosleep.js';
    import Workout from '../js/workout.js';
    import WorkoutExercise from './workout-exercise.vue';

    const SECONDS_TO_PLAY = [1,2,3,4,5,10,20,30];

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

                inWorkout : false,

                message : null,

                nosleep : new NoSleep(),

                pauseBetweenSets : workout.pauseBetweenSets,

                queue : null,

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
                    this.$sound.play(`${seconds}`);
                }
            }
        },

        methods : {
            back() {
                this.$router.go(-1);
            },

            async go() {
                if (!this.running) {
                    return;
                }

                // No more exercises, stop workout
                if (!this.queue.hasNext()) {
                    this.stop();
                }

                const step = this.queue.next();

                if (step.section) {
                    await this.$sound.playAsync(step.section);
                    setTimeout(this.go, (this.secondInMs / 3));
                } else {
                    this.exercise = step.exercise;
                    this.message = step.message;
                    this.second = step.second;
                    setTimeout(this.go, this.secondInMs);
                }
            },

            stop() {
                this.running = false;
                this.inWorkout = false;
                this.$sound.play('workout-complete');
                this.nosleep.disable();
            },

            async start() {
                // This is obviously a horrible clutch
                this.nosleep.enable();

                this.queue = new Workout({
                    introTime : this.introTime,
                    workout : this.workout
                });

                this.running = true;
                this.inWorkout = true;

                this.go();
            },

            async toggle() {
                this.running = !this.running;

                if (this.running) {
                    await this.$sound.playAsync('starting-workout');
                } else {
                    await this.$sound.playAsync('pausing');
                }

                this.go();
            }
        }
    }
</script>