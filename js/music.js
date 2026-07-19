const playButtons = document.querySelectorAll(".play-button");
const tracks = document.querySelectorAll("audio");
const progressBars = document.querySelectorAll(".progress");

const customLyrics = {

    "rock-revival": `[Spoken]
(Welcome to triple R! Please take a moment to listen to our introductory greeting!)

[Verse 1]
If you're looking for a life-long companion
Well, we have got your answer
Guaranteed to outlive you by millions of years
If you're looking for someone to rely on
Or for a boulder to cry on
Come on down to triple R, to let us aid your fears

[Chorus]
Rock on, rock on
Rock Revival and Restoration
Rock on, rock on
Rock Revival and
Rock Revival and
Rock Revival and Restoration

[Instrumental Break]

(Um, so, I'm just wondering... uh... what do you d- what do you do with the rocks? I'm not... it wasn't clear... what you do w-with the rocks... so...)
(Well I guess we're)

[Verse 2]
Kinda like an animal shelter
Strictly for hardеned magma
Sedimentary, mеtamorphic, even igneous
You could use one as a friendly little mate
Use one as a paperweight
But, in exchange for their service, do show them some love

[Chorus]
Rock on, rock on (Rock on! Rock on!)
Rock Revival and Restoration
Rock on, rock on (Rock on! Rock on!)
Rock Revival and Restoration
Rock on, rock on (Rock on! Rock on!)
Rock Revival and Restoration
Rock on, rock on (Rock on! Rock on!)
Rock Revival and (Rock Revival and!)
Rock Revival and Restoration

[Spoken]
(Is it specific rocks or is it just "the" rock- like, is there, like, a room of rocks that... you work with? And along side? I'm just... I need... yeah... thank you...)`

};

document.querySelectorAll("[data-release-date]").forEach((release) => {

    const date = document.createElement("p");
    const heading = release.querySelector("h2");

    date.className = "release-date";
    date.textContent = `Released ${release.dataset.releaseDate}`;

    heading.insertAdjacentElement("afterend", date);

});

document.querySelectorAll(".track").forEach((track) => {

    const lyrics = document.createElement("section");
    const text = document.createElement("p");
    const trackId = track.querySelector("audio").id;

    lyrics.className = "lyrics";
    lyrics.setAttribute("aria-label", "Lyrics");
    text.textContent = customLyrics[trackId] || "Lyrics coming soon.";

    lyrics.append(text);

    track.append(lyrics);

});

const getButton = (track) => document.querySelector(`.play-button[data-track="${track.id}"]`);
const getProgress = (track) => document.querySelector(`.progress[data-track="${track.id}"]`);
const progressAnimationFrames = new WeakMap();

const updateProgressSmoothly = (track) => {

    cancelAnimationFrame(progressAnimationFrames.get(track));

    const update = () => {

        if (Number.isFinite(track.duration)) {

            getProgress(track).value = (track.currentTime / track.duration) * 100;

        }

        if (!track.paused && !track.ended) {

            progressAnimationFrames.set(track, requestAnimationFrame(update));

        }

    };

    progressAnimationFrames.set(track, requestAnimationFrame(update));

};

const resetControls = (track) => {

    const button = getButton(track);

    button.textContent = "Play";
    button.classList.remove("is-playing");
    getProgress(track).value = 0;

};

playButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const track = document.querySelector(`#${button.dataset.track}`);

        if (!track.paused) {

            track.pause();

            return;

        }

        tracks.forEach((audio) => {

            if (audio !== track) {

                audio.pause();
                audio.currentTime = 0;
                resetControls(audio);

            }

        });

        track.play();
        button.textContent = "Pause";
        button.classList.add("is-playing");
        updateProgressSmoothly(track);

    });

});

progressBars.forEach((progress) => {

    progress.addEventListener("input", () => {

        const track = document.querySelector(`#${progress.dataset.track}`);

        if (Number.isFinite(track.duration)) {

            track.currentTime = (progress.value / 100) * track.duration;

        }

    });

});

tracks.forEach((track) => {

    track.addEventListener("timeupdate", () => {

        if (Number.isFinite(track.duration)) {

            getProgress(track).value = (track.currentTime / track.duration) * 100;

        }

    });

    track.addEventListener("pause", () => {

        cancelAnimationFrame(progressAnimationFrames.get(track));
        const button = getButton(track);

        button.textContent = "Play";
        button.classList.remove("is-playing");

    });

    track.addEventListener("ended", () => {

        resetControls(track);

    });

});
