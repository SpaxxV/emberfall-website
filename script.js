const bgLrg = document.getElementById("landingBgIMG");
bgLrg.src = "./images/bg_" + Math.floor(Math.random() * 3) + ".png";
bgLrg.onload = () => {bgLrg.hidden = false};

const navbar = document.getElementById("navbar");

const landingContent = document.getElementById("landingContent");

function onScroll() {
    const scrollY = window.scrollY;

    navbar.classList.toggle("scrolled", scrollY > 60);

    landingContent.style.transform = `translateY(${scrollY * 0.22}px)`;
    landingContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.7));
}

window.addEventListener("scroll", onScroll, { passive: true });

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
    if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
    }
    });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

const track = document.getElementById("staffTrack");
const cardW = 260 + 24;
let staffIndex = 0;
const maxCards = track.children.length;

function slideStaff(dir) {
    dir *= Math.max(1, Math.floor(track.parentElement.clientWidth / cardW));
    console.log(dir);
    const visibleCards = Math.floor(track.parentElement.offsetWidth / cardW);
    const maxIndex = Math.max(0, maxCards - visibleCards);
    staffIndex = Math.max(0, Math.min(staffIndex + dir, maxIndex));
    track.style.transform = `translateX(-${staffIndex * cardW}px)`;
}

function toggleAbout() {
    const extra = document.getElementById("aboutExtra");
    const arrow = document.getElementById("readMoreArrow");
    const btn = document.getElementById("readMoreBtn");
    const isOpen = extra.classList.toggle("open");
    arrow.style.transform = isOpen ? "rotate(90deg)" : "";
    btn.childNodes[0].textContent = isOpen ? "Read Less " : "Read More ";
}

const carouselImages = ["./images/events/twevent.png", "./images/events/lfevent.png", "./images/events/vevent.png", "./images/events/pevent.png"];
let carouselIndex = 0;

setInterval(() => {
    for (let i = 0; i < 4; i++) {
        document.getElementById("cimgc" + i).style.animation = "trans-avis-" + i +" 1s ease-in-out forwards";
    }
    setTimeout(() => {
        carouselIndex++;
        if (carouselIndex == carouselImages.length) carouselIndex = 0;
        let ci = carouselIndex;
        for (let i = 0; i < 4; i++) {
            document.getElementById("cimgc" + i).style.animation = "none";
            document.getElementById("cimg" + i).src = carouselImages[ci];
            ci++;
            if (ci == carouselImages.length) ci = 0;
        }
    }, 1000);
}, 5000);

externalGetRequest("https://discord.com/api/v10/invites/emberfallevents?with_counts=true&with_expiration=true", (res) => {
    if (res.approximate_member_count) {
        document.getElementById("online-count").innerHTML = res.approximate_presence_count + " Online";
        document.getElementById("member-count").innerHTML = res.approximate_member_count + " Members";
    }
})