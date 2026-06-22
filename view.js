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
    }
};
