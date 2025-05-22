"use strict";
function mainSlider() {
    const slidesContainer = document.querySelector(".Main-slides-container");
    const slides = document.querySelectorAll(".Main-slide");
    const dots = document.querySelectorAll(".dot");
    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");

    let currentIndex = 0;

    function updateSlider(index) {
        slidesContainer.style.transform = `translateX(-${index * 100}%)`;

        dots.forEach(dot => dot.classList.remove("active"));
        dots[index].classList.add("active");

        currentIndex = index;
    }

    prev.addEventListener("click", () => {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider(newIndex);
    });

    next.addEventListener("click", () => {
        const newIndex = (currentIndex + 1) % slides.length;
        updateSlider(newIndex);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            updateSlider(index);
        });
    });

    updateSlider(currentIndex);
}
function TP_slider() {
    const carousel = document.querySelector(".TP-img-track")
    const imges = carousel.querySelectorAll("img")
    const button = document.querySelector(".TP-right").querySelector("button")
    carousel.style.width = `${imges.length * 728}px`;
    let index = 0
    function changeSlides() {
        const slashes = document.querySelector(".TP-slash").querySelectorAll("button");
        const text = document.querySelectorAll(".TP-text");
        index++;
        if (index === imges.length) {
            index = 0;
        }
        carousel.style.transform = `translateX(-${index * 728}px)`;
        text.forEach(element => {
            element.classList.remove("active")
        })
        text[index].classList.add("active")
        slashes.forEach(element => {
            element.classList.remove("active")
        })
        slashes[index].classList.add("active")
        console.log(text);
        console.log(slashes);
    }
    button.addEventListener("click", changeSlides)
    const slashes = document.querySelector(".TP-slash").querySelectorAll("button");
    let count = 0
    slashes.forEach(element => {
        element.dataset.count = count;
        count++;
        element.addEventListener("click", () => {
            index = element.dataset.count - 1;
            changeSlides();
        })
    });
    console.log(imges);
    console.log(button);
}
document?.querySelector(".Main-slider").addEventListener("load", mainSlider())
document?.querySelector(".TP").addEventListener("load", TP_slider())
