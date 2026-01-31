let main = {};

main.init = (options) => {
    let terminal = select(options?.selector);
    if(terminal){
        terminal.html('Initializing terminal...<br>' + "\n" + '<span class="cursor"></span><br>' + "\n");
        let lc = main.line_column(terminal);
        console.log(lc);
        // main.goto_line(terminal, 2);
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

main.caret_get_offset = (element) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return 0;

    const range = selection.getRangeAt(0);
    const preRange = range.cloneRange();

    preRange.selectNodeContents(element);
    preRange.setEnd(range.endContainer, range.endOffset);

    return preRange.toString().length;
}


main.line_column = (element) => {
    const offset = main.caret_get_offset(element);
    console.log(offset);

    // Normalize text: <div>, <p>, <br> → newlines
    const text = element.innerText || element.textContent;

    let line = 1;
    let column = 1;
    let count = 0;

    for (let i = 0; i < text.length; i++) {
        if (count === offset) break;

        if (text[i] === '\n') {
            line++;
            column = 1;
        } else {
            column++;
        }
        count++;
    }
    return { line, column };
}

main.goto_colum = (editor, column_nr) => {
    const selection = window.getSelection();
    const range = document.createRange();

        // Get all text nodes inside the contenteditable
    const walker = document.createTreeWalker(
        editor,
        NodeFilter.SHOW_TEXT,
        null
    );

    let node;
    let offset = 0;

    while ((node = walker.nextNode())) {
        const text = node.textContent;
        console.log(text);
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                offset = 0; // reset column on new line
            } else {
                if (offset === column_nr) {
                    range.setStart(node, i);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    return;
                }
                offset++;
            }
        }
    }
}

main.goto_line = (editor, line_nr) => {
    const length = main.line_count(editor);
    // Validate line number
    if (line_nr < 1 || line_nr > length) {
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
        main.goto_colum(editor, main.column_count(editor, line_nr));
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
                content.html(content.html() + "\n" + 'Login: ' + '<span class="cursor"></span>');

                let result = main.line_column(content);
                console.log(result);

                // main.goto_line(content, line_nr);
                // content.focus();
            }
            console.log(ping_data);
        }
    });
}

export { main }