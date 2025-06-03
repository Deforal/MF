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
async function isUserLoggedIn() {
    try {
        const res = await fetch('./php/is_logged_in.php');
        const result = await res.json();
        if (result.isLoggedIn) {
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
        fetch("./php/get_header_filters.php").then(res => res.json()),
        isUserLoggedIn(),
        fetch("./php/get_cart_amount.php").then(res => res.json())
    ]);

    const data = filtersRes;
    const cartAmount = cartAmountRes.amount;

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
    const profileHTML = isLoggedIn.loggedIn
        ? `
        <div class="profile_icon_wrapper">
            <img src="./img/logos/Profile.svg" alt="" class="profile_icon link_like">
            <div class="profile_dropdown hidden">
                ${isLoggedIn.user.Role == 1 ? `<a href ="./admin_panel.html" class="link_like"> Админ панель </a>` : ``}
                <a href="./profile.html" class="link_like">Профиль</a>
                <a class="link_like" href="./history.html">История заказов</p>
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
                        <p class="header_top_right_cart_p ${cartAmount > 0 ? "display" : ""}">${cartAmount}</p>
                    </div>
                </div>
            </section>
            <nav class="header_bottom center">
                <a href="./catalog.html">Каталог</a>
                ${buildDropdown('Тип', 'type', data.type)}
                ${buildDropdown('Категория', 'category', data.category)}
                <a href="./catalog.html?sale=1">Скидки</a>
                ${buildDropdown('Размер', 'size', data.size)}
                ${buildDropdown('Вкус', 'flavour', data.flavour)}
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

    const labelToFieldMap = {
        'Вкус': 'Flavour',
        'Вес': 'Size',
        'Категория': 'Category',
        'Тип': 'Type'
    };
    const fieldToLabelMap = Object.fromEntries(
        Object.entries(labelToFieldMap).map(([k, v]) => [v, k])
    );

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
                });

                filtersContainer.appendChild(fieldset);
            }

            // Set filters and sort based on URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.forEach((value, key) => {
                const label = fieldToLabelMap[key];
                if (label) {
                    const radio = document.querySelector(`#filters input[name="${label}"][value="${value}"]`);
                    if (radio) {
                        radio.checked = true;
                    }
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
                    const filters = gatherFilters(labelToFieldMap);
                    fetchFilteredProducts(filters);
                });
            });

            // Initial fetch of products with current filters
            const filters = gatherFilters(labelToFieldMap);
            fetchFilteredProducts(filters);

            // Menu collapse button
            const menu_btn = document.getElementById("collapse_menu")
            menu_btn.addEventListener("click", () => {
                const menu = document.querySelector(".catalog__side_menu")
                const grid = document.querySelector(".catalog__products_grid")
                menu.classList.toggle("close")
                grid.classList.toggle("more")
            });
        })
        .catch(error => console.error('Error fetching filters:', error));
});

// Modified to accept label-field map
function gatherFilters(labelToFieldMap) {
    const filters = {};
    document.querySelectorAll('#filters fieldset').forEach(fieldset => {
        const label = fieldset.querySelector('legend').textContent;
        const selected = fieldset.querySelector('input[type="radio"]:checked');
        if (selected && labelToFieldMap[label]) {
            filters[labelToFieldMap[label]] = selected.value;
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

            // --- 🔽 Apply sorting manually here ---
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
            // --- 🔼 Done sorting ---

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
                    ${
                        product.Second_price
                            ? `<p class="new_price">${product.Second_price}₽</p> <p class="old_price">${product.Price}₽</p>`
                            : `<p class="normal_price">${product.Price}₽</p>`
                    }
                `;
                grid.appendChild(card);
            });
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
    const filters = gatherFilters({
        'Вкус': 'Flavour',
        'Вес': 'Size',
        'Категория': 'Category',
        'Тип': 'Type'
    });
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
    console.log(data);
    const variants = data.variants;
    const desc = data.description;
    console.log(data);
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
            <div class="overview-content">${section.content.replaceAll("###", "<br><br>")}</div>
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
    const benefitList = desc.list.split("###").map(line => `<li>${line}</li>`).join("");
    document.querySelector(".product_listBenef").innerHTML = benefitList;
}

document.addEventListener("DOMContentLoaded", async () => {
    const page = document.querySelector(".product");
    if (!page) return;
    let productIDNew = 0;
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

        filtered.forEach(p => {
            const btn = document.createElement("button");
            const isOutOfStock = parseInt(p.Amount_avbl) === 0;

            btn.textContent = `${p.Size} (${p.Amount_avbl} шт)` + (isOutOfStock ? " — нет в наличии" : "");
            btn.dataset.price = p.Price;
            btn.dataset.second_price = p.Second_price;
            btn.dataset.id = p.id;

            if (isOutOfStock) {
                btn.disabled = true;
                btn.classList.add("out-of-stock");
            } else {
                btn.addEventListener("click", () => {
                    updatePrice(p.Price, p.Second_price);
                    highlightSelectedSize(btn);
                    productIDNew = btn.dataset.id
                    renderReviewsSection();
                    document.getElementById("product__rating").innerHTML = p.Rating ? `<div> ${p.Rating} ★ (${p.ReviewCount} отзывов)</div>` : "У этого товара нет оценок"
                });
                if (p.Size === preselectSize) {
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

    document.getElementById("cart_product").addEventListener("click", async () => {
        const qty = parseInt(qtyInput.value) || 1;

        // Get selected size button (that has the data-pid)
        const selectedSizeBtn = sizeButtonsContainer.querySelector(".selected");
        if (!selectedSizeBtn) {
            alert("Пожалуйста, выберите вес товара.");
            return;
        }

        const productId = selectedSizeBtn.dataset.Pid;

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
                    <p class="review_rate">Оценка: ${review.Rating}/5</p>
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
            ${isLoggedIn ? getReviewForm() : ''}
            <h1>Отзывы других пользователей</h1>
            ${reviews.map(renderReview).join('')}
        `;

        if (isLoggedIn) {
            const form = document.getElementById('review-form');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = {
                    product_id: productId,
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
                } else {
                    alert('Error submitting review');
                }
            });
        }
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
    if (!container || !summarySection) return;

    const authRes = await fetch("./php/is_logged_in.php");
    const authData = await authRes.json();

    if (!authData.loggedIn) {
        container.innerHTML = `<p style="color: red;">Пожалуйста, войдите в аккаунт, чтобы увидеть корзину.</p>`;
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
            container.innerHTML = `<p style="color: red;">${cartData.error}</p>`;
            return;
        }

        const items = cartData.cart;
        if (items.length === 0) {
            container.innerHTML = `<p>Корзина пуста.</p>`;
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
                console.log(checkoutBtn);
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
                    alert("Ошибка при оформлении заказа: " + data.error);
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
                grid.innerHTML = '<p>У вас ещё нет заказов.</p>';
                return;
            }

            orders.forEach(order => {
                const card = document.createElement('div');
                card.className = 'catalog__products_card'; // reuse styling
                const orderDate = new Date(order.Date).toLocaleDateString('ru-RU');
                console.log(order);
                card.innerHTML = `
                    <a href="product.html?id=${order.Product_id}">
                        <img src="./img/catalog/id-${order.Product_id}/${order.image}" alt="">
                    </a>
                    <h4>${order.NewName} - ${order.Flavour} - ${order.Size}</h4>
                    <p><b>Количество:</b> ${order.Amount}</p>
                    <p><b>Дата заказа:</b> ${orderDate}</p>
                `;
                grid.appendChild(card);
            });
        })
        .catch(err => {
            console.error('Ошибка при загрузке истории заказов:', err);
        });
}

// Call when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.history__grid')) {
        fetchOrderHistory();
    }
});