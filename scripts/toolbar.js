const TOOLBAR = {};

TOOLBAR.bar = document.getElementById('toolbar');
TOOLBAR.tooltip = document.getElementById('toolbar_tooltip');

TOOLBAR.tools = {};

TOOLBAR.show = (bool, desc=false) => {
    if (bool) {
        TOOLBAR.tooltip.textContent = desc;
        TOOLBAR.tooltip.classList.add('visible');
    } else {
        TOOLBAR.tooltip.classList.remove('visible');
    }
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
        onequip();
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

// export default TOOLBAR;