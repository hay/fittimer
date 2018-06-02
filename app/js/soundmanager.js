export default class {
    constructor(sounds) {
        this._firstrun = true;
        this._sounds = sounds;
    }

    _preload() {
        // First time, we cache this stuff
        if (this._firstrun) {
            const sounds = {};

            for (let sound of this._sounds) {
                sounds[sound] = new Howl({
                    src : [`audio/${sound}.mp3`],
                    html5: true
                });
            }

            this._sounds = sounds;

            this._firstrun = false;
        }
    }

    play(id) {
        this._preload();
        this._sounds[id].play();
    }
}