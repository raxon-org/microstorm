let main = {};

main.init = () => {
    let selector = '.terminal';
    let terminal = select(selector);
    if(terminal){
        terminal.html('Initializing terminal...');
    }
    main.event_source(selector);
}

main.event_source = (selector) => {
    let eventSource = new EventSource(url_sse, {
        withCredentials: true,
    });
    eventSource.addEventListener('ping', (event) => {
        let content = select(selector);
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