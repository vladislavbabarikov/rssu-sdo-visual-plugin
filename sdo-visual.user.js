// ==UserScript==
// @name         sdo-visual.user.js
// @namespace    qlstudios.ru
// @updateURL    https://raw.githubusercontent.com/VladislavBabarikov/rssu-sdo-visual-plugin/main/sdo-visual.user.js
// @downloadURL  https://raw.githubusercontent.com/VladislavBabarikov/rssu-sdo-visual-plugin/main/sdo-visual.user.js
// @version      0.7
// @description  Beta Pre-relise
// @author       MinimalCaxapa
// @match        https://sdo.rgsu.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';

    /**
     * (0) Создаём оверлей (Preloader), чтобы скрыть старую страницу.
     */
    function createOverlay() {
        if (document.getElementById('script-loading-overlay')) return;

        const style = document.createElement('style');
        style.id = 'script-loading-overlay-style';
        style.innerHTML = `
            #script-loading-overlay {
                position: fixed;
                inset: 0;
                z-index: 999999;
                background: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                font-family: sans-serif;
            }
            .loading-text {
                margin-bottom: 0.75rem;
                font-size: 1rem;
                color: #333;
            }
            .loading-bar {
                width: 100px;
                height: 4px;
                background: #0067a4;
                animation: loadingAnimation 1.5s ease-in-out infinite;
                transform-origin: left center;
            }
            @keyframes loadingAnimation {
                0% {
                    transform: scaleX(0);
                    transform-origin: left center;
                }
                50% {
                    transform: scaleX(1);
                    transform-origin: left center;
                }
                50.1% {
                    transform-origin: right center;
                }
                100% {
                    transform: scaleX(0);
                    transform-origin: right center;
                }
            }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'script-loading-overlay';
        overlay.innerHTML = `
            <div class="loading-text">SDO Visual plugin by MinimalCaxapa</div>
            <div class="loading-bar"></div>
        `;

        document.body.appendChild(overlay);
    }

    function removeOverlay() {
        const ov = document.getElementById('script-loading-overlay');
        if (ov) ov.remove();
        const st = document.getElementById('script-loading-overlay-style');
        if (st) st.remove();
    }

    // Показать оверлей до всех остальных действий
    createOverlay();

    /**
     * (A) Перехват сетевых ошибок (404, blocked by client)
     */
    window.addEventListener('error', function (e) {
        const badUrls = [
            'sdo.rgsu.net/tilda-grid-3.0.min.css',
            'sdo.rgsu.net/fonts-tildasans.css',
            'mc.yandex.ru/metrika/watch.js'
        ];
        if (e?.target && (e.target.src || e.target.href)) {
            const url = e.target.src || e.target.href;
            if (badUrls.some((badUrl) => url.includes(badUrl))) {
                e.stopImmediatePropagation();
                e.preventDefault();
                return false;
            }
        }
    }, true);

    /**
     * (B) Удаляем ссылки на несуществующие CSS (если придут в HTML)
     */
    function removeBadLinksFromHTML(html) {
        html = html.replace(/<link[^>]+tilda-grid-3\.0\.min\.css[^>]*>/gi, '');
        html = html.replace(/<link[^>]+fonts-tildasans\.css[^>]*>/gi, '');
        return html;
    }

    /**
     * (C) Общие функции для удаления элементов
     */
    function observeAndRemove(selector, name) {
        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                element.remove();
                console.log(`Элемент '${name}' удалён.`);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function observeAndRemoveParagraphs(parentSelector, textsToRemove) {
        const observer = new MutationObserver(() => {
            const parentElement = document.querySelector(parentSelector);
            if (parentElement) {
                const paragraphs = parentElement.querySelectorAll('p');
                paragraphs.forEach((paragraph) => {
                    textsToRemove.forEach((text) => {
                        if (paragraph.textContent.trim().includes(text)) {
                            paragraph.remove();
                            console.log(`Параграф с текстом "${text}" удалён.`);
                        }
                    });
                });
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * (D) Настраиваем все наблюдатели (MutationObserver)
     */
    function setupObservers() {
        // Удаляем нужные элементы
        observeAndRemove('.ui-dialog.ui-widget[aria-labelledby="ui-dialog-title-sna_popup"]', 'Большой ориентационный тест (БОТ)');
        observeAndRemove('.ui-widget-overlay', 'Оверлей');
        observeAndRemove('#userwayAccessibilityIcon', 'Меню доступности');
        observeAndRemove('script[src*="mc.yandex.ru/metrika/watch.js"]', 'Скрипт Яндекс.Метрики');
        observeAndRemove('#footer', 'Футер (HyperMethod)');
        observeAndRemove('.hm-page-support', 'Секция "Техническая поддержка"');
        observeAndRemove('.head_switcher_default', 'Секция "Смена отображения курсов"');
        observeAndRemove('.help-activator', 'Секция "Помощь"');
        observeAndRemove('.progress_title', 'Секция "Результат"');
        observeAndRemove('.search-form', 'Секция "Поиск"');

        // Удаляем глобальный AJAX-спиннер
        observeAndRemove('.ajax-spinner.ajax-spinner-global', 'Глобальный AJAX-спиннер');

        // Удаляем некоторые параграфы
        const textsToRemove = [
            'Отображение итоговой оценки на вкладке "Мои курсы" отображается в тестовом режиме.',
            'Актуальные баллы необходимо смотреть на странице "План занятий" → "Прогресс изучения".'
        ];
        observeAndRemoveParagraphs('.els-content.els-box', textsToRemove);
    }

    /**
     * (E) Очистка контейнера новостей
     */
    function clearNewsContainer() {
        const newsContainer = document.querySelector('.user-dashboard');
        if (newsContainer) {
            newsContainer.innerHTML = '';
            console.log('Контейнер новостей очищен.');
        } else {
            console.log('Контейнер новостей не найден (может, на этой странице его нет).');
        }
    }

    /**
     * (F) Исправление путей к изображениям
     */
    function fixImagePaths() {
        const images = document.querySelectorAll('img');
        images.forEach((img) => {
            if (img.src.includes('https://optim.tildacdn.com/')) {
                img.src = img.src.replace(
                    'https://optim.tildacdn.com/',
                    'https://sdo.rgsu.net/tilda-images/'
                );
                console.log(`Путь изображения исправлен: ${img.src}`);
            }
        });
    }

    /**
     * (G) Загрузка и замена контента в .user-dashboard (до 2 попыток)
     */
    async function replaceNewsContent() {
        const newsContainer = document.querySelector('.user-dashboard');
        if (!newsContainer) {
            console.log('Контейнер новостей .user-dashboard отсутствует. Пропускаем загрузку.');
            return;
        }

        let success = false;
        const maxAttempts = 2;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            console.log(`[News] Попытка №${attempt} загрузить HTML новостей...`);
            try {
                const response = await fetch('https://77.221.157.219:8444/exported/page_61476881_combined.html');
                if (response.ok) {
                    let html = await response.text();
                    html = removeBadLinksFromHTML(html);
                    newsContainer.innerHTML = html;
                    console.log('[News] Новости успешно загружены.');
                    fixImagePaths();
                    success = true;
                    break;
                } else {
                    console.error(`[News] Ошибка загрузки: ${response.status}`);
                }
            } catch (error) {
                console.error('[News] Ошибка при загрузке новостей:', error);
            }

            if (!success && attempt < maxAttempts) {
                console.warn(`[News] Попытка №${attempt} не удалась, пробуем еще раз...`);
            }
        }

        if (!success) {
            newsContainer.innerHTML = '<p>Не удалось загрузить новости (2 попытки).</p>';
        }
    }

    /**
     * (H) Имитация нажатия средней кнопкой мыши - НА ВСЕ ССЫЛКИ (но только на 2 страницах).
     */
    function emulateMiddleClickOnSpecificPages() {
        const currentURL = window.location.href;
        const allowedPages = [
            'https://sdo.rgsu.net/',
            'https://sdo.rgsu.net/?page_id=m0101&page_id=m0101'
        ];
        if (!allowedPages.includes(currentURL)) {
            return; // Делаем это только на этих страницах
        }

        // Перехватываем ЛКМ (button === 0) для всех ссылок на странице
        document.addEventListener('click', (event) => {
            if (event.button === 0) {
                const linkEl = event.target.closest('a');
                if (linkEl && linkEl.href) {
                    event.preventDefault();
                    window.open(linkEl.href, '_self');
                    console.log(`Переход по ссылке: ${linkEl.href}`);
                }
            }
        });
    }

    /**
     * (I) Стилистические изменения (логотип, фон, тулбар и т. д.)
     */
    function initUI() {
        // Удаляем блок логотипа, фиксированную высоту #header
        const logoBlock = document.querySelector('#logo');
        if (logoBlock) {
            logoBlock.remove();
            console.log('Блок логотипа удалён.');
        }
        const header = document.querySelector('#header');
        if (header) {
            header.style.height = 'auto';
            console.log('Фиксированная высота #header убрана.');
        }

        // Меняем фон .user-block-wrapper-default
        const userBlockWrapper = document.querySelector('.user-block-wrapper-default');
        if (userBlockWrapper) {
            userBlockWrapper.style.backgroundColor = '#0067a4';
            console.log('Фон блока user-block-wrapper изменён.');
        }

        // Меняем стили для .hm-es-event-toolbar-button-icon
        const toolbarIcons = document.querySelectorAll('.hm-es-event-toolbar-button-icon');
        toolbarIcons.forEach((icon) => {
            icon.style.backgroundColor = '#0067a4';
            icon.style.border = '1px solid #ffffff';
        });
        console.log('Стили для hm-es-event-toolbar-button-icon обновлены.');
    }

    /**
     * (J) Основная инициализация
     */
    async function init() {
        clearNewsContainer();
        await replaceNewsContent();
        emulateMiddleClickOnSpecificPages(); // теперь обрабатываем все ссылки (на 2 страницах)
        initUI();
        setupObservers();
    }

    // Запуск (дожидаемся replaceNewsContent)
    await init();

    // Убираем оверлей, показывая обновлённую страницу
    removeOverlay();

    /**
     * (K) Игнорирование некоторых ошибок iframe (Blocked frame, Security)
     */
    window.onerror = function (message) {
        if (message.includes('Blocked a frame with origin') || message.includes('SecurityError')) {
            return true; // подавляем
        }
    };
})();
