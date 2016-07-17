// Customizations and utilities
Array.prototype.randomElement = function(){
  return this[Math.floor(Math.random()*this.length)];
}

function debug(args, rating) {
    var level = 0;
    if (!rating || (rating <= level)) {
        console.log(args);
    }
}

// ----------------
// Grammar Class
// ----------------

// Creates a grammar object from a JSON containing a dictionary mapping non-terminals to expressions or non-terminals
// The base symbol must be "_"
var Grammar = function(grammarJSON, nameOfInitialSymbol) {
    this.grammarJSON = grammarJSON;
    this.initial = nameOfInitialSymbol;
    if (!grammarJSON[this.initial]) {
        throw nameOfInitialSymbol + " must be a valid non-terminal in the grammar for it to be usable";
    }
}

Grammar.prototype.generateOne = function(string) {
    var current = string;
    if (typeof current == 'undefined') {
        current = this.initial;
    }
    debug("generateOne(" + current + "):", 1);

    // if the current token is already a non-terminal, return it
    if (!this.contains(current)) {
        return current;
    }
    //otherwise, pick a random value, split it up, recurse and concatenate
    var options = this.grammarJSON[current];
    var option = options.randomElement();
    debug("\tselected " + option + " from " + options, 1);
    var parts = option.split(" ");

    var result = this.generateOne(parts[0]);
    for (var i = 1; i < parts.length; i++) {
        result += " " + this.generateOne(parts[i]);
    }

    return result;
}

Grammar.prototype.contains = function(string) {
    return !(typeof this.grammarJSON[string] == 'undefined');
}

Grammar.prototype.generate = function(howMany) {
    var strings = [];
    for (var i = 0; i < howMany; i++) {
        strings[i] = this.generateOne();
    }
    return strings;
}

// ----------------
// Displayer Class
// ----------------

var emojiDisplayer = function(grammar, countInput, displayContainer) {
    this.generator = grammar;
    this.howManyInput = countInput;
    this.displayContainer = displayContainer;
}

emojiDisplayer.prototype.display = function() {
    this.clear();
    var emoji = this.generator.generate(this.howManyInput.value);
    for (var i = 0; i < emoji.length; i++) {
        debug("----------------", 1);
        var li = document.createElement("li");
        li.textContent = emoji[i];
        this.displayContainer.appendChild(li);
    }
}

emojiDisplayer.prototype.clear = function() {
    var current = this.displayContainer.firstChild;
    while (current) {
        this.displayContainer.removeChild(current);
        current = this.displayContainer.firstChild;
    }
}

// ----------------
// Setup
// ----------------

function init() {
    // Configuration
    debug("Running init...")
    var displayer = new emojiDisplayer(
        new Grammar({
            "emoji" : ["eh" , "et" , "ef"],
            "eh" : ["( ef )", "[ ef ]", "༼ ef  ༽"],
            "et" : ["el eh er", "d( ef )b", "b( ef )d", "(っ ef ς)"],
            "ef" : ["^ em ^", "• em •", "o em o", "O em O", "> em <", "x em x", "' em '", "; em ;", ": em :", "- em -", "* em *", "´ em ´", "~ em ~", "• em <", "> em •", "ಠ em ಠ", "¬ em ¬", "￣ em ￣", "ಥ em ಥ", "ʘ em ʘ", "◎  em ◎", "•́ em •̀", "T em T", "⌒ em ⌒", " ˃̶ em ˂̶", "ര em ര", "⇀ em ⇀", "╥ em ╥", "´ em ´", "˘ em ˘", "❛ em ❛", "৺ em ৺", "୨ em ୧"],
            "em" : ["_", ".", "__", "д", "w", "-", ",", "////", "皿", "益", "人", "﹏", "ㅿ", "□", "ʖ", "ᴗ", "ㅂ", "▂", "ᴥ", "〜", "∀", "ﾛ", "▿▿▿▿", "ヮ", "ڡ", "︿", "‸", "ϖ", "˫", "֊", "෴"],
            "el" : ["\\", "c", "┗", "ヽ", "〜", "┌", "ヾ", "＼"],
            "er" : ["/", "7", "~", "┛", "ﾉ", "〜", "┘", "⊃", "ง", "ゞ", "ﾉ*:･ﾟ✧", "乂 eh ﾉ", "❤ eh"]
        }, "emoji"),
        document.getElementById("howMany"),
        document.getElementById("emoji")
    );
    debug("displayer is..." + displayer)
    debug("displayer.generator is..." + displayer.generator);
    debug("displayer.howManyInput is..." + displayer.howManyInput);
    debug("displayer.displayContainer is..." + displayer.displayContainer);
    // Event binding
    document.getElementById("generate").addEventListener("click", function() {
        displayer.display();
    });
    document.getElementById("howMany").addEventListener("input", function() {
        if (this.value == this.max) {
            document.getElementById("soManyMessage").style.display = "block";
        } else {
            document.getElementById("soManyMessage").style.display = "none";
        }
    });
    // <div id="soMany">
    //
    // </div>
    // Generate the first emoji
    displayer.display();
}

window.onload = init;
