const view = {
    pages: {
        home(model)
        {
            let html = "";
            html += `<h1 class="app-title">Decision Maker 3000</h1>`;
            html += `<p class="tagline">Can't decide? Let the app decide for you.</p>`;
            html += `<div class="menu">`;
            for (const game of model.games)
            {
                html += `<button class="game-card" data-nav="${game.id}">`;
                html += `<span class="game-name">${game.name}</span>`;
                html += `<span class="game-chevron">›</span>`;
                html += `</button>`;
            }
            html += `</div>`;
            return html;
        },
        coinflip(model)
        {
            const coin = model.coin;
            let html = "";
            html += `<button class="back" data-nav="home">‹ Back</button>`;
            html += `<div class="game">`;
            html += `<h1>Coin Flip</h1>`;
            html += `<div class="coin">`;
            const src = coin.frame ?? (coin.result ? coin.result.image : null);
            if (src)
            {
                const alt = (coin.result && !coin.frame) ? coin.result.label : "";
                html += `<img id="coin-img" src="${src}" alt="${alt}">`;
            }
            else
            {
                html += `<img id="coin-img" src="images/flipEmpty.png" alt="?">`;
            }
            html += `</div>`;
            html += `<div class="coin-controls">`;
            if (coin.flipping)
            {
                html += `<button class="btn" data-action="flip" disabled>Flipping…</button>`;
            }
            else if (coin.result)
            {
                html += `<button class="btn" data-action="flip">Flip again</button>`;
            }
            else
            {
                html += `<button class="btn" data-action="flip">Flip</button>`;
            }
            const headsTailsOn = coin.mode === "headstails";
            html += `<button class="btn-secondary${headsTailsOn ? " toggle-on" : ""}" data-action="toggleCoinMode"${coin.flipping ? " disabled" : ""} aria-pressed="${headsTailsOn}">Heads / Tails</button>`;
            html += `</div>`;
            html += `</div>`;
            return html;
        },
        dice(model)
        {
            const dice = model.dice;
            let html = "";
            html += `<button class="back" data-nav="home">‹ Back</button>`;
            html += `<div class="game">`;
            html += `<h1>Dice Roll</h1>`;
            html += `<div class="dice-count">`;
            html += `<label>Number of dice <input type="number" id="dice-count" min="1" max="10" value="${dice.count}"${dice.rolling ? " disabled" : ""}></label>`;
            html += `</div>`;
            html += `<div class="dice" id="dice">`;
            html += view.diceMarkup(model);
            html += `</div>`;
            if (dice.rolling)
            {
                html += `<button class="btn" data-action="roll" disabled>Rolling…</button>`;
            }
            else
            {
                html += `<button class="btn" data-action="roll">Roll</button>`;
            }
            html += `</div>`;
            return html;
        },
        magic8(model)
        {
            const magic8 = model.magic8;
            let html = "";
            html += `<button class="back" data-nav="home">‹ Back</button>`;
            html += `<div class="game">`;
            html += `<h1>Magic 8-Ball</h1>`;
            html += `<div class="ball${magic8.shaking ? " shaking" : ""}">`;
            html += `<div class="ball-window">`;
            if (magic8.shaking)
            {
                html += `…`;
            }
            else if (magic8.answer)
            {
                html += magic8.answer;
            }
            else
            {
                html += `<span class="ball-8">8</span>`;
            }
            html += `</div>`;
            html += `</div>`;
            if (magic8.shaking)
            {
                html += `<button class="btn" data-action="ask" disabled>Shaking…</button>`;
            }
            else if (magic8.answer)
            {
                html += `<button class="btn" data-action="ask">Ask again</button>`;
            }
            else
            {
                html += `<button class="btn" data-action="ask">Ask</button>`;
            }
            html += `</div>`;
            return html;
        },
        wheel(model)
        {
            const wheel = model.wheel;
            let html = "";
            html += `<button class="back" data-nav="home">‹ Back</button>`;
            html += `<div class="game">`;
            html += `<h1>Decision Wheel</h1>`;
            if (wheel.editing)
            {
                html += `<div class="wheel-editor">`;
                for (let i = 0; i < wheel.options.length; i++)
                {
                    const opt = wheel.options[i];
                    const removeDisabled = wheel.options.length <= 2 ? " disabled" : "";
                    html += `<div class="edit-row">`;
                    html += `<input type="color" class="edit-color" data-edit="color" data-index="${i}" value="${opt.color}">`;
                    html += `<input type="text" class="edit-label" data-edit="label" data-index="${i}" value="${view.escape(opt.label)}" maxlength="14">`;
                    html += `<button class="edit-remove" data-action="removeOption" data-index="${i}" aria-label="Remove option"${removeDisabled}>✕</button>`;
                    html += `</div>`;
                }
                html += `</div>`;
                html += `<div class="wheel-editor-actions">`;
                if (wheel.options.length < 8)
                {
                    html += `<button class="btn-secondary" data-action="addOption">+ Add option</button>`;
                }
                html += `<button class="btn-secondary" data-action="resetWheel">Reset to default</button>`;
                html += `<button class="btn" data-action="doneEditing">Done</button>`;
                html += `</div>`;
            }
            else
            {
                const options = wheel.options;
                const seg = 360 / options.length;
                html += `<div class="wheel-wrap">`;
                html += `<div class="wheel-pointer"></div>`;
                html += `<div class="wheel" id="wheel" style="transform: rotate(${wheel.rotation}deg); background: ${view.wheelGradient(options)}">`;
                for (let i = 0; i < options.length; i++)
                {
                    const angle = i * seg + seg / 2;
                    html += `<div class="wheel-label" style="transform: rotate(${angle}deg)"><span>${view.escape(options[i].label)}</span></div>`;
                }
                html += `</div>`;
                html += `</div>`;
                if (!wheel.spinning && wheel.result)
                {
                    html += `<p class="wheel-result">${view.escape(wheel.result)}</p>`;
                }
                html += `<div class="wheel-controls">`;
                if (wheel.spinning)
                {
                    html += `<button class="btn" data-action="spin" disabled>Spinning…</button>`;
                }
                else
                {
                    html += `<button class="btn" data-action="spin">${wheel.result ? "Spin again" : "Spin"}</button>`;
                }
                html += `<button class="btn-secondary" data-action="editWheel"${wheel.spinning ? " disabled" : ""}>Edit</button>`;
                html += `</div>`;
            }
            html += `</div>`;
            return html;
        },
        number(model)
        {
            const number = model.number;
            let html = "";
            html += `<button class="back" data-nav="home">‹ Back</button>`;
            html += `<div class="game">`;
            html += `<h1>Pick a Number</h1>`;
            html += `<div class="number-range">`;
            html += `<label>Min <input type="number" id="num-min" value="${number.min}"></label>`;
            html += `<label>Max <input type="number" id="num-max" value="${number.max}"></label>`;
            html += `</div>`;
            html += `<div class="number-display" id="number-display">`;
            html += (number.value !== null ? number.value : "?");
            html += `</div>`;
            if (number.picking)
            {
                html += `<button class="btn" data-action="pick" disabled>Picking…</button>`;
            }
            else
            {
                html += `<button class="btn" data-action="pick">${number.value !== null ? "Pick again" : "Pick"}</button>`;
            }
            html += `</div>`;
            return html;
        },
        settings(model)
        {
            let html = "";
            html += `<button class="back" data-nav="home">‹ Back</button>`;
            html += `<h1>Settings</h1>`;
            html += `<h2 class="settings-label">Theme</h2>`;
            html += `<div class="theme-options">`;
            for (const theme of model.themes)
            {
                const cls = theme.id === model.theme ? "theme-btn active" : "theme-btn";
                html += `<button class="${cls}" data-action="setTheme" data-theme="${theme.id}">${theme.name}</button>`;
            }
            html += `</div>`;
            html += `<h2 class="settings-label">Coin</h2>`;
            html += `<div class="theme-options">`;
            for (const mode of model.coin.modes)
            {
                const cls = mode.id === model.coin.mode ? "theme-btn active" : "theme-btn";
                html += `<button class="${cls}" data-action="setCoinMode" data-mode="${mode.id}">${mode.name}</button>`;
            }
            html += `</div>`;
            return html;
        }
    },
    placeholder(model)
    {
        const game = model.games.find((g) => g.id === model.currentView);
        const name = game ? game.name : "Coming soon";
        let html = "";
        html += `<button class="back" data-nav="home">‹ Back</button>`;
        html += `<div class="game placeholder">`;
        html += `<h1>${name}</h1>`;
        html += `<p class="tagline">Coming soon.</p>`;
        html += `</div>`;
        return html;
    },
    render(model)
    {
        let html = "";
        if (model.currentView !== "settings")
        {
            html += `<button class="settings-btn" data-nav="settings" aria-label="Settings">`;
            html += `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
            html += `</button>`;
        }
        const page = view.pages[model.currentView];
        if (page)
        {
            html += page(model);
        }
        else if (model.games.some((g) => g.id === model.currentView))
        {
            html += view.placeholder(model);
        }
        else
        {
            html += view.pages.home(model);
        }
        model.app.innerHTML = html;
    },
    setCoinFrame(src)
    {
        const img = document.getElementById("coin-img");
        if (img)
        {
            img.src = src;
        }
    },
    dieFace(value)
    {
        const layouts = {
            1: [5],
            2: [1, 9],
            3: [1, 5, 9],
            4: [1, 3, 7, 9],
            5: [1, 3, 5, 7, 9],
            6: [1, 3, 4, 6, 7, 9]
        };
        const pips = layouts[value] || [];
        let html = "";
        for (let cell = 1; cell <= 9; cell++)
        {
            if (pips.includes(cell))
            {
                html += `<span class="cell"><span class="pip"></span></span>`;
            }
            else
            {
                html += `<span class="cell"></span>`;
            }
        }
        return html;
    },
    diceMarkup(model)
    {
        const dice = model.dice;
        let html = "";
        for (let i = 0; i < dice.count; i++)
        {
            const value = (dice.values && dice.values[i]) ? dice.values[i] : null;
            html += `<div class="die${dice.rolling ? " rolling" : ""}" id="die-${i}">${view.dieFace(value)}</div>`;
        }
        return html;
    },
    setDiceArea(model)
    {
        const container = document.getElementById("dice");
        if (container)
        {
            container.innerHTML = view.diceMarkup(model);
        }
    },
    setDiceValues(values)
    {
        for (let i = 0; i < values.length; i++)
        {
            const die = document.getElementById("die-" + i);
            if (die)
            {
                die.innerHTML = view.dieFace(values[i]);
            }
        }
    },
    wheelGradient(options)
    {
        const seg = 360 / options.length;
        const stops = [];
        for (let i = 0; i < options.length; i++)
        {
            stops.push(`${options[i].color} ${i * seg}deg ${(i + 1) * seg}deg`);
        }
        return `conic-gradient(${stops.join(", ")})`;
    },
    escape(str)
    {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    },
    setWheelRotation(deg)
    {
        const wheel = document.getElementById("wheel");
        if (wheel)
        {
            wheel.style.transform = `rotate(${deg}deg)`;
        }
    },
    setNumber(value)
    {
        const el = document.getElementById("number-display");
        if (el)
        {
            el.textContent = value;
        }
    }
};
