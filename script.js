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
async function isUserLoggedIn() {
    try {
        const res = await fetch('./php/is_logged_in.php');
        const result = await res.json();
        return result;
    } catch (err) {
        return console.error('Error checking login status:', err);;
    }
}
async function header() {
    const header = document?.querySelector(".header_landing");
    if (!header) return console.error("header is absent");

    const [filtersRes, isLoggedIn] = await Promise.all([
        fetch("./php/get_header_filters.php").then(res => res.json()),
        isUserLoggedIn()
    ]);

    const data = filtersRes;

    const buildDropdown = (label, name, values) => {
        return `
            <div class="dropdown">
                <button href="#" class="dropdown_btn">${label}</button>
                <div class="dropdown_content">
                    ${values.map(val => {
                        console.log(val);
                        const encoded = encodeURIComponent(val);
                        return `<a href="./catalog.html?${label}=${encoded}">${val}</a>`;
                    }).join('')}
                </div>
            </div>`;
    };
    console.log(isLoggedIn);
    const profileHTML = isLoggedIn.loggedIn
        ? `
        <div class="profile_icon_wrapper">
            <img src="./img/logos/Profile.svg" alt="" class="profile_icon link_like">
            <div class="profile_dropdown hidden">
                ${isLoggedIn.user.Role == 1 ? `<a href ="./admin_panel.html" class="link_like"> Админ панель </a>` : ``}
                <p class="link_like">Профиль</p>
                <p class="link_like">История заказов</p>
                <a class="link_like" href="./php/logout.php">Выйти</a>
            </div>
        </div>`
        : `
            <div class="dropdown">
                <img src="./img/logos/Profile.svg" alt="" class="dropdown_btn">
                <div class="dropdown_content">
                    <a href="./register.html">Регистрация</a>
                    <a href="./login.html">Вход</a>
                </div>
            </div>
        `;

    let string = `
        <div class="header">
            <section class="header_top center">
                <a href="./index.html"><img src="./img/logos/logo2.svg" alt=""></a>
                <div class="header_top_right">
                    ${profileHTML}
                    <div class="header_top_right_cart">
                        <a href="./cart.html"><img src="./img/logos/Cart.svg" alt="" class="cart_icon"></a>
                        <p class="header_top_right_cart_p ${isLoggedIn ? "display" : ""}">3</p>
                    </div>
                </div>
            </section>
            <nav class="header_bottom center">
                ${buildDropdown('Тип', 'type', data.type)}
                ${buildDropdown('Категория', 'category', data.category)}
                <a href="./catalog.html?sale=1">Скидки</a>
                ${buildDropdown('Размер', 'size', data.size)}
                ${buildDropdown('Вкус', 'size', data.flavour)}
            </nav>
        </div>
    `;

    header.innerHTML = string;
}

document.addEventListener('click', e => {
    const profileIcon = document.querySelector('.profile_icon');
    const profileDropdown = document.querySelector('.profile_dropdown');
    const cartIcon = document.querySelector('.cart_icon');
    const cartDropdown = document.querySelector('.cart_dropdown');

    if (profileIcon && profileDropdown && profileIcon.contains(e.target)) {
        profileDropdown.classList.toggle('hidden');
    } else if (!profileDropdown?.contains(e.target)) {
        profileDropdown?.classList.add('hidden');
    }

    if (cartIcon && cartDropdown && cartIcon.contains(e.target)) {
        cartDropdown.classList.toggle('hidden');
    } else if (!cartDropdown?.contains(e.target)) {
        cartDropdown?.classList.add('hidden');
    }
});

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
    const page = document.querySelector(".catalog");
    if (!page) return;
    // Load filters and render them
    fetch('./php/get_filters.php')
        .then(response => response.json())
        .then(data => {
            const filtersContainer = document.getElementById('filters');
            filtersContainer.innerHTML = '';
            console.log(data);
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
                });

                filtersContainer.appendChild(fieldset);
            }
            const urlParams = new URLSearchParams(window.location.search);
            // Set filters and sort based on URL parameters
            urlParams.forEach((value, key) => {
                console.log(value, key);
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
                    <a href="product.html?id=${product.id}">
                        <img src="./img/catalog/id-${product.id}/${product.image}" alt="">
                    </a>
                    <h4>${product.NewName} - ${product.Flavour} - ${product.Size}</h4>
                    <div>${product.Rating ?? 0} ★ (${product.ReviewCount} отзывов)</div>
                    <p>${product.Price}₽</p>
                `;
                grid.appendChild(card);
            });
        })
        .catch(error => console.error('Ошибка загрузки товаров:', error));
}

// Also listen for sort select changes
document?.getElementById('sort-select')?.addEventListener('change', () => {
    const filters = gatherFilters();
    fetchFilteredProducts(filters);
});
document?.getElementById('clear-filters')?.addEventListener('click', () => {
    document.querySelectorAll('#filters input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });

    const filters = gatherFilters();
    fetchFilteredProducts(filters);
});

document.addEventListener('DOMContentLoaded', () => {
    const registerPage = document.querySelector(".register");
    if (!registerPage) return;

    console.log("form"); // ✅ This should now run

    const form = document.querySelector('.register_form');
    const message = document.querySelector('main.register .error_msg');

    const fieldMap = {
        name: '.reg_name',
        email: '.reg_email',
        phone: '.reg_phone',
        birth: '.reg_date',
        pass: '.reg_pass',
        rpass: '.reg_Rpass'
    };

    form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        let hasError = false;

        // Clear previous errors
        Object.entries(fieldMap).forEach(([key, selector]) => {
            const input = document.querySelector(selector);
            const errorText = document.querySelector(`${selector}_error`);
            input.classList.remove('error');
            if (errorText) errorText.classList.remove('error_msg_display');
        });

        // Validate fields
        const data = {};
        Object.entries(fieldMap).forEach(([key, selector]) => {
            const input = document.querySelector(selector);
            const value = input.value.trim();
            if (!value) {
                input.classList.add('error');
                document.querySelector(`${selector}_error`).classList.add('error_msg_display');
                hasError = true;
            }
            data[key] = value;
        });

        if (data.pass !== data.rpass) {
            hasError = true;
            const passInput = document.querySelector(fieldMap.pass);
            const rpassInput = document.querySelector(fieldMap.rpass);
            document.querySelector('.reg_Rpass_error').textContent = 'Пароли не совпадают';
            document.querySelector('.reg_Rpass_error').classList.add('error_msg_display');
            passInput.classList.add('error');
            rpassInput.classList.add('error');
        }

        if (hasError) return;

        // Prepare data
        const body = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            birth: data.birth,
            gender: form.gender.value,
            pass: data.pass
        };

        try {
            const res = await fetch('./php/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const result = await res.json();
            if (result.success) {
                message.textContent = 'Успешная регистрация!';
                window.location.href = './index.html';
            } else {
                message.textContent = result.message || 'Ошибка регистрации';
            }
        } catch (err) {
            message.textContent = 'Ошибка при подключении к серверу.';
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const page = document.querySelector('.login_form');
    if (!page) return;
    const form = document.querySelector('.login_form');
    const message = document.querySelector('main.login .error_msg');

    const fieldMap = {
        email: '.log_email',
        pass: '.log_pass'
    };

    form.addEventListener('submit', async e => {
        e.preventDefault();
        let hasError = false;

        // Clear previous errors
        Object.entries(fieldMap).forEach(([key, selector]) => {
            const input = document.querySelector(selector);
            const errorText = document.querySelector(`${selector}_error`);
            input.classList.remove('error');
            if (errorText) errorText.classList.remove('error_msg_display');
        });
        message.textContent = '';

        // Validate fields
        const data = {};
        Object.entries(fieldMap).forEach(([key, selector]) => {
            const input = document.querySelector(selector);
            const value = input.value.trim();
            if (!value) {
                input.classList.add('error');
                document.querySelector(`${selector}_error`).classList.add('error_msg_display');
                hasError = true;
            }
            data[key] = value;
        });

        if (hasError) return;

        // Send data
        try {
            const res = await fetch('./php/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (result.success) {
                window.location.href = './index.html';
            } else {
                message.textContent = result.message || 'Неверный логин или пароль.';
            }
        } catch (err) {
            message.textContent = 'Ошибка при подключении к серверу.';
        }
    });
});

async function loadProduct(productId) {
    const res = await fetch(`./php/getVariants.php?id=${productId}`);
    const data = await res.json();

    const variants = data.variants;
    const desc = data.description;
    let current = variants[0]; // pick default (or find based on current flavour/size)

    // Set product name
    const fullName = `${desc.name} ${current.Flavour} ${current.Size}`;
    document.querySelector("h1").textContent = fullName;
    document.querySelector(".link_tree p:last-of-type").textContent = fullName;

    // Overview sections (assumes 3)
    const overviewHTML = [
        { title: "Обзор", content: desc.overview },
        { title: "Как принимать", content: desc.suggest },
        { title: "Преимущества", content: desc.benefits }
    ].map((section, i) => `
        <section>
            <a href="#" class="toggle-overview" data-index="${i}">
                ${section.title} <span><</span>
            </a>
            <div class="overview-content">${section.content}</div>
        </section>
    `).join("");

    document.querySelector(".product__overview").innerHTML = overviewHTML;

    // Toggle overview section visibility
    document.querySelectorAll(".toggle-overview").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const section = link.parentElement;
            section.classList.toggle("open");
        });
    });

    // Benefits (as list items)
    const benefitList = desc.benefits.split("\n").map(line => `<li>${line}</li>`).join("");
    document.querySelector(".product_listBenef").innerHTML = benefitList;
}

document.addEventListener("DOMContentLoaded", async () => {
    const page = document.querySelector(".product");
    if (!page) return;

    const productId = new URLSearchParams(window.location.search).get("id");

    if (productId) {
        loadProduct(productId)
    }

    const flavourSelect = document.getElementById("flavour-select");
    const sizeSection = document.querySelector(".product__size");
    const sizeButtonsContainer = document.getElementById("size-buttons");
    const priceSection = document.getElementById("price-section");

    const qtyInput = document.getElementById("qty-input");
    const qtyMinus = document.getElementById("qty-minus");
    const qtyPlus = document.getElementById("qty-plus");
    const qtyError = document.getElementById("qty-error");

    let productVariants = [];
    let selectedProduct = null;

    // 1. Fetch all variants of the current product's group
    const res = await fetch(`./php/getVariants.php?id=${productId}`);
    productVariants = await res.json();
    
    // 2. Find selected product based on id from URL
    selectedProduct = productVariants.variants.find(p => p.id == productId);

    if (!selectedProduct) {
        console.error("Product not found");
        return;
    }

    // 3. Populate unique flavours from existing variants
    const uniqueFlavours = [...new Set(productVariants.variants.map(p => p.Flavour))];
    console.log(uniqueFlavours);
    uniqueFlavours.forEach(flavour => {
        const opt = document.createElement("option");
        opt.value = flavour;
        opt.textContent = flavour;
        flavourSelect.appendChild(opt);
    });
    console.log(selectedProduct);
    // 4. Set selected flavour on page load
    flavourSelect.value = selectedProduct.Flavour;
    showSizesForFlavour(selectedProduct.Flavour, selectedProduct.Size);

    // 5. On flavour change, update sizes
    flavourSelect.addEventListener("change", () => {
        showSizesForFlavour(flavourSelect.value, null);
    });

    // Helper: Show size buttons for a given flavour
    function showSizesForFlavour(flavour, preselectSize = null) {
        const filtered = productVariants.variants.filter(p => p.Flavour === flavour);

        sizeButtonsContainer.innerHTML = "";

        filtered.forEach(p => {
            const btn = document.createElement("button");
            const isOutOfStock = parseInt(p.Amount_avbl) === 0;

            btn.textContent = `${p.Size} (${p.Amount_avbl} шт)` + (isOutOfStock ? " — нет в наличии" : "");
            btn.dataset.price = p.Price;
            btn.dataset.second_price = p.Second_price;
            btn.dataset.Pid = p.id;

            if (isOutOfStock) {
                btn.disabled = true;
                btn.classList.add("out-of-stock");
            } else {
                btn.addEventListener("click", () => {
                    updatePrice(p.Price, p.Second_price);
                    highlightSelectedSize(btn);
                });
                if (p.Size === preselectSize) {
                    console.log("click");
                     setTimeout(() => btn.click(), 0);
                }
            }

            sizeButtonsContainer.appendChild(btn);

            // Auto-select matching size if provided
        });

        sizeSection.style.display = "flex";
        priceSection.style.display = "none";
    }

    // Helper: Update price display
    function updatePrice(price, secondPrice) {
        if (secondPrice != null) {
            priceSection.innerHTML = `<span class="before">${price} $</span><span class="after">${secondPrice} $</span>`
        } else {
            priceSection.textContent = `${price} $`;
        }
        priceSection.style.display = "flex";
    }

    // Helper: Highlight selected size
    function highlightSelectedSize(activeBtn) {
        [...sizeButtonsContainer.children].forEach(btn => btn.classList.remove("selected"));
        activeBtn.classList.add("selected");
    }

    // Quantity controls
    function updateQtyControls() {
        const value = parseInt(qtyInput.value) || 1;
        qtyMinus.disabled = value <= 1;
        qtyPlus.disabled = value >= 50;
        qtyMinus.classList.toggle("btn--disabled", value <= 1);
        qtyPlus.classList.toggle("btn--disabled", value >= 50);
        qtyError.style.display = value > 50 ? "block" : "none";
    }

    qtyMinus.addEventListener("click", () => {
        let val = parseInt(qtyInput.value) || 1;
        if (val > 1) qtyInput.value = val - 1;
        updateQtyControls();
    });

    qtyPlus.addEventListener("click", () => {
        let val = parseInt(qtyInput.value) || 1;
        if (val < 50) qtyInput.value = val + 1;
        updateQtyControls();
    });

    qtyInput.addEventListener("input", () => {
        let val = parseInt(qtyInput.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 50) {
            qtyInput.value = 50;
        } else {
            qtyInput.value = val;
        }
        updateQtyControls();
    });

    updateQtyControls(); // initial
});

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".admin__top_button");
    const tableContainers = document.querySelectorAll(".admin__table-container");

    const renderTable = async (tableName) => {
        const table = document.getElementById(tableName);
        try {
        const response = await fetch(`./php/admin_render.php?table=${tableName}`);
        const html = await response.text();
        table.innerHTML = html;
        } catch (error) {
        console.error(`Error loading ${tableName}:`, error);
        table.innerHTML = `<tr><td colspan="100%" class="error">Failed to load ${tableName} table.</td></tr>`;
        }
    };

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
        const target = button.dataset.target;

        tableContainers.forEach((container) => {
            container.classList.add("hidden");
        });

        const activeContainer = document.getElementById(`table-${target}`);
        activeContainer.classList.remove("hidden");

        renderTable(target);
        });
    });

    // Render first table by default
    if (buttons.length > 0) {
        buttons[0].click();
    }
});

document.addEventListener("input", (e) => {
    if (e.target.tagName === "TD" && e.target.hasAttribute("contenteditable")) {
        const id = e.target.dataset.id;
        const column = e.target.dataset.column;
        const table = e.target.closest("table").id;
        const value = e.target.innerText;

        fetch("./php/admin_update.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ table, id, column, value })
        });
    }
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const id = e.target.dataset.id;
        const table = e.target.closest("table").id;

        fetch("./php/admin_delete.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ table, id })
        }).then(() => {
            e.target.closest("tr").remove();
        });
    }
});

document.addEventListener("submit", async (e) => {
    if (!e.target.matches(".insert-form")) return;
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const table = form.dataset.table;

    try {
        const response = await fetch('./php/admin_insert.php', {
            method: 'POST',
            body: new URLSearchParams([...formData, ['table', table]])
        });

        const result = await response.text();
        if (result === 'success') {
            form.reset();
            const tableElem = document.getElementById(table);
            const reloadEvent = new Event('click');
            document.querySelector(`[data-target="${table}"]`).dispatchEvent(reloadEvent);
        } else {
            alert('Ошибка добавления: ' + result);
        }
    } catch (err) {
        console.error('Ошибка при добавлении:', err);
    }
});

