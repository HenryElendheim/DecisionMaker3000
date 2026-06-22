const controller = {
    navigate(viewName)
    {
        model.currentView = viewName;
        view.render(model);
    },
    setTheme(themeId)
    {
        model.theme = themeId;
        document.documentElement.dataset.theme = themeId;
        view.render(model);
    },
    setCoinMode(modeId)
    {
        model.coin.mode = modeId;
        model.coin.result = null;
        model.coin.frame = null;
        view.render(model);
    },
    flip()
    {
        const coin = model.coin;
        if (coin.flipping)
        {
            return;
        }

        const f = coin.frames;
        const sequence = [
            f[3], f[2], f[1], f[0],
            f[1], f[2], f[3],
            f[2], f[1], f[0],
            f[1], f[2], f[3],
            f[2], f[1], f[0],
            f[1], f[2], f[3],
        ];

        coin.flipping = true;
        coin.result = null;
        coin.frame = sequence[0];
        view.render(model);

        let i = 0;
        const timer = setInterval(() =>
        {
            i++;
            if (i < sequence.length)
            {
                coin.frame = sequence[i];
                view.setCoinFrame(coin.frame);
            }
            else
            {
                clearInterval(timer);
                const mode = coin.modes.find((m) => m.id === coin.mode);
                const sides = mode.sides;
                const index = Math.floor(Math.random() * sides.length);
                coin.result = sides[index];
                coin.frame = null;
                coin.flipping = false;
                view.render(model);
            }
        }, 50);
    },
    preload()
    {
        const coin = model.coin;
        let sources = coin.frames.slice();
        for (const mode of coin.modes)
        {
            sources = sources.concat(mode.sides.map((side) => side.image));
        }
        for (const src of sources)
        {
            const img = new Image();
            img.src = src;
        }
    },
    init()
    {
        controller.preload();
        document.documentElement.dataset.theme = model.theme;
        model.app.addEventListener("click", (e) =>
        {
            const nav = e.target.closest("[data-nav]");
            if (nav)
            {
                controller.navigate(nav.dataset.nav);
                return;
            }

            const action = e.target.closest("[data-action]");
            if (action && action.dataset.action === "flip")
            {
                controller.flip();
            }
            else if (action && action.dataset.action === "setTheme")
            {
                controller.setTheme(action.dataset.theme);
            }
            else if (action && action.dataset.action === "setCoinMode")
            {
                controller.setCoinMode(action.dataset.mode);
            }
        });
        view.render(model);
    }
};

controller.init();
