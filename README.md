# Quick Tab Switcher ⚡

A cross-browser extension for switching and managing tabs in a flash, without leaving the keyboard.

## Overview

This extension is currently only working in Chrome, and not yet available in the webstore.

## Installation (Chrome)

**Clone the repository**
```sh
$ git clone git@github.com:aaemnnosttv/quick-tab-switcher.git
$ cd quick-tab-switcher
```

**Install dependencies**
```sh
$ yarn
```

**Build the extension files**
```sh
$ yarn run build
```

**Add extension in Chrome**
- Open the `chrome://extensions` page
- Check the box for **Developer Mode** in the top right corner if it isn't already
- Click the button to **Load Unpacked Extension**
- Navigate to `{path-to-cloned-quick-tab-switcher-directory}/browsers/chrome/` and click **Select**

That's it! The extension is now loaded.

## Configuring the hotkey to toggle the switcher

By default, the hotkey to toggle the switcher is `Cmd` + `K` (Mac) or `Ctrl` + `K` (Win).
To change this, open the `chrome://extensions` page, scroll to the bottom and click the link for **Keyboard shortcuts**.

![image](https://user-images.githubusercontent.com/1621608/32484593-1128e094-c3a9-11e7-9764-ade2ac538b5e.png)

Choose whichever key you want to toggle the switcher. I plan on making this more accessible in the future as well.

## Hotkeys

In addition to toggling the switcher, you may also perform the following actions while the switcher is active:

- `Ctrl` + `J` Move selected/highlighted tab down
- `Ctrl` + `K` Move selected/highlighted tab up
- `Ctrl` + `X` Close the selected/highlighted tab
- `Enter` or `Return` Switch to the selected/highlighted tab
- `Esc` Close the switcher

> Note that `Ctrl` is used for all platforms for these hotkeys, and they are currently not changeable.

## Acknowledgements

This extension is largely inspired by [Fast Tab Switcher](https://github.com/BinaryMuse/chrome-fast-tab-switcher). I wanted to build a similar extension which would work cross-browser; not just for Chrome.

As this extension is built with [Vue](https://vuejs.org), the [Vue Devtools](https://github.com/vuejs/vue-devtools) extension source was a very useful example of a cross-browser extension with Vue.

