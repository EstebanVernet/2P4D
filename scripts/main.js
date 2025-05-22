// import TOOLBAR from './toolbar.js';

TOOLBAR.append('Selector', 'Select and connect elements together', 'cursor', () => {});
TOOLBAR.append('Hand', 'Move through the workspace', 'hand', () => {});
TOOLBAR.append('Value', 'Create new values', 'number', () => {});
TOOLBAR.append('Operator', 'Add, substract, multiply or divide two values', 'operation', () => {});
TOOLBAR.append('Generator', 'Generate new values from graphs', 'algorithm', () => {});
TOOLBAR.append('Curve generator', 'Generate new values using a Bézier curve', 'easing', () => {});
TOOLBAR.append('Color', 'Retreive colors by changing its hue, saturation and lightness', 'color', () => {});
TOOLBAR.append('Papers', 'Create user-defined instructions that you can reuse everywhere', 'paper', () => {});

// Register custom node with DOM elements
function CustomDOMNode() {
  this.addInput("input", "number");
  this.addOutput("output", "number");
  
  this.properties = { value: 0 };
  this.size = [200, 100];
  
  // Create DOM elements
  this.createDOMElements();
}
CustomDOMNode.prototype.createDOMElements = function() {
  // Create container
  this.domContainer = document.createElement('div');
  this.domContainer.style.position = 'absolute';
  this.domContainer.style.pointerEvents = 'auto';
  this.domContainer.style.background = 'rgba(40, 40, 40, 0.9)';
  this.domContainer.style.border = '1px solid #666';
  this.domContainer.style.borderRadius = '4px';
  this.domContainer.style.padding = '8px';
  this.domContainer.style.fontSize = '12px';
  this.domContainer.style.color = 'white';
  this.domContainer.style.fontFamily = 'Arial, sans-serif';
  
  // Create input element
  this.inputElement = document.createElement('input');
  this.inputElement.type = 'number';
  this.inputElement.value = this.properties.value;
  this.inputElement.style.width = '80px';
  this.inputElement.style.background = '#222';
  this.inputElement.style.border = '1px solid #555';
  this.inputElement.style.color = 'white';
  this.inputElement.style.padding = '2px';
  
  // Create button
  this.buttonElement = document.createElement('button');
  this.buttonElement.textContent = 'Set';
  this.buttonElement.style.marginLeft = '5px';
  this.buttonElement.style.background = '#444';
  this.buttonElement.style.border = '1px solid #666';
  this.buttonElement.style.color = 'white';
  this.buttonElement.style.padding = '2px 8px';
  this.buttonElement.style.cursor = 'pointer';
  
  // Add event listeners
  const self = this;
  this.inputElement.addEventListener('change', function() {
      self.properties.value = parseFloat(this.value) || 0;
      self.setDirtyCanvas(true);
  });
  
  this.buttonElement.addEventListener('click', function() {
      self.properties.value = parseFloat(self.inputElement.value) || 0;
      self.setDirtyCanvas(true);
  });
  
  // Append elements
  this.domContainer.appendChild(this.inputElement);
  this.domContainer.appendChild(this.buttonElement);
  document.body.appendChild(this.domContainer);
};

CustomDOMNode.prototype.onDrawForeground = function(ctx) {
  if (!this.domContainer) return;
  
  // Get canvas position and scale
  const canvas = ctx.canvas;
  const rect = canvas.getBoundingClientRect();
  const scale = graphcanvas.ds.scale;
  const offset = graphcanvas.ds.offset;
  
  // Calculate DOM element position
  const x = (this.pos[0] + offset[0]) + rect.left + 10;
  const y = (this.pos[1] + offset[1]) + rect.top + 25;
  
  // Update DOM position
  this.domContainer.style.left = x + 'px';
  this.domContainer.style.top = y + 'px';
  
  // Hide if too small
  this.domContainer.style.display = scale < 0.3 ? 'none' : 'block';
};

CustomDOMNode.prototype.onExecute = function() {
  this.setOutputData(0, this.properties.value);
};

CustomDOMNode.prototype.onRemoved = function() {
  // Clean up DOM elements when node is removed
  if (this.domContainer && this.domContainer.parentNode) {
      this.domContainer.parentNode.removeChild(this.domContainer);
  }
};

CustomDOMNode.prototype.onPropertyChanged = function(name, value) {
  if (name === "value" && this.inputElement) {
      this.inputElement.value = value;
  }
};

// Register the node
LiteGraph.registerNodeType("custom/dom_node", CustomDOMNode);


var node_const = LiteGraph.createNode("basic/const");
node_const.pos = [200,200];
graph.add(node_const);
node_const.setValue(4.5);

var node_watch = LiteGraph.createNode("basic/watch");
node_watch.pos = [700,200];
graph.add(node_watch);

node_const.connect(0, node_watch, 0);

// Add to your existing code after graph creation:
var custom_node = LiteGraph.createNode("custom/dom_node");
custom_node.pos = [400, 300];
graph.add(custom_node);

// Connect it to existing nodes
node_const.connect(0, custom_node, 0);
custom_node.connect(0, node_watch, 0);

graph.start();