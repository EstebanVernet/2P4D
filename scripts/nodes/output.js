LiteGraph.registerNodeType("custom/output", DOM_NODE.new(
    [128 + 64, 32],
    function(elm) {
        elm.block_delete = true;
        elm.addInput("input", "number");
        elm.container.classList.add("input-output", "output");
        elm.setName = (inputName) => {
            elm.inputName = inputName;
            elm.container.innerHTML = inputName;
            elm.properties = {name: inputName};
        }

        elm.setIndicator = (f) => {
            const svgElm = SVG().addTo(elm.container).size(16, 16);
            const rect = svgElm.rect(16, 16);
            const update = () => {
                const t = (Math.sin(performance.now() / 400) / 2) + 0.5;
                const data = f(t);
                if (data.w) rect.width(data.w * 16);
                if (data.h) rect.height(data.h * 16);
                if (data.x) rect.x(data.x * 16 - 8);
                if (data.y) rect.y(data.y * 16 - 8);

                data.hue = data.hue ? data.hue / 5 : 298 / 360;
                data.s = data.s ? data.s : 100 / 100;
                data.v = data.v ? data.v : 50 / 100;

                const color = `hsl(${data.hue * 360}, ${data.s * 100}%, ${data.v * 100}%)`;
                rect.fill(color);

                requestAnimationFrame(update);
            }
            update();
            elm.adjustSize();
        }

        elm.onConfigure = () => {
            elm.setName(elm.properties.name);
        }
    }
));