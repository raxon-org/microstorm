let main = {};

main.init = (options) => {
    let terminal = select(options?.selector);
    if(terminal){
        terminal.html('Initializing terminal...<br>' + "\n" + '<span class="cursor"></span><br>' + "\n");
        main.line_column(terminal, 2, 1);
    } else {
        return;
    }
    main.event_source(options);
}

main.line_count = (editor) => {
    const text = editor.innerText.split("\n");
    return text.length;
}

main.column_count = (editor, line_nr) => {
    const text = editor.innerText.split("\n");
    let index;
    console.log('line nr:' + line_nr);
    for(index=0; index < text.length; index++){
        if(index === line_nr){
            return text[index].length;
        }
    }
    return 0;
}

main.line_column = (editable, line, column) => {
    editable.focus();

    const text = editable.innerText || editable.textContent;
    console.log(text.length);
    const lines = text.split('\n');

    if (line < 1) line = 1;
    if (line > lines.length) line = lines.length;

    console.log(lines);
    console.log(line);

    const targetLine = lines[line -1];
    const col = Math.min(column-1 , targetLine.length);

    console.log(targetLine);

    // Convert line/column to absolute offset
    let offset = 0;
    for (let i = 0; i < line - 1; i++) {
        offset += lines[i].length + 1; // +1 for '\n'
    }
    offset += col;
    console.log(offset);

    // Walk text nodes to find offset
    const range = document.createRange();
    const selection = window.getSelection();

    let currentOffset = 0;

    function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const nextOffset = currentOffset + node.length;
            if (offset <= nextOffset) {
                range.setStart(node, node.length - 1);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
                return true;
            }
            currentOffset = nextOffset;
        } else {
            for (const child of node.childNodes) {
                if (walk(child)) return true;
            }
        }
        return false;
    }
    walk(editable);
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
                content.html(content.html() + "\n" + 'Login: ');
                let line_nr = main.line_count(content);
                let column_nr = main.column_count(content, line_nr);
                console.log(line_nr);
                console.log(column_nr);
                main.line_column(content, line_nr, column_nr);
            }
            console.log(ping_data);
        }
    });
}

export { main }