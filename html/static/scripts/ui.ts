function getCurrentYear(): void {
    const el: HTMLElement|null = document.getElementById("year");
    if (el) el.innerHTML = ` \u2013 ${new Date().getFullYear()}`;
}

function initRevealOnScroll(): void {
    const targets: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>(
        ".card, #contentBody > ul > li, img.badge, .contactTile"
    );
    if (targets.length === 0) return;

    targets.forEach((el: HTMLElement): void => el.classList.add("reveal"));

    const prefersReduced: boolean = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !("IntersectionObserver" in window)) {
        targets.forEach((el: HTMLElement): void => el.classList.add("in-view"));
        return;
    }

    const io = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]): void => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    io.unobserve(entry.target);
                }
            }
        },
        { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    targets.forEach((el: HTMLElement): void => io.observe(el));
}

function initRotatingSubtitle(): void {
    const el: HTMLElement|null = document.querySelector<HTMLElement>("#contentTitle h2");
    if (!el) return;

    const roles: string[] = [
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
    let i: number = 0;
    el.textContent = roles[0]!;

    window.setInterval((): void => {
        el.classList.add("is-fading");
        window.setTimeout((): void => {
            i = (i + 1) % roles.length;
            el.textContent = roles[i]!;
            el.classList.remove("is-fading");
        }, 300);
    }, 2800);
}

function formatFingerprint(raw: string): string {
    const cleaned: string = raw.replace(/\s+/g, "").toUpperCase();
    const groups: RegExpMatchArray | null = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
}

function initPgpFingerprint(): void {
    const el: HTMLElement | null = document.getElementById("pgpFingerprint");
    if (!el) return;

    fetch("/fingerprint.txt", { cache: "no-store" })
        .then((res: Response): Promise<string> => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.text();
        })
        .then((text: string): void => {
            const trimmed: string = text.trim();
            if (!trimmed) throw new Error("empty fingerprint");
            el.textContent = formatFingerprint(trimmed);
            el.dataset.status = "ready";
        })
        .catch((): void => {
            el.dataset.status = "error";
            el.textContent = "";
        });
}

function main(): number {
    getCurrentYear();
    initRevealOnScroll();
    initRotatingSubtitle();
    initPgpFingerprint();
    return 0;
}
main();
