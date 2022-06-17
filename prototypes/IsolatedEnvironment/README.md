# GUI Isolated Environment

A quick prototype for UserGui's Isolated Environment to bypass CSP restrictions.

## The idea

Open the GUI in a new origin, so that the browser doesn't apply the site's CSP restrictions to the GUI.

Communication between the window and the userscript can be done in multiple ways, but I'll have to see how I'll implement it.

## How to test

`CTRL + I`, paste this into your console,

```js
window.open("https://augmentedweb.github.io/UserGui/prototypes/IsolatedEnvironment/index.html", `
<p>Hello World</p>
`, `width=300, height=500, left=300, top=200`);
```

You'll see a popup appear, inside it, the Hello World body element.
