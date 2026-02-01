let main = {};

main.init = (options) => {
    let terminal = select(options?.selector);
    if(terminal){
        terminal.html(' <span class="readonly">Initializing terminal...<br></span>' + "\n" );
        main.readonly(terminal);
        main.focus_end(terminal);
    } else {
        return;
    }
    main.event_source(options);
}

main.readonly = (editor) => {
    editor.addEventListener("keydown", (e) => {
        const sel = window.getSelection();
        if (!sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        const node = range.startContainer;

        // Prevent deleting protected spans
        if (
            (e.key === "Backspace" || e.key === "Delete") &&
            node.parentElement?.classList.contains("readonly")
        ) {
            e.preventDefault();
        }
        else if (
            (e.key === "Backspace" || e.key === "Delete") &&
            node?.classList.contains("readonly")
        ) {
            e.preventDefault();
        }
    });

    /*
    editor.addEventListener('beforeinput', (e) => {
        console.log(e);
        /*
        else if (e.target.closest('.readonly')) {
            e.preventDefault();
        }

    });
     */
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
                content.html(content.html() + "\n" + ' <span class="readonly">Login:&nbsp;</span><span class="cursor"></span>');
                //main.focus_end(content)
                let cursor = select('.cursor');
                cursor.focus();
            }
            console.log(ping_data);
        }
    });
}

export { main }