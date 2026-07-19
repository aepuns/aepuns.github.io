const playButtons = document.querySelectorAll(".play-button");
const tracks = document.querySelectorAll("audio");
const progressBars = document.querySelectorAll(".progress");

const customLyrics = {
    "aliens-remastered": `[Chorus]
The aliens have found earth and
They're coming down to steal our land
Their pointy antennae and glossy eyes
They're coming down to steal our lives

[Verse 1]
The president of the world comes out
And he speaks to the aliens
"Now, be reasonable, aliens, let us live
We've never hurt you, be civil about this!"
The aliens send a transmission to earth
And the government translates all the words
If the aliens hate us, we will be dead
This is what that message said

[Chorus]
We aliens have found earth and
We're coming down to steal your land
Our pointy antennae and glossy eyes
There's nothing you can do to stop our rise

[Verse 2]
And now the world is really really worried
The president makes a speech, "Hurry hurry hurry
Get to the nearest NASA location and hop into a rocket, we're outta this place, man"
Hop into my car, hit the road, and drive
By the time I get to NASA, there's a crowd outside
The world is at a standstill and nobody moves
Until somebody in NASA opens the front doors and BOOM
The crowd goes wild
Soon enough the spaceships are heading skyward
All of Canada packed into the ships
As we leave the ground the UFOs zoom and zip around
Our shuttles space bound
Now we're out, all safe and sound
A smart man's plans have all paid off
And within a day, we're set up on Mars

[Chorus]
We aliens have found Mars and
We're coming down to steal your land
Our pointy antennae and glossy eyes
There's no planet that you can hide

[Verse 4]
The lasers come out, ZAP, BANG, BLAST
The aliens want to kill us fast
People dead to my left and to my right
I know I gotta escape or I'm gonna die
I kick down people, rush through the crowd
ZAP, BANG, BLAST, the lasers so loud
I hop into a rocket, off of Mars
I'm not sure how to pilot this hunk of junk
ZAP, BANG, BLAST, I hit a few UFOs
They're trying to take me out but they're way too slow
Or it could be because I'm flying really bad
It takes me a minute to get back on track

[Outro]
But now I'm gliding through space
For about two days
Until I find earth
And then I'm home safe`,

    "frogs": `[Verse 1: Snown't Man]
Goopaleepadoopadeega, badookadookaleegoo, badookoo-ah
Bookalookadoopadeeda, balookadookadedoo, gadoogadoogaleegah, badookadooka
I'm sitting here dancing in bogs
Eating flies like a hog the cog
In my brain running laps in my head
I could end up dead
Thinking of jumping around
Cause this beat is so sound
It has a profound noise
It can put a baby to bed
The swamp’s filled with the beats of ecosystems, complete
A chain of species singing so sweet
Making all of your troubles be sweeped
Under a rug tugged deep into complete harmony
Did Horton hear a who?
Or should you be worrying about how to
Be a cold blooded frog like me? And Hop to the beat
Let's feel the heat of the many webbed feet

[Verse 2: Duck]
Wee!!! I’m a fly, guys!
Life so sweet, like Mai Tais
I just ride the breeze and dive ‘round trees
And I’m so pleased, provided, these
Predators don’t try to eat me, yeah
I’m feeling great when both of my wings meet the air
I don’t wanna get swatted or zapped
People call me a bug, I don’t wanna be that
I wanna be the guy that’s fun at parties
First to the scene when a peel is rotting
I’m the type of guy to land on your shoulder
And rub my hands, plotting when you’re looking over
Oh, can I fly in your wine? I appreciate it
Dining inside it ‘til I’m inebriated
I really hate it when people slap me, it’s rude
I’m only flying around you ‘cause you stinking, dude!
Scientific name, diptera
If I see a spider web, then I dip in terror
‘Cause I only live 28 days of my life
So I gotta make the most of it while I’m alive

[Verse 3: aepuns]
Hey, what’s popping, I’m Og the frog
I’m hopping off a log and into the bog
Some call me a ugly and small
But the females love me ‘cause I rock the swamp, ha!
Don’t knock the frog life, my friend
Take a lap ‘round the pond and back again
That’s 2.43 meters per second
I can tell that’s impressing, by your facial expression
“Wow Mr. Og, that’s super great!
But how do you frogs communicate?”
Well, it’s simple, when we’re not on a beat
We call out to each other with croaks and creaks
The cars want me popped when I cross the road
But don’t liken me to a disgusting toad
I’ll dodge those idiots with agility
And avoid those vehicular guillotines
Yeah, I’m cunning at running away from prey
And when it’s sunny, I’m finding a good place to lay
Hip hopping since the day I was spawned
That’s why I got the big greens up inside of my pond`,

    "missed-halloween": `[Chorus]
Boo, trick or treat, man, I’m at your door
And it’s not Halloween, it’s November 4th
And so you might ask, “What am I out here for?”
But I’m just out for candy and nothing more

[Verse 1]
So I missed out on Halloween
But Halloween is the best, undoubtedly
And I don’t wanna miss out on the treats
So I’m going ‘round town at the start of the week
Yep, November 4th today
And if I don’t get enough, tomorrow; do it again
It’s celebrating Halloween with a bit of delay
And if I knock on the door, then man, you know what I’ll say

[Chorus]
(I'll say) Boo, man, I’m at your door
But it’s not Halloween, it’s November 4th
So you might ask, “What are you out here for?”
But I’m just out for candy and nothing more

[Verse 2]
I’m not wearing a costume
But if you squint then I kinda look like Tom Cruise
So if you see me on the five o’clock news
Whatever they're accusing me of was probably Tom Cruise
I’m just knock knocking people’s doors
Just to see, perhaps, if anybody’s currently home
And if they aren’t I might break into their front window
And steal any valuables that they may own
And ransack their cupboards for anything good
And walk around the house with shoes covered in mud
And then leave the house, knowing I've done no good
And see their lawnmower (Well, I could)

[Chorus]
Boo, trick or treat, man, I’m at your door
And it’s not Halloween, it’s November 4th
So you might ask, “What am I out here for?”
But I’m just out for candy and nothing more`
};

document.querySelectorAll("details.lyrics").forEach((details) => {
    const lyrics = document.createElement("section");
    const text = details.querySelector("p");
    const trackId = details.closest(".track").querySelector("audio").id;

    lyrics.className = "lyrics";
    lyrics.setAttribute("aria-label", "Lyrics");
    lyrics.append(text);
    details.replaceWith(lyrics);

    if (customLyrics[trackId]) {
        text.textContent = customLyrics[trackId];
    }
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
    getButton(track).textContent = "Play";
    getButton(track).classList.remove("is-playing");
    getProgress(track).value = 0;
};

playButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const track = document.querySelector(`#${button.dataset.track}`);
        if (!track.paused) { track.pause(); return; }
        tracks.forEach((audio) => {
            if (audio !== track) { audio.pause(); audio.currentTime = 0; resetControls(audio); }
        });
        track.play();
        button.textContent = "Pause";
        button.classList.add("is-playing");
        updateProgressSmoothly(track);
    });
});

progressBars.forEach((progress) => {
    progress.step = "any";

    progress.addEventListener("input", () => {
        const track = document.querySelector(`#${progress.dataset.track}`);
        if (Number.isFinite(track.duration)) track.currentTime = (progress.value / 100) * track.duration;
    });
});

tracks.forEach((track) => {
    track.addEventListener("timeupdate", () => {
        if (Number.isFinite(track.duration)) getProgress(track).value = (track.currentTime / track.duration) * 100;
    });
    track.addEventListener("pause", () => {
        cancelAnimationFrame(progressAnimationFrames.get(track));
        getButton(track).textContent = "Play";
        getButton(track).classList.remove("is-playing");
    });
    track.addEventListener("ended", () => resetControls(track));
});
if (localStorage.getItem("disable-bubble-zoom") === "true") {
    document.documentElement.classList.add("disable-bubble-zoom");
}
