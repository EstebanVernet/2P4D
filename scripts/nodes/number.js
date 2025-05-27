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

    const line2 = new base.line(parent, cx, cy, cx, cy + 8);
    line2.secondary();
    const anchor2 = new base.draggableAnchor(parent, cx, cy, cx, cy + 8, (x, y) => {
        this.data.ax2 = x;
        this.data.ay2 = y;
        line2.update(cx, cy, x, y);

        const val = compute(this.data);
        this.onupdate(val);
    });

    anchor2.secondary();
    
    const line1 = new base.line(parent, cx, cy, cx, cy + 64);
    const anchor1 = new base.draggableAnchor(parent, cx, cy, cx, cy + 64, (x, y) => {
        const old_angle = Math.atan2(this.data.ay1 - this.data.cy, this.data.ax1 - this.data.cx);
        const new_angle = Math.atan2(y - this.data.cy, x - this.data.cx);
        const diff = new_angle - old_angle;
        
        this.data.ax1 = x;
        this.data.ay1 = y;
        line1.update(cx, cy, x, y);

        const l2_dist = distance(this.data.cx, this.data.cy, this.data.ax2, this.data.ay2);
        const l2_angle = Math.atan2(this.data.ay2 - this.data.cy, this.data.ax2 - this.data.cx);

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
            this.setOutputData(0, anchorValue);
        }

        elm.onConfigure = () => {
            anchornumber.updateObject(this.properties);
        }
    }
));
