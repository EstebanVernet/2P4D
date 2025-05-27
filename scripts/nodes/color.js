let hsl2hsv = (h,s,l,v=s*Math.min(l,1-l)+l) => [h, v?2-2*l/v:0, v];

let hsv2hsl = (h,s,v,l=v-v*s/2, m=Math.min(l,1-l)) => [h,m?(v-l)/m:0,l];

function createColorDOMNode(node, parent) {

    const tem_box = document.getElementById("tem-box-color")
    const clone = tem_box.content.cloneNode(true)

    const sv = clone.querySelector(".sv")
    const sv_picker = clone.querySelector(".color-sv-indicator")

    this.map = (x, inMin, inMax, outMin, outMax) => (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin

    this.updated = () => {};

    this.getHue = (y) => {
        return this.map(y, 0, 128, 360, 0);
    }

    this.getSaturation = (x) => {
        return this.map(x, 0, 128, 0, 100);
    }

    this.getValue = (y) => {
        return this.map(y, 128, 0, 0, 100);
    }

    this.setSV = (x, y) => {
        node.properties.saturationPos = x;
        node.properties.valuePos = y;

        if (x < 0) x = 0;
        if (x > 128) x = 128;
        if (y < 0) y = 0;
        if (y > 128) y = 128;

        sv_picker.style.left = x + "px";
        sv_picker.style.top = y + "px";
    
        this.saturation = this.getSaturation(x);
        this.value = this.getValue(y);
        this.updated();
    }

    let mousedown_sv = false;

    sv.onmousedown = (e) => {
        e.preventDefault();
        mousedown_sv = true;
        const bounds = sv.getBoundingClientRect();
        this.setSV(e.clientX - bounds.left, e.clientY - bounds.top);
    }

    const h = clone.querySelector(".h")
    const h_picker = clone.querySelector(".color-h-indicator")

    let mousedown_h = false;

    this.setH = (y) => {
        node.properties.huePos = y;
        if (y < 0) y = 0;
        if (y > 128) y = 128;

        h_picker.style.top = y + "px";

        const hue = this.getHue(y);
        this.hue = hue;
        sv.style.setProperty("--hue", hue + "deg");
        this.updated();
    }

    h.onmousedown = (e) => {
        e.preventDefault();
        mousedown_h = true;
        const bounds = h.getBoundingClientRect();
        this.setH(e.clientY - bounds.top);
    }

    document.addEventListener("mousemove", (e) => {
        if (mousedown_sv) {
            e.preventDefault();
            const bounds = sv.getBoundingClientRect();
            this.setSV(e.clientX - bounds.left, e.clientY - bounds.top);
        }
        if (mousedown_h) {
            const bounds = h.getBoundingClientRect();
            e.preventDefault();
            this.setH(e.clientY - bounds.top);
        }
    });

    document.addEventListener("mouseup", (e) => {
        if (mousedown_sv) {
            e.preventDefault();
            mousedown_sv = false;
        }
        if (mousedown_h) {
            e.preventDefault();
            mousedown_h = false;
        }
    });

    parent.appendChild(clone);
}

LiteGraph.registerNodeType("custom/color", DOM_NODE.new(
    [128 + 8 + 32 + 16 + 8, 128],
    function(elm) {

        elm.properties = {
            hue: 0,
            saturation: 0,
            value: 100
        }

        elm.container.classList.add("node-color");
        const col = new createColorDOMNode(elm, elm.container)

        // elm.addInput("hue", "number");
        // elm.addInput("saturation", "number");
        // elm.addInput("value", "number");
        
        elm.addOutput("hue", "number");
        elm.addOutput("saturation", "number");
        elm.addOutput("value", "number");

        elm.onExecute = function() {
            // console.log(col.hue, col.saturation, col.value);
            const newCol = hsv2hsl(col.hue, col.saturation / 100, col.value / 100);

            const hue = newCol[0];
            const saturation = newCol[1] * 100;
            const value = newCol[2] * 100;
            
            // console.log(hue, saturation, value);
            this.setOutputData(0, hue);
            this.setOutputData(1, saturation);
            this.setOutputData(2, value);
        }

        col.updated = () => {
            elm.properties.hue = col.hue;
            elm.properties.saturation = col.saturation;
            elm.properties.value = col.value;
            elm.graph.onNodePropertyChanged();
        }

        elm.onConfigure = () => {

            col.setH(elm.properties.huePos);
            col.setSV(elm.properties.saturationPos, elm.properties.valuePos);
            
            col.updated();
        }
    }
));
