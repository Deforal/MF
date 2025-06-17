"use strict";
window.addEventListener("load", () => {
    // MAIN SLIDER
    const page = document?.querySelector(".TP");
    if (!page) return;
    const mainContainer = document.querySelector(".Main-slides-container");
    const mainSlides = document.querySelectorAll(".Main-slide");
    const mainDots = document.querySelectorAll(".dot");
    const mainPrev = document.querySelector(".prev");
    const mainNext = document.querySelector(".next");

    let mainIndex = 0;

    function updateMainSlider() {
        const width = mainSlides[0].clientWidth;
        mainContainer.style.transform = `translateX(-${mainIndex * width}px)`;
        mainDots.forEach(dot => dot.classList.remove("active"));
        if (mainDots[mainIndex]) mainDots[mainIndex].classList.add("active");
    }

    function resizeMainSlider() {
        updateMainSlider();
    }

    mainPrev?.addEventListener("click", () => {
        mainIndex = (mainIndex - 1 + mainSlides.length) % mainSlides.length;
        updateMainSlider();
    });

    mainNext?.addEventListener("click", () => {
        mainIndex = (mainIndex + 1) % mainSlides.length;
        updateMainSlider();
    });

    mainDots.forEach((dot, idx) => {
        dot.addEventListener("click", () => {
            mainIndex = idx;
            updateMainSlider();
        });
    });

    window.addEventListener("resize", resizeMainSlider);
    updateMainSlider();

    // TP SLIDER
    const tpTrack = document.querySelector(".TP-img-track");
    const tpSlides = tpTrack?.querySelectorAll("div");
    const tpNext = document.querySelector(".TP-right button");
    const tpDots = document.querySelectorAll(".TP-slash button");
    const tpTexts = document.querySelectorAll(".TP-text");

    let tpIndex = 0;

    function updateTPSlider() {
        const slideWidth = document.querySelector(".TP-img").clientWidth;
        tpTrack.style.transform = `translateX(-${tpIndex * slideWidth}px)`;

        tpDots.forEach(dot => dot.classList.remove("active"));
        if (tpDots[tpIndex]) tpDots[tpIndex].classList.add("active");

        tpTexts.forEach(text => text.classList.remove("active"));
        if (tpTexts[tpIndex]) tpTexts[tpIndex].classList.add("active");
    }

    tpNext?.addEventListener("click", () => {
        tpIndex = (tpIndex + 1) % tpSlides.length;
        updateTPSlider();
    });

    tpDots.forEach((dot, idx) => {
        dot.addEventListener("click", () => {
            tpIndex = idx;
            updateTPSlider();
        });
    });

    window.addEventListener("resize", updateTPSlider);
    updateTPSlider();
});

let loaderTimeout;

function showLoaderDelayed() {
    clearTimeout(loaderTimeout); // clear previous in case of spam clicking
    loaderTimeout = setTimeout(() => {
        document.getElementById('loader').style.display = 'flex';
    }, 200); // Show loader *only if* loading takes longer than 300ms
}

function hideLoader(forceShow = true) {
    clearTimeout(loaderTimeout); // in case loading finished fast

    const loader = document.getElementById('loader');

    if (forceShow !== false) {
        // Hide immediately when done
        loader.style.display = 'none';
    } else {
        // Show immediately (e.g. on page load)
        loader.style.display = 'flex';
    }
}
async function isUserLoggedIn() {
    try {
        const res = await fetch('./php/is_logged_in.php');
        const result = await res.json();
        if (result.loggedIn) {
            return result;
        } else {
            return false;
        }
        
    } catch (err) {
        return console.error('Error checking login status:', err);;
    }
}

async function header() {
    const header = document?.querySelector(".header_landing");
    if (!header) return console.error("header is absent");

    const [filtersRes, isLoggedIn, cartAmountRes] = await Promise.all([
        fetch("./php/get_filters.php?header=1").then(res => res.json()),
        isUserLoggedIn(),
        fetch("./php/get_cart_amount.php").then(res => res.json())
    ]);

    const data = filtersRes;
    const cartAmount = cartAmountRes.amount;

    const buildDropdown = (label, values) => {
        return `
            <div class="dropdown">
                <button href="#" class="dropdown_btn">${label}</button>
                <div class="dropdown_content ${label == "Вкус" || label == "Вес" ? "last" : ""}">
                    <div class="dropdown_content_div">
                        ${values.map(val => {
                            const encoded = encodeURIComponent(val);
                            return `<a href="./catalog.html?${encodeURIComponent(label)}=${encoded}">${val}</a>`;
                        }).join('')}
                    </div>
                </div>
            </div>`;
    };
    const profileHTML = isLoggedIn.loggedIn
        ? `
        <div class="profile_icon_wrapper">
            <img src="./img/logos/Profile.svg" alt="" class="profile_icon link_like">
            <div class="profile_dropdown hidden">
                <div class="profile_dropdown_div">
                    ${isLoggedIn.user.Role == 1 ? `<a href ="./admin_panel.html" class="link_like"> Админ панель </a>` : ``}
                    <a href="./profile.html" class="link_like">Профиль</a>
                    <a class="link_like" href="./history.html">История заказов</p>
                    <a class="link_like" href="./php/logout.php">Выйти</a>
                </div>
            </div>
        </div>`
        : `
            <div class="dropdown">
                <div class="profile_dropdown_div">
                    <img src="./img/logos/Profile.svg" alt="" class="dropdown_btn">
                    <div class="dropdown_content">
                        <a href="./register.html">Регистрация</a>
                        <a href="./login.html">Вход</a>
                    </div>
                </div>
            </div>
        `;

    let string = `
        <div class="header">
            <section class="header_top center">
                <a class="header_top_left"href="./index.html">
                <img src="./img/logos/logo2.svg" alt="" class="main">
                <img src="./img/logos/logo1.svg" alt="" class="small">
                </a>
                <div class="header_top_right">
                    ${profileHTML}
                    <div class="header_top_right_cart">
                        <a href="./cart.html"><img src="./img/logos/Cart.svg" alt="" class="cart_icon"></a>
                        <p class="header_top_right_cart_p ${cartAmount > 0 ? "display" : ""}">${cartAmount}</p>
                    </div>
                </div>
            </section>
            <nav class="header_bottom center">
                <a href="./catalog.html">Каталог</a>
                ${buildDropdown('Тип', data.type)}
                ${buildDropdown('Категория', data.category)}
                <a href="./catalog.html?sale=1">Скидки</a>
                ${buildDropdown('Вес', data.size)}
                ${buildDropdown('Вкус', data.flavour)}
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
                <p>+7-989-888-88-88</p>
                <p>MFCompany@gmail.com</p>
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

    function sortSizeOptions(options) {
        function normalizeValue(str) {
            return str.toLowerCase().replace(',', '.').trim();
        }

        function parseSizeToLb(str) {
            str = normalizeValue(str);
            const patterns = [
                { regex: /([\d.]+)\s*(pound|lb|lbs|фунт|пуд)/, multiplier: 1 },
                { regex: /([\d.]+)\s*(kilogram|килограмм|кг)/, multiplier: 2.20462 },
                { regex: /([\d.]+)\s*(gram|грамм|г)/, multiplier: 0.00220462 },
            ];
            for (const { regex, multiplier } of patterns) {
                const match = str.match(regex);
                if (match) return parseFloat(match[1]) * multiplier;
            }
            return null;
        }

        function extractLeadingNumber(str) {
            const match = str.match(/^\s*(\d+(?:[\.,]\d+)?)/);
            return match ? parseFloat(match[1].replace(',', '.')) : null;
        }

        // Step 1: Merge normalized duplicates
        const mergedMap = new Map();

        for (const option of options) {
            const normalized = normalizeValue(option.value);
            if (mergedMap.has(normalized)) {
                mergedMap.get(normalized).count += option.count;
            } else {
                mergedMap.set(normalized, { value: normalized, count: option.count });
            }
        }

        const mergedArray = Array.from(mergedMap.values());

        // Step 2: Sort merged array
        mergedArray.sort((a, b) => {
            const aVal = parseSizeToLb(a.value);
            const bVal = parseSizeToLb(b.value);
            if (aVal !== null && bVal !== null) return aVal - bVal;
            if (aVal !== null) return -1;
            if (bVal !== null) return 1;

            const aNum = extractLeadingNumber(a.value);
            const bNum = extractLeadingNumber(b.value);
            if (aNum !== null && bNum !== null) return aNum - bNum;
            if (aNum !== null) return -1;
            if (bNum !== null) return 1;

            return a.value.localeCompare(b.value);
        });

        return mergedArray;
    }



    // Load filters and render them
    fetch('./php/get_filters.php')
        .then(response => response.json())
        .then(data => {
            const filtersContainer = document.getElementById('filters');
            filtersContainer.innerHTML = '';

            // SORT "Вес" OPTIONS
            if (data["Вес"]) {
                data["Вес"] = sortSizeOptions(data["Вес"]);
            }
            for (const [filterName, options] of Object.entries(data)) {
                const fieldset = document.createElement('fieldset');
                const legend = document.createElement('legend');
                legend.textContent = filterName;
                fieldset.appendChild(legend);
                options.forEach(option => {
                    const label = document.createElement('label');
                    label.innerHTML = `
                    <label class="custom-${(filterName === 'Вкус') ? 'checkbox' : 'radio'}">
                        <input type="${(filterName === 'Вкус') ? 'checkbox' : 'radio'}" name="${filterName}" value="${option.value}" />
                        <span></span>
                        ${option.value} (${option.count})
                    </label>`
                    fieldset.appendChild(label);
                });

                filtersContainer.appendChild(fieldset);
            }

            const urlParams = new URLSearchParams(window.location.search);
            urlParams.forEach((value, key) => {
                const inputs = document.querySelectorAll(`#filters input[name="${key}"]`);
                inputs.forEach(input => {
                    if (input.value === value || value.split(',').includes(input.value)) {
                        input.checked = true;
                    }
                });
            });

            const sortParam = urlParams.get('sort');
            if (sortParam) {
                const sortSelect = document.getElementById('sort-select');
                sortSelect.value = sortParam;
            }

            filtersContainer.querySelectorAll('input[type=radio], input[type=checkbox]').forEach(input => {
                input.addEventListener('change', () => {
                    const filters = gatherFilters();
                    fetchFilteredProducts(filters);
                    showLoaderDelayed();
                });
            });

            const filters = gatherFilters();
            fetchFilteredProducts(filters);

            const menu_btn = document.getElementById("collapse_menu");
            menu_btn.addEventListener("click", () => {
                document.querySelector(".catalog__side_menu").classList.toggle("close");
                document.querySelector(".catalog__products_grid").classList.toggle("more");
            });
        })
        .catch(error => console.error('Error fetching filters:', error));
});


function gatherFilters() {
    const filters = {};
    document.querySelectorAll('#filters fieldset').forEach(fieldset => {
        const Oldlabel = fieldset.querySelector('legend').textContent;
        const transition = {
            'Вкус':'Flavour',
            'Категория':'Category',
            'Тип':'Type',
            'Вес':'Size'
        }
        const label = transition[Oldlabel]
        const inputs = fieldset.querySelectorAll('input:checked');
        if (inputs.length > 0) {
            const values = Array.from(inputs).map(input => input.value);
            filters[label] = (label === 'Flavour') ? values.join(',') : values[0];
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

            if (sortValue === 'price-asc') {
                products.sort((a, b) => {
                    const priceA = a.Second_price ? parseFloat(a.Second_price) : parseFloat(a.Price);
                    const priceB = b.Second_price ? parseFloat(b.Second_price) : parseFloat(b.Price);
                    return priceA - priceB;
                });
            } else if (sortValue === 'price-desc') {
                products.sort((a, b) => {
                    const priceA = a.Second_price ? parseFloat(a.Second_price) : parseFloat(a.Price);
                    const priceB = b.Second_price ? parseFloat(b.Second_price) : parseFloat(b.Price);
                    return priceB - priceA;
                });
            } else if (sortValue === 'sales') {
                products.sort((a, b) => {
                    const soldA = parseInt(a.Amount_sold || 0);
                    const soldB = parseInt(b.Amount_sold || 0);
                    return soldB - soldA;
                });
            } else if (sortValue === 'sale') {
                // Put discounted products first
                products.sort((a, b) => {
                    const aHasSale = a.Second_price !== null && a.Second_price !== '';
                    const bHasSale = b.Second_price !== null && b.Second_price !== '';

                    // First, compare whether they are on sale
                    if (aHasSale && !bHasSale) return -1;
                    if (!aHasSale && bHasSale) return 1;

                    // Optional: within each group, sort by effective price
                    const priceA = aHasSale ? parseFloat(a.Second_price) : parseFloat(a.Price);
                    const priceB = bHasSale ? parseFloat(b.Second_price) : parseFloat(b.Price);
                    return priceA - priceB;
                });
            }

            grid.innerHTML = '';
            amountElem.textContent = `Найдено товаров: ${products.length}`;

            if (products.length === 0) {
                grid.innerHTML = '<p style="font-size:24px;">Товары не найдены.</p>';
                hideLoader();
                return;
            }

            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'catalog__products_card';
                card.innerHTML = `
                    <a href="product.html?id=${product.id}">
                        <img src="./img/catalog/id-${product.id}/${product.image}" alt="" loading="lazy">
                    </a>
                    <h4>${product.NewName} - ${product.Flavour} - ${product.Size}</h4>
                    <div>${product.Rating ?? 0} ★ (${product.ReviewCount} отзывов)</div>
                    ${
                        product.Second_price
                            ? `<p class="new_price">${product.Second_price}₽</p> <p class="old_price">${product.Price}₽</p>`
                            : `<p class="normal_price">${product.Price}₽</p>`
                    }
                `;
                grid.appendChild(card);
            });
            hideLoader();
        })
        .catch(error => console.error('Ошибка загрузки товаров:', error));
}

// Sort dropdown change
document?.getElementById('sort-select')?.addEventListener('change', () => {
    const filters = gatherFilters({
        'Вкус': 'Flavour',
        'Вес': 'Size',
        'Категория': 'Category',
        'Тип': 'Type'
    });
    fetchFilteredProducts(filters);
});

// Clear filters button
document?.getElementById('clear-filters')?.addEventListener('click', () => {
    document.querySelectorAll('#filters input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    document.querySelectorAll('#filters input[type="checkbox"]').forEach(radio => {
        radio.checked = false;
    });
    const filters = gatherFilters({
        'Вкус': 'Flavour',
        'Вес': 'Size',
        'Категория': 'Category',
        'Тип': 'Type'
    });
    fetchFilteredProducts(filters);
    hideLoader(false)
});

document.addEventListener('DOMContentLoaded', () => {
    const registerPage = document.querySelector(".register");
    if (!registerPage) return;

    const form = document.querySelector('.register_form');
    const message = document.querySelector('.error_msg_bottom');

    const fieldMap = {
        name: '.reg_name',
        email: '.reg_email',
        phone: '.reg_phone',
        birth: '.reg_date',
        pass: '.reg_pass',
        rpass: '.reg_Rpass'
    };

    const phoneInput = document.querySelector(fieldMap.phone);
    phoneInput.addEventListener('input', (e) => {
        let x = e.target.value.replace(/\D/g, '').replace(/^8/, '7');
        if (!x.startsWith('7')) x = '7' + x;
        if (x.length > 11) x = x.slice(0, 11);

        let formatted = '+7';
        if (x.length >= 2) formatted += ' (' + x.slice(1, 4);
        if (x.length >= 5) formatted += ') ' + x.slice(4, 7);
        if (x.length >= 8) formatted += '-' + x.slice(7, 9);
        if (x.length >= 10) formatted += '-' + x.slice(9, 11);

        e.target.value = formatted;
    });

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
                alert("Успешная регистрация!");
                window.location.href = './index.html';
            } else {
                alert(result.message);
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
                alert(result.message)
            }
        } catch (err) {
            message.textContent = 'Ошибка при подключении к серверу.';
        }
    });
});



document.addEventListener("DOMContentLoaded", async () => {
    const page = document.querySelector(".product");
    if (!page) return;
    let productIDNew = 0;
    const productId = new URLSearchParams(window.location.search).get("id");


    const flavourSelect = document.getElementById("flavour-select");
    const sizeSection = document.querySelector(".product__size");
    const sizeButtonsContainer = document.getElementById("size-buttons");
    const priceSection = document.getElementById("price-section");

    let amount_avbl = 1;
    let qtyInput = document.getElementById("qty-input");
    let qtyMinus = document.getElementById("qty-minus");
    let qtyPlus = document.getElementById("qty-plus");
    let qtyError = document.getElementById("qty-error");

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
    uniqueFlavours.forEach(flavour => {
        const opt = document.createElement("option");
        opt.value = flavour;
        opt.textContent = flavour;
        flavourSelect.appendChild(opt);
    });
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
        let autoSelect = filtered.length == 1 ?? true
        filtered.forEach(p => {
            const btn = document.createElement("button");
            const isOutOfStock = parseInt(p.Amount_avbl) === 0;

            btn.textContent = `${p.Size} (${p.Amount_avbl} шт)` + (isOutOfStock ? " — нет в наличии" : "");
            btn.dataset.price = p.Price;
            btn.dataset.second_price = p.Second_price;
            btn.dataset.id = p.id;
            btn.dataset.amount = p.Amount_avbl;
            if (isOutOfStock) {
                btn.disabled = true;
                btn.classList.add("out-of-stock");
            } else {
                btn.addEventListener("click", () => {
                    updatePrice(p.Price, p.Second_price);
                    highlightSelectedSize(btn);
                    productIDNew = btn.dataset.id
                    renderReviewsSection();
                    loadProduct(productIDNew);
                    amount_avbl = p.Amount_avbl
                    setupQtyControls();
                });
                if (p.Size === preselectSize || autoSelect) {
                    setTimeout(() => btn.click(), 0);
                }
            }

            sizeButtonsContainer.appendChild(btn);

            // Auto-select matching size if provided
        });

        sizeSection.style.display = "flex";
        priceSection.style.display = "none";
    }

    async function loadProduct(productId) {
        const res = await fetch(`./php/getVariants.php?id=${productId}`);
        const data = await res.json();
        const variants = data.variants;
        const desc = data.description;
        let current = variants.filter((product) => product.id == productId)[0];
        const url = new URL(window.location);
        url.searchParams.set("id", current.id);
        window.history.replaceState({}, "", url);
        document.getElementById("product__rating").innerHTML = current.Rating ? `<div> ${current.Rating} ★ (${current.ReviewCount} отзывов)</div>` : "У этого товара нет оценок"
        productSlider();
        // Set product name
        const fullName = `${desc.name} ${current.Flavour} ${current.Size}`;
        document.querySelector("h1").textContent = fullName;
        document.querySelector(".link_tree p:last-of-type").textContent = fullName;

        // Overview sections (assumes 3)
        const overviewHTML = [
            { title: "Обзор", content: desc.overview },
            { title: "Как принимать", content: desc.suggest },
            { title: "Преимущества", content: desc.benefits }
        ].map((section, i) => {
            let contentHTML;

            if (section.title === "Преимущества") {
                const listItems = section.content
                    .split("###")
                    .filter(item => item.trim() !== "")
                    .map(item => `<li style="list-style-position:inside;">${item.trim()}</li>`)
                    .join("");

                contentHTML = `<ul>${listItems}</ul>`;
            } else {
                contentHTML = section.content.replaceAll("###", "<br><br>");
            }

            return `
                <section>
                    <a href="#" class="toggle-overview" data-index="${i}">
                        ${section.title} <span><</span>
                    </a>
                    <div class="overview-content">${contentHTML}</div>
                </section>
            `;
        }).join("");

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
        const benefitList = desc.list.split("###").map(line => `<li>${line}</li>`).join("");
        document.querySelector(".product_listBenef").innerHTML = benefitList;
    }
    // Helper: Update price display
    function updatePrice(price, secondPrice) {
        if (secondPrice != null) {
            priceSection.innerHTML = `<span class="before">${price} ₽</span><span class="after">${secondPrice} ₽</span>`
        } else {
            priceSection.textContent = `${price} ₽`;
        }
        priceSection.style.display = "flex";
    }

    // Helper: Highlight selected size
    function highlightSelectedSize(activeBtn) {
        [...sizeButtonsContainer.children].forEach(btn => btn.classList.remove("selected"));
        activeBtn.classList.add("selected");
    }

    
    function setupQtyControls() {

        // Clone nodes to remove existing event listeners
        const qtyInputClone = qtyInput.cloneNode(true);
        const qtyMinusClone = qtyMinus.cloneNode(true);
        const qtyPlusClone = qtyPlus.cloneNode(true);

        qtyInput.parentNode.replaceChild(qtyInputClone, qtyInput);
        qtyMinus.parentNode.replaceChild(qtyMinusClone, qtyMinus);
        qtyPlus.parentNode.replaceChild(qtyPlusClone, qtyPlus);

        // Update references
        qtyInput = qtyInputClone;
        qtyMinus = qtyMinusClone;
        qtyPlus = qtyPlusClone;

        qtyMinus.addEventListener("click", onMinusClick);
        qtyPlus.addEventListener("click", onPlusClick);
        qtyInput.addEventListener("input", onQtyInput);

        updateQtyControls();
    }

    function updateQtyControls() {
        const value = parseInt(qtyInput.value) || 1;
        qtyMinus.disabled = value <= 1;
        qtyPlus.disabled = value >= amount_avbl;
        qtyMinus.classList.toggle("btn--disabled", value <= 1);
        qtyPlus.classList.toggle("btn--disabled", value >= amount_avbl);
        qtyError.style.display = value > amount_avbl ? "block" : "none";
    }

    function onMinusClick() {
        let val = parseInt(qtyInput.value) || 1;
        if (val > 1) qtyInput.value = val - 1;
        updateQtyControls();
    }

    function onPlusClick() {
        let val = parseInt(qtyInput.value) || 1;
        if (val < amount_avbl) qtyInput.value = val + 1;
        updateQtyControls();
    }

    function onQtyInput() {
        let val = parseInt(qtyInput.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > amount_avbl) {
            qtyInput.value = amount_avbl;
        } else {
            qtyInput.value = val;
        }
        updateQtyControls();
    }

    document.getElementById("cart_product").addEventListener("click", async () => {
        const qty = parseInt(qtyInput.value) || 1;

        // Get selected size button (that has the data-pid)
        const selectedSizeBtn = sizeButtonsContainer.querySelector(".selected");
        if (!selectedSizeBtn) {
            alert("Пожалуйста, выберите вес товара.");
            return;
        }

        const productId = selectedSizeBtn.dataset.id;
        const formData = new FormData();
        formData.append("Product_id", productId);
        formData.append("Amount", qty);

        try {
            const response = await fetch("./php/addToCart.php", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                header()
            } else {
                alert("Ошибка: " + result.message);
            }
        } catch (error) {
            console.error("Ошибка при добавлении в корзину:", error);
            alert("Произошла ошибка при добавлении в корзину.");
        }
    });

    async function fetchReviews() {
        const res = await fetch(`./php/get_reviews.php?product_id=${productIDNew}`);
        const reviews = await res.json();
        return reviews;
    }

    function renderReview(review) {
        const productName = `${review.GroupName} ${review.Flavour} ${review.Size}`;
        return `
            <div class="review">
                <div class="review_left">
                    <h4>${review.UserName}</h4>
                    <p><strong>Продукт:</strong> ${productName}</p>
                </div>
                <div class="review_right">
                    <h3>${review.Title}</h3>
                    <p class="review_rate">Оценка: ${review.Rating} ★</p>
                    <p>${review.Text}</p>
                </div>
            </div>
        `;
    }

    function getReviewForm() {
        return `
            <form id="review-form">
                <h3>Напишите ваш отзыв</h3>
                <input type="text" name="title" placeholder="Заголовок отзыва" required />
                <select name="rating" required>
                    <option value="">Оцените</option>
                    ${[1,2,3,4,5].map(n => `<option value="${n}">${n}</option>`).join('')}
                </select>
                <textarea name="text" placeholder="Напишите свой отзыв" required></textarea>
                <button type="submit">Оставить отзыв</button>
            </form>
        `;
    }

    async function renderReviewsSection() {
        const container = document.getElementById('reviews-container');
        const reviews = await fetchReviews();
        const isLoggedIn = await isUserLoggedIn();
        container.innerHTML = `
            <h1>Отзывы других пользователей</h1>
            ${reviews.length ? reviews.map(renderReview).join('') : `<p style="font-size: 24px; padding-top:24px;">Отзывы отсутствуют</p>`}
        `;
        if (isLoggedIn) {
            container.innerHTML = `
                ${isLoggedIn ? getReviewForm() : ''}
                <h1>Отзывы других пользователей</h1>
                ${reviews.length ? reviews.map(renderReview).join('') : `<p style="font-size: 24px; padding-top:24px;">Отзывы отсутствуют</p>`}
            `;
            const form = document.getElementById('review-form');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = {
                    product_id: productIDNew,
                    title: formData.get('title'),
                    text: formData.get('text'),
                    rating: formData.get('rating')
                };

                const res = await fetch('./php/submit_review.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    renderReviewsSection(); // Refresh the reviews
                    loadProduct(productIDNew)
                } else {
                    alert('Error submitting review');
                }
            });
        }
    }
    function productSlider() {
        const productId = new URLSearchParams(window.location.search).get("id"); 
        let imageList = [];
        let currentIndex = 0;
        async function fetchImages() {
            const res = await fetch(`./php/get_images.php?product_id=${productId}`);
            imageList = await res.json();
            // Sort by ID if needed
            imageList.success.sort((a, b) => a.Selection - b.Selection);
            renderThumbnails();
            showImage(0);
        }

        function renderThumbnails() {
            const container = document.getElementById('thumbs-container');
            container.innerHTML = '';
            imageList.success.forEach((img, idx) => {
                const thumb = document.createElement('img');
                thumb.src = `./img/catalog/id-${productId}/${img.URL}`;
                thumb.dataset.index = idx;
                thumb.onclick = () => showImage(idx);
                container.appendChild(thumb);
            });
        }

        function showImage(index) {
            currentIndex = index;
            document.getElementById('main-image').src = `./img/catalog/id-${productId}/${imageList.success[index].URL}`;

            // Highlight selected thumb
            document.querySelectorAll('#thumbs-container img').forEach(img => img.classList.remove('selected'));
            document.querySelector(`#thumbs-container img[data-index="${index}"]`).classList.add('selected');
        }

        document.querySelector('.nav.left').onclick = () => {
            if (currentIndex > 0) showImage(currentIndex - 1);
        };
        document.querySelector('.nav.right').onclick = () => {
            if (currentIndex < imageList.success.length - 1) showImage(currentIndex + 1);
        };

        document.querySelector('.arrow.up').onclick = () => {
            document.getElementById('thumbs-container').scrollTop -= 60;
        };
        document.querySelector('.arrow.down').onclick = () => {
            document.getElementById('thumbs-container').scrollTop += 60;
        };

        fetchImages();
    }
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

document.addEventListener("blur", (e) => {
    if (e.target.tagName === "TD" && e.target.hasAttribute("contenteditable")) {
        const id = e.target.dataset.id;
        const column = e.target.dataset.column;
        const table = e.target.closest("table").id;
        const value = e.target.innerText.trim(); // remove accidental whitespace

        // Optionally: skip update if value is unchanged from before
        // You'd need to store original value on focus if you want that

        fetch("./php/admin_update.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ table, id, column, value })
        }).then(response => response.json())
        .then(data => {
            if (data.success) {
                const tableElem = document.getElementById(table);
                const reloadEvent = new Event('click');
                document.querySelector(`[data-target="${table}"]`).dispatchEvent(reloadEvent);
            } 
        })
    }
}, true);

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const id = e.target.dataset.id;
        const table = e.target.closest("table").id;
        const check = confirm("Вы уверенны?")
        if (check) {
            fetch("./php/admin_delete.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ table, id })
            }).then(() => {
                e.target.closest("tr").remove();
            }); 
        }
        
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
document.addEventListener("DOMContentLoaded", () => {
    const page = document.getElementById("profile")
    if (!page) return;
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            const container = button.parentElement;
            const valueSpan = container.querySelector('.value');
            const originalValue = valueSpan.textContent;
            const field = valueSpan.dataset.field;

            const input = document.createElement('input');
            input.type = field === 'Birth' ? 'date' : 'text';
            input.value = originalValue;

            const confirmBtn = document.createElement('button');
            confirmBtn.classList.add("edit-btn")
            confirmBtn.textContent = '✔';

            const cancelBtn = document.createElement('button');
            cancelBtn.classList.add("edit-btn")
            cancelBtn.textContent = '✖';

            valueSpan.style.display = 'none';
            button.style.display = 'none';

            container.appendChild(input);
            container.appendChild(confirmBtn);
            container.appendChild(cancelBtn);

            cancelBtn.addEventListener('click', () => {
            input.remove();
            confirmBtn.remove();
            cancelBtn.remove();
            valueSpan.style.display = '';
            button.style.display = '';
            });

            confirmBtn.addEventListener('click', () => {
            fetch('./php/update_profile.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ field: field, value: input.value })
            })
            .then(res => res.text())
            .then(msg => {
                valueSpan.textContent = input.value;
                cancelBtn.click(); // trigger cancel to cleanup
            });
            });
        });
        });
    fetch('./php/is_logged_in.php')
        .then(res => res.json())
        .then(data => {
            if (!data.loggedIn) {
                alert('Ошибка загрузки профиля');
                return;
            }

            const user = data.user;

            // Map field keys to element IDs
            const fieldMap = {
                Name: 'profile-name',
                Email: 'profile-email',
                Phone: 'profile-phone',
                Birth: 'profile-birth',
                Gender: 'profile-gender'
            };

            for (const field in fieldMap) {
                const el = document.getElementById(fieldMap[field]);
                if (el) el.textContent = user[field] || 'Не указано';
            }
        })
        .catch(err => {
            console.error('Ошибка:', err);
        });
})
document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("cart-container");
    const summarySection = document.querySelector(".cart__right");
    const loginCheck = await isUserLoggedIn();
    if (!container || !summarySection) return;
    if (loginCheck == false) {
        container.innerHTML = `<p style="color: red; font-size:24px;">Пожалуйста, войдите в аккаунт, чтобы увидеть корзину.</p>`;
        summarySection.classList.toggle("hide")
        return;
    }

    const fetchCart = async () => {
        const res = await fetch("./php/getCart.php");
        return await res.json();
    };

    const updateCartItem = async (productId, amount) => {
        await fetch('./php/updateCartItem.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, amount })
        });
    };

    const deleteCartItem = async (productId) => {
        await fetch('./php/deleteCartItem.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId })
        });
    };

    const renderCart = async () => {
        header()
        const cartData = await fetchCart();
        container.innerHTML = '';
        if (cartData.error) {
            container.innerHTML = `<p style="color: red; font-size:24px;">${cartData.error}</p>`;
            return;
        }

        const items = cartData.cart;
        if (items.length === 0) {
            container.innerHTML = `<p style="font-size:24px;">Корзина пуста.</p>`;
            summarySection.innerHTML = '';
            return;
        }

        const list = document.createElement("div");
        list.classList.add("cart__list");

        let totalItems = 0;
        let subtotal = 0;

        items.forEach(item => {
            const product = document.createElement("div");
            product.classList.add("cart__item");

            const price = item.Second_price !== null ? parseFloat(item.Second_price) : parseFloat(item.Price);
            const itemTotal = price * item.Amount;

            totalItems += item.Amount;
            subtotal += itemTotal;

            product.innerHTML = `
                <a href="./product.html?id=${item.id}"><img src="./img/catalog/id-${item.id}/${item.URL}" alt="${item.FullName}" class="cart__img"></a>
                <div class="cart__info">
                    <div class="cart__info_left">
                        <h3>${item.FullName}</h3>
                        <p><b>Вкус:</b> ${item.Flavour}</p>
                        <p><b>Вес:</b> ${item.Size}</p>
                    </div>  
                    <div class="cart__info_right"> 
                        <p><b>Цена:</b> ${price} ₽</p>
                        <div class="product__amount_amount">
                            <div>
                                <button class="qty-minus" data-id="${item.id}">-</button>
                                <input type="number" class="qty-input" min="1" max="50" value="${item.Amount}" data-id="${item.id}">
                                <button class="qty-plus" data-id="${item.id}">+</button>
                            </div>
                            <button class="remove-btn" data-id="${item.id}">Удалить</button>
                        </div>
                    </div>
                    
                </div>
            `;

            list.appendChild(product);
        });

        container.appendChild(list);

        summarySection.innerHTML = `
            <h2>Обзор</h2>
            <p id="summary-items">${totalItems} товара(-ов)</p>
            <p>Подитог: <span id="summary-subtotal">${subtotal.toFixed(2)} ₽</span></p>
            <p>Налог: рассчитывается при оформлении</p>
            <p>Доставка: Бесплатно</p>
            <hr>
            <p><strong>Итого: <span id="summary-total">${subtotal.toFixed(2)} ₽</span></strong></p>
            <button id="checkout-btn">Оформить заказ</button>
        `;
        const checkoutBtn = document.getElementById("checkout-btn");
        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", async () => {
                const confirmOrder = confirm("Подтвердить заказ?");
                if (!confirmOrder) return;

                const res = await fetch("./php/checkout.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });
                const data = await res.json();

                if (data.success) {
                    alert("Заказ успешно оформлен!");
                    renderCart(); // Refresh cart after order
                } else {
                    alert(data.error);
                }
            });
        }
        document.querySelectorAll(".qty-plus").forEach(btn => {
            btn.addEventListener("click", async () => {
                const input = btn.previousElementSibling;
                const newVal = parseInt(input.value) + 1;
                await updateCartItem(btn.dataset.id, newVal);
                renderCart();
            });
        });

        document.querySelectorAll(".qty-minus").forEach(btn => {
            btn.addEventListener("click", async () => {
                const input = btn.nextElementSibling;
                const newVal = Math.max(1, parseInt(input.value) - 1);
                await updateCartItem(btn.dataset.id, newVal);
                renderCart();
            });
        });

        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                await deleteCartItem(btn.dataset.id);
                renderCart();
            });
        });

        document.querySelectorAll(".qty-input").forEach(input => {
            input.addEventListener("change", async () => {
                const newVal = Math.max(1, parseInt(input.value));
                await updateCartItem(input.dataset.id, newVal);
                renderCart();
            });
        });
    };

    renderCart();

});

function fetchOrderHistory() {
    fetch('./php/get_order_history.php')
        .then(res => res.json())
        .then(orders => {
            const grid = document.querySelector('.history__grid');
            grid.innerHTML = '';

            if (!orders.length) {
                grid.innerHTML = '<p style="font-size: 24px;">У вас ещё нет заказов.</p>';
                return;
            }
            orders.forEach(order => {
                const card = document.createElement('div');
                card.className = 'catalog__products_card'; // reuse styling
                const orderDate = new Date(order.Date).toLocaleDateString('ru-RU');
                card.innerHTML = `
                    <a href="product.html?id=${order.Product_id}">
                        <img src="./img/catalog/id-${order.Product_id}/${order.image}" alt="">
                    </a>
                    <h4>${order.NewName} - ${order.Flavour} - ${order.Size}</h4>
                    <p><b>Количество:</b> ${order.Amount}</p>
                    <p><b>Дата заказа:</b> ${orderDate}</p>
                    <p><b>Статус:</b> ${order.Status}</p>
                `;
                grid.appendChild(card);
            });
        })
        .catch(err => {
            console.error('Ошибка при загрузке истории заказов:', err);
        });
}
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.history__grid')) {
        fetchOrderHistory();
    }
});

