LiteGraph.registerNodeType("custom/output", DOM_NODE.new(
    [128 + 16, 32],
    function(elm) {
        elm.block_delete = true;
        elm.addInput("input", "number");
        elm.container.classList.add("input-output", "output");
        elm.setName = (inputName) => {
            elm.inputName = inputName;
            elm.container.innerHTML = inputName;
            elm.properties = {name: inputName};
        }

        elm.onConfigure = () => {
            elm.setName(elm.properties.name);
        }
    }
));