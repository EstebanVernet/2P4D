// import TOOLBAR from './toolbar.js';

class staticNodes {
    constructor(type, list) {
        this.type = type;
        this.list = list;
        this.nodes = {};
        this.list.forEach(node => {
           this.add(node.name, node.x, node.y, node.indicator);
        })
    }

    add(name, x, y, indicator) {
        const n = LiteGraph.createNode(this.type);
        n.pos = [x, y];
        n.setName(name);
        graph.add(n);
        this.nodes[name] = n;
        if (indicator) n.setIndicator(indicator);
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
                if (node.inputName == "Index") {
                    graph.remove(node);
                } else {
                    this.nodes[node.properties.name] = node;
                    if (this.list.find(x => x.name === node.properties.name).indicator) node.setIndicator(this.list.find(x => x.name === node.properties.name).indicator);
                }
            }
        })
    }
}

const nodes_input = new staticNodes("custom/input", [
    // { name: "Index", x: 50, y: 150 },
    { name: "Vertical pos.", x: 50, y: 200 },
    { name: "Horizontal pos.", x: 50, y: 250 }
]);

const nodes_output = new staticNodes("custom/output", [
    { name: "Vertical offset", x: 950, y: 150, indicator: (t) => {return {y: t}} },
    { name: "Horizontal offset", x: 950, y: 200, indicator: (t) => {return {x: t}} },
    
    { name: "Width", x: 950, y: 300, indicator: (t) => {return {w: t}} },
    { name: "Height", x: 950, y: 350, indicator: (t) => {return {h: t}} },

    { name: "Hue", x: 950, y: 450, indicator: (t) => {return {hue: t}} },
    { name: "Saturation", x: 950, y: 500, indicator: (t) => {return {s: t}} },
    { name: "Value", x: 950, y: 550, indicator: (t) => {return {v: t}} },
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
