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

}

LiteGraph.registerNodeType("custom/operator", DOM_NODE.new(
    [20, 46],
    function(elm) {
        // elm.properties = { value: 0 };

        // console.log(elm.container)
        // const num = createAnchorNumber(elm.container);

        let operator_choice = "add";
        createDomOperator(elm.container, (val) => {
            operator_choice = val;
        })

        elm.addInput("entry1", "number");
        elm.addInput("entry2", "number");
        elm.addOutput("output", "number");

        elm.onExecute = function() {
            const A = elm.getInputData(0) ? elm.getInputData(0) : 0;
            const B = elm.getInputData(1) ? elm.getInputData(1) : 0;
            let result = 0;
            switch (operator_choice) {
                case "add":
                    result = A + B;
                    break;
                case "sub":
                    result = A - B;
                    break;
                case "mult":
                    result = A * B;
                    break;
                case "div":
                    if (B === 0) {
                        result = A;
                        break;
                    }
                    result = A / B;
                    break;
                case "mod":
                    result = A % B;
                    break;
            }
            this.setOutputData(0, result);
        }
    }
));