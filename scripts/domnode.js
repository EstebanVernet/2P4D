const DOM_NODE = {};

DOM_NODE.base = function() {
    if (this.extend) this.extend(this);
    this.createDomContainer();
  }
  
  DOM_NODE.base.prototype.createDomContainer = function() {
    this.container = document.createElement('div');
    this.container.classList.add("dom-node");
    
    this.container.style.width = (this.size[0] - (6+4) * 2 * 2) + 'px';
    this.container.style.height = this.size[1] + 'px';

    document.body.appendChild(this.container);
    // On change self.setDirtyCanvas(true);
  };
  
  DOM_NODE.base.prototype.onDrawForeground = function(ctx) {
    if (!this.container) return;
    
    const canvas = ctx.canvas;
    const rect = canvas.getBoundingClientRect();
    const offset = graphcanvas.ds.offset;
    const x = (this.pos[0] + offset[0]) + rect.left + (6 + 4) * 2;
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
  

DOM_NODE.new = (extension) => {
    function clone() {DOM_NODE.base.apply(this, arguments)};
    clone.prototype = Object.create(DOM_NODE.base.prototype);
    clone.prototype.extend = extension; 
    return clone;
}