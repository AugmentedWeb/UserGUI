# UserGui

<img src="media/usergui_logo.png" alt="logo" width="500"/>

A Graphical user interface for userscripts. Creating user-friendly userscripts can be a bit challenging, as the majority of regular users are scared to touch your code. UserGui allows you to unlock your userscript to more people, and to create a more pleasing experience.

## Features

### Internal & External GUI

|           | Internal GUI                 | External GUI                 |
|-----------|------------------------------|------------------------------|
| Parent    | iFrame                       | New window                   |
| Positions | Inside document body         | Anywhere in screen           |
| Weakness  | Can't move outside of window | Disabled popups hide the GUI |

### Dynamic navbar

With a simple command, the user can add pages to the GUI. If multiple pages are added, a navigation bar will generated automatically.

### Various other settings

* Open the GUI in the center of the screen
* Dynamically size the external GUI
* Custom CSS input to internal and external GUI separately
* etc...

## Technology

### Bootstrap 5

UserGui uses the power of [Bootstrap 5](https://getbootstrap.com/docs/5.0/getting-started/introduction/) to make beautiful interfaces, like the one below.

![Example GUI](media/example_gui.png)

Bootstrap 5 is loaded using the userscript manager's `GM.xmlHttpRequest` function to bypass possible CORS-limitations.

### Other

UserGui doesn't need to load anything else than Bootstrap 5. Everything else functions from pure vanilla JavaScript.
