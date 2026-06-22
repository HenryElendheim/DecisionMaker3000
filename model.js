const model = {
    app: document.getElementById("app"),
    currentView: "home",
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
        { id: "number", name: "Pick a Number" }
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
    }
};
