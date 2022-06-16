# UserGui Documentation

<img src="media/logo_docs.png" alt="logo" width="500"/>

## Quick Start

### 1) Setup the userscript header

Grant the userscript `GM.xmlHttpRequest` and require the UserGui, like so.

```js
// @grant       GM.xmlHttpRequest
// @require     https://github.com/AugmentedWeb/UserGui/raw/main/usergui.js
```

### 2) Create a new instance

```js
const Gui = new UserGui;
```

### 3) Apply settings

`Gui.settings` has settings for the GUI, and its window, such as

```js
Gui.settings.window.title = "GUI Demo"; // set window title
Gui.settings.window.centered = true; // GUI starts at the center of the screen
Gui.settings.gui.internal.darkCloseButton = true; // Changes the close button to dark theme
```

### 4) Add a page

Use [BeautifyTools' Form Builder](https://beautifytools.com/html-form-builder.php) to create your GUI elements. After creating the form, press the "Get HTML" button. 

> **NOTE: No other form builder is supported, please use the BeautifyTool's form builder.**

The form's HTML will be inserted, **as a whole**, into the `Gui.addPage(html, name)` function, like so

```js
Gui.addPage(`
<div class="rendered-form">
    <div class="formbuilder-button form-group field-button-1655324182259">
        <button type="button" class="btn-default btn" name="button-1655324182259" access="false" style="default" id="button-1655324182259">Button</button>
    </div>
</div>
`, "Some name");
```

### 5) Open the GUI

Use `Gui.open(readyFunction)` to open the GUI.

```js
Gui.open(() => {
    // learn more in step 6
});
```

### 6) Functionalize the GUI

Currently, your GUI is a dead shell. We need to add event listeners to make it alive.

Inside the `Gui.open(readyFunction)`'s ready function, add events, like so,

```js
Gui.event("button-1655324182259", "click", () => {
    console.log("Button was clicked!");
});
```

### 7) The GUI is done

The final result could look like this,

```js
// ==UserScript==
// @name        Example-GUI
// @namespace   HKR
// @match       https://example.com/*
// @grant       GM.xmlHttpRequest
// @version     1.0
// @author      HKR
// @description This is an example userscript made for UserGui
// @require     https://github.com/AugmentedWeb/UserGui/raw/main/usergui.js
// ==/UserScript==

const Gui = new UserGui;

Gui.settings.window.title = "GUI Demo"; // set window title
Gui.settings.window.centered = true; // GUI starts at the center of the screen
Gui.settings.window.external = true; // GUI opens up externally

Gui.addPage(`
<div class="rendered-form">
    <div class="formbuilder-button form-group field-button-1655324182259">
        <button type="button" class="btn-default btn" name="button-1655324182259" access="false" style="default" id="button-1655324182259">Button</button>
    </div>
</div>
`, "Some name");

Gui.open(() => {
    Gui.event("button-1655324182259", "click", () => {
        console.log("Button was clicked!");
    });
});
```

---

## AddPage Function

```js
addPage(content, name)
```
>
> ### Description
>
> Pushes an object containing the content and the name to the `#guiPages` variable. This adds a page to the GUI.
>
> ### Parameters
>
> **@content (String)** *HTML GUI content*
> 
> **@name (String)** *Navbar tab title*
>
> ### Returns
>
> None

