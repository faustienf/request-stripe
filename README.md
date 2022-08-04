<p align="center">
  <img src="https://raw.githubusercontent.com/faustienf/request-stripe/main/assets/header.png" width="80%">
</p>

[![npm-version](https://img.shields.io/npm/v/request-stripe.svg)](https://npmjs.org/package/request-stripe)

# request-stripe

🌈 The tiny library for rendering a progress bar on top your screen.

## Features

- 📦 Zero dependencies
- 🕯 Framework agnostic, using vanila API
- 🔨 Tiny API
- ⚙️ Customize render and styles
- 🧲 Autocombine requests

## Getting Started

```sh
npm install request-stripe
```

```js
import { requestStripe } from 'request-stripe';

fetch().finally(requestStripe());
// or
const done = requestStripe();
fetch().finally(() => {
  done();
});
```

## Customization

### Styles

```css
.request-stripe-custom {
  color: #e11d48;
  animation-name: custom-process, custom-finish;
  animation-...
}

.request-stripe-custom[data-state='process'] {
  animation-play-state: running, paused;
}

.request-stripe-custom[data-state='finish'] {
  animation-play-state: paused, running;
}

@keyframes custom-process {
  ...
}

@keyframes custom-finish {
  ...
}
```

### Render

```ts
import { Render, requestStripe } from 'request-stripe';

// Write a render function
const customRender: Render = () => {
  const customElement = document.createElement('div');
  document.body.appendChild(customElement);

  return () => {
    document.body.removeChild(stripeElement);
  };
};

// Pass the function
const done = requestStripe(customRender);
```
