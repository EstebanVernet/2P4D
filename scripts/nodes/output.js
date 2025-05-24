LiteGraph.registerNodeType("custom/output", DOM_NODE.new(
    [64, 16],
    function(elm) {
        elm.block_delete = true;
        elm.addInput("input", "number");
        elm.container.classList.add("debug-display");
        elm.setName = (inputName) => {
            elm.inputName = inputName;
            elm.container.innerHTML = inputName;
        }
    }
));