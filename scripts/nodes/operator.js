function createDomOperator(parent) {
    const bg = document.createElement('img');
    bg.src = './assets/operators/elm.svg';
    bg.classList.add('operator');
    parent.appendChild(bg);
}

LiteGraph.registerNodeType("custom/operator", DOM_NODE.new(
    [20, 20],
    function(elm) {
        // elm.properties = { value: 0 };

        // console.log(elm.container)
        // const num = createAnchorNumber(elm.container);

        createDomOperator(elm.container)

        elm.addInput("entry1", "number");
        elm.addInput("entry2", "number");
        
        elm.addOutput("output", "number");
    }
));