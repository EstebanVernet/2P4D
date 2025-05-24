LiteGraph.registerNodeType("custom/input", DOM_NODE.new(
    [64, 16],
    function(elm) {
        elm.block_delete = true;
        elm.addOutput("output", "number");
        elm.container.classList.add("debug-display");
        elm.setName = (inputName) => {
            elm.inputName = inputName;
            elm.container.innerHTML = inputName;
        }
    }
));
