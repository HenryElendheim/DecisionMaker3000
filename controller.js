const controller = {
    navigate(viewName)
    {
        model.wheel.editing = false;
        if (viewName === "coinflip")
        {
            model.coin.result = null;
            model.coin.rotation = 0;
        }
        else if (viewName === "dice")
        {
            model.dice.values = [];
            model.dice.settled = [];
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
        else if (viewName === "time")
        {
            model.time.result = null;
        }
        else if (viewName === "color")
        {
            model.color.result = null;
            model.color.index = null;
            model.color.editing = false;
        }
        model.currentView = viewName;
        view.render(model);
    },
    openSettings()
    {
        model.returnView = model.currentView;
        model.currentView = "settings";
        view.render(model);
    },
    closeSettings()
    {
        model.currentView = model.returnView;
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
        view.render(model);
    },
    toggleCoinMode()
    {
        const coin = model.coin;
        coin.mode = (coin.mode === "headstails") ? "yesno" : "headstails";
        coin.result = null;
        view.render(model);
    },
    setTimeFormat(format)
    {
        model.time.hour12 = (format === "12");
        view.render(model);
    },
    toggleTimeFormat()
    {
        model.time.hour12 = !model.time.hour12;
        view.render(model);
    },
    toggleTimeRound()
    {
        model.time.round = !model.time.round;
        view.render(model);
    },
    readTimeField(target)
    {
        const time = model.time;
        const canonical = target === "start" ? time.start : time.end;
        const hourEl = document.getElementById("time-" + target + "-hour");
        const minEl = document.getElementById("time-" + target + "-min");
        if (!hourEl || !minEl)
        {
            return canonical;
        }
        let hour = parseInt(hourEl.value, 10);
        if (isNaN(hour) || hour < 1)
        {
            hour = 12;
        }
        if (hour > 12)
        {
            hour = 12;
        }
        let minute = parseInt(minEl.value, 10);
        if (isNaN(minute) || minute < 0)
        {
            minute = 0;
        }
        if (minute > 59)
        {
            minute = 59;
        }
        const period = parseInt(canonical.split(":")[0], 10) < 12 ? "AM" : "PM";
        let h24 = hour % 12;
        if (period === "PM")
        {
            h24 += 12;
        }
        return String(h24).padStart(2, "0") + ":" + String(minute).padStart(2, "0");
    },
    updateTimeField(target)
    {
        const value = controller.readTimeField(target);
        if (target === "start")
        {
            model.time.start = value;
        }
        else
        {
            model.time.end = value;
        }
    },
    setPeriod(target, period)
    {
        controller.updateTimeField(target);
        const current = target === "start" ? model.time.start : model.time.end;
        const parts = current.split(":");
        let h24 = parseInt(parts[0], 10) % 12;
        if (period === "PM")
        {
            h24 += 12;
        }
        const value = String(h24).padStart(2, "0") + ":" + parts[1];
        if (target === "start")
        {
            model.time.start = value;
        }
        else
        {
            model.time.end = value;
        }
        view.render(model);
    },
    flip()
    {
        const coin = model.coin;
        if (coin.flipping)
        {
            return;
        }

        const mode = coin.modes.find((m) => m.id === coin.mode);
        const chosen = Math.floor(Math.random() * mode.sides.length);

        coin.flipping = true;
        coin.result = null;
        view.render(model);

        const base = Math.ceil(coin.rotation / 360) * 360;
        const target = base + 360 * 5 + (chosen === 1 ? 180 : 0);

        setTimeout(() =>
        {
            coin.rotation = target;
            view.setCoinRotation(target);
        }, 30);

        setTimeout(() =>
        {
            coin.result = mode.sides[chosen];
            coin.flipping = false;
            view.render(model);
        }, 2650);
    },
    roll()
    {
        const dice = model.dice;
        if (dice.rolling)
        {
            return;
        }

        const rollValue = () => Math.floor(Math.random() * dice.sides) + 1;

        dice.rolling = true;
        dice.values = [];
        dice.settled = [];
        for (let d = 0; d < dice.count; d++)
        {
            dice.values.push(rollValue());
            dice.settled.push(false);
        }
        view.render(model);

        const ticker = setInterval(() =>
        {
            for (let d = 0; d < dice.count; d++)
            {
                if (!dice.settled[d])
                {
                    dice.values[d] = rollValue();
                    view.setDieFace(d, dice.values[d]);
                }
            }
        }, 80);

        const minSpin = dice.count === 1 ? 1800 : 500;
        const stagger = Math.min(220, Math.floor(2000 / dice.count));
        for (let d = 0; d < dice.count; d++)
        {
            setTimeout(() =>
            {
                dice.values[d] = rollValue();
                dice.settled[d] = true;
                view.settleDie(d, dice.values[d]);
                if (dice.settled.every((s) => s))
                {
                    clearInterval(ticker);
                    dice.rolling = false;
                    view.setRolling(false);
                }
            }, minSpin + d * stagger);
        }
    },
    setDiceCount(raw)
    {
        let count = parseInt(raw, 10);
        if (isNaN(count) || count < 1)
        {
            count = 1;
        }
        if (count > model.dice.max)
        {
            count = model.dice.max;
        }
        model.dice.count = count;
        model.dice.values = [];
        model.dice.settled = [];
        view.setDiceArea(model);
    },
    setDiceMax(raw)
    {
        let value = parseInt(raw, 10);
        if (isNaN(value) || value < 10)
        {
            value = 10;
        }
        if (value > 50)
        {
            value = 50;
        }
        model.dice.max = value;
        if (model.dice.count > value)
        {
            model.dice.count = value;
            model.dice.values = [];
            model.dice.settled = [];
        }
        const out = document.getElementById("dice-max-value");
        if (out)
        {
            out.textContent = value;
        }
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
            wheel.resultColor = options[i].color;
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
    pickTime()
    {
        const time = model.time;
        if (time.picking)
        {
            return;
        }

        if (time.hour12)
        {
            controller.updateTimeField("start");
            controller.updateTimeField("end");
        }
        else
        {
            const startInput = document.getElementById("time-start");
            const endInput = document.getElementById("time-end");
            if (startInput && startInput.value)
            {
                time.start = startInput.value;
            }
            if (endInput && endInput.value)
            {
                time.end = endInput.value;
            }
        }

        const toMinutes = (t) =>
        {
            const parts = t.split(":");
            return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        };
        const toClock = (mins) =>
        {
            const h = Math.floor(mins / 60);
            const m = mins % 60;
            if (time.hour12)
            {
                const period = h < 12 ? "AM" : "PM";
                let hour = h % 12;
                if (hour === 0)
                {
                    hour = 12;
                }
                return hour + ":" + String(m).padStart(2, "0") + " " + period;
            }
            return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
        };

        let startMin = toMinutes(time.start);
        let endMin = toMinutes(time.end);
        if (startMin > endMin)
        {
            const temp = startMin;
            startMin = endMin;
            endMin = temp;
        }

        const pickMinute = () =>
        {
            if (time.round)
            {
                const quarters = [];
                const first = Math.ceil(startMin / 15) * 15;
                for (let q = first; q <= endMin; q += 15)
                {
                    quarters.push(q);
                }
                if (quarters.length > 0)
                {
                    return quarters[Math.floor(Math.random() * quarters.length)];
                }
            }
            return startMin + Math.floor(Math.random() * (endMin - startMin + 1));
        };

        time.picking = true;
        view.render(model);

        let ticks = 0;
        const timer = setInterval(() =>
        {
            ticks++;
            if (ticks < 12)
            {
                view.setTime(toClock(pickMinute()));
            }
            else
            {
                clearInterval(timer);
                time.result = toClock(pickMinute());
                time.picking = false;
                view.render(model);
            }
        }, 50);
    },
    pickColor()
    {
        const color = model.color;
        if (color.picking)
        {
            return;
        }
        const n = color.options.length;
        if (n === 0)
        {
            return;
        }

        const target = Math.floor(Math.random() * n);
        color.picking = true;
        color.result = null;
        color.index = null;
        view.render(model);

        const total = n * 2 + target;
        let i = 0;
        const step = () =>
        {
            color.index = i % n;
            view.setColorHighlight(color.index);
            i++;
            if (i > total)
            {
                color.index = target;
                color.result = color.options[target];
                color.picking = false;
                view.render(model);
                return;
            }
            const remaining = total - i;
            let delay = 40;
            if (remaining < 10)
            {
                delay = 40 + (10 - remaining) * 18;
            }
            setTimeout(step, delay);
        };
        step();
    },
    editColors()
    {
        model.color.editing = true;
        model.color.result = null;
        model.color.index = null;
        view.render(model);
    },
    doneEditingColors()
    {
        model.color.editing = false;
        view.render(model);
    },
    addColor()
    {
        const color = model.color;
        if (color.options.length >= (color.max || 50))
        {
            return;
        }
        const palette = color.defaults;
        color.options.push(palette[color.options.length % palette.length]);
        view.render(model);
        const cells = document.querySelectorAll(".color-cell-edit");
        const added = cells[cells.length - 1];
        if (added)
        {
            added.classList.add("adding");
        }
    },
    removeColor(index)
    {
        const color = model.color;
        if (color.options.length <= 2)
        {
            return;
        }
        const cells = document.querySelectorAll(".color-cell-edit");
        const cell = cells[index];
        if (cell)
        {
            cell.classList.add("removing");
            setTimeout(() =>
            {
                color.options.splice(index, 1);
                view.render(model);
            }, 180);
        }
        else
        {
            color.options.splice(index, 1);
            view.render(model);
        }
    },
    setColorMax(raw)
    {
        let value = parseInt(raw, 10);
        if (isNaN(value) || value < 50)
        {
            value = 50;
        }
        if (value > 100)
        {
            value = 100;
        }
        model.color.max = value;
        const out = document.getElementById("color-max-value");
        if (out)
        {
            out.textContent = value;
        }
    },
    resetColors()
    {
        const color = model.color;
        color.options = color.defaults.slice();
        color.result = null;
        color.index = null;
        view.render(model);
    },
    save()
    {
        try
        {
            const data = {
                theme: model.theme,
                coinMode: model.coin.mode,
                diceCount: model.dice.count,
                diceMax: model.dice.max,
                numberMin: model.number.min,
                numberMax: model.number.max,
                wheelOptions: model.wheel.options,
                timeStart: model.time.start,
                timeEnd: model.time.end,
                timeHour12: model.time.hour12,
                timeRound: model.time.round,
                colorOptions: model.color.options,
                colorMax: model.color.max
            };
            localStorage.setItem("decisionmaker", JSON.stringify(data));
        }
        catch (e)
        {
        }
    },
    load()
    {
        try
        {
            const raw = localStorage.getItem("decisionmaker");
            if (!raw)
            {
                return;
            }
            const data = JSON.parse(raw);
            if (data.theme)
            {
                model.theme = data.theme;
            }
            if (data.coinMode)
            {
                model.coin.mode = data.coinMode;
            }
            if (typeof data.diceMax === "number")
            {
                model.dice.max = Math.min(50, Math.max(10, data.diceMax));
            }
            if (typeof data.diceCount === "number")
            {
                model.dice.count = Math.min(model.dice.max, Math.max(1, data.diceCount));
            }
            if (typeof data.numberMin === "number")
            {
                model.number.min = data.numberMin;
            }
            if (typeof data.numberMax === "number")
            {
                model.number.max = data.numberMax;
            }
            if (Array.isArray(data.wheelOptions) && data.wheelOptions.length >= 2)
            {
                model.wheel.options = data.wheelOptions;
            }
            if (typeof data.timeStart === "string")
            {
                model.time.start = data.timeStart;
            }
            if (typeof data.timeEnd === "string")
            {
                model.time.end = data.timeEnd;
            }
            if (typeof data.timeHour12 === "boolean")
            {
                model.time.hour12 = data.timeHour12;
            }
            if (typeof data.timeRound === "boolean")
            {
                model.time.round = data.timeRound;
            }
            if (Array.isArray(data.colorOptions) && data.colorOptions.length >= 2)
            {
                model.color.options = data.colorOptions;
            }
            if (typeof data.colorMax === "number")
            {
                model.color.max = Math.min(100, Math.max(50, data.colorMax));
            }
        }
        catch (e)
        {
        }
    },
    init()
    {
        controller.load();
        document.documentElement.dataset.theme = model.theme;
        window.addEventListener("beforeunload", controller.save);
        document.addEventListener("visibilitychange", () =>
        {
            if (document.visibilityState === "hidden")
            {
                controller.save();
            }
        });
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
            else if (action && action.dataset.action === "setTimeFormat")
            {
                controller.setTimeFormat(action.dataset.format);
            }
            else if (action && action.dataset.action === "setPeriod")
            {
                controller.setPeriod(action.dataset.target, action.dataset.period);
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
            else if (action && action.dataset.action === "pickTime")
            {
                controller.pickTime();
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
            else if (action && action.dataset.action === "openSettings")
            {
                controller.openSettings();
            }
            else if (action && action.dataset.action === "closeSettings")
            {
                controller.closeSettings();
            }
            else if (action && action.dataset.action === "pickColor")
            {
                controller.pickColor();
            }
            else if (action && action.dataset.action === "editColors")
            {
                controller.editColors();
            }
            else if (action && action.dataset.action === "doneEditingColors")
            {
                controller.doneEditingColors();
            }
            else if (action && action.dataset.action === "addColor")
            {
                controller.addColor();
            }
            else if (action && action.dataset.action === "removeColor")
            {
                controller.removeColor(parseInt(action.dataset.index, 10));
            }
            else if (action && action.dataset.action === "resetColors")
            {
                controller.resetColors();
            }
        });

        model.app.addEventListener("input", (e) =>
        {
            const editEl = e.target.closest("[data-edit]");
            if (editEl)
            {
                const index = parseInt(editEl.dataset.index, 10);
                model.wheel.options[index][editEl.dataset.edit] = editEl.value;
                return;
            }
            const colorInput = e.target.closest(".color-input");
            if (colorInput)
            {
                const index = parseInt(colorInput.dataset.index, 10);
                model.color.options[index] = colorInput.value;
                const swatch = colorInput.closest(".color-swatch");
                if (swatch)
                {
                    swatch.style.background = colorInput.value;
                }
                return;
            }
            if (e.target.id === "dice-count")
            {
                controller.setDiceCount(e.target.value);
            }
            else if (e.target.classList.contains("time-part"))
            {
                controller.updateTimeField(e.target.dataset.target);
            }
            else if (e.target.id === "color-max")
            {
                controller.setColorMax(e.target.value);
            }
            else if (e.target.id === "dice-max")
            {
                controller.setDiceMax(e.target.value);
            }
        });

        model.app.addEventListener("change", (e) =>
        {
            if (e.target.id === "dice-count")
            {
                e.target.value = model.dice.count;
            }
            else if (e.target.id === "time-ampm")
            {
                controller.toggleTimeFormat();
            }
            else if (e.target.id === "time-round")
            {
                controller.toggleTimeRound();
            }
            else if (e.target.id === "coin-mode")
            {
                controller.toggleCoinMode();
            }
        });
        view.render(model);
    }
};

controller.init();
