const result = document.getElementById('result');
const svg = SVG().addTo(result).size(256, 256);

function render(f) {
    const width = result.clientWidth;
    const height = result.clientHeight;

    svg.clear();
    for (let y=0 ; y<16 ; y++) {
        for (let x=0 ; x<16 ; x++) {
            const i = x + y*16;
            const { offset={x:0, y:0}, col='black', show=true, size={w: 1, h: 1} } = f(i, x, y);
            const params = {
                x: width/16*x + width/16/2 + offset.x,
                y: height/16*y + height/16/2 + offset.y,
                w: width/16 * size.w,
                h: height/16 * size.h
            }
            svg.rect(params.w, params.h)
            .center(params.x, params.y)
            .fill(col);
        }
    }
}

function handleWorkflowChange() {
    render((i, x, y) => {

        // input_index.properties.value = i; // ('output', i);
        // input_index.onExecute();
        
        nodes_input.setValue('Index', i);
        nodes_input.setValue('Vertical pos.', (y + .5) / 16);
        nodes_input.setValue('Horizontal pos.', (x + .5) / 16);
        
        graph.runStep();
        
        return {
            offset: { x: nodes_output.getValue('Horizontal offset') || 0, y: nodes_output.getValue('Vertical offset') || 0 },
            col: 'hsl(' + nodes_output.getValue('Hue') + ', ' + nodes_output.getValue('Saturation') + '%, ' + nodes_output.getValue('Value') + '%)',
            show: true,
            size: {
                w: nodes_output.getValue('Width') || 1, // Add fallback
                h: nodes_output.getValue('Height') || 1
            }
        }
    })
}