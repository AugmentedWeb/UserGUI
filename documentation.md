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

# Public Functions

### AddPage Function

```js
addPage(content, name)
```
>
> ### Description
>
> Adds a page to the GUI page array.
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

### Open Function

```js
open(readyFunction)
```
>
> ### Description
>
> Opens the GUI, either externally or internally.
>
> ### Parameters
>
> **@readyFunction (Function)** *Gets called after the GUI has initialized, might contain user's event functions*
>
> ### Returns
>
> None

### Close Function

```js
close()
```
>
> ### Description
>
> Closes the GUI.
>
> ### Parameters
>
> None
>
> ### Returns
>
> None

### Event Function

```js
event(name, event, eventFunction)
```
>
> ### Description
>
> Creates an event listener for a GUI form element.
>
> ### Parameters
>
> **@name (String)** *Form element's name, taken from BeautifyTools' Form Builder*
> 
> **@event (String)** *Event to listen for (click, change, e.g.)*
> 
> **@eventFunction (Function)** *Function to be called when event is activated*
> 
> ### Returns
>
> None

### Disable Function

```js
disable(name)
```
>
> ### Description
>
> Disables a GUI form element.
>
> ### Parameters
>
> **@name (String)** *Form element's name, taken from BeautifyTools' Form Builder*
> 
> ### Returns
>
> None

### Enable Function

```js
enable(name)
```
>
> ### Description
>
> Enables a GUI form element.
>
> ### Parameters
>
> **@name (String)** *Form element's name, taken from BeautifyTools' Form Builder*
> 
> ### Returns
>
> None

### GetValue Function

```js
getValue(name)
```
>
> ### Description
>
> Gets a GUI form element's value. Works on types "text field", "textarea", "date field" & "number".
>
> ### Parameters
>
> **@name (String)** *Form element's name, taken from BeautifyTools' Form Builder*
> 
> ### Returns
>
> **(String, Integer)** *The GUI form element's value*

### SetValue Function

```js
setValue(name, newValue)
```
>
> ### Description
>
> Sets a GUI form element's value. Works on types "text field", "textarea", "date field" & "number".
>
> ### Parameters
>
> **@name (String)** *Form element's name, taken from BeautifyTools' Form Builder*
> 
> **@newValue (String, Integer)** *The new GUI form element's value to be set*
> 
> ### Returns
>
> **(String, Integer)** *The GUI form element's value*
