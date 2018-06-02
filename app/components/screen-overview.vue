<template>
    <div class="section content container">
        <h1>FitTimer</h1>

        <p>These workouts are available:</p>

        <ul>
            <li v-for="(workout, index) in workouts"
                v-bind:key="index">
                <router-link v-bind:to="workout.to">
                    {{workout.name}}
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                workouts : this.$store.state.workouts.map((workout, index) => {
                    workout.to = {
                        name : 'workout',
                        params : {
                            workoutId : index
                        }
                    };

                    return workout;
                })
            }
        }
    }
</script>