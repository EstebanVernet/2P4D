LiteGraph.registerNodeType("custom/output", DOM_NODE.new(
    [128, 32],
    function(elm) {
        elm.block_delete = true;
        elm.addInput("input", "number");
        elm.container.classList.add("input-output");
        elm.setName = (inputName) => {
            elm.inputName = inputName;
            elm.container.innerHTML = inputName;
        }
    }
));