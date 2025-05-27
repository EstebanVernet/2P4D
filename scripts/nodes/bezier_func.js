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
    return cubicBezier(p0.y / 128, p0.x / 128, p1.y / 128, p2.x / 128, p2.y / 128, p3.y / 128, x);
}

function cubicBezier(startY, x1, y1, x2, y2, endY, x) {
    if (x < 0) return startY;
    if (x > 1) return endY;
    
    // Use Newton-Raphson method to find t value that gives us the desired x
    let t = x;
    
    for (let i = 0; i < 10; i++) {
    const currentX = cubicBezierX(t, x1, x2);
    const diff = currentX - x;
    
    if (Math.abs(diff) < 0.0001) break;
    
    const derivative = cubicBezierXDerivative(t, x1, x2);
    if (Math.abs(derivative) < 0.0001) break;
    
    t = t - diff / derivative;
    t = Math.max(0, Math.min(1, t));
    }
    
    // Calculate y value using the found t
    return cubicBezierY(t, startY, y1, y2, endY);
}

// Helper function to calculate x coordinate for given t
function cubicBezierX(t, x1, x2) {
const u = 1 - t;
// B(t) = (1-t)³*0 + 3(1-t)²t*x1 + 3(1-t)t²*x2 + t³*1
return 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t;
}

// Helper function to calculate y coordinate for given t
function cubicBezierY(t, startY, y1, y2, endY) {
const u = 1 - t;
// B(t) = (1-t)³*startY + 3(1-t)²t*y1 + 3(1-t)t²*y2 + t³*endY
return u * u * u * startY + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * endY;
}

// Helper function for derivative of x with respect to t
function cubicBezierXDerivative(t, x1, x2) {
const u = 1 - t;
return 3 * u * u * x1 + 6 * u * t * (x2 - x1) + 3 * t * t * (1 - x2);
}

bezierfunc.create = function(parent) {
    const svgElement = SVG().addTo(parent).size(128, 128);

    let data = {
        p0: { x: 0, y: 0 },
        p1: { x: 32, y: 32 },
        p2: { x: 128-32, y: 128-32 },
        p3: { x: 128, y: 128 }
    }

    this.updateObject = () => {
        line0.update(data.p0.x, data.p0.y, data.p1.x, data.p1.y);
        line1.update(data.p2.x, data.p2.y, data.p3.x, data.p3.y);

        curve.update(data.p0.x, data.p0.y, data.p1.x, data.p1.y, data.p2.x, data.p2.y, data.p3.x, data.p3.y);
    }

    this.computeFromBezier = (x) => {
        return bezierfunc.compute(data.p0, data.p1, data.p2, data.p3, x);
    }

    const line0 = new bezierfunc.line(svgElement, 0, 0, 0, 0);
    const line1 = new bezierfunc.line(svgElement, 0, 0, 0, 0);

    const curve = new bezierfunc.beziercurve(svgElement, 0, 0, 0, 0, 0, 0, 0, 0);

    const p0 = new bezierfunc.draggableAnchor('rect', svgElement, 0, 0, 0, 0, 0, 128, (x, y) => {
        data.p0.x = x;
        data.p0.y = y;
        this.updateObject();
    });
    const p1 = new bezierfunc.draggableAnchor('ellipse', svgElement, 32, 32, 0, -64, 128, 128 + 64, (x, y) => {
        data.p1.x = x;
        data.p1.y = y;
        this.updateObject();
    });
    const p2 = new bezierfunc.draggableAnchor('ellipse', svgElement, 128-32, 128-32, 0, -64, 128, 128 + 64, (x, y) => {
        data.p2.x = x;
        data.p2.y = y;
        this.updateObject();
    });
    const p3 = new bezierfunc.draggableAnchor('rect', svgElement, 128, 128, 128, 0, 128, 128, (x, y) => {
        data.p3.x = x;
        data.p3.y = y;
        this.updateObject();
    });

    this.updateObject();
}

LiteGraph.registerNodeType("custom/bezierfunc", DOM_NODE.new(
    [128, 128],
    function(elm) {
        // elm.properties = { value: 0 };
        // this.properties = { precision: 0.01 };
        // let anchorValue = 0;
        elm.container.classList.add("bezierfunc");
        const curve = new bezierfunc.create(elm.container);


        elm.addInput("val_input", "number");
        elm.addOutput("val_output", "number");
        
        // anchornumber.onupdate = function (val) {
        //     anchorValue = Math.floor(val * 1000) / 1000;
        //     handleWorkflowChange();
        // }

        elm.onExecute = () => {
            const x = this.getInputData(0);
            const res = curve.computeFromBezier(x);
            elm.setOutputData(0, res);
        }
    }
));
