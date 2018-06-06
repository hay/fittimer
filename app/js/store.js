import Vuex from 'vuex';

export default function(data) {
    return new Vuex.Store({
        strict : true,

        state : {
            introTime : data.global.introTime,
            ONE_SECOND : 1000,
            muted : false,
            sounds : data.global.sounds,
            workouts : data.workouts,
            workoutId : null
        },

        mutations : {
            debug(state) {
                state.ONE_SECOND = 10;
                state.muted = true;
            }
        }
    })
};