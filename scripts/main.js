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

    graphUpdated() {
        graph._nodes.forEach(node => {
            if (node.type === this.type) {
                this.nodes[node.properties.name] = node;
            }
        })
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

const btn_save = document.getElementById("save-graph");
btn_save.addEventListener("click", () => {
    saveGraphToFile('graph.json');
});

function saveGraphToFile(filename = 'graph.json') {
    const graphData = graph.serialize();
    const graphString = JSON.stringify(graphData);
    const blob = new Blob([graphString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function loadGraph(graphData) {
    // Clear existing graph
    graph.clear();
    
    // Configure the graph with loaded data
    graph.configure(graphData);
    
    // Optionally set canvas dirty for redraw
    if (graphcanvas) {
        graphcanvas.setDirty(true, true);
    }

    if (nodes_input) {
        nodes_input.graphUpdated();
    }
    if (nodes_output) {
        nodes_output.graphUpdated();
    }

    handleWorkflowChange();
}

// Load from file input
function loadGraphFromFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const graphData = JSON.parse(e.target.result);
            loadGraph(graphData);
        } catch (error) {
            console.error('Error loading graph:', error);
        }
    };
    reader.readAsText(file);
}

const btn_load = document.getElementById("load-graph");
btn_load.addEventListener("click", () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        loadGraphFromFile(file);
    });
    fileInput.click();
});

fetch('./examples/rainbow.json')
.then(response => response.json())
.then(graphData => {
    loadGraph(graphData);
});
