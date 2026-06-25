# Decision Maker 3000

Can't decide? Let the app decide for you. Decision Maker 3000 is a small single-page web app with a handful of quick "decision games" to settle any choice.

## Games

- **Coin Flip** — an animated coin that lands on Yes/No (switch to Heads/Tails in settings).
- **Dice Roll** — roll a standard six-sided die.
- **Magic 8-Ball** — ask a yes/no question and get one of the 20 classic answers.
- **Decision Wheel** — spin the wheel and let it land on an option.
- **Pick a Number** — get a random number in a range you choose.

## Features

- Dark and light themes (dark by default), switchable from the settings gear.
- Mobile-first layout that scales cleanly to desktop.
- No build step and no dependencies — just plain HTML, CSS, and JavaScript.

## Running it

Open `index.html` in any modern browser — double-click it or drag it into a tab. There's nothing to install or build.

## Project structure

The app uses a simple Model–View–Controller split:

| File | Role |
|------|------|
| `index.html` | Markup; loads the stylesheet and scripts |
| `model.js` | Application state and data (games, theme, and each game's state) |
| `view.js` | Renders each screen from the model into the page |
| `controller.js` | Handles input, updates the model, and triggers re-renders |
| `styles.css` | All styling and theming |
| `images/` | Coin artwork |

Rendering is data-driven: the home menu is built from `model.games`, and each screen is a function in `view.pages`. A single click listener handles navigation (`data-nav`) and actions (`data-action`).

## Adding a new game

1. Add an entry to `model.games`: `{ id, name }`.
2. Add a matching page function to `view.pages` in `view.js`.

Until a page exists for a game's id, it automatically shows a "Coming soon" placeholder.
