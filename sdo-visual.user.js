// ==UserScript==
// @name         sdo-visual.user.js
// @namespace    qlstudios.ru
// @updateURL    https://raw.githubusercontent.com/VladislavBabarikov/rssu-sdo-visual-plugin/main/sdo-visual.user.js
// @downloadURL  https://raw.githubusercontent.com/VladislavBabarikov/rssu-sdo-visual-plugin/main/sdo-visual.user.js
// @version      0.4
// @description  Beta
// @author       MinimalCaxapa
// @match        https://sdo.rgsu.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Использование MutationObserver для удаления элемента
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

    /**
     * Удаление конкретных параграфов из заданного контейнера по тексту
     */
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
     * Замена содержимого контейнера новостей на <iframe>
     */
    function replaceNewsContent() {
        const newsContainer = document.querySelector('.user-dashboard');
        if (newsContainer) {
            newsContainer.innerHTML = '';
            const iframe = document.createElement('iframe');
            iframe.src = 'https://qlstudios.ru/rssuvisualplugin/newssdo';
            iframe.width = '100%';
            iframe.height = '600px';
            iframe.style.border = 'none';
            newsContainer.appendChild(iframe);
            console.log('Новости заменены на iframe.');
        } else {
            console.log('Контейнер новостей отсутствует.');
        }
    }

    /**
     * Игнорирование ошибок iframe
     */
    window.onerror = function (message) {
        if (message.includes('Blocked a frame with origin') || message.includes('SecurityError')) {
            return true;
        }
    };

    /**
     * Имитация нажатия средней кнопки мыши
     */
    function emulateMiddleClickOnSpecificPages() {
        const currentURL = window.location.href;
        const allowedPages = [
            'https://sdo.rgsu.net/',
            'https://sdo.rgsu.net/?page_id=m0101&page_id=m0101',
        ];

        if (allowedPages.includes(currentURL)) {
            document.addEventListener('click', (event) => {
                if (event.button === 0) {
                    const target = event.target.closest('a');
                    if (target && target.href) {
                        event.preventDefault();
                        window.open(target.href, '_self');
                        console.log(`Переход по ссылке: ${target.href}`);
                    }
                }
            });
        }
    }

    /**
     * Удаление блока логотипа и снятие фиксированной высоты
     */
    function removeLogoBlockAndFixHeader() {
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
    }

    /**
     * Изменение фона для блока user-block-wrapper
     */
    function updateUserBlockWrapperBackground() {
        const userBlockWrapper = document.querySelector('.user-block-wrapper-default');
        if (userBlockWrapper) {
            userBlockWrapper.style.backgroundColor = '#0067a4';
            console.log('Фон блока user-block-wrapper изменён.');
        } else {
            console.log('Блок user-block-wrapper не найден.');
        }
    }

    /**
     * Изменение стилей для hm-es-event-toolbar-button-icon
     */
    function updateToolbarButtonStyles() {
        const toolbarIcons = document.querySelectorAll('.hm-es-event-toolbar-button-icon');
        toolbarIcons.forEach((icon) => {
            icon.style.backgroundColor = '#0067a4';
            icon.style.border = '1px solid #ffffff';
        });
        console.log('Стили для hm-es-event-toolbar-button-icon обновлены.');
    }

    // Настраиваем наблюдение и удаление элементов
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

    // Удаляем конкретные параграфы
    const textsToRemove = [
        'Отображение итоговой оценки на вкладке "Мои курсы" отображается в тестовом режиме.',
        'Актуальные баллы необходимо смотреть на странице "План занятий" → "Прогресс изучения".',
    ];
    observeAndRemoveParagraphs('.els-content.els-box', textsToRemove);

    // Заменяем новости
    replaceNewsContent();

    // Имитация нажатия средней кнопки мыши
    emulateMiddleClickOnSpecificPages();

    // Удаляем блок логотипа и фиксированную высоту
    removeLogoBlockAndFixHeader();

    // Обновляем стили для блока user-block-wrapper
    updateUserBlockWrapperBackground();

    // Обновляем стили для toolbar icons
    updateToolbarButtonStyles();
})();
