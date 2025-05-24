const canvas = document.getElementById('workspace');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var graph = new LGraph();

const graphcanvas = new LGraphCanvas(canvas, graph);
graphcanvas.allow_searchbox = false;
graphcanvas._mousewheel_callback = null;

graphcanvas.background_image = './assets/bg.png';

function updateEditorHiPPICanvas(width, height) {
    const ratio = window.devicePixelRatio;
    graphcanvas.canvas.width = width * ratio;
    graphcanvas.canvas.height = height * ratio;
    graphcanvas.canvas.style.width = width + "px";
    graphcanvas.canvas.style.height = height + "px";
    graphcanvas.canvas.getContext("2d").scale(ratio, ratio);
    return graphcanvas.canvas;
}

updateEditorHiPPICanvas(window.innerWidth, window.innerHeight);
