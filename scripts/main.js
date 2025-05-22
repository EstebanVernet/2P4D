// import TOOLBAR from './toolbar.js';

TOOLBAR.append('Selector', 'Select and connect elements together', 'cursor', () => {});
TOOLBAR.append('Hand', 'Move through the workspace', 'hand', () => {});
TOOLBAR.append('Value', 'Create new values', 'number', () => {});
TOOLBAR.append('Operator', 'Add, substract, multiply or divide two values', 'operation', () => {});
TOOLBAR.append('Generator', 'Generate new values from graphs', 'algorithm', () => {});
TOOLBAR.append('Curve generator', 'Generate new values using a Bézier curve', 'easing', () => {});
TOOLBAR.append('Color', 'Retreive colors by changing its hue, saturation and lightness', 'color', () => {});
TOOLBAR.append('Papers', 'Create user-defined instructions that you can reuse everywhere', 'paper', () => {});

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

LiteGraph.registerNodeType("custom/test_node", DOM_NODE.new(
  [16, 16],
  function(elm) {
    elm.properties = { value: 0 };

    console.log(elm.container)
    const num = createAnchorNumber(elm.container);

    // elm.addInput("input1", "number");
    elm.addOutput("output", "number");
  }
));

var custom_node = LiteGraph.createNode("custom/test_node");
custom_node.pos = [400, 300];
graph.add(custom_node);

graph.start();