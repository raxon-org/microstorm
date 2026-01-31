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

main.goto_line = (editor, line_nr) => {
        const text = editor.innerText.split("\n");

        // Validate line number
        if (line_nr < 1 || line_nr > text.length) {
            alert("Line number out of range.");
            return;
        }

        // Create a range and selection
        const range = document.createRange();
        const sel = window.getSelection();

        // Find the target text node for the given line
        let charCount = 0;
        let targetNode = null;
        let offset = 0;

        function findNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const lines = node.textContent.split("\n");
                for (let i = 0; i < lines.length; i++) {
                    charCount++;
                    if (charCount === line_nr) {
                        targetNode = node;
                        offset = lines.slice(0, i).join("\n").length + (i > 0 ? 1 : 0);
                        return true;
                    }
                }
            } else {
                for (let child of node.childNodes) {
                    if (findNode(child)) return true;
                }
            }
            return false;
        }

        // Simpler approach: navigate by block elements
        const childLines = editor.childNodes;
        if (line_nr <= childLines.length) {
            targetNode = childLines[line_nr - 1].firstChild || childLines[line_nr - 1];
            offset = 0;
        }

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
            console.log(ping_data);
        }
    });
}

export { main }