# UserGui

<img src="media/usergui_logo.png" alt="logo" width="500"/>

A Graphical user interface for userscripts. Creating user-friendly userscripts can be a bit challenging, as the majority of regular users are scared to touch your code. UserGui allows you to unlock your userscript to more people, and to create a more pleasing experience.

## Get started

I'm glad you're interested in using UserGui, welcome! To get started, please take a look at the [documentation](documentation.md).

## Feature overview

### Internal & External GUI

|           | Internal GUI                 | External GUI                 |
|-----------|------------------------------|------------------------------|
| Parent    | iFrame                       | New window                   |
| Positions | Inside document body         | Anywhere in screen           |
| Weakness  | Can't move outside of window | Disabled popups hide the GUI |
| Image  | ![Internal GUI](media/example_gui.png) | ![External GUI](media/external_gui.png) |

### Dynamic navbar

If the user adds multiple pages to the GUI, a navigation bar will generated automatically.

### Various other features

* Custom CSS input to internal and external GUI separately
* Really simple data functions for GUI elements
* Open the GUI in the center of the screen
* Notify the user if popups are blocked
* Dynamically size the external GUI
* Bypass site CORS
* and so on...

## Technology

### Bootstrap 5

UserGui uses the power of [Bootstrap 5](https://getbootstrap.com/docs/5.0/getting-started/introduction/) to make beautiful interfaces. Bootstrap is loaded using the userscript manager's `GM.xmlHttpRequest` function. This is done in order to bypass possible CORS-limitations.

### Other

UserGui doesn't need to load anything else than Bootstrap 5. Everything else functions from pure vanilla JavaScript.
