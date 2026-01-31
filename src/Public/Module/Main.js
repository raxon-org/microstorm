let main = {};

main.init = (options) => {
    let terminal = select(options?.selector);
    if(terminal){
        terminal.html('Initializing terminal...<br>' + "\n" + '<span class="cursor"></span><br>' + "\n");
        main.focus_end(terminal);
    } else {
        return;
    }
    main.event_source(options);
    main.keyboard_backspace(options);
}

main.keyboard_backspace = (options) => {
    const terminal = select(options?.selector);
    terminal.on('keydown', (event) => {
    if (event.key !== "Backspace") {
        return;
    }
    const stopSpan = terminal.select('.cursor');
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);

    // Only care when caret is collapsed (no selection)
    if (!range.collapsed) return;

    const { startContainer, startOffset } = range;

        // Case 1: Cursor is inside the protected span
    if (stopSpan.contains(startContainer)) {
        event.preventDefault();
            return;
        }

        // Case 2: Cursor is immediately after the protected span
        if (
            startContainer.nodeType === Node.TEXT_NODE &&
            startOffset === 0
        ) {
            const prev = startContainer.previousSibling;
            if (prev === stopSpan) {
                event.preventDefault();
            }
        }
    });
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
main.focus_end = (editor) => {
    editor.focus();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
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
                content.html(content.html() + "\n" + 'Login: <span class="cursor"></span>');
                let line_nr = main.line_count(content);
                let column_nr = main.column_count(content, line_nr);
                console.log(line_nr);
                console.log(column_nr);
                main.focus_end(content);
            }
            console.log(ping_data);
        }
    });
}

export { main }