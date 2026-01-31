let main = {};

main.init = (options) => {
    let terminal = select(options?.selector);
    if(terminal){
        terminal.html('Initializing terminal...<br>' + "\n" + '<span class="cursor"></span><br>' + "\n");
        main.goto_line(terminal, 2);
    } else {
        return;
    }
    main.event_source(options);
}

main.goto_line_find_node = (node, line_nr) => {
    let line_count = 0;
    if (node.nodeType === Node.TEXT_NODE) {
        const lines = node.textContent.split("\n");
        for (let i = 0; i < lines.length; i++) {
            line_count++;
            if (line_count === line_nr) {
                let targetNode = node;
                let offset = lines.slice(0, i).join("\n").length + (i > 0 ? 1 : 0);
                return {
                    "targetNode" :targetNode,
                    "offset": offset
                }
            }
        }
    } else {
        for (let child of node.childNodes) {
            let result = main.goto_line_find_node(child, line_nr);
            if(result !== false){
                return result;
            }
        }
    }
    return false;
}

main.goto_line = (editor, line_nr) => {
    const text = editor.innerText.split("\n");
    console.log(text.length);
    // Validate line number
    if (line_nr < 1 || line_nr > text.length) {
        alert("Line number out of range.");
        return;
    }

    // Create a range and selection
    const range= document.createRange();
    const sel = window.getSelection();

    // Find the target text node for the given line

    let result = main.goto_line_find_node(editor, line_nr);
    if(result === false){
        alert("Could not find the specified line.");
        return;
    }
    let offset = result?.offset;
    let targetNode = result?.targetNode;
    if (targetNode) {
        range.setStart(targetNode, offset);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        editor.focus();
    } else {
        alert("Could not find the specified line.");
    }
    

}



main.event_source = (options) => {
    let eventSource = new EventSource(options?.url?.sse, {
        withCredentials: true,
    });
    let last_event_id = 0;
    let retry = 0;
    eventSource.addEventListener('ping', (event) => {
        let content = select(options?.selector);
        if(parseInt(event.lastEventId) >= parseInt(last_event_id)){
            last_event_id = event.lastEventId;
        }
        else if(parseInt(event.lastEventId) === 1 && retry < 3) {
            last_event_id = event.lastEventId;
            retry++;
        } else  {
            content.html(content.html() + '<hr>');
            eventSource.close();
        }
        if(event?.data) {
            let ping_data = JSON.parse(event.data);
            if(ping_data?.action && ping_data?.action === 'login'){
                content.html(content.html() + 'Login: ' + '<span class="cursor"></span>');
                content.focus();
            }
            console.log(ping_data);
        }
    });
}

export { main }