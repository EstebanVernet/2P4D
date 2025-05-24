const TOOLBAR = {};

TOOLBAR.bar = document.getElementById('toolbar');
TOOLBAR.tooltip = document.getElementById('toolbar_tooltip');

TOOLBAR.tools = {};

TOOLBAR.selected = null;

TOOLBAR.show = (bool, desc=false) => {
    if (bool) {
        TOOLBAR.tooltip.textContent = desc;
        TOOLBAR.tooltip.classList.add('visible');
    } else {
        TOOLBAR.tooltip.classList.remove('visible');
    }
}

TOOLBAR.equip = (toolName) => {
    TOOLBAR.selected = toolName;
    TOOLBAR.tools[toolName].onequip();
}

TOOLBAR.append = (name, description, icon, onequip) => {
    const tool = document.createElement('img');
    tool.classList.add('tool');
    tool.src = './assets/icons/' + icon + '.svg';
    tool.alt = name;
    tool.toolname = name;
    tool.description = description;
    tool.onequip = onequip;
    TOOLBAR.tools[name] = tool;
    
    tool.addEventListener('click', () => {
        TOOLBAR.equip(name);
    });

    let timer;
    tool.addEventListener('mouseover', () => {
        timer = setTimeout(() => {
            TOOLBAR.show(true, tool.description);
        }, 500);
    });
    tool.addEventListener('mouseout', () => {
        clearTimeout(timer);
        TOOLBAR.show(false);
    });
    
    TOOLBAR.bar.appendChild(tool);
}

TOOLBAR.createNode = (name) => {
    const [x, y] = graph.list_of_graphcanvas[0].graph_mouse;
    const node = LiteGraph.createNode(name);
    node.pos = [x, y];
    graph.add(node);
    return node;
}

TOOLBAR.append('Selector', 'Select and connect elements together', 'cursor', () => {});
TOOLBAR.append('Hand', 'Move through the workspace', 'hand', () => {});
TOOLBAR.append('Value', 'Create new values', 'number', () => {});
TOOLBAR.append('Operator', 'Add, substract, multiply or divide two values', 'operation', () => {});
TOOLBAR.append('Generator', 'Generate new values from graphs', 'algorithm', () => {});
TOOLBAR.append('Curve generator', 'Generate new values using a Bézier curve', 'easing', () => {});
TOOLBAR.append('Color', 'Retreive colors by changing its hue, saturation and lightness', 'color', () => {});
TOOLBAR.append('Papers', 'Create user-defined instructions that you can reuse everywhere', 'paper', () => {});

TOOLBAR.equip('Selector');

// On key down, if space, toolbar selected is hand
let previousSelected = 'Selector';
let isSpaceSelected = false;
window.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        if (!isSpaceSelected) {
            previousSelected = TOOLBAR.selected;
            TOOLBAR.equip('Hand');
            isSpaceSelected = true;
        }
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === ' ') {
        isSpaceSelected = false;
        TOOLBAR.equip(previousSelected);
    }
});

const workspace = document.getElementById('workspace');

graph.moveToolEvent = () => {
    if (TOOLBAR.selected === 'Hand') {
        graph.list_of_graphcanvas[0].dragging_canvas = true;
    }
}

// Nodes creation tools

workspace.addEventListener('click', (e) => {
    switch (TOOLBAR.selected) {
        case 'Value':
            TOOLBAR.createNode('custom/number');
            break;
        case 'Operator':
            TOOLBAR.createNode('custom/operator');
            break;
    }
});