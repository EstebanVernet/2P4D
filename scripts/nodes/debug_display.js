LiteGraph.registerNodeType("custom/debug_display", DOM_NODE.new(
    [128, 64],
    function(elm) {
        elm.container.classList.add("debug-display");

        elm.addInput("val_input", "number");
        elm.addOutput("val_output", "number");

        elm.onExecute = function() {
            var input_value = this.getInputData(0);
            if (input_value === undefined) input_value = 0;
            elm.container.innerHTML = input_value;
            this.setOutputData(0, input_value);
        }
    }
));
