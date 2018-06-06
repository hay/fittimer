<template>
    <div class="exercise">
        <h2>{{exercise.name}}</h2>

        <p>
            {{exercise.seconds}} seconds.
        </p>

        <p v-if="exercise.repeat">
            Repeat {{exercise.repeat}} times.
            <span v-if="pauseBetweenSets">
                {{pauseBetweenSets}} seconds pause between every set.
            </span>
        </p>

        <h3 v-if="message && second">
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
                v-bind:src="'https://www.youtube-nocookie.com/embed/' + exercise.video.youtube + '?rel=0&amp;controls=0&amp;showinfo=0&amp;playsinline=1&amp;mute=1&amp;autoplay=1&amp;loop=1'"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen></iframe>
        </div>
    </div>
</template>

<script>
    export default {
        props : {
            exercise : {
                type : Object,
                required : true
            },

            message : {
                type : String
            },

            pauseBetweenSets : {
                type : Number
            },

            second : {
                type : Number
            }
        }
    }
</script>