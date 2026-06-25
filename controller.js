const controller = {
    navigate(viewName)
    {
        model.wheel.editing = false;
        if (viewName === "coinflip")
        {
            model.coin.result = null;
            model.coin.frame = null;
        }
        else if (viewName === "dice")
        {
            model.dice.value = null;
        }
        else if (viewName === "magic8")
        {
            model.magic8.answer = null;
        }
        else if (viewName === "wheel")
        {
            model.wheel.result = null;
            model.wheel.rotation = 0;
        }
        else if (viewName === "number")
        {
            model.number.value = null;
        }
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
    toggleCoinMode()
    {
        const coin = model.coin;
        coin.mode = (coin.mode === "headstails") ? "yesno" : "headstails";
        coin.result = null;
        coin.frame = null;
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
    roll()
    {
        const dice = model.dice;
        if (dice.rolling)
        {
            return;
        }

        dice.rolling = true;
        dice.value = Math.floor(Math.random() * dice.sides) + 1;
        view.render(model);

        let ticks = 0;
        const timer = setInterval(() =>
        {
            ticks++;
            if (ticks < 10)
            {
                dice.value = Math.floor(Math.random() * dice.sides) + 1;
                view.setDie(dice.value);
            }
            else
            {
                clearInterval(timer);
                dice.value = Math.floor(Math.random() * dice.sides) + 1;
                dice.rolling = false;
                view.render(model);
            }
        }, 60);
    },
    ask()
    {
        const magic8 = model.magic8;
        if (magic8.shaking)
        {
            return;
        }
        magic8.shaking = true;
        magic8.answer = null;
        view.render(model);

        setTimeout(() =>
        {
            const answers = magic8.answers;
            magic8.answer = answers[Math.floor(Math.random() * answers.length)];
            magic8.shaking = false;
            view.render(model);
        }, 900);
    },
    spin()
    {
        const wheel = model.wheel;
        if (wheel.spinning)
        {
            return;
        }

        const options = wheel.options;
        const seg = 360 / options.length;
        const i = Math.floor(Math.random() * options.length);
        const centerAngle = i * seg + seg / 2;
        const targetMod = (360 - centerAngle) % 360;
        const currentMod = ((wheel.rotation % 360) + 360) % 360;
        let delta = targetMod - currentMod;
        if (delta < 0)
        {
            delta += 360;
        }
        const newRotation = wheel.rotation + 360 * 5 + delta;

        wheel.spinning = true;
        wheel.result = null;
        view.render(model);

        setTimeout(() =>
        {
            wheel.rotation = newRotation;
            view.setWheelRotation(newRotation);
        }, 30);

        setTimeout(() =>
        {
            wheel.result = options[i].label;
            wheel.spinning = false;
            view.render(model);
        }, 3700);
    },
    editWheel()
    {
        model.wheel.editing = true;
        model.wheel.result = null;
        view.render(model);
    },
    doneEditing()
    {
        model.wheel.editing = false;
        view.render(model);
    },
    addOption()
    {
        const wheel = model.wheel;
        if (wheel.options.length >= 8)
        {
            return;
        }
        const palette = ["#8e2de2", "#b14de0", "#6a1b9a", "#c04dd6", "#7b2ff7", "#9c27b0", "#5b1e9e", "#a236c9"];
        wheel.options.push({ label: "New", color: palette[wheel.options.length % palette.length] });
        view.render(model);
    },
    removeOption(index)
    {
        const wheel = model.wheel;
        if (wheel.options.length <= 2)
        {
            return;
        }
        wheel.options.splice(index, 1);
        view.render(model);
    },
    resetWheel()
    {
        const wheel = model.wheel;
        wheel.options = wheel.defaults.map((o) => ({ label: o.label, color: o.color }));
        wheel.result = null;
        wheel.rotation = 0;
        view.render(model);
    },
    pick()
    {
        const number = model.number;
        if (number.picking)
        {
            return;
        }

        const minInput = document.getElementById("num-min");
        const maxInput = document.getElementById("num-max");
        let min = parseInt(minInput.value, 10);
        let max = parseInt(maxInput.value, 10);
        if (isNaN(min))
        {
            min = 1;
        }
        if (isNaN(max))
        {
            max = 100;
        }
        if (min > max)
        {
            const temp = min;
            min = max;
            max = temp;
        }
        number.min = min;
        number.max = max;
        number.picking = true;
        view.render(model);

        let ticks = 0;
        const timer = setInterval(() =>
        {
            ticks++;
            if (ticks < 12)
            {
                number.value = Math.floor(Math.random() * (max - min + 1)) + min;
                view.setNumber(number.value);
            }
            else
            {
                clearInterval(timer);
                number.value = Math.floor(Math.random() * (max - min + 1)) + min;
                number.picking = false;
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
            else if (action && action.dataset.action === "toggleCoinMode")
            {
                controller.toggleCoinMode();
            }
            else if (action && action.dataset.action === "roll")
            {
                controller.roll();
            }
            else if (action && action.dataset.action === "ask")
            {
                controller.ask();
            }
            else if (action && action.dataset.action === "spin")
            {
                controller.spin();
            }
            else if (action && action.dataset.action === "pick")
            {
                controller.pick();
            }
            else if (action && action.dataset.action === "editWheel")
            {
                controller.editWheel();
            }
            else if (action && action.dataset.action === "doneEditing")
            {
                controller.doneEditing();
            }
            else if (action && action.dataset.action === "addOption")
            {
                controller.addOption();
            }
            else if (action && action.dataset.action === "removeOption")
            {
                controller.removeOption(parseInt(action.dataset.index, 10));
            }
            else if (action && action.dataset.action === "resetWheel")
            {
                controller.resetWheel();
            }
        });

        model.app.addEventListener("input", (e) =>
        {
            const el = e.target.closest("[data-edit]");
            if (el)
            {
                const index = parseInt(el.dataset.index, 10);
                model.wheel.options[index][el.dataset.edit] = el.value;
            }
        });
        view.render(model);
    }
};

controller.init();
