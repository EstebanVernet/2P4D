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
                y: height/16*y + height/16/2 + offset.x,
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

        input_index.properties.value = i; // ('output', i);
        input_index.onExecute();
        graph.runStep();
        
        return {
            offset: { x: 0, y: 0 },
            col: 'red',
            show: true,
            size: {
                w: output_size.getInputData(0) || 1, // Add fallback
                h: output_size.getInputData(0) || 1
            }
        }
    })
}