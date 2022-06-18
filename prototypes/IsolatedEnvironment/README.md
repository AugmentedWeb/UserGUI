# GUI Isolated Environment

A quick prototype for UserGui's Isolated Environment to bypass CSP restrictions.

## The idea

Open the GUI in a new origin, so that the browser doesn't apply the site's CSP restrictions to the GUI.

Communication between the window and the userscript can be done in multiple ways, but I'll have to see how I'll implement it.

## Issues

Datatransfer might require `eval(string)` function, which is dangerous if the userscript evaluates strings from the external "isolated" site.

## How to test

`CTRL + SHIFT + I`, paste this into your console,

```js
const isolatedEnvironment = "https://augmentedweb.github.io/UserGui/prototypes/IsolatedEnvironment/index.html";
let isolatedEnvironmentLoaded = false;

window.addEventListener('message', e => {
    console.log(e);

    if(e.data == "Pong" && isolatedEnvironmentLoaded != true) {
        isolatedEnvironmentLoaded = true;
    }
});

const isolatedWindow = window.open(isolatedEnvironment, `<p>Hello World</p>`, `width=300, height=500, left=500, top=200`);

const waitForLoad = setInterval(() => {
    console.log("Sending ping...");
    isolatedWindow.postMessage("Ping", isolatedEnvironment);

    if(isolatedWindow == null) {
        clearInterval(waitForLoad);
        onPopupBlock();
    }

    if(isolatedEnvironmentLoaded) {
        clearInterval(waitForLoad);
        onload();
    }
}, 500);

function onPopupBlock() {
    console.log("The popups are blocked!");
}

function onload() {
    console.log("The isolated environment is ready!");
}
```
