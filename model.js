const model = {
    app: document.getElementById("app"),
    currentView: "home",
    returnView: "home",
    theme: "dark",
    themes: [
        { id: "dark", name: "Dark" },
        { id: "light", name: "Light" }
    ],
    games: [
        { id: "coinflip", name: "Coin Flip" },
        { id: "magic8", name: "Magic 8-Ball" },
        { id: "dice", name: "Dice Roll" },
        { id: "wheel", name: "Decision Wheel" },
        { id: "number", name: "Pick a Number" },
        { id: "time", name: "Pick a Time" },
        { id: "color", name: "Pick a Color" }
    ],
    coin: {
        result: null,
        frame: null,
        flipping: false,
        frames: [
            "images/flip1.png",
            "images/flip2.png",
            "images/flip3.png",
            "images/flipEmpty.png"
        ],
        mode: "yesno",
        modes: [
            {
                id: "yesno",
                name: "Yes / No",
                sides: [
                    { id: "yes", label: "Yes", image: "images/flipYes.png" },
                    { id: "no", label: "No", image: "images/flipNo.png" }
                ]
            },
            {
                id: "headstails",
                name: "Heads / Tails",
                sides: [
                    { id: "heads", label: "Heads", image: "images/flipHeads.png" },
                    { id: "tails", label: "Tails", image: "images/flipTails.png" }
                ]
            }
        ]
    },
    dice: {
        count: 1,
        values: [],
        rolling: false,
        sides: 6
    },
    magic8: {
        answer: null,
        shaking: false,
        answers: [
            "It is certain.",
            "It is decidedly so.",
            "Without a doubt.",
            "Yes definitely.",
            "You may rely on it.",
            "As I see it, yes.",
            "Most likely.",
            "Outlook good.",
            "Yes.",
            "Signs point to yes.",
            "Reply hazy, try again.",
            "Ask again later.",
            "Better not tell you now.",
            "Cannot predict now.",
            "Concentrate and ask again.",
            "Don't count on it.",
            "My reply is no.",
            "My sources say no.",
            "Outlook not so good.",
            "Very doubtful."
        ]
    },
    wheel: {
        rotation: 0,
        spinning: false,
        result: null,
        editing: false,
        options: [
            { label: "Yes", color: "#8e2de2" },
            { label: "No", color: "#b14de0" },
            { label: "Maybe", color: "#6a1b9a" },
            { label: "Do it", color: "#c04dd6" },
            { label: "Skip", color: "#7b2ff7" },
            { label: "Later", color: "#9c27b0" }
        ],
        defaults: [
            { label: "Yes", color: "#8e2de2" },
            { label: "No", color: "#b14de0" },
            { label: "Maybe", color: "#6a1b9a" },
            { label: "Do it", color: "#c04dd6" },
            { label: "Skip", color: "#7b2ff7" },
            { label: "Later", color: "#9c27b0" }
        ]
    },
    number: {
        min: 1,
        max: 100,
        value: null,
        picking: false
    },
    time: {
        start: "09:00",
        end: "17:00",
        result: null,
        picking: false,
        hour12: false,
        round: false
    },
    color: {
        result: null,
        index: null,
        picking: false,
        editing: false,
        max: 50,
        options: [
            "#e74c3c", "#e67e22", "#f1c40f", "#2ecc71",
            "#1abc9c", "#3498db", "#6c5ce7", "#9b59b6",
            "#e84393", "#fd79a8", "#00b894", "#fdcb6e"
        ],
        defaults: [
            "#e74c3c", "#e67e22", "#f1c40f", "#2ecc71",
            "#1abc9c", "#3498db", "#6c5ce7", "#9b59b6",
            "#e84393", "#fd79a8", "#00b894", "#fdcb6e"
        ]
    }
};
