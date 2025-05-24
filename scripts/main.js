// import TOOLBAR from './toolbar.js';

// // Register the node
// LiteGraph.registerNodeType("custom/dom_node", CustomDOMNode);


// var node_const = LiteGraph.createNode("basic/const");
// node_const.pos = [200,200];
// graph.add(node_const);
// node_const.setValue(4.5);

// var node_watch = LiteGraph.createNode("basic/watch");
// node_watch.pos = [700,200];
// graph.add(node_watch);

// node_const.connect(0, node_watch, 0);

// // Add to your existing code after graph creation:
// var custom_node = LiteGraph.createNode("custom/dom_node");
// custom_node.pos = [400, 300];
// graph.add(custom_node);

// // Connect it to existing nodes
// node_const.connect(0, custom_node, 0);
// custom_node.connect(0, node_watch, 0);

// var node_number = LiteGraph.createNode("custom/number");
// node_number.pos = [400, 300];
// graph.add(node_number);

// var node_operator = LiteGraph.createNode("custom/operator");
// node_operator.pos = [500, 300];
// graph.add(node_operator);

// var node_debug = LiteGraph.createNode("custom/debug_display");
// node_debug.pos = [600, 300];
// graph.add(node_debug);

var input_index = LiteGraph.createNode("custom/input");
input_index.pos = [200, 300];
input_index.setName("index");
graph.add(input_index);

var output_size = LiteGraph.createNode("custom/output");
output_size.pos = [700, 300];
output_size.setName("size");
graph.add(output_size);

graph.start();

graph.onNodeAdded = handleWorkflowChange
graph.onNodeRemoved = handleWorkflowChange
graph.onConnectionChange = handleWorkflowChange
graph.onNodePropertyChanged = handleWorkflowChange