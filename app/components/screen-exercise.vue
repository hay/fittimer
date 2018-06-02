<template>
    <div
        class="section content container"
        v-if="exercise">
        <router-link
            class="button"
            v-bind:to="backRoute">
            ◀ Exercises
        </router-link>

        <h2>{{exercise.name}}</h2>

        <p>
            {{exercise.seconds}} seconds.
        </p>

        <p v-if="exercise.repeat">
            Repeat {{exercise.repeat}} times.
            {{pauseBetweenSets}} seconds pause between every set.
        </p>

        <h3>
            {{message}}<br>
            {{second}}
        </h3>

        <video
            v-if="exercise.video && exercise.video.src"
            v-bind:src="'video/' + exercise.video.src + '.mp4'"
            autoplay
            playsinline
            muted
            loop></video>

        <div
            v-if="exercise.video && exercise.video.youtube"
            class="video-embed">
            <iframe
                v-bind:src="'https://www.youtube-nocookie.com/embed/' + exercise.video.youtube + '?rel=0&amp;controls=0&amp;showinfo=0&playsinline=1&mute=1&autoplay=1&loop=1'"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen></iframe>
        </div>
    </div>
</template>

<script>
    const SECONDS_TO_PLAY = [1,2,3,4,5,10,20];

    function promiseTimeout(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    export default {
        beforeRouteUpdate(to, from, next) {
            this.go();
            next();
        },

        mounted() {
            this.go();
        },

        computed: {
            exercise() {
                return this.getExercise().exercise;
            }
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
                introTime : this.$store.state.introTime,
                message : null,
                ONE_SECOND : this.$store.state.ONE_SECOND,
                pauseBetweenExercises : workout.pauseBetweenExercises,
                pauseBetweenSets : workout.pauseBetweenSets,
                second : null
            };
        },

        watch : {
            second(seconds) {
                if (SECONDS_TO_PLAY.includes(seconds)) {
                    this.$sound.play(`count/${seconds}`);
                }
            }
        },

        methods : {
            async countdown(to, callback) {
                for (let second = to; second > 0; second--) {
                    callback(second);
                    await promiseTimeout(this.ONE_SECOND);
                }
            },

            // FIXME: this should be easier
            getExercise() {
                const workoutId = parseInt(this.$route.params.workoutId);
                const exerciseId = parseInt(this.$route.params.exerciseId);
                const workout = this.$store.state.workouts[workoutId];
                const exercise = workout.exercises[exerciseId];
                return { exercise, workout };
            },

            async go() {
                if (this.$store.state.autoplay) {
                    if (this.$store.state.playExercise === 0) {
                        this.message = `Starting in ${this.introTime} seconds`;
                        await this.countdown(
                            this.introTime,
                            s => this.second = s
                        );
                    } else {
                        this.message = 'Pausing between exercises';
                        await this.countdown(
                            this.pauseBetweenExercises,
                            s => this.second = s
                        );
                    }
                }

                for (let time = 0; time < this.exercise.repeat; time++) {
                    this.message = `Set ${time + 1}`;
                    this.second = this.exercise.seconds;

                    await this.countdown(
                        this.exercise.seconds,
                        s => this.second = s
                    );

                    if (this.exercise.repeat > 1 && time !== (this.exercise.repeat - 1)) {
                        this.message = 'Pausing';
                        this.$sound.play('win');

                        await this.countdown(
                            this.pauseBetweenSets,
                            s => this.second = s
                        );
                    }
                }

                if (this.$store.state.autoplay) {
                    this.$store.dispatch('nextExercise');
                } else {
                    this.second = null;
                    this.message = 'Exercise done';
                }
            },

            reset() {
                this.$store.commit('reset');

                this.$router.push({
                    name : 'list'
                });
            }
        }
    };
</script>