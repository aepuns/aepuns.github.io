const updatesStatus = document.querySelector("#updates-status");
const updatesFeed = document.querySelector("#updates-feed");
const adminDialog = document.querySelector("#admin-dialog");
const adminClose = document.querySelector("#admin-close");
const loginForm = document.querySelector("#login-form");
const updateForm = document.querySelector("#update-form");
const adminSignOut = document.querySelector("#admin-sign-out");
const adminStatus = document.querySelector("#admin-status");
const loginStatus = document.querySelector("#login-status");
const adminEmail = document.querySelector("#admin-email");
const updateTitle = document.querySelector("#update-title");
const adminUserId = "8951dc95-5cbf-4800-941a-679902d34849";
const secretSequence = [
    "a",
    "p",
    "n",
    "ArrowUp"
];
let sequencePosition = 0;

const client = window.supabase.createClient(
    window.AEPUNS_SUPABASE.url,
    window.AEPUNS_SUPABASE.publishableKey
);

const setAdminStatus = (message, state = "") => {
    adminStatus.textContent = message;
    adminStatus.classList.toggle("is-success", state === "success");
    adminStatus.classList.toggle("is-error", state === "error");
};

const setLoginStatus = (message, state = "") => {
    loginStatus.textContent = message;
    loginStatus.classList.toggle("is-success", state === "success");
    loginStatus.classList.toggle("is-error", state === "error");
};

const setAdminView = (session) => {
    const isAdmin = session?.user.id === adminUserId;

    loginForm.hidden = isAdmin;
    updateForm.hidden = !isAdmin;
    setAdminStatus("");
    setLoginStatus(isAdmin ? "sign-in confirmed." : "", isAdmin ? "success" : "");

    if (adminDialog.open) {
        (isAdmin ? updateTitle : adminEmail).focus();
    }
};

const renderUpdates = (updates, likes, currentUserId) => {
    updatesFeed.replaceChildren();

    if (!updates.length) {
        updatesStatus.textContent = "No updates yet.";
        return;
    }

    updatesStatus.textContent = "";

    updates.forEach((update) => {
        const entry = document.createElement("article");
        const title = document.createElement("h2");
        const date = document.createElement("time");
        const body = document.createElement("p");
        const actions = document.createElement("div");
        const likeButton = document.createElement("button");
        const heart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const heartPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const likeCount = document.createElement("span");
        const publishedAt = new Date(update.published_at);
        const updateLikes = likes.filter((like) => like.update_id === update.id);
        const isLiked = updateLikes.some((like) => like.user_id === currentUserId);
        const isAdmin = currentUserId === adminUserId;

        entry.className = "update-entry";
        actions.className = "update-actions";
        title.textContent = update.title;
        date.dateTime = publishedAt.toISOString();
        date.textContent = publishedAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        body.textContent = update.body;
        likeButton.className = "like-button";
        likeButton.type = "button";
        likeButton.setAttribute("aria-label", `${isLiked ? "Unlike" : "Like"} ${update.title}`);
        likeButton.setAttribute("aria-pressed", String(isLiked));
        heart.setAttribute("class", "like-heart");
        heart.setAttribute("viewBox", "0 0 24 24");
        heart.setAttribute("aria-hidden", "true");
        heartPath.setAttribute("d", "M12 21C10.4 19.6 4.4 15.5 2.7 11.4C1.1 7.6 3.1 3.7 6.8 3.2C9 2.9 11 4 12 5.7C13 4 15 2.9 17.2 3.2C20.9 3.7 22.9 7.6 21.3 11.4C19.6 15.5 13.6 19.6 12 21Z");
        heart.append(heartPath);
        likeCount.textContent = String(updateLikes.length);
        likeButton.append(heart, likeCount);
        likeButton.addEventListener("click", () => toggleLike(update.id, isLiked, likeButton));
        actions.append(likeButton);

        if (isAdmin) {
            const deleteButton = document.createElement("button");

            deleteButton.className = "delete-button";
            deleteButton.type = "button";
            deleteButton.textContent = "delete";
            deleteButton.setAttribute("aria-label", `Delete ${update.title}`);
            deleteButton.addEventListener("click", () => deleteUpdate(update, deleteButton));
            actions.append(deleteButton);
        }

        entry.append(date, title, body, actions);
        updatesFeed.append(entry);
    });
};

const loadUpdates = async () => {
    const [updatesResult, likesResult, sessionResult] = await Promise.all([
        client
            .from("updates")
            .select("id,title,body,published_at")
            .order("published_at", { ascending: false }),
        client
            .from("update_likes")
            .select("update_id,user_id"),
        client.auth.getSession()
    ]);

    if (updatesResult.error) {
        updatesStatus.textContent = "Updates are unavailable right now.";
        console.error(updatesResult.error);
        return;
    }

    if (likesResult.error) {
        console.error(likesResult.error);
    }

    renderUpdates(
        updatesResult.data,
        likesResult.data || [],
        sessionResult.data.session?.user.id
    );
};

const getLikeUser = async () => {
    const { data: sessionData } = await client.auth.getSession();

    if (sessionData.session) {
        return sessionData.session.user;
    }

    const { data, error } = await client.auth.signInAnonymously();

    if (error) {
        if (/anonymous sign-?ins? (are|is) disabled/i.test(error.message)) {
            throw new Error("LIKES_REQUIRE_ANONYMOUS_AUTH", { cause: error });
        }

        throw error;
    }

    return data.user;
};

async function toggleLike(updateId, isLiked, button) {
    button.disabled = true;

    try {
        const user = await getLikeUser();
        const query = isLiked
            ? client
                .from("update_likes")
                .delete()
                .eq("update_id", updateId)
                .eq("user_id", user.id)
            : client
                .from("update_likes")
                .insert({ update_id: updateId });
        const { error } = await query;

        if (error) {
            throw error;
        }

        await loadUpdates();
    } catch (error) {
        button.disabled = false;
        updatesStatus.textContent = error.message === "LIKES_REQUIRE_ANONYMOUS_AUTH"
            ? "likes need anonymous sign-ins enabled in Supabase."
            : "couldn't update that heart. try again.";
        console.error(error);
    }
}

async function deleteUpdate(update, button) {
    if (!window.confirm(`Delete "${update.title}"? This can't be undone.`)) {
        return;
    }

    button.disabled = true;
    updatesStatus.textContent = "deleting update...";

    const { error } = await client
        .from("updates")
        .delete()
        .eq("id", update.id);

    if (error) {
        button.disabled = false;
        updatesStatus.textContent = "couldn't delete that update. check the database setup.";
        console.error(error);
        return;
    }

    updatesStatus.textContent = "update deleted.";
    await loadUpdates();
}

document.addEventListener("keydown", async (event) => {
    if (event.target.matches("input, textarea")) {
        return;
    }

    const expectedKey = secretSequence[sequencePosition];
    const pressedKey = event.key.length === 1 ? event.key.toLowerCase() : event.key;

    if (pressedKey === expectedKey) {
        sequencePosition += 1;
    } else {
        sequencePosition = pressedKey === secretSequence[0] ? 1 : 0;
    }

    if (sequencePosition === secretSequence.length) {
        sequencePosition = 0;
        const { data } = await client.auth.getSession();
        setAdminView(data.session);
        adminDialog.showModal();
        (data.session?.user.id === adminUserId ? updateTitle : adminEmail).focus();
    }
});

adminClose.addEventListener("click", () => {
    adminDialog.close();
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setLoginStatus("signing in...");

    const formData = new FormData(loginForm);
    const { data, error } = await client.auth.signInWithPassword({
        email: formData.get("email"),
        password: formData.get("password")
    });

    if (error) {
        setLoginStatus("sign-in incorrect. you're not aepuns >:(", "error");
        return;
    }

    if (data.session?.user.id !== adminUserId) {
        await client.auth.signOut();
        setAdminView(null);
        setLoginStatus("sign-in incorrect. you're not aepuns >:(", "error");
        return;
    }

    loginForm.reset();
    setAdminView(data.session);
    await loadUpdates();
});

updateForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setAdminStatus("posting...");

    const formData = new FormData(updateForm);
    const { error } = await client.from("updates").insert({
        title: formData.get("title").trim(),
        body: formData.get("body").trim()
    });

    if (error) {
        setAdminStatus("posting failed. check the database setup and your admin account.", "error");
        console.error(error);
        return;
    }

    updateForm.reset();
    setAdminStatus("update posted.", "success");
    await loadUpdates();
});

adminSignOut.addEventListener("click", async () => {
    await client.auth.signOut();
    setAdminView(null);
    await loadUpdates();
});

loadUpdates();
