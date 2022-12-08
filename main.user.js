// ==UserScript==
// @name         UniFi Dashboard Dark Mode
// @namespace    http://zwander.dev/
// @version      0.1
// @description  Dark Mode for UniFi dashboard.
// @author       Zachary Wander
// @match        https://unifi.ui.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ui.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @updateURL    https://cdn.jsdelivr.net/gh/zacharee/UniFiDarkMode@master/main.user.js
// ==/UserScript==

const STYLESHEET_ID = 'unifi-dark-theme-style';
const STYLESHEET = `
body {
    background-color: #1a1a1a;
}
:root, #root {
    --main-panel-background-color: #1a1a1a;
    background-color: #1a1a1a;
    color: #fff;
}
[class*="container-dark"], #console-dashboard-content, #section-header, main {
    background: #1a1a1a !important;
}
[class*="appHeader"] {
    background: none;
}
.dashboard-tile-image:hover {
    background: #343434 !important;
}
[class*="unifi-portal"][aria-current="true"] {
    background: #343434 !important;
}
[class*="button-dark"]:hover {
    background: #343434 !important;
}
[class*="unifi-portal"][data-testid="SearchButton"] {
    background-color: #1a1a1a !important;
}
[class*="backgroundToolbarSearch"]:after {
    background: #343434;
    color: #fff;
}
[class*="toolbarInput"] {
    color: #fff;
}
[class*="title"], [class*="text-base"] {
    color: #fff !important;
}
[class*="details"] {
    color: #fafafa !important;
}
main > div > div > div:nth-child(2) [class*="unifi-portal"] {
    background: #1f1f1f;
    border-bottom: 1px solid #555555;
}
main > div > div:nth-child(1) [class*="unifi-portal"] {
    border-bottom: 1px solid #555555;
}
main > div > div:nth-child(1) > * [class*="unifi-portal"] {
    border-bottom: unset;
}
[class*="icon"] {
    color: #787878;
}
.variant-online, .variant-offline {
    border: 1px solid #555555 !important;
}
[class*="card"] {
    background-color: #1f1f1f !important;
}
span[class*="content"] > span, label {
    color: #fafafa !important;
}
[class*="inputContainer-secondary"] {
    background-color: #343434;
}
div [class*="options"] {
    background-color: #1f1f1f;
    color: #fafafa;
}
.user-detail-panel, .user-detail-general-header, .user-detail-panel-tab {
    background-color: #1f1f1f !important;
}
.user-detail-panel-header h3, .user-detail-general-header h3 {
    color: #fff !important;
}
[class*="style_custom-date-picker-wrap"] {
    background-color: #1f1f1f !important;
    border: unset;
}
[class*="tabsContainer"], div:has(> svg) {
    border: unset !important;
}
`;

function themeStuff() {
    const styleSheet = document.createElement('style');
    styleSheet.id = STYLESHEET_ID;
    styleSheet.textContent = STYLESHEET;
    document.head.appendChild(styleSheet);

    observeElements(true);
}

function removeTheme() {
    const styleSheetElement = document.getElementById(STYLESHEET_ID);
    styleSheetElement.remove();

    observeElements(false);
}

function observeElements(lightToDark) {
    const key = (lightToDark) ? "light" : "dark";
    const inverseKey = (lightToDark) ? "dark" : "light";

    function onAdd() {
        const elements = document.querySelectorAll(`[class*="${key}"]`);
        elements.forEach(a => {
            const classes = a.classList;
            classes.value = classes.value.replace(new RegExp(key, "gi"), inverseKey);
        })
    }

    if (lightToDark) {
        onAdd();
        document.arrive(`[class*="${key}"]`, {fireOnAttributesModification: true, existing: true}, onAdd);
    }
    document.unbindArrive(`[class*="${inverseKey}"]`);
}

(function () {
    'use strict';

    let isNetworkAlready = window.location.href.includes("network/");

    window.onload = () => {
        const bodyList = document.querySelector("body");
        let oldHref = document.location.href;
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                if (oldHref !== document.location.href) {
                    oldHref = document.location.href;
                    if (oldHref.includes("network/") && !isNetworkAlready) {
                        isNetworkAlready = true
                        removeTheme();
                    }

                    if (!oldHref.includes("network/") && isNetworkAlready) {
                        isNetworkAlready = false
                        themeStuff();
                    }
                }
            });
        });

        const config = {
            childList: true,
            subtree: true
        };

        observer.observe(bodyList, config);
    }

    if (!isNetworkAlready) {
        themeStuff();
    }
})();