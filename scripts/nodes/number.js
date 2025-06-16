const base = {};

let isShiftPressed = false;
document.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') {
        isShiftPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') {
        isShiftPressed = false;
    }
});

base.anchorNumberGuide = function (parent, x, y) {
    this.elm = parent.ellipse(8, 8)
    .center(x, y)
    .attr({ class: 'guide' });

    this.setSize = function (w, h) {
        this.elm.size(w, h);
        this.elm.center(x, y);
    }

    this.show = function (bool) {
        this.elm.attr({ class: bool ? 'guide visible' : 'guide' });
    }
}
base.anchorPrecisionGuide = function (parent, x, y, radius = 16) {
    this.centerX = x;
    this.centerY = y;
    this.radius = radius;
    this.startAngle = 0;
    this.endAngle = Math.PI / 2; // 90 degrees default
    
    // Helper function to create arc path string
    this.createArcPath = function() {
        // Convert angles to standard SVG coordinate system (0° = right, clockwise)
        const startX = this.centerX + this.radius * Math.cos(this.startAngle);
        const startY = this.centerY + this.radius * Math.sin(this.startAngle);
        const endX = this.centerX + this.radius * Math.cos(this.endAngle);
        const endY = this.centerY + this.radius * Math.sin(this.endAngle);
        
        // Calculate angle difference
        let angleDiff = this.endAngle - this.startAngle;
        
        // Normalize angle difference
        while (angleDiff < 0) angleDiff += 2 * Math.PI;
        while (angleDiff > 2 * Math.PI) angleDiff -= 2 * Math.PI;
        
        // Determine if the arc should be drawn as the large arc
        const largeArc = angleDiff > Math.PI ? 1 : 0;
        
        // SVG arc path: M startX,startY A radius,radius 0 largeArc,sweepFlag endX,endY
        const sweepFlag = 1; // Always clockwise
        
        // If start and end are the same, draw a full circle
        if (Math.abs(angleDiff) < 0.001 || Math.abs(angleDiff - 2 * Math.PI) < 0.001) {
            // Draw full circle as two semicircles
            const midX = this.centerX + this.radius * Math.cos(this.startAngle + Math.PI);
            const midY = this.centerY + this.radius * Math.sin(this.startAngle + Math.PI);
            return `M ${startX} ${startY} A ${this.radius} ${this.radius} 0 0 1 ${midX} ${midY} A ${this.radius} ${this.radius} 0 0 1 ${startX} ${startY}`;
        }
        
        return `M ${startX} ${startY} A ${this.radius} ${this.radius} 0 ${largeArc} ${sweepFlag} ${endX} ${endY}`;
    };

    // Create the initial arc path
    this.elm = parent.path(this.createArcPath())
    .attr({ class: 'guide' });
    
    // Set the size (radius) of the arc
    this.setSize = function (newRadius) {
        this.radius = newRadius;
        this.updatePath();
    };
    
    // Set start and end angles (in radians)
    this.setAngles = function (startAngle, endAngle) {
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.updatePath();
    };
    
    // Set start and end angles (in degrees) - convenience method
    this.setAnglesDegrees = function (startDegrees, endDegrees) {
        this.startAngle = (startDegrees * Math.PI) / 180;
        this.endAngle = (endDegrees * Math.PI) / 180;
        this.updatePath();
    };
    
    // Update the path after changes
    this.updatePath = function() {
        this.elm.plot(this.createArcPath());
    };
    
    // Set center position
    this.setCenter = function(newX, newY) {
        this.centerX = newX;
        this.centerY = newY;
        this.updatePath();
    };
    
    // Show/hide the arc
    this.show = function (bool) {
        this.elm.attr({ class: bool ? 'guide visible' : 'guide' });
    };
};

base.draggableAnchor = function (parent, ox, oy, x, y, moved) {
    // Calculate initial radius from origin (0,0)

    let lockedDist = 0;

    this.elm = parent.ellipse(8, 8)
    .center(x, y)
    .attr({ class: 'anchor' })
    .draggable()
    .on('dragmove', (e) => {
        if (isShiftPressed) {
            e.preventDefault()

            const { handler, box } = e.detail

            const ang = Math.atan2(e.detail.box.cy - oy, e.detail.box.cx - ox) - Math.PI / 2;
            
            const lockedX = Math.sin(-ang) * lockedDist + ox;
            const lockedY = Math.cos(ang) * lockedDist + oy;
            
            handler.move(lockedX - 4, lockedY - 4);
            moved(lockedX, lockedY);
        } else {
            lockedDist = Math.sqrt(Math.pow(e.detail.box.cx - ox, 2) + Math.pow(e.detail.box.cy - oy, 2));
            moved(e.detail.box.cx, e.detail.box.cy);
        }
    });
        
    this.secondary = function () {
        this.elm.attr({ class: 'anchor secondary' });
    }
    
    this.update = function (x, y) {
        this.elm.center(x, y);
    }
   
    moved(x, y);
}

base.line = function (parent, x1, y1, x2, y2) {
    this.elm = parent.line(x1, y1, x2, y2)
    .attr({ class: 'line' });
    
    this.update = function (x1, y1, x2, y2) {
        this.elm.attr({ x1: x1, y1: y1, x2: x2, y2: y2 });
    }

    this.secondary = function () {
        this.elm.attr({ class: 'line secondary' });
    }
}

const instances = {};

instances.anchorNumber = function (node, parent, cx, cy) {
    this.onupdate = () => {};

    this.data = {
        cx: cx,
        cy: cy,
        ax1: 0,
        ay1: 0,
        ax2: 0,
        ay2: 0
    }

    const num_guide = new base.anchorNumberGuide(parent, cx, cy);
    num_guide.show(false);

    const precision_guide = new base.anchorPrecisionGuide(parent, cx, cy);

    document.addEventListener("mouseup", () => {
        num_guide.show(false);
        precision_guide.show(false);
    })

    const line2 = new base.line(parent, cx, cy, cx, cy + 16);
    line2.secondary();
    const anchor2 = new base.draggableAnchor(parent, cx, cy, cx, cy + 16, (x, y) => {
        this.data.ax2 = x;
        this.data.ay2 = y;
        line2.update(cx, cy, x, y);


        const l1_ang = Math.atan2(this.data.ay1 - this.data.cy, this.data.ax1 - this.data.cx);
        const l2_ang = Math.atan2(this.data.ay2 - this.data.cy, this.data.ax2 - this.data.cx);
        
        const l1_dist = distance(this.data.cx, this.data.cy, this.data.ax1, this.data.ay1);
        const l2_dist = distance(this.data.cx, this.data.cy, this.data.ax2, this.data.ay2);
        
        precision_guide.show(true)
        precision_guide.setAngles(l1_ang, l2_ang);
        precision_guide.setSize(Math.min(l1_dist, l2_dist));

        const val = compute(this.data);
        this.onupdate(val);
    });

    anchor2.secondary();
    
    const line1 = new base.line(parent, cx, cy, cx, cy + 32);
    const anchor1 = new base.draggableAnchor(parent, cx, cy, cx, cy + 32, (x, y) => {
        num_guide.show(true);

        const old_angle = Math.atan2(this.data.ay1 - this.data.cy, this.data.ax1 - this.data.cx);
        const new_angle = Math.atan2(y - this.data.cy, x - this.data.cx);
        const diff = new_angle - old_angle;
        
        this.data.ax1 = x;
        this.data.ay1 = y;
        line1.update(cx, cy, x, y);

        const l2_dist = distance(this.data.cx, this.data.cy, this.data.ax2, this.data.ay2);
        const l2_angle = Math.atan2(this.data.ay2 - this.data.cy, this.data.ax2 - this.data.cx);

        const l1_dist = distance(this.data.cx, this.data.cy, this.data.ax1, this.data.ay1);
        const dist_rounded = Math.floor(l1_dist * 2 / 64) * 64 + 32;
        num_guide.setSize(dist_rounded, dist_rounded);

        this.data.ax2 = this.data.cx + l2_dist * Math.cos(l2_angle + diff);
        this.data.ay2 = this.data.cy + l2_dist * Math.sin(l2_angle + diff);
        
        line2.update(cx, cy, this.data.ax2, this.data.ay2);
        anchor2.update(this.data.ax2, this.data.ay2);

        const val = compute(this.data);
        this.onupdate(val);
    });

    parent.rect(8, 8)
    .center(cx, cy)
    .attr({ class: 'anchor no-pointer-events' })

    this.updateObject = (dat) => {
        this.data = dat;
        line1.update(cx, cy, this.data.ax1, this.data.ay1);
        line2.update(cx, cy, this.data.ax2, this.data.ay2);
        anchor1.update(this.data.ax1, this.data.ay1);
        anchor2.update(this.data.ax2, this.data.ay2);

        const val = compute(this.data);
        this.onupdate(val);
    }

    this.onupdate(this.data);
    num_guide.show(false);
    precision_guide.show(false);
}

const distance = function (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function calculateSum(x) {
    const multiplier = Math.PI * 2;
    return multiplier * (x * (x + 1) / 2);
}

const map = (value, inMin, inMax, outMin, outMax) => (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin

function compute(data) {
    const angle_circular_float = ((Math.atan2(data.ay2 - data.cy, data.ax2 - data.cx) % (2 * Math.PI) + (2 * Math.PI)) % (2 * Math.PI)) / (2 * Math.PI);
    const angle_circular_int = ((Math.atan2(data.ay1 - data.cy, data.ax1 - data.cx) % (2 * Math.PI) + (2 * Math.PI)) % (2 * Math.PI)) / (2 * Math.PI);
    const ang_diff = (angle_circular_float - angle_circular_int + 1) % 1;
    const FLOAT = ang_diff;

    const int_ang = Math.atan2(data.ay1 - data.cy, data.ax1 - data.cx) / Math.PI;
    const int_dist = distance(data.cx, data.cy, data.ax1, data.ay1);
    const ring = Math.max(0, Math.floor(int_dist / 32)) * Math.PI * 2;

    const base = calculateSum(Math.floor(int_dist / 32));
    const offset = map(int_ang, -1, 1, ring, 0);

    const VALUE = Math.floor(base - offset) + FLOAT;

    return VALUE;
}

function createAnchorNumber(node, parent) {
    const svgElement = SVG().addTo(parent).size(16, 32);
    const elm = new instances.anchorNumber(node, svgElement, 8, 16);
    return elm;
}

// const elm = new instances.anchorNumber(window.innerWidth / 2, window.innerHeight / 2);
// const g = new grid(8, 8);
// elm.onupdate = function (val) {
//     g.update((i, x, y) => {
//         const int = Math.floor(val);
//         const float = val - Math.floor(val);
//         return {
//             w: int==i ? 8 * float : 8,
//             h: 8,
//             spacing: 4,
//             shouldDraw: i < val
//         }
//     });
// }

LiteGraph.registerNodeType("custom/number", DOM_NODE.new(
    [16, 32],
    function(elm) {
        // elm.properties = { value: 0 };
        this.properties = { value: 0 };
        let anchorValue = 0;
        const anchornumber = createAnchorNumber(elm, elm.container);
        elm.addOutput("val_output", "number");
        anchornumber.onupdate = (val) => {
            anchorValue = Math.floor(val * 1000) / 1000;
            // this.properties.value = anchorValue;
            this.properties = anchornumber.data;
            elm.graph.onNodePropertyChanged();
        }

        elm.onExecute = function() {
            this.setOutputData(0, anchorValue / 16);
        }

        elm.onConfigure = () => {
            anchornumber.updateObject(this.properties);
        }

        elm.onAdded = () => {
            anchornumber.updateObject(anchornumber.data);
        }
    }
));
