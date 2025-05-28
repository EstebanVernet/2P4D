const bezierfunc = {};

const constrain = (val, min, max) => Math.min(Math.max(val, min), max);

bezierfunc.draggableAnchor = function (type, parent, x, y, minX, minY, maxX, maxY, moved) {

    if (type=='ellipse') {
        this.elm = parent.ellipse(8, 8)
    } else {
        this.elm = parent.rect(8, 8)
    }

    this.elm
    .center(x, y)
    .attr({ class: 'anchor' })
    .draggable()
    .on('dragmove', (e) => {
        e.preventDefault()
        const { handler, box } = e.detail
    
        const x = constrain(box.cx, minX, maxX);
        const y = constrain(box.cy, minY, maxY);
        handler.move(x - 4, y - 4);
        
        moved(x, y);
    });
    
    this.update = function (x, y) {
        this.elm.center(x, y);
    }
   
    moved(x, y);
}

bezierfunc.line = function (parent, x1, y1, x2, y2) {
    this.elm = parent.line(x1, y1, x2, y2)
    .attr({ class: 'line' });
    
    this.update = function (x1, y1, x2, y2) {
        this.elm.attr({ x1: x1, y1: y1, x2: x2, y2: y2 });
    }
}

bezierfunc.beziercurve = function (parent, x1, y1, x2, y2, x3, y3, x4, y4) {
    this.elm = parent.path()
    .attr({ class: 'beziercurve' });

    this.update = function (x1, y1, x2, y2, x3, y3, x4, y4) {
        this.elm.plot(`M ${x1} ${y1} C ${x2} ${y2} ${x3} ${y3} ${x4} ${y4}`);
    }

    this.update(x1, y1, x2, y2, x3, y3, x4, y4);
}

bezierfunc.compute = (p0, p1, p2, p3, x) => {
    // return findTForX(p0.y / 128, p0.x / 128, p1.y / 128, p2.x / 128, p2.y / 128, p3.y / 128, x);
    return bezierEasing(p0, p1, p2, p3, x);
}

function cubicBezier(t, p0, p1, p2, p3) {
    const u = 1 - t;
    return u * u * u * p0 + 
        3 * u * u * t * p1 + 
        3 * u * t * t * p2 + 
        t * t * t * p3;
}

function findTForX(x, p0, p1, p2, p3, precision = 0.0001) {
    let tMin = 0;
    let tMax = 1;
    let t = x; // Initial guess

    // Binary search to find t where x(t) equals our target x
    for (let i = 0; i < 50; i++) { // Max 50 iterations
        const currentX = cubicBezier(t, p0.x / 128, p1.x / 128, p2.x / 128, p3.x / 128);
        const diff = currentX - x;
        
        if (Math.abs(diff) < precision) {
        break;
        }
        
        if (diff > 0) {
        tMax = t;
        } else {
        tMin = t;
        }
        
        t = (tMin + tMax) / 2;
    }

    return t;
}

function bezierEasing(p0, p1, p2, p3, x) {
    // Clamp x to [0, 1] range
    x = Math.max(0, Math.min(1, x));

    // Handle edge cases
    if (x === 0) return p0.y;
    if (x === 1) return p3.y;

    // Find the t parameter that corresponds to our x coordinate
    const t = findTForX(x, p0, p1, p2, p3);

    // Calculate and return the y coordinate at that t
    return cubicBezier(t, p0.y / 128, p1.y / 128, p2.y / 128, p3.y / 128);
}

bezierfunc.create = function(parent) {
    this.onupdate = () => {};
    const svgElement = SVG().addTo(parent).size(128, 128);

    this.data = {
        p0: { x: 0, y: 0 },
        p1: { x: 32, y: 32 },
        p2: { x: 128-32, y: 128-32 },
        p3: { x: 128, y: 128 }
    }

    this.updateObject = () => {
        line0.update(this.data.p0.x, this.data.p0.y, this.data.p1.x, this.data.p1.y);
        line1.update(this.data.p2.x, this.data.p2.y, this.data.p3.x, this.data.p3.y);

        curve.update(this.data.p0.x, this.data.p0.y, this.data.p1.x, this.data.p1.y, this.data.p2.x, this.data.p2.y, this.data.p3.x, this.data.p3.y);
        this.onupdate();
    }

    this.updateAnchors = () => {
        p0.update(this.data.p0.x, this.data.p0.y);
        p1.update(this.data.p1.x, this.data.p1.y);
        p2.update(this.data.p2.x, this.data.p2.y);
        p3.update(this.data.p3.x, this.data.p3.y);
    }

    this.computeFromBezier = (x) => {
        return bezierfunc.compute(this.data.p0, this.data.p1, this.data.p2, this.data.p3, x);
    }

    const line0 = new bezierfunc.line(svgElement, 0, 0, 0, 0);
    const line1 = new bezierfunc.line(svgElement, 0, 0, 0, 0);

    const curve = new bezierfunc.beziercurve(svgElement, 0, 0, 0, 0, 0, 0, 0, 0);

    const p0 = new bezierfunc.draggableAnchor('rect', svgElement, 0, 0, 0, 0, 0, 128, (x, y) => {
        this.data.p0.x = x;
        this.data.p0.y = y;
        this.updateObject();
    });
    const p1 = new bezierfunc.draggableAnchor('ellipse', svgElement, 32, 32, 0, -64, 128, 128 + 64, (x, y) => {
        this.data.p1.x = x;
        this.data.p1.y = y;
        this.updateObject();
    });
    const p2 = new bezierfunc.draggableAnchor('ellipse', svgElement, 128-32, 128-32, 0, -64, 128, 128 + 64, (x, y) => {
        this.data.p2.x = x;
        this.data.p2.y = y;
        this.updateObject();
    });
    const p3 = new bezierfunc.draggableAnchor('rect', svgElement, 128, 128, 128, 0, 128, 128, (x, y) => {
        this.data.p3.x = x;
        this.data.p3.y = y;
        this.updateObject();
    });

    this.updateObject();
}

LiteGraph.registerNodeType("custom/bezierfunc", DOM_NODE.new(
    [128, 128],
    function(elm) {

        elm.properties = {
            p0: { x: 0, y: 0 },
            p1: { x: 32, y: 32 },
            p2: { x: 128-32, y: 128-32 },
            p3: { x: 128, y: 128 },
        };

        // this.properties = { precision: 0.01 };
        // let anchorValue = 0;
        elm.container.classList.add("bezierfunc");
        const curve = new bezierfunc.create(elm.container);
        curve.onupdate = () => {
            elm.properties = curve.data;
            if (elm.graph) {
                elm.graph.onNodePropertyChanged();
            }
        }

        elm.addInput("val_input", "number");
        elm.addOutput("val_output", "number");
        
        elm.onExecute = () => {
            const x = this.getInputData(0);
            const res = curve.computeFromBezier(x);
            elm.setOutputData(0, res);
        }

        elm.onConfigure = () => {
            curve.data = elm.properties;
            curve.updateObject();
            curve.updateAnchors();
        }
    }
));
