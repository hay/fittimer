import { range } from 'lodash';

export default class {
    constructor({ introTime, workout }) {
        this.introTime = introTime;
        this.pauseBetweenExercises = workout.pauseBetweenExercises;
        this.pauseBetweenSets = workout.pauseBetweenSets;

        this.queue = [];

        workout.exercises.forEach((exercise, index) => {
            // If no repeat is given, it is assumed to be one
            if (!exercise.repeat) {
                exercise.repeat = 1;
            }

            this.addCommandsForExercise(exercise, index);
        });
    }

    addCommandsForExercise(exercise, index) {
        if (index === 0) {
            this.queue.push({ section : 'starting-workout' });

            range(this.introTime, 0).forEach((second) => {
                this.queue.push({
                    message : `Starting in ${second} seconds`,
                    exercise, second
                });
            });
        } else {
            this.queue.push(
                { section : 'next-exercise' },
                { section : 'pausing' }
            );

            range(this.pauseBetweenExercises, 0).forEach((second) => {
                this.queue.push({
                    message : 'Pausing between exercises',
                    exercise, second
                });
            });
        }

        for (let time = 0; time < exercise.repeat; time++) {
            this.queue.push(
                { section : 'set' },
                { section : time + 1 }
            );

            range(exercise.seconds, 0).forEach((second) => {
                this.queue.push({
                    message : `Set ${time + 1}`,
                    exercise, second
                });
            });

            if (exercise.repeat > 1 && time !== (exercise.repeat - 1)) {
                this.queue.push(
                    { section : 'set-complete' },
                    { section : 'pausing' }
                );

                range(this.pauseBetweenSets, 0).forEach((second) => {
                    this.queue.push({
                        message : 'Pausing',
                        exercise, second
                    });
                })
            }
        }
    }

    hasNext() {
        return this.queue.length > 0;
    }

    next() {
        return this.queue.shift();
    }
}