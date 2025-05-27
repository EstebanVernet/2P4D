// import TOOLBAR from './toolbar.js';

class staticNodes {
    constructor(type, list) {
        this.type = type;
        this.list = list;
        this.nodes = {};
        this.list.forEach(node => {
            this.add(node.name, node.x, node.y);
        })
    }

    add(name, x, y) {
        const n = LiteGraph.createNode(this.type);
        n.pos = [x, y];
        n.setName(name);
        graph.add(n);
        this.nodes[name] = n;
    }

    getValue(name) {
        return this.nodes[name].getInputData(0);
    }

    setValue(name, value) {
        this.nodes[name].properties.value = value;
        this.nodes[name].onExecute();
    }
}

const nodes_input = new staticNodes("custom/input", [
    { name: "Index", x: 50, y: 150 },
    { name: "Vertical pos.", x: 50, y: 200 },
    { name: "Horizontal pos.", x: 50, y: 250 }
]);

const nodes_output = new staticNodes("custom/output", [
    { name: "Vertical offset", x: 950, y: 150 },
    { name: "Horizontal offset", x: 950, y: 200 },
    
    { name: "Width", x: 950, y: 300 },
    { name: "Height", x: 950, y: 350 },

    { name: "Hue", x: 950, y: 450 },
    { name: "Saturation", x: 950, y: 500 },
    { name: "Value", x: 950, y: 550 },
]);

// var input_index = LiteGraph.createNode("custom/bezierfunc");
// input_index.pos = [200, 300];
// graph.add(input_index);

// var output_size = LiteGraph.createNode("custom/color");
// output_size.pos = [400, 300];
// graph.add(output_size);

graph.start();

graph.onNodeAdded = handleWorkflowChange
graph.onNodeRemoved = handleWorkflowChange
graph.onConnectionChange = handleWorkflowChange
graph.onNodePropertyChanged = handleWorkflowChange