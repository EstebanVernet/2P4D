const canvas = document.getElementById('workspace');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var graph = new LGraph();

const graphcanvas = new LGraphCanvas(canvas, graph);
graphcanvas.allow_searchbox = false;
graphcanvas._mousewheel_callback = null;

graphcanvas.background_image = './assets/bg.png';