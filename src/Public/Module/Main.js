let main = {};

main.init = (options) => {
    let terminal = select(options?.selector);
    if(terminal){
        terminal.html('Initializing terminal...' + "\n" );
        // main.readonly(terminal);
        main.focus_end(terminal);
    } else {
        return;
    }
    main.event_source(options);
}

main.readonly = (editor) => {
    editor.addEventListener("input", () => {
        const nodelist = editor.select(".readonly")
        for(let index = 0; index < nodelist.length; index++){
            let span = nodelist[index];
            span.setAttribute("contenteditable", "false");
        }
    });
    editor.addEventListener("keydown", (e) => {
        if (e.key !== "Delete" && e.key !== "Backspace") return;

        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);

        const to_delete = main.get_node_about_to_delete(range, e.key);
        console.log("Will delete:", to_delete);
    });
    /*
    editor.addEventListener("input", (e) => {
        console.log(e);
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        console.log(e);
        const range = sel.getRangeAt(0);
        const node = range.startContainer;
        console.log('######################NODE');
        console.log(node);
        if(e.inputType === "deleteContentBackward"){
            const range = document.createRange();
            range.setStartBefore(e.target);
            range.collapse(true);

            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
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
    */
    editor.addEventListener("click", (e) => {
        if (e.target.classList.contains("readonly")) {
            const range = document.createRange();
            range.setStartAfter(e.target);
            range.collapse(true);

            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
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

main.get_node_about_to_delete = (range, key) => {
    const container = range.startContainer;
    const offset = range.startOffset;
    // Text node
    if (container.nodeType === Node.TEXT_NODE) {
        if (key === "Backspace" && offset > 0) {
            return container;
        }
        if (key === "Delete" && offset < container.length) {
            return container;
        }
        // At text boundary → look at siblings
        return key === "Backspace"
            ? container.previousSibling
            : container.nextSibling;
    }
    // Element node
    if (container.nodeType === Node.ELEMENT_NODE) {
        return key === "Backspace"
            ? container.childNodes[offset - 1]
            : container.childNodes[offset];
    }
    return null;
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
                content.html(content.html() + "\n" + ' Login:&nbsp;<span class="cursor" contenteditable="true"></span>');
                //main.focus_end(content)
                let cursor = content.select('.cursor');
                cursor.focus();
            }
            console.log(ping_data);
        }
    });
}

export { main }