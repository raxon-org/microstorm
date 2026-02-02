let main = {};

main.init = (options) => {
    let terminal = select(options?.selector);
    if(terminal){
        terminal.html('Initializing terminal...' + "\n" );
        // main.readonly(terminal);
        //main.focus_end(terminal);
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
main.focus_end = (editor) => {
    editor.focus();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

main.cursor = (options, cursor, data) => {
    cursor.on('keydown', (event) => {
        if(event.key === 'Enter'){
            if(event.shiftKey === false){
                event.preventDefault();
                const post = {
                    'input': cursor.innerText + '\n',
                    'uuid': data?.uuid,
                    'action': data?.command?.action
                };
                request(options?.url?.command, post, (url, response) => {
                    cursor.innerText = '';
                    console.log(response);
                })
                console.log(event);
            }
        }
    });
    cursor.focus();
    const range = document.createRange();
    range.selectNodeContents(cursor);
    range.collapse(false); // false = collapse to end
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
            let data = JSON.parse(event.data);
            if(
                data?.uuid &&
                data?.command?.action
            ){
                let cursor = null;
                /*
                const to_remove = content.select('.cursor');
                if(to_remove){
                    if(to_remove.length > 1){
                        cursor = to_remove.pop() ?? null;
                    } else {
                        cursor = to_remove;
                    }
                }
                 */
                const output = data?.output.join("");
                switch(data?.command?.action){
                    case 'login':
                    case 'login.host':
                    case 'login.password':
                    case 'login.shell':
                    case 'shell':
                    case 'shell.command':
                    default:
                        // let range = null;
                        /*
                        if(cursor !== null){
                            // cursor.focus();
                            // range = main.cursor_position_save();
                            cursor.remove();
                        }
                        if(to_remove){
                            to_remove.remove();
                        }
                         */
                        content.html(output + '<span class="cursor" contenteditable="true"></span>');
                        cursor = content.select('.cursor');
                        /*
                        if(!cursor){

                            cursor = content.select('.cursor');
                        } else {
                            content.html(output);
                            content.append(cursor);
                            cursor = content.select('.cursor');
                        }
                         */
                        main.cursor(options, cursor, data);
                        /*
                        if(range !== null){
                            main.cursor_position_restore(range);
                        }
                         */
                    break;
                }

                //main.focus_end(content)

            }
            console.log(data);
        }
    });
}

main.cursor_position_save = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return null;
    return selection.getRangeAt(0);
}

main.cursor_position_restore = (range) => {
    if (!range) return;
    console.log(range);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

export { main }