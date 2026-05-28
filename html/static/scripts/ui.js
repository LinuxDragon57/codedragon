"use strict";
function getCurrentYear() {
    const el = document.getElementById("year");
    if (el)
        el.innerHTML = ` \u2013 ${new Date().getFullYear()}`;
}
function initRevealOnScroll() {
    const targets = document.querySelectorAll(".card, #contentBody > ul > li, img.badge, .contactTile");
    if (targets.length === 0)
        return;
    targets.forEach((el) => el.classList.add("reveal"));
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !("IntersectionObserver" in window)) {
        targets.forEach((el) => el.classList.add("in-view"));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                io.unobserve(entry.target);
            }
        }
    }, { threshold: 0.15, rootMargin: "0px 0px -5% 0px" });
    targets.forEach((el) => io.observe(el));
}
function initRotatingSubtitle() {
    const el = document.querySelector("#contentTitle h2");
    if (!el)
        return;
    const roles = [
        "Software Engineer",
        "Linux Sysadmin",
        "Cyber-Security Wizard",
        "Astronomy Nerd",
        "FOSS Advocate",
        "Robotics Enthusiast",
    ];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }
    el.classList.add("rotatingSubtitle");
    let i = 0;
    el.textContent = roles[0];
    window.setInterval(() => {
        el.classList.add("is-fading");
        window.setTimeout(() => {
            i = (i + 1) % roles.length;
            el.textContent = roles[i];
            el.classList.remove("is-fading");
        }, 300);
    }, 2800);
}
function formatFingerprint(raw) {
    const cleaned = raw.replace(/\s+/g, "").toUpperCase();
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
}
function initPgpFingerprint() {
    const el = document.getElementById("pgpFingerprint");
    if (!el)
        return;
    fetch("/fingerprint.txt", { cache: "no-store" })
        .then((res) => {
        if (!res.ok)
            throw new Error(`HTTP ${res.status}`);
        return res.text();
    })
        .then((text) => {
        const trimmed = text.trim();
        if (!trimmed)
            throw new Error("empty fingerprint");
        el.textContent = formatFingerprint(trimmed);
        el.dataset.status = "ready";
    })
        .catch(() => {
        el.dataset.status = "error";
        el.textContent = "";
    });
}
function main() {
    getCurrentYear();
    initRevealOnScroll();
    initRotatingSubtitle();
    initPgpFingerprint();
    return 0;
}
main();
