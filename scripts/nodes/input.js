LiteGraph.registerNodeType("custom/input", DOM_NODE.new(
    [128, 32],
    function(elm) {
        elm.block_delete = true;
        elm.addOutput("output", "number");
        elm.container.classList.add("input-output");
        elm.setName = (inputName) => {
            elm.inputName = inputName;
            elm.container.innerHTML = inputName;
        }
    }
));
