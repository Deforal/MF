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
document?.querySelector(".Main-slider")?.addEventListener("load", mainSlider())
document?.querySelector(".TP")?.addEventListener("load", TP_slider())

async function header() {
    const header = document?.querySelector(".header_landing");
    if (!header) return console.error("header is absent");

    const res = await fetch("./php/get_header_filters.php");
    const data = await res.json();

    const buildDropdown = (label, name, values) => {
        return `
            <div class="dropdown">
                <button href="#" class="dropdown_btn">${label}</button>
                <div class="dropdown_content">
                    ${values.map(val => {
                        const encoded = encodeURIComponent(val);
                        return `<a href="./catalog.html?${name}=${encoded}">${val}</a>`;
                    }).join('')}
                </div>
            </div>`;
    };

    let string = `
        <div class="header">
            <section class="header_top center">
                <a href="./index.html"><img src="./img/logos/logo2.svg" alt=""></a>
                <div class = "header_top_right">
                    <div class="dropdown">
                        <img src="./img/logos/Profile.svg" alt="" class="dropdown_btn">
                        <div class="dropdown_content">
                            <a href="./register.html">Регистрация</a>
                            <a href="./login.html">Вход</a>
                        </div>
                    </div>
                    <a href="./favs.html"><img src="./img/logos/heart.svg" alt=""></a>
                    <div class="header_top_right_cart">
                        <a href="./cart.html"><img src="./img/logos/Cart.svg" alt=""></a>
                        <p class="header_top_right_cart_p">3</p>
                    </div>
                </div>
            </section>
            <nav class="header_bottom center">
                ${buildDropdown('Тип', 'type', data.type)}
                ${buildDropdown('Категория', 'category', data.category)}
                <a href="./catalog.html?sale=1">Скидки</a>
                ${buildDropdown('Размер', 'size', data.size)}
            </nav>
        </div>
    `;

    header.innerHTML = string;
}


function footer() {
    const footer = document?.querySelector(".footer")
    if (footer) {
        let string = `
        <section class="footer__top">
            <div class="footer__support">
                <h3>Поддержка клиентов</h3>
                <a href="./return.html">Политика возврата</a>
                <a href="./offices.html">Наши офисы</a>
                
            </div>
            <div class="footer__about">
                <h3>О МетаФорма</h3>
                <a href="./quality.html">Наше качество</a>
                <a href="./about.html">О нас</a>
                <a href="./enviroment.html">Наша забота</a>
            </div>
            <div class="footer__help">
                <h3>Нужна помощь?</h3>
                <p>011 - 49594959</p>
                <p>indiacustomercare@glanbia.com</p>
            </div>
            <div class="footer__SM">
                <h3>Наши соц. сети</h3>
                <div>
                    <img src="./img/logos/youtube.svg" alt="" class="youtube">
                    <img src="./img/logos/inst.png" alt="">
                    <img src="./img/logos/facebook.svg" alt="">
                </div>
            </div>
        </section>
        <section class="footer__bottom">
            <img src="./img/logos/logo1.svg" alt="">
            <p>©2025 МетаФорма. Все права защищены.</p>
        </section>`
        footer.innerHTML = string
    } else {
        console.error("footer is absent");
    }
}
document.addEventListener("DOMContentLoaded", () => {
    header()
    footer()
})
document.addEventListener('DOMContentLoaded', () => {
    // Load filters and render them
    fetch('./php/get_filters.php')
        .then(response => response.json())
        .then(data => {
            const filtersContainer = document.getElementById('filters');
            filtersContainer.innerHTML = '';

            for (const [filterName, options] of Object.entries(data)) {
                const fieldset = document.createElement('fieldset');
                const legend = document.createElement('legend');
                legend.textContent = filterName;
                fieldset.appendChild(legend);

                options.forEach(option => {
                    const label = document.createElement('label');
                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = filterName;
                    radio.value = option.value;

                    label.appendChild(radio);
                    label.append(` ${option.value} (${option.count})`);
                    fieldset.appendChild(label);
                    fieldset.appendChild(document.createElement('br'));
                });

                filtersContainer.appendChild(fieldset);
            }
            const urlParams = new URLSearchParams(window.location.search);
            // Set filters and sort based on URL parameters
            urlParams.forEach((value, key) => {
                const radio = document.querySelector(`#filters input[name="${key}"][value="${value}"]`);
                if (radio) {
                    radio.checked = true;
                }
            });

            const sortParam = urlParams.get('sort');
            if (sortParam) {
                const sortSelect = document.getElementById('sort-select');
                sortSelect.value = sortParam;
            }

            // Add event listeners to all radios to trigger filtering on change
            filtersContainer.querySelectorAll('input[type=radio]').forEach(radio => {
                radio.addEventListener('change', () => {
                    const filters = gatherFilters();
                    fetchFilteredProducts(filters);
                });
            });

            // Initial fetch of products with current filters
            const filters = gatherFilters();
            fetchFilteredProducts(filters);
        })
        .catch(error => console.error('Error fetching filters:', error));
});

function gatherFilters() {
    const filters = {};
    document.querySelectorAll('#filters fieldset').forEach(fieldset => {
        const key = fieldset.querySelector('legend').textContent;
        const selected = fieldset.querySelector('input[type="radio"]:checked');
        if (selected) {
            filters[key] = selected.value;
        }
    });
    return filters;
}

function fetchFilteredProducts(filters) {
    const sortSelect = document.getElementById('sort-select');
    const sortValue = sortSelect.value;

    if (sortValue) {
        filters['sort'] = sortValue;
    }

    const query = new URLSearchParams(filters).toString();
    fetch(`./php/get_products.php?${query}`)
        .then(response => response.json())
        .then(products => {
            const grid = document.querySelector('.catalog__products_grid');
            const amountElem = document.querySelector('.amount_products');

            grid.innerHTML = '';

            amountElem.textContent = `Найдено товаров: ${products.length}`;

            if (products.length === 0) {
                grid.innerHTML = '<p>Товары не найдены.</p>';
                return;
            }

            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'catalog__products_card';
                card.innerHTML = `
                    <a href="#">
                        <img src="./img/catalog/id-${product.id}/${product.image}" alt="">
                    </a>
                    <h4>${product.Name}</h4>
                    <div>${product.Rating ?? 0} ★ (${product.ReviewCount} отзывов)</div>
                    <p>${product.Price}₽</p>
                `;
                grid.appendChild(card);
            });
        })
        .catch(error => console.error('Ошибка загрузки товаров:', error));
}

// Also listen for sort select changes
document.getElementById('sort-select').addEventListener('change', () => {
    const filters = gatherFilters();
    fetchFilteredProducts(filters);
});
document.getElementById('clear-filters').addEventListener('click', () => {
    document.querySelectorAll('#filters input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });

    const filters = gatherFilters();
    fetchFilteredProducts(filters);
});