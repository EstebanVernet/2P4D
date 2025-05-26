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
    { name: "Index", x: 200, y: 300 },
    { name: "Vertical pos.", x: 200, y: 350 },
    { name: "Horizontal pos.", x: 200, y: 400 }
]);

const nodes_output = new staticNodes("custom/output", [
    { name: "Vertical offset", x: 700, y: 300 },
    { name: "Horizontal offset", x: 700, y: 350 },
    
    { name: "Width", x: 700, y: 400 },
    { name: "Height", x: 700, y: 450 },

    { name: "Color", x: 700, y: 500 }
]);

// var input_index = LiteGraph.createNode("custom/input");
// input_index.pos = [200, 300];
// input_index.setName("index");
// graph.add(input_index);

// var output_size = LiteGraph.createNode("custom/output");
// output_size.pos = [700, 300];
// output_size.setName("size");
// graph.add(output_size);

graph.start();

graph.onNodeAdded = handleWorkflowChange
graph.onNodeRemoved = handleWorkflowChange
graph.onConnectionChange = handleWorkflowChange
graph.onNodePropertyChanged = handleWorkflowChange