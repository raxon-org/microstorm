let main = {};

main.init = (options) => {
    let terminal = select(options?.selector);
    if(terminal){
        terminal.html('Initializing terminal...<br><span class="prompt" contenteditable="true"></span>');
        let prompt = terminal.select('.prompt');
        prompt.focus();
        console.log('focus?');
    } else {
        return;
    }
    main.event_source(options);
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