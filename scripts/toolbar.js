const TOOLBAR = {};

TOOLBAR.bar = document.querySelector('#toolbar .tools');
TOOLBAR.tooltip = document.getElementById('toolbar_tooltip');

TOOLBAR.tools = {};

TOOLBAR.selected = null;

TOOLBAR.show = (bool, toolname=false, shortcut=false, desc=false) => {
    if (bool) {

        const str_shortcut = shortcut ? ` (${shortcut}) ` : '';
        const title = str_shortcut + toolname;
        TOOLBAR.tooltip.querySelector('.title').textContent = title;
        TOOLBAR.tooltip.querySelector('.description').textContent = desc;
        TOOLBAR.tooltip.classList.add('visible');
    } else {
        TOOLBAR.tooltip.classList.remove('visible');
    }
}

TOOLBAR.onequip = (toolName) => {
    if (toolName == 'Tweaker') {
        document.body.classList.add('tweak');
    } else {
        document.body.classList.remove('tweak');
    }
}

TOOLBAR.equip = (toolName) => {
    TOOLBAR.selected = toolName;

    for (const tool in TOOLBAR.tools) {
        TOOLBAR.tools[tool].classList.remove('selected');
    }
    TOOLBAR.tools[toolName].classList.add('selected');

    if (TOOLBAR.tools[toolName].cursor) {
        document.documentElement.style.setProperty('--cursor', `url("../assets/icons/cursor/${TOOLBAR.tools[toolName].icon}.svg") 0 0, auto`);
    } else {
        document.documentElement.style.setProperty('--cursor', `url("../assets/icons/${TOOLBAR.tools[toolName].icon}.svg") 0 0, auto`);
    }
    TOOLBAR.onequip(toolName);
    // TOOLBAR.tools[toolName].onequip();
}

TOOLBAR.append = (name, description, icon, cursor, shortcut) => {
    const tool = document.createElement('img');
    tool.classList.add('tool');
    tool.icon = icon;
    tool.cursor = cursor;
    tool.src = './assets/icons/' + icon + '.svg';
    tool.alt = name;
    tool.shortcut = shortcut;
    tool.toolname = name;
    tool.description = description;
    TOOLBAR.tools[name] = tool;
    
    tool.addEventListener('click', () => {
        TOOLBAR.equip(name);
    });

    let timer;
    tool.addEventListener('mouseover', () => {
        timer = setTimeout(() => {
            TOOLBAR.show(true, tool.toolname, tool.shortcut, tool.description);
        }, 500);
    });
    tool.addEventListener('mouseout', () => {
        clearTimeout(timer);
        TOOLBAR.show(false);
    });
    
    TOOLBAR.bar.appendChild(tool);
}

document.addEventListener('keydown', (e) => {
    for (const tool in TOOLBAR.tools) {
        if (!TOOLBAR.tools[tool].shortcut) continue;
        if (e.key.toLowerCase() == TOOLBAR.tools[tool].shortcut.toLowerCase()) {
            TOOLBAR.equip(tool);
        }
    }
})

TOOLBAR.createNode = (name) => {
    const [x, y] = graph.list_of_graphcanvas[0].graph_mouse;
    const node = LiteGraph.createNode(name);
    node.pos = [x, y];
    graph.add(node);
    TOOLBAR.equip('Tweaker');
    return node;
}

TOOLBAR.append('Selector', 'Select and move nodes', 'cursor', true, 'V');
TOOLBAR.append('Tweaker', 'Modify and connect nodes', 'tweaker', true, 'A');
TOOLBAR.append('Hand', 'Move through the workspace', 'hand', false, 'H');
TOOLBAR.append('Value', 'Create new values', 'number', true, 'P');
TOOLBAR.append('Operator', 'Add, substract, multiply or divide two values', 'operation', true, 'O');
TOOLBAR.append('Generator', 'Generate new values from graphs', 'algorithm', true, 'G');
TOOLBAR.append('Curve generator', 'Generate new values using a Bézier curve', 'easing', true, 'B');
TOOLBAR.append('Color', 'Retreive colors by changing its hue, saturation and lightness', 'color', true, 'C');
// TOOLBAR.append('Papers', 'Create user-defined instructions that you can reuse everywhere', 'paper', false, 'F');

TOOLBAR.equip('Selector');
 
// preload cursors
for (const toolName in TOOLBAR.tools) {
    if (TOOLBAR.tools[toolName].cursor) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = `./assets/icons/cursor/${TOOLBAR.tools[toolName].icon}.svg`;
        link.as = 'image';
        document.head.appendChild(link);
    }
}

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

let generator_waiting = false;
workspace.addEventListener('click', (e) => {
    switch (TOOLBAR.selected) {
        case 'Value':
            TOOLBAR.createNode('custom/number');
            break;
        case 'Operator':
            TOOLBAR.createNode('custom/operator');
            break;
        case 'Curve generator':
            TOOLBAR.createNode('custom/bezierfunc');
            break;
        case 'Color': 
            TOOLBAR.createNode('custom/color');
            break;
        case 'Generator':
            if (!generator_waiting) {
                e.stopPropagation();
                // console.log(e.offsetX, e.offsetY);
                generator_waiting = true;
                FUNCNODE.selectFunction(e.offsetX, e.offsetY).then((name) => {
                    // console.log(name);
                    const node = TOOLBAR.createNode('custom/func');
                    node.properties.name = name;
                    node.changeFunction(name);
                    generator_waiting = false;
                })
                .catch(() => {
                    generator_waiting = false;
                });
            }
            break;
    }
});

document.addEventListener("mousedown", (e) => {
    if (TOOLBAR.selected == 'Hand') {
        document.documentElement.style.setProperty('--cursor', `url("../assets/icons/grab.svg") 0 0, auto`);
    }
})

// document.addEventListener("mouseup", (e) => {
//     if (TOOLBAR.selected == 'Hand') {
//         document.documentElement.style.setProperty('--cursor', `url("../assets/icons/hand.svg") 0 0, auto`);
//     }
// })