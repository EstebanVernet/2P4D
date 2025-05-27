LiteGraph.registerNodeType("custom/input", DOM_NODE.new(
    [128 + 16, 32],
    function(elm) {
        elm.block_delete = true;
        elm.addOutput("output", "number");
        elm.container.classList.add("input-output", "input");
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
