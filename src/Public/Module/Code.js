import hljs from '/Js/Highlight/highlight.min.js';

let code = {};

code.init = () => {
    hljs.highlightAll();
    let list = select('.prettyprinted');
    console.log(list);
    if(is.nodeList(list)){
        for(let i=0; i < list.length; i++){
            let item = list[i];
            let copy = priya.create('button');
            copy.type = 'button';
            copy.title = 'Copy to clipboard';
            copy.html('<img src="/Svg/Icon/Copy.svg" alt="Copy" />');
            copy.on('click', () => {
                let code = item.select('code');
                let text = code.textContent;
                let array = text.split('\n');
                let index;
                for(index=0; index < array.length; index++){
                    array[index] = array[index].trim();
                }
                text = array.join('\n');
                navigator.clipboard.writeText(text).then(function() {
                    //nothing
                }).catch(function(error) {
                    //nothing
                });
            });
            copy.addClass('copy');
            item.append(copy);
        }
    } else {
        let item = list;
        let copy = priya.create('button');
        copy.type = 'button';
        copy.title = 'Copy to clipboard';
        copy.html('<img src="/Svg/Icon/Copy.svg" alt="Copy" />');
        copy.on('click', () => {
            let code = item.select('code');
            let text = code.textContent ;
            let array = text.split('\n');
            let index;
            for(index=0; index < array.length; index++){
                array[index] = array[index].trim();
            }
            text = array.join('\n');
            navigator.clipboard.writeText(text).then(function() {
                //nothing
            }).catch(function(error) {
                //nothing
            });
        });
        copy.addClass('copy');
        if(item){
            item.append(copy);
        }
    }
}

export { code };