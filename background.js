/*! InstantDataScraperNext - 2025-01-29 */

chrome.action.onClicked.addListener(function (e) { chrome.windows.getCurrent(function (e) { parentWindowId = e.id }), chrome.windows.create({ url: chrome.runtime.getURL("popup.html?tabid=" + encodeURIComponent(e.id) + "&url=" + encodeURIComponent(e.url)), type: "popup", width: 720, height: 650 }) });

chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        console.log("Mensaje recibido de Load FB Ads Library. Ejecutando scraper...");

        // Aquí simulamos que el usuario le hizo clic a la extensión
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            let tab = tabs[0];
            if (tab) {
                chrome.windows.getCurrent(function (e) { parentWindowId = e.id });
                chrome.windows.create({
                    url: chrome.runtime.getURL("popup.html?tabid=" + encodeURIComponent(tab.id) + "&url=" + encodeURIComponent(tab.url)),
                    type: "popup",
                    width: 720,
                    height: 650
                });
            }
        });

        sendResponse({ status: "received" });
    }
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "monitorAndReopen") {
        const targetTabId = request.tabId;
        const nextUrl = request.nextUrl;

        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
            if (tabId === targetTabId && changeInfo.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener);

                setTimeout(() => {
                    chrome.windows.getCurrent(function (e) { parentWindowId = e.id });
                    chrome.windows.create({
                        url: chrome.runtime.getURL("popup.html?tabid=" + encodeURIComponent(tabId) + "&url=" + encodeURIComponent(tab.url)),
                        type: "popup",
                        width: 720,
                        height: 650
                    });
                }, 3000);
            }
        });

        if (nextUrl) {
            chrome.tabs.update(targetTabId, { url: nextUrl });
        }

        sendResponse({ status: "monitoring" });
        return true;
    }
});