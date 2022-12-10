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
    --side-panel-background-color: #1a1a1a;
    --header-panel-background-color: #1a1a1a;
    --footer-panel-background-color: #1a1a1a;
    --header-panel-tertiary-background-color: #343434;
    --navigation-background-color: #343434;
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
main div div div:nth-child(2) [class*="unifi-portal"]:not(label):not(a) {
    background: #1a1a1a;
    //border-bottom: 1px solid #555555;
}
main div div div:nth-child(2) [class*="unifi-portal"] label {
    border-bottom: unset;
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
    background-color: #1a1a1a !important;
}
span[class*="content"] > span, label {
    color: #fafafa !important;
}
[class*="inputContainer-secondary"] {
    background-color: #343434;
}
div [class*="options"] {
    background-color: #1a1a1a;
    color: #fafafa;
}
.user-detail-panel, .user-detail-general-header, .user-detail-panel-tab {
    background-color: #1a1a1a !important;
}
.user-detail-panel-header h3, .user-detail-general-header h3 {
    color: #fff !important;
}
[class*="style_custom-date-picker-wrap"] {
    background-color: #1a1a1a !important;
    border: unset;
}
[class*="tabsContainer"], div:has(> svg) {
    border: unset !important;
}
div[class*="unifi-portal"]:has(> a):active, div.unifi-portal-1okx0t8 {
    background: #343434 !important;
}
button[class*="portal"][aria-expanded="true"] {
    background-color: #343434 !important;
}
span[class*="content"] {
    color: #fafafa;
}
[class*="input-light"] {
    color: #fafafa;
}
[class*="input-focused"] {
    color: #ffffff;
}
div[class*="filter-container"] {
    background-color: #343434;
}
div.popover-dropdown-item:hover {
    background: #343434 !important;
}
[class*="search_search-dropdown-icon"]:hover {
    background: #343434 !important;
}
input {
    background-color: #232323;
}
[class*="csv_csv-content"] label {
    background: #343434 !important;
}
div[class*="groups__ListContainer"], div[class*="layout__ToolBar"] {
    background: unset !important;
}
div[class*="groups__StyledSidePanel"] {
    background: #121212;
}
.dark-layout-content {
    background: #1a1a1a !important;
}
td div span {
    color: #fff;
}
[class*="unifi-portal"] label .container {
    background: #1a1a1a !important;
}
div[class*="unifi-portal"]:has(span[class*="text-base"]) {
    background: unset !important;
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
        function replace(a, classes, inverseKey) {
            a.classList.value = classes.value.replace(new RegExp(key, "g"), inverseKey);
        }

        if (this.classList) {
            console.log(this.classList.value);
            replace(this, this.classList, inverseKey);
        }

        const elements = document.querySelectorAll(`[class*="${key}"]`);
        elements.forEach((_, index) => {
            const a = elements[index];
            const classes = a.classList

            replace(a, classes, inverseKey);

            setTimeout(() => {
                replace(a, classes, inverseKey);
            }, 50);

            setTimeout(() => {
                replace(a, classes, inverseKey);
            }, 100);
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