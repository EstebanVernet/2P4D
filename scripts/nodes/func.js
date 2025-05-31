const FUNCNODE = {};

FUNCNODE.list = {};

FUNCNODE.addfunction = function(name, inputs, func) {
    FUNCNODE.list[name] = { input_count: inputs, func: func };

    // Add to form
    const clone = FUNCNODE.templateItem.content.cloneNode(true);
    clone.querySelector('.title').innerHTML = name;

    clone.querySelector('.func-item').dataset.fname = name;

    FUNCNODE.createPreview(name, clone.querySelector('.plot'));

    FUNCNODE.form.appendChild(clone);   
}

FUNCNODE.createPreview = function(name, parent) {
    const svgElement = SVG().addTo(parent).size(128, 24);
    const values = FUNCNODE.plot(FUNCNODE.list[name].func, FUNCNODE.list[name].input_count);

    // console.log(values)
    
    const highest = Math.max(...values);
    const lowest = Math.min(...values);

    // console.log(highest, lowest);

    let points = [];
    for (let i = 0; i < values.length; i++) {
        const x = map(i, 0, values.length, 0, 128);
        const y = map(values[i], lowest, highest, 24, 0);
        points.push([x, y]);
    }

    let nodePoints = [];
    for (let i = 0; i < values.length; i++) {
        const x = map(i, 0, values.length, 0, 128);
        const y = map(values[i], lowest, highest, 32, 0);
        nodePoints.push([x, y]);
    }

    FUNCNODE.list[name].points = nodePoints;

    svgElement.polyline(points).stroke({ width: 1 });

    return svgElement;
}

FUNCNODE.plot = function(f, count) {
    const values = [];
    for (let i = -5 ; i<= 5 ; i+=0.05) {    
        if (count == 1) {
            values.push(f(i));
        } else if (count == 2) {
            values.push(f(i, 0));
        } else if (count == 3) {
            values.push(f(i, 0, 0));
        }
    }
    return values;
}

FUNCNODE.form = document.getElementById("popup-funcs");
FUNCNODE.templateItem = document.getElementById("tem-func-item");

FUNCNODE.selectFunction = function(x, y) {
    return new Promise((resolve, reject) => {
        FUNCNODE.form.classList.add("show");
        FUNCNODE.form.style.left = `${constrain(x, 0, window.innerWidth - FUNCNODE.form.offsetWidth)}px`;
        FUNCNODE.form.style.top = `${constrain(y, 0, window.innerHeight - FUNCNODE.form.offsetHeight)}px`;

        const eventFunction = (e) => { 
            e.preventDefault();
            const target = e.currentTarget;
            if (target.dataset.fname) {
                resolve(target.dataset.fname);
            } else {
                reject();
            }
            FUNCNODE.form.classList.remove("show");
            FUNCNODE.form.querySelectorAll('.func-item').forEach(item => {
                item.removeEventListener("click", eventFunction);
            });
        };

        FUNCNODE.form.querySelectorAll('.func-item').forEach(item => {
            item.addEventListener("click", eventFunction);
        });

        document.addEventListener("click", (e) => {
            if (!FUNCNODE.form.contains(e.target)) {
                reject();
                FUNCNODE.form.classList.remove("show");
                FUNCNODE.form.querySelectorAll('.func-item').forEach(item => {
                    item.removeEventListener("click", eventFunction);
                });
            }
        }, { once: true });
    });
}

FUNCNODE.addfunction("Sinus", 1, function(x) { return Math.sin(x); });
FUNCNODE.addfunction("Cosinus", 1, function(x) { return Math.cos(x); });
FUNCNODE.addfunction("Tangens", 1, function(x) { return Math.tan(x); });
FUNCNODE.addfunction("Maximum", 2, function(x, y) { return Math.max(x, y); });
FUNCNODE.addfunction("Minimum", 2, function(x, y) { return Math.min(x, y); });
FUNCNODE.addfunction("Positive", 1, function(x) { return Math.abs(x); });
FUNCNODE.addfunction("Noise", 2, function(x, y) { return noise.simplex2(x, y); });

LiteGraph.registerNodeType("custom/func", DOM_NODE.new(
    [128, 32],
    function(elm) {
        elm.container.classList.add("node-func");
        elm.properties = { f: "Noise" };

        elm.addInput("val_input", "number");
        elm.addOutput("val_output", "number");

        const svgElement = SVG().addTo(elm.container).size(128, 32);

        elm.changeFunction = (name) => {
            const f = FUNCNODE.list[name];
            elm.properties.f = name;
            const el = svgElement.findOne('.func_plot');
            if (el) el.remove();
            svgElement.polyline(f.points).stroke({ width: 1 }).attr({ class: 'func_plot' });
    
            const input_count = FUNCNODE.list[name].input_count;
            while (elm.inputs.length < input_count) {
                elm.addInput("val_input", "number");
            }
            while (elm.inputs.length > input_count) {
                elm.removeInput(elm.inputs.length - 1);
            }
        }

        elm.container.addEventListener("click", (e) => {
            e.stopPropagation();
            FUNCNODE.selectFunction(e.clientX, e.clientY).then((name) => {
                elm.changeFunction(name);
                if (elm.graph) {
                    elm.graph.onNodePropertyChanged();
                }
            })
            .catch(() => {});
        });

        elm.onConfigure = () => {
            elm.changeFunction(elm.properties.f);
        }

        elm.onAdded = () => {
            elm.changeFunction(elm.properties.f);
        }

        elm.onExecute = () => {
            const f = FUNCNODE.list[elm.properties.f].func;
            const out = f(...elm.inputs.map((x, index) => elm.getInputData(index)));
            elm.setOutputData(0, out);
        }
    }
));

// var output_size = LiteGraph.createNode("custom/func");
// output_size.pos = [400, 300];
// graph.add(output_size);
