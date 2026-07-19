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
    loginForm.hidden = Boolean(session);
    updateForm.hidden = !session;
    setAdminStatus("");
    setLoginStatus(session ? "sign-in confirmed." : "", session ? "success" : "");

    if (adminDialog.open) {
        (session ? updateTitle : adminEmail).focus();
    }
};

const renderUpdates = (updates) => {
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
        const publishedAt = new Date(update.published_at);

        entry.className = "update-entry";
        title.textContent = update.title;
        date.dateTime = publishedAt.toISOString();
        date.textContent = publishedAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        body.textContent = update.body;
        entry.append(date, title, body);
        updatesFeed.append(entry);
    });
};

const loadUpdates = async () => {
    const { data, error } = await client
        .from("updates")
        .select("id,title,body,published_at")
        .order("published_at", { ascending: false });

    if (error) {
        updatesStatus.textContent = "Updates are unavailable right now.";
        console.error(error);
        return;
    }

    renderUpdates(data);
};

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
        (data.session ? updateTitle : adminEmail).focus();
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

    loginForm.reset();
    setAdminView(data.session);
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
});

loadUpdates();
