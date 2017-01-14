"use strict";

var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

// Customizations and utilities
Array.prototype.randomElement = function() {
    return this[Math.floor(Math.random() * this.length)];
};

function debug(args) {
    var rating = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    var level = 0;
    if (rating < level) {
        console.log(args);
    }
}

// A context-free grammar with functions to generate random, valid instances
// of the language

var Grammar = function() {
    function Grammar(grammarJSON, nameOfInitialSymbol) {
        _classCallCheck(this, Grammar);

        // Throw exception if nameOfInitialSymbol is not present in grammar
        if (!(nameOfInitialSymbol in grammarJSON)) {
            throw nameOfInitialSymbol + " must be a valid non-terminal in the grammar for it to be usable";
        }

        this.grammarJSON = grammarJSON;
        this.initial = nameOfInitialSymbol;
    }

    _createClass(Grammar, [{
        key: "generateOne",
        value: function generateOne() {
            var current = arguments.length <= 0 || arguments[0] === undefined ? this.initial : arguments[0];

            debug("generateOne(" + current + ")", 1);

            // if the current token is already a non-terminal, return it
            if (!(current in this.grammarJSON)) {
                return current;
            }

            // otherwise, pick a random expresssion for the current token
            var options = this.grammarJSON[current];
            var option = options.randomElement();
            debug("\tselected " + option + " from " + options, 1);

            // split it up, recurse on each part, and concatenate the results
            var parts = option.split(" ");
            var result = this.generateOne(parts[0]);
            for (var i = 1; i < parts.length; i++) {
                result += " " + this.generateOne(parts[i]);
            }
            return result;
        }
    }, {
        key: "generate",
        value: function generate(howMany) {
            var strings = [];
            for (var i = 0; i < howMany; i++) {
                var result = this.generateOne();
                while (strings.includes(result)) {
                    debug("skipped duplicate of " + result);
                    result = this.generateOne();
                }
                debug("Received generated string " + result + " from grammar");
                strings.push(result);
            }
            return strings;
        }
    }]);

    return Grammar;
}();

// Generates list items containing countInput.value instances from the given grammar
// and appends them to displayContainer


var GrammarDisplayer = function() {
    function GrammarDisplayer(grammar, countInput, displayContainer) {
        _classCallCheck(this, GrammarDisplayer);

        if (!(grammar && countInput && displayContainer)) {
            throw "arguments to constructor cannot be undefined";
        }
        this.generator = grammar;
        this.howManyInput = countInput;
        this.displayContainer = displayContainer;
    }

    _createClass(GrammarDisplayer, [{
        key: "display",
        value: function display() {
            this.clear();
            debug("Generating " + this.howMany() + " strings");
            var strings = this.generator.generate(this.howMany());
            debug("Displaying the following strings: " + strings);
            for (var i = 0; i < strings.length; i++) {
                debug("----------------", 1);
                var li = document.createElement("li");
                li.textContent = strings[i];
                this.displayContainer.appendChild(li);
            }
        }
    }, {
        key: "howMany",
        value: function howMany() {
            return this.howManyInput.value;
        }
    }, {
        key: "clear",
        value: function clear() {
            var current = this.displayContainer.firstChild;
            while (current) {
                this.displayContainer.removeChild(current);
                current = this.displayContainer.firstChild;
            }
        }
    }]);

    return GrammarDisplayer;
}();

// Setup

function init() {
    // Configuration
    var displayer = new GrammarDisplayer(new Grammar({
        "kaomoji": ["head", "bracketed_head", "symmetrically_armed_head", "face"],
        "head": ["( face )", "[ face ]", "༼ face  ༽"],
        "bracketed_head": ["left_arm head right_arm"],
        "symmetrically_armed_head": ["d( face )b", "(╯ face )╯", "(っ face ς)", "ᕕ( face )ᕗ", "(つ face )つ",
            "ᕦ( face )ᕤ", "(づ face )づ"
        ],
        "face": ["^ mouth ^", "• mouth •", "o mouth o", "O mouth O", "> mouth <", "x mouth x",
            "' mouth '", "; mouth ;", " ̿ mouth  ̿", "- mouth -", "* mouth *", "´ mouth ´",
            "~ mouth ~", "• mouth <", "> mouth •", "ಠ mouth ಠ", "¬ mouth ¬", "￣ mouth ￣",
            "ಥ mouth ಥ", "ʘ mouth ʘ", "◎  mouth ◎", "•́ mouth •̀", "T mouth T", "⌒ mouth ⌒",
            " ˃̶ mouth ˂̶", "ര mouth ര", "⇀ mouth ⇀", "╥ mouth ╥", "´ mouth ´",
            "˘ mouth ˘", "❛ mouth ❛", "৺ mouth ৺", "୨ mouth ୧", "눈 mouth 눈",
            "° mouth °", "⌐■ mouth ■", "≖ mouth ≖", "•̀ mouth •́", "◕ mouth ◕", "⊙ mouth ☉",
            "ᗒ mouth ᗕ", " ͒  mouth ͒  ", "´･ mouth ･`"
        ],
        "mouth": ["_", ".", "__", "д", "ω", "-", ",", "////", "皿", "益", "人",
            "﹏", "ㅿ", "□", "ʖ", "ᴗ", "ㅂ", "▂", "ᴥ", "〜", "∀", "ﾛ",
            "▿▿▿▿", "ヮ", "ڡ", "︿", "‸", "ϖ", "˫", "֊", "෴", "³", "ᗣ"
        ],
        "left_arm": ["\\", "c", "┗", "ヽ", "〜", "┌", "ヾ", "＼"],
        "right_arm": ["/", "7", "~", "┛", "ﾉ", "〜", "┘", "⊃", "ง", "ゞ", "ﾉ*:･ﾟ✧",
            "乂 head ﾉ", "❤ head", "و"
        ]
    }, "kaomoji"), document.getElementById("howMany"), document.getElementById("display"));

    // Event binding
    document.getElementById("generate").addEventListener("click", function() {
        displayer.display();
    });

    // Easter egg display for maximum value of the input field
    document.getElementById("howMany").addEventListener("input", function() {
        if (this.value == this.max) {
            document.getElementById("soManyMessage").style.display = "block";
        } else {
            document.getElementById("soManyMessage").style.display = "none";
        }
    });

    // Initial generation
    displayer.display();
}

window.onload = init;
