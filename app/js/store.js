import Vuex from 'vuex';

export default function(data) {
    return new Vuex.Store({
        strict : true,

        state : {
            autoplay : false,
            introTime : data.global.introTime,
            ONE_SECOND : 1000,
            muted : false,
            playExercise: -1,
            sounds : data.global.sounds,
            workouts : data.workouts,
            workoutId : null
        },

        actions : {
            nextExercise({ state, commit, getters }) {
                const exercises = state.workouts[state.workoutId].exercises;

                if (state.playExercise >= (exercises.length - 1)) {
                    commit('reset');
                } else {
                    commit('nextExercise');
                }
            },
        },

        mutations : {
            debug(state) {
                state.ONE_SECOND = 10;
                state.muted = true;
            },

            nextExercise(state) {
                state.playExercise += 1;
            },

            reset(state) {
                state.playExercise = -1;
                state.autoplay = false;
            },

            runWorkout(state, workoutId) {
                state.autoplay = true;
                state.workoutId = workoutId;
                state.playExercise = 0;
            }
        }
    })
};