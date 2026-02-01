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
                    'action': data?.action
                };
                request(options?.url?.command, post, (url, response) => {
                    console.log(response);
                })
                console.log(event);
            }
        }
    })
    cursor.focus();
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
                data?.action
            ){
                let cursor = null;
                switch(data?.action){
                    case 'login':
                        content.html(content.html() + "\n" + ' Login:&nbsp;<span class="cursor" contenteditable="true"></span>');
                        cursor = content.select('.cursor');
                        main.cursor(options, cursor, data);
                        break;
                    case 'login.host':
                        content.html(content.html() + "\n" + ' Host:&nbsp;<span class="cursor" contenteditable="true"></span>');
                        cursor = content.select('.cursor');
                        main.cursor(options, cursor, data);
                        break;

                }

                //main.focus_end(content)

            }
            console.log(data);
        }
    });
}

export { main }