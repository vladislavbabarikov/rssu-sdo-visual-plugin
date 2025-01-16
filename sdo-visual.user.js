// ==UserScript==
// @name         sdo-visual.user.js
// @namespace    qlstudios.ru
// @version      0.1
// @description  Beta
// @author       MinimalCaxapa
// @match        https://sdo.rgsu.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Использование MutationObserver для удаления элемента при его появлении
     * @param {string} selector - CSS-селектор элемента
     * @param {string} name - Название элемента (для логов)
     */
    function observeAndRemove(selector, name) {
        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                element.remove();
                console.log(`Элемент '${name}' удалён.`);
                observer.disconnect(); // Останавливаем наблюдение после удаления
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    /**
     * Удаление конкретных параграфов из заданного контейнера по тексту
     * @param {string} parentSelector - Селектор контейнера
     * @param {Array<string>} textsToRemove - Массив текстов, которые нужно удалить
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

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

/**
 * Замена содержимого контейнера новостей на <iframe>
 */
function replaceNewsContent() {
    const newsContainer = document.querySelector('.user-dashboard');
    if (newsContainer) {
        newsContainer.innerHTML = ''; // Очищаем содержимое блока

        // Создаём iframe
        const iframe = document.createElement('iframe');
        iframe.src = 'https://qlstudios.ru/rssuvisualplugin/newssdo'; // Ваша страница
        iframe.width = '100%'; // Устанавливаем ширину
        iframe.height = '600px'; // Устанавливаем высоту
        iframe.style.border = 'none'; // Убираем границу

        newsContainer.appendChild(iframe);
        console.log('Новости заменены на iframe.');
    } else {
        console.log('Контейнер новостей отсутствует. Пропускаем.');
    }
}
// Переопределяем консольный вывод для игнорирования ошибок
window.onerror = function (message, source, lineno, colno, error) {
    if (message.includes('Blocked a frame with origin') || message.includes('SecurityError')) {
        return true; // Подавляем сообщение об ошибке
    }
};


    /**
     * Удаление инлайн-скрипта по содержимому
     * @param {string} keyword - Ключевое слово для поиска в тексте скрипта
     * @param {string} name - Название элемента (для логов)
     */
    function removeInlineScript(keyword, name) {
        const scripts = document.querySelectorAll('script');
        let removed = false;
        scripts.forEach((script) => {
            if (script.textContent.includes(keyword)) {
                script.remove();
                removed = true;
            }
        });
        console.log(removed ? `Инлайн-скрипт '${name}' удалён.` : `Инлайн-скрипт '${name}' отсутствует.`);
    }

    /**
     * Имитация нажатия средней кнопки мыши только для указанных страниц
     */
    function emulateMiddleClickOnSpecificPages() {
        const currentURL = window.location.href;
        const allowedPages = [
            'https://sdo.rgsu.net/',
            'https://sdo.rgsu.net/?page_id=m0101&page_id=m0101',
        ];

        if (allowedPages.includes(currentURL)) {
            document.addEventListener('click', (event) => {
                if (event.button === 0) { // ЛКМ
                    const target = event.target.closest('a'); // Проверяем, кликнули ли по ссылке
                    if (target && target.href) {
                        event.preventDefault(); // Предотвращаем стандартное поведение ЛКМ
                        window.open(target.href, '_self'); // Переходим по ссылке в текущей вкладке
                        console.log(`Переход по ссылке: ${target.href}`);
                    }
                }
            });
        }
    }

    /**
     * Модификация элемента "Домой" на "СДО"
     */
    function modifyHomeLink() {
        const homeLink = document.querySelector('li a[href="https://sdo.rgsu.net/?page_id=m0101&page_id=m0101"]');
        if (homeLink) {
            homeLink.href = 'https://sdo.rgsu.net/';
            homeLink.querySelector('span').textContent = 'СДО';
            console.log('Ссылка "Домой" заменена на "СДО".');
        } else {
            console.log('Элемент "Домой" не найден.');
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

    /**
     * Создание окна настроек
     */
    function createSettingsWindow() {
        const settingsOverlay = document.createElement('div');
        settingsOverlay.id = 'settings-overlay';
        settingsOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            visibility: hidden;
        `;

        const settingsWindow = document.createElement('div');
        settingsWindow.style.cssText = `
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
            width: 400px;
            text-align: center;
            position: relative;
        `;

        const title = document.createElement('h2');
        title.textContent = 'RSSU Visual by MinimalCaxapa';
        title.style.color = '#0078d4';

        const subtitle = document.createElement('p');
        subtitle.textContent = 'В разработке';
        subtitle.style.color = '#333';
        subtitle.style.fontSize = '16px';
        subtitle.style.marginTop = '10px';

        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #333;
        `;
        closeButton.addEventListener('click', () => {
            settingsOverlay.style.visibility = 'hidden';
        });

        settingsWindow.appendChild(title);
        settingsWindow.appendChild(subtitle);
        settingsWindow.appendChild(closeButton);
        settingsOverlay.appendChild(settingsWindow);
        document.body.appendChild(settingsOverlay);
    }

    /**
     * Показ окна настроек
     */
    function showSettingsWindow() {
        const settingsOverlay = document.querySelector('#settings-overlay');
        if (settingsOverlay) {
            settingsOverlay.style.visibility = 'visible';
        }
    }

    /**
     * Добавление кнопки настроек в панель навигации
     */
    function addSettingsButton() {
        const navBar = document.querySelector('.tab-bar .wrapper ul');
        if (navBar) {
            const settingsButton = document.createElement('li');
            settingsButton.classList.add('settings-button');

            const settingsLink = document.createElement('a');
            settingsLink.href = '#';
            settingsLink.innerHTML = '<span>Настройка RSSU Visual</span>';
            settingsLink.addEventListener('click', (event) => {
                event.preventDefault();
                showSettingsWindow();
            });

            settingsButton.appendChild(settingsLink);
            navBar.appendChild(settingsButton);
            console.log('Кнопка настроек добавлена в панель навигации.');
        } else {
            console.log('Панель навигации не найдена. Кнопка настроек не добавлена.');
        }
    }

    // Создаем окно настроек
    createSettingsWindow();

    // Добавляем кнопку настроек
    addSettingsButton();

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

    // Удаляем конкретные параграфы из блока .els-content.els-box
    const textsToRemove = [
        'Отображение итоговой оценки на вкладке "Мои курсы" отображается в тестовом режиме.',
        'Актуальные баллы необходимо смотреть на странице "План занятий" → "Прогресс изучения".',
    ];
    observeAndRemoveParagraphs('.els-content.els-box', textsToRemove);

    // Заменяем новости
    replaceNewsContent();

    // Удаляем инлайн-скрипт
    removeInlineScript('Ya.Metrika', 'Инлайн-скрипт Яндекс.Метрики');

    // Активируем переход по ссылкам только для заданных страниц
    emulateMiddleClickOnSpecificPages();

    // Модифицируем ссылку "Домой"
    modifyHomeLink();

    // Удаляем блок логотипа и снимаем фиксированную высоту
    removeLogoBlockAndFixHeader();

    // Изменяем фон блока user-block-wrapper
    updateUserBlockWrapperBackground();

    // Изменяем стили для toolbar icons
    updateToolbarButtonStyles();
})();
