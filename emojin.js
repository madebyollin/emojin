// Customizations and utilities
Array.prototype.randomElement = function(){
  return this[Math.floor(Math.random() * this.length)];
}

function debug(args, rating = 0) {
    const level = 0;
    if (rating < level) {
        console.log(args);
    }
}

// A context-free grammar with functions to generate random, valid instances
// of the language
class Grammar {
    constructor(grammarJSON, nameOfInitialSymbol) {
        // Throw exception if nameOfInitialSymbol is not present in grammar
        if (!(nameOfInitialSymbol in grammarJSON)) {
            throw nameOfInitialSymbol + " must be a valid non-terminal in the grammar for it to be usable";
        }

        this.grammarJSON = grammarJSON;
        this.initial = nameOfInitialSymbol;
    }

    generateOne(current = this.initial) {
        debug(`generateOne(${current})`, 1);

        // if the current token is already a non-terminal, return it
        if (!(current in this.grammarJSON)) {
            return current;
        }

        // otherwise, pick a random expresssion for the current token
        const options = this.grammarJSON[current];
        const option = options.randomElement();
        debug(`\tselected ${option} from ${options}`, 1);

        // split it up, recurse on each part, and concatenate the results
        const parts = option.split(" ");
        let result = this.generateOne(parts[0]);
            for (let i = 1; i < parts.length; i++) {
               result += " " + this.generateOne(parts[i]);
            }
        return result;
    }

    generate(howMany) {
        const strings = [];
        for (let i = 0; i < howMany; i++) {
            let result = this.generateOne();
            while (strings.includes(result)) {
                debug(`skipped duplicate of ${result}`);
                result = this.generateOne();
            }
            debug(`Received generated string ${result} from grammar`);
            strings.push(result);
        }
        return strings;
    }
}

// Generates list items containing countInput.value instances from the given grammar
// and appends them to displayContainer
class GrammarDisplayer {
    constructor(grammar, countInput, displayContainer) {
        if (!( grammar && countInput && displayContainer)) {
            throw "arguments to constructor cannot be undefined";
        }
        this.generator = grammar;
        this.howManyInput = countInput;
        this.displayContainer = displayContainer;
    }

    display() {
        var self = this;
        this.generator.generate(this.howMany()).map((string) =>
            const li = document.createElement("li");
            li.textContent = string;
            self.displayContainer.appendChild(li);
        );
    }

    howMany() {
        return this.howManyInput.value;
    }

    clear() {
        let current = this.displayContainer.firstChild;
        while (current) {
            this.displayContainer.removeChild(current);
            current = this.displayContainer.firstChild;
        }
    }
}

// Setup

function init() {
    // Configuration
    const displayer = new GrammarDisplayer(
        new Grammar({
            "kaomoji" : ["head" , "bracketed_head", "symmetrically_armed_head" , "face"],
            "head" : ["( face )", "[ face ]", "༼ face  ༽"],
            "bracketed_head": ["left_arm head right_arm"],
            "symmetrically_armed_head" : ["d( face )b", "(╯ face )╯", "(っ face ς)", "ᕕ( face )ᕗ","(つ face )つ",
                    "ᕦ( face )ᕤ", "(づ face )づ"],
            "face" : ["^ mouth ^", "• mouth •", "o mouth o", "O mouth O", "> mouth <", "x mouth x",
                    "' mouth '", "; mouth ;", " ̿ mouth  ̿", "- mouth -", "* mouth *", "´ mouth ´",
                    "~ mouth ~", "• mouth <", "> mouth •", "ಠ mouth ಠ", "¬ mouth ¬", "￣ mouth ￣",
                    "ಥ mouth ಥ", "ʘ mouth ʘ", "◎  mouth ◎", "•́ mouth •̀", "T mouth T", "⌒ mouth ⌒",
                    " ˃̶ mouth ˂̶", "ര mouth ര", "⇀ mouth ⇀", "╥ mouth ╥", "´ mouth ´",
                    "˘ mouth ˘", "❛ mouth ❛", "৺ mouth ৺", "୨ mouth ୧", "눈 mouth 눈",
                    "° mouth °", "⌐■ mouth ■", "≖ mouth ≖", "•̀ mouth •́", "◕ mouth ◕", "⊙ mouth ☉",
                    "ᗒ mouth ᗕ", " ͒  mouth ͒  ", "´･ mouth ･`"],
            "mouth" : ["_", ".", "__", "д", "ω", "-", ",", "////", "皿", "益", "人",
                    "﹏", "ㅿ", "□", "ʖ", "ᴗ", "ㅂ", "▂", "ᴥ", "〜", "∀", "ﾛ",
                    "▿▿▿▿", "ヮ", "ڡ", "︿", "‸", "ϖ", "˫", "֊", "෴", "³", "ᗣ"],
            "left_arm" : ["\\", "c", "┗", "ヽ", "〜", "┌", "ヾ", "＼"],
            "right_arm" : ["/", "7", "~", "┛", "ﾉ", "〜", "┘", "⊃", "ง", "ゞ", "ﾉ*:･ﾟ✧",
                    "乂 head ﾉ", "❤ head", "و"]
        }, "kaomoji"),
        document.getElementById("howMany"),
        document.getElementById("display")
    );

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
