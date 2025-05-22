const DOM_NODE = {};

DOM_NODE.base = function() {
    this.createDomContainer();
    if (this.extend) this.extend(this);
    this.adjustSize();
    // this.size[0] -= 20;
  }

  DOM_NODE.base.prototype.adjustSize = function() {
    const has_inputs = this.inputs && this.inputs.length > 0;
    const has_outputs = this.outputs && this.outputs.length > 0;
    this.size[0] += (6+8) * ((has_inputs ? 1 : 0) + (has_outputs ? 1 : 0));
  };
  
  DOM_NODE.base.prototype.createDomContainer = function() {
    this.container = document.createElement('div');
    this.container.classList.add("dom-node");

    console.log(this)
    
    const out_count = this.outputs ? 1:0;
    const in_count = this.inputs ? 1:0;

    this.container.style.width = (this.size[0] - (3 + 4) * (out_count+in_count) * 2 ) + 'px';
    this.container.style.height = this.size[1] + 'px';

    document.body.appendChild(this.container);
    // On change self.setDirtyCanvas(true);
  };
  
  DOM_NODE.base.prototype.onDrawForeground = function(ctx) {
    if (!this.container) return;
    
    const canvas = ctx.canvas;
    const rect = canvas.getBoundingClientRect();
    const offset = graphcanvas.ds.offset;
    const x = (this.pos[0] + offset[0]) + rect.left + (this.inputs ? (3 + 4) * 2 : 0);
    const y = (this.pos[1] + offset[1]) + rect.top;
    this.container.style.left = x + 'px';
    this.container.style.top = y + 'px';
  };
  
  DOM_NODE.base.prototype.onExecute = function() {
    this.setOutputData(0, this.properties.value);
  };
  
  DOM_NODE.base.prototype.onRemoved = function() {
    if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
    }
  };
  
  DOM_NODE.base.prototype.onPropertyChanged = function(name, value) {
    if (name === "value" && this.inputElement) {
        this.inputElement.value = value;
    }
  };
  

DOM_NODE.new = (size, extension) => {
    function clone() {DOM_NODE.base.apply(this, arguments)};
    clone.prototype = Object.create(DOM_NODE.base.prototype);
    clone.prototype.extend = extension
    clone.prototype.size = size;
    return clone;
}