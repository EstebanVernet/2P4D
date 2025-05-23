function createDomOperator(parent, onupdate) {
    const bg = document.createElement('img');
    bg.src = './assets/operators/elm.svg';
    bg.classList.add('operator');
    parent.appendChild(bg);

    const icon = document.createElement('img');
    icon.src = './assets/operators/add.svg';
    icon.classList.add('operator-icon');
    parent.appendChild(icon);

    const tem_box = document.getElementById("tem-box-operator")
    const clone = tem_box.content.cloneNode(true).querySelector('.box-operator');
    clone.classList.add('hidden');
    const buttons = clone.querySelectorAll('img');
    parent.appendChild(clone);

    bg.addEventListener('click', () => {
        clone.classList.toggle('hidden');
    })

    const setIcon = (iconName) => {
        icon.src = './assets/operators/' + iconName + '.svg';
        onupdate(iconName);
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            setIcon(button.dataset.operator);
            clone.classList.add('hidden');
        })
    });

    console.log(buttons)
}

LiteGraph.registerNodeType("custom/operator", DOM_NODE.new(
    [20, 20],
    function(elm) {
        // elm.properties = { value: 0 };

        // console.log(elm.container)
        // const num = createAnchorNumber(elm.container);

        createDomOperator(elm.container, (val) => {
            // console.log(val);
        })

        elm.addInput("entry1", "number");
        elm.addInput("entry2", "number");
        
        elm.addOutput("output", "number");
    }
));