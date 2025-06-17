function createDomOperator(parent, onupdate) {
    const bg = document.createElement('img');
    bg.src = './assets/operators/elm.svg';
    bg.classList.add('operator');
    parent.appendChild(bg);
    this.bg = bg;

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

    this.setIcon = (iconName) => {
        icon.src = './assets/operators/' + iconName + '.svg';
        onupdate(iconName);
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            this.setIcon(button.dataset.operator);
            clone.classList.add('hidden');
        })
    });

    document.addEventListener('click', (event) => {
        if (!clone.contains(event.target) && !bg.contains(event.target)) {
            clone.classList.add('hidden');
        }
    });
}

LiteGraph.registerNodeType("custom/operator", DOM_NODE.new(
    [20, 46],
    function(elm) {
        elm.properties = {operator: "add"};

        // console.log(elm.container)
        // const num = createAnchorNumber(elm.container);

        let operator_choice = "add";
        const operatorDom = new createDomOperator(elm.container, (val) => {
            operator_choice = val;
            elm.properties.operator = val;
            elm.graph.onNodePropertyChanged();
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
                case "pow":
                    result = Math.pow(A, B);
                    break;
            }
            this.setOutputData(0, result);
        }

        elm.onConfigure = () => {
            operatorDom.setIcon(elm.properties.operator);
        }

        elm.onAdded = () => {
            operatorDom.setIcon(elm.properties.operator);
        }

        elm.checkInputs = () => {
            let error = false;
            for (let i = 0 ; i< elm.inputs.length ; i++) {
                if (elm.inputs[i].link == null) error = true;
            }
            operatorDom.bg.src = error ? './assets/operators/err.svg' : './assets/operators/elm.svg';
        }

        elm.onConnectionsChange = elm.checkInputs;
    }
));