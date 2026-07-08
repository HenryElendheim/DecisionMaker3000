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
            const mode = coin.modes.find((m) => m.id === coin.mode);
            let html = "";
            html += `<button class="back" data-nav="home">‹ Back</button>`;
            html += `<div class="game">`;
            html += `<h1>Coin Flip</h1>`;
            html += `<svg width="0" height="0" class="coin-defs" aria-hidden="true"><defs>`;
            html += `<radialGradient id="coinGold" cx="38%" cy="34%" r="75%">`;
            html += `<stop offset="0%" stop-color="#ffe9a8"></stop>`;
            html += `<stop offset="55%" stop-color="#f5c542"></stop>`;
            html += `<stop offset="100%" stop-color="#d99a1c"></stop>`;
            html += `</radialGradient></defs></svg>`;
            html += `<div class="coin${!coin.flipping && coin.result ? " landed" : ""}">`;
            html += `<div class="coin-3d" id="coin-3d" style="transform: rotateX(${coin.rotation}deg)">`;
            html += `<div class="coin-face front">${view.coinFace(mode.sides[0].label)}</div>`;
            html += `<div class="coin-face back">${view.coinFace(mode.sides[1].label)}</div>`;
            html += `</div>`;
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
            html += `<label class="check-row"><input type="checkbox" id="coin-mode"${headsTailsOn ? " checked" : ""}${coin.flipping ? " disabled" : ""}> Heads / Tails</label>`;
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
            html += `<label>Number of dice <input type="number" id="dice-count" min="1" max="${dice.max}" value="${dice.count}"${dice.rolling ? " disabled" : ""}></label>`;
            html += `</div>`;
            html += `<div class="dice" id="dice">`;
            html += view.diceMarkup(model);
            html += `</div>`;
            if (dice.rolling)
            {
                html += `<button class="btn" id="roll-btn" data-action="roll" disabled>Rolling…</button>`;
            }
            else
            {
                html += `<button class="btn" id="roll-btn" data-action="roll">Roll</button>`;
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
            html += `<div class="ball${magic8.shaking ? " shaking" : ""}${!magic8.shaking && magic8.answer ? " landed" : ""}">`;
            if (!magic8.shaking && magic8.answer)
            {
                html += `<div class="ball-window">${magic8.answer}</div>`;
            }
            else
            {
                html += `<span class="ball-8">8</span>`;
            }
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
                const wheelLanded = !wheel.spinning && wheel.result ? " landed" : "";
                const glowVar = wheelLanded ? `; --glow-color: ${view.escape(wheel.resultColor || "#ffffff")}` : "";
                html += `<div class="wheel${wheelLanded}" id="wheel" style="transform: rotate(${wheel.rotation}deg); background: ${view.wheelGradient(options)}${glowVar}">`;
                for (let i = 0; i < options.length; i++)
                {
                    const angle = i * seg + seg / 2;
                    const textColor = view.textColorFor(options[i].color);
                    html += `<div class="wheel-label" style="transform: rotate(${angle}deg)"><span style="color: ${textColor}">${view.escape(options[i].label)}</span></div>`;
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
            const numLanded = number.value !== null && !number.picking ? " landed" : "";
            html += `<div class="number-display${numLanded}" id="number-display">`;
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
        time(model)
        {
            const time = model.time;
            let html = "";
            html += `<button class="back" data-nav="home">‹ Back</button>`;
            html += `<div class="game">`;
            html += `<h1>Pick a Time</h1>`;
            html += `<div class="time-range">`;
            if (time.hour12)
            {
                html += view.timeField12("start", time.start, "From");
                html += view.timeField12("end", time.end, "To");
            }
            else
            {
                html += `<label>From <input type="time" id="time-start" value="${time.start}"></label>`;
                html += `<label>To <input type="time" id="time-end" value="${time.end}"></label>`;
            }
            html += `</div>`;
            const timeLanded = time.result !== null && !time.picking ? " landed" : "";
            html += `<div class="time-display${timeLanded}" id="time-result">`;
            html += (time.result !== null ? time.result : (time.hour12 ? "--:-- --" : "--:--"));
            html += `</div>`;
            if (time.picking)
            {
                html += `<button class="btn" data-action="pickTime" disabled>Picking…</button>`;
            }
            else
            {
                html += `<button class="btn" data-action="pickTime">${time.result !== null ? "Pick again" : "Pick a time"}</button>`;
            }
            html += `<label class="check-row"><input type="checkbox" id="time-ampm"${time.hour12 ? " checked" : ""}> AM / PM</label>`;
            html += `<label class="check-row"><input type="checkbox" id="time-round"${time.round ? " checked" : ""}> Round to 00 / 15 / 30 / 45</label>`;
            html += `</div>`;
            return html;
        },
        color(model)
        {
            const color = model.color;
            let html = "";
            html += `<button class="back" data-nav="home">‹ Back</button>`;
            html += `<div class="game">`;
            html += `<h1>Pick a Color</h1>`;
            if (color.editing)
            {
                html += `<div class="color-grid editing">`;
                for (let i = 0; i < color.options.length; i++)
                {
                    const removeDisabled = color.options.length <= 2 ? " disabled" : "";
                    html += `<div class="color-cell-edit">`;
                    html += `<label class="color-swatch" style="background:${view.escape(color.options[i])}">`;
                    html += `<input type="color" class="color-input" data-index="${i}" value="${view.escape(color.options[i])}">`;
                    html += `</label>`;
                    html += `<button class="color-remove" data-action="removeColor" data-index="${i}" aria-label="Remove color"${removeDisabled}>✕</button>`;
                    html += `</div>`;
                }
                const atCap = color.options.length >= (color.max || 50);
                html += `<button class="color-add" data-action="addColor" aria-label="Add color"${atCap ? " disabled title=\"Maximum reached\"" : ""}>+</button>`;
                html += `</div>`;
                html += `<div class="color-editor-actions">`;
                html += `<button class="btn-secondary" data-action="resetColors">Reset to default</button>`;
                html += `<button class="btn" data-action="doneEditingColors">Done</button>`;
                html += `</div>`;
            }
            else
            {
                const gridResult = color.result && !color.picking ? " has-result" : "";
                html += `<div class="color-grid${gridResult}" id="color-grid">`;
                html += view.colorGridMarkup(model);
                html += `</div>`;
                html += `<div class="color-result">`;
                const swatch = color.result ? color.result : "transparent";
                const swatchPop = color.result && !color.picking ? " pop" : "";
                html += `<div class="color-result-swatch${swatchPop}" style="background:${view.escape(swatch)}"></div>`;
                html += `<div class="color-result-hex${swatchPop}">${color.result ? view.escape(color.result.toUpperCase()) : "--------"}</div>`;
                html += `</div>`;
                html += `<div class="color-controls">`;
                if (color.picking)
                {
                    html += `<button class="btn" data-action="pickColor" disabled>Picking…</button>`;
                }
                else
                {
                    html += `<button class="btn" data-action="pickColor">${color.result ? "Pick again" : "Pick a color"}</button>`;
                }
                html += `<button class="btn-secondary" data-action="editColors"${color.picking ? " disabled" : ""}>Edit colors</button>`;
                html += `</div>`;
            }
            html += `</div>`;
            return html;
        },
        settings(model)
        {
            let html = "";
            html += `<button class="back" data-action="closeSettings">‹ Back</button>`;
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
            html += `<h2 class="settings-label">Dice Roll</h2>`;
            const diceMax = model.dice.max || 10;
            html += `<div class="slider-setting">`;
            html += `<div class="slider-row"><span>Maximum dice</span><span class="slider-value" id="dice-max-value">${diceMax}</span></div>`;
            html += `<input type="range" id="dice-max" min="10" max="50" step="5" value="${diceMax}">`;
            html += `</div>`;
            const spinSec = (model.dice.spinTime || 1800) / 1000;
            html += `<div class="slider-setting">`;
            html += `<div class="slider-row"><span>Spin time</span><span class="slider-value" id="dice-spin-value">${spinSec}s</span></div>`;
            html += `<input type="range" id="dice-spin" min="1" max="10" step="0.1" value="${spinSec}">`;
            html += `</div>`;
            html += `<h2 class="settings-label">Pick a Time</h2>`;
            html += `<div class="theme-options">`;
            const cls24 = !model.time.hour12 ? "theme-btn active" : "theme-btn";
            const cls12 = model.time.hour12 ? "theme-btn active" : "theme-btn";
            html += `<button class="${cls24}" data-action="setTimeFormat" data-format="24">24-hour</button>`;
            html += `<button class="${cls12}" data-action="setTimeFormat" data-format="12">12-hour (AM / PM)</button>`;
            html += `</div>`;
            html += `<h2 class="settings-label">Pick a Color</h2>`;
            const colorMax = model.color.max || 50;
            html += `<div class="slider-setting">`;
            html += `<div class="slider-row"><span>Maximum colors</span><span class="slider-value" id="color-max-value">${colorMax}</span></div>`;
            html += `<input type="range" id="color-max" min="50" max="100" step="5" value="${colorMax}">`;
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
            html += `<button class="settings-btn" data-action="openSettings" aria-label="Settings">`;
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
    coinFace(label)
    {
        let html = "";
        html += `<svg viewBox="0 0 120 120" class="coin-svg" aria-hidden="true">`;
        html += `<circle cx="60" cy="60" r="57" fill="url(#coinGold)" stroke="#b97e12" stroke-width="3"></circle>`;
        html += `<circle cx="60" cy="60" r="47" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="2"></circle>`;
        html += `<text x="60" y="63" text-anchor="middle" dominant-baseline="middle" class="coin-text">${view.escape(label)}</text>`;
        html += `</svg>`;
        return html;
    },
    setCoinRotation(deg)
    {
        const coin = document.getElementById("coin-3d");
        if (coin)
        {
            coin.style.transform = `rotateX(${deg}deg)`;
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
            const settled = dice.settled && dice.settled[i];
            const rolling = dice.rolling && !settled;
            const landed = settled || (!dice.rolling && value);
            html += `<div class="die${rolling ? " rolling" : ""}${landed ? " landed" : ""}" id="die-${i}">${view.dieFace(value)}</div>`;
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
    setDieFace(index, value)
    {
        const die = document.getElementById("die-" + index);
        if (die)
        {
            die.innerHTML = view.dieFace(value);
        }
    },
    settleDie(index, value)
    {
        const die = document.getElementById("die-" + index);
        if (die)
        {
            die.classList.remove("rolling");
            die.classList.add("landed");
            die.innerHTML = view.dieFace(value);
        }
    },
    setRolling(rolling)
    {
        const btn = document.getElementById("roll-btn");
        if (btn)
        {
            btn.disabled = rolling;
            btn.textContent = rolling ? "Rolling…" : "Roll";
        }
        const count = document.getElementById("dice-count");
        if (count)
        {
            count.disabled = rolling;
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
    textColorFor(hex)
    {
        const c = String(hex).replace("#", "");
        const full = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
        const r = parseInt(full.substr(0, 2), 16);
        const g = parseInt(full.substr(2, 2), 16);
        const b = parseInt(full.substr(4, 2), 16);
        if (isNaN(r) || isNaN(g) || isNaN(b))
        {
            return "#ffffff";
        }
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 150 ? "#000000" : "#ffffff";
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
    },
    setTime(value)
    {
        const el = document.getElementById("time-result");
        if (el)
        {
            el.textContent = value;
        }
    },
    timeField12(target, canonical, label)
    {
        const parts = canonical.split(":");
        const h24 = parseInt(parts[0], 10);
        const minute = parts[1] || "00";
        const period = h24 < 12 ? "AM" : "PM";
        let hour = h24 % 12;
        if (hour === 0)
        {
            hour = 12;
        }
        let html = "";
        html += `<div class="time-field">`;
        html += `<span class="time-field-label">${label}</span>`;
        html += `<div class="time-field-inputs">`;
        html += `<input type="number" class="time-part" data-target="${target}" id="time-${target}-hour" min="1" max="12" value="${hour}">`;
        html += `<span class="time-colon">:</span>`;
        html += `<input type="number" class="time-part" data-target="${target}" id="time-${target}-min" min="0" max="59" value="${minute}">`;
        html += `<div class="ampm-picker">`;
        for (const p of ["AM", "PM"])
        {
            const active = p === period ? " active" : "";
            html += `<button class="ampm-btn${active}" data-action="setPeriod" data-target="${target}" data-period="${p}">${p}</button>`;
        }
        html += `</div>`;
        html += `</div>`;
        html += `</div>`;
        return html;
    },
    colorGridMarkup(model)
    {
        const color = model.color;
        const landed = !!color.result && !color.picking;
        let html = "";
        for (let i = 0; i < color.options.length; i++)
        {
            let state = "";
            if (color.index === i)
            {
                state = landed ? " landed" : " lit";
            }
            html += `<div class="color-square${state}" id="color-square-${i}" style="background:${view.escape(color.options[i])}"></div>`;
        }
        return html;
    },
    setColorHighlight(index)
    {
        const squares = document.querySelectorAll(".color-square");
        squares.forEach((sq, i) =>
        {
            sq.classList.toggle("lit", i === index);
        });
    }
};
