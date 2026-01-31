/**
 * @author Remco van der Velde
 * @since 2015-02-18
 * @version 1.0.0
 *
 * @package priya
 * @subpackage js
 * @category core
 *
 * @description
 *
 * @todo
 *
 *
 * @changeLog
 * 1.0.0
 *  -    all
 */

var priya = function (collection){
    this.version = '0.3.22';
    this.collect = {};
    this.parent = this;
    this.load = 0;
    this.hit = 0;    
    this.collect.url = collection.url;
    this.collect.web = {};
    this.collect.web.root = collection.url;
    this.collect.web.bin = collection.bin;
    this.collect.web.priya = collection.priya;
    this.collect.parameters = collection.parameters;
    this.collect.require = {};
    this.collect.require.jid = 1;
    var jid = this.collect.require.jid;
    let agent = navigator.userAgent;
    let needle = 'SamsungBrowser/';
    let position = agent.toLowerCase().indexOf((needle).toLowerCase());
    let url;
    if(position){
        //if browser is SamsungBrowser/19.0  use date otherwise Bootstrap will only be available on one subdomain (the init) and not on the (docs).
        url = this.collect.web.bin + 'Bootstrap.json?' + this.version + '.' + this.uuid();
    } else {
        url = this.collect.web.bin + 'Bootstrap.json?' + this.version;
    }
    this.get(url, function(url, data){
        priya.collect.data = {};
        priya.collect.data[jid] = {};
        priya.collect.data[jid].toLoad = 1;
        //priya.collect.require = {};
        priya.collect.require.toLoad--;
        if(typeof data != 'object'){
            priya.collect.data[jid].loaded = 0;
            console.log('data malformed in get' + url);
        }
        if(data.collect){
            var index;
            for(index in data.collect){
                priya.collect[index] = data.collect[index];
            }
        }
        /* require needs this */
        priya.expose();
        priya.collect.data[jid].loaded = 1;
        priya.collect.require.loaded--;
        priya.collect.data[jid].file = [];
        priya.collect.data[jid].file.push(url);
        if(data.require.file){
            var index = 0;
            for(index=0; index < data.require.file.length; index++){
                data.require.file[index] = priya.collect.web.bin + data.require.file[index] + '?' + priya.collect.version;
            }
            require(data.require.file, function(){
                priya.expose('window');
            });
        }
    });
}

priya.prototype.uuid = function (){
    let uuid = "";
    let i;
    let random;
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += "-";
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
}

priya.prototype.namespace = function (namespace) {
    if(typeof namespace == 'undefined' || namespace === '__proto__'){
        priya.debug('undefined namespace');
        return;
    }
    if(Object.prototype.toString.call(priya) === '[object Function]'){
        var object = this;
    } else {
        var object = priya;
    }
    if (typeof object['namespace'][namespace] === 'undefined') {
        object['namespace'][namespace] = {};
    }
    object = object['namespace'][namespace];
    if(Object.prototype.toString.call(priya) === '[object Function]'){
        object = this.attach(object);
    } else {
        object = priya.attach(object);
    }
    return object;
}

priya.prototype.expose = function (collection, attribute){
    if(typeof collection == 'undefined'){
        var expose = this.collect.expose;
        var index;
        for(index in expose){
            if(index === 'window'){
                continue;
            }
            var name = expose[index];
            window[name] = this[index].bind(window);
        }
    } else {
        if(typeof attribute === 'undefined'){
            if(collection === 'window'){
                var expose = this.collect.expose[collection];
                var index;
                for(index in expose){
                    var name = expose[index];
                    if(typeof _('prototype')[index]?.bind == 'function'){
                        window[name] = _('prototype')[index].bind(window);
                    } else {
                        window[name] = _('prototype')[index];
                    }
                }
            }
        } else {
            console.log('expose; collection: ' + collection +' attribute: ' + attribute);
        }
    }
}

priya.prototype.requireElement= function(url, closure){
    var split = url.split('.css');
    if(split.length === 2){
        var element = document.createElement('link');
        if(Object.prototype.toString.call(priya) === '[object Function]'){
            element = this.attach(element);
        } else {
            element = priya.attach(element);
        }        
        var jid = priya.collect.require.jid;
        element.setAttribute('href', url);
        element.setAttribute('rel', 'stylesheet');
        element.setAttribute('data-require-once', true);        
        element.addEventListener('load', function(event){
            var file = priya.collect.require[jid].file ? priya.collect.require[jid].file : [];
            file.push(this.getAttribute('href'));
            if(typeof priya.collect.require[jid] == 'undefined'){
                priya.collect.require[jid] = {
                    'loaded' : 0                    
                };
            }
            priya.collect.require[jid].file = file;
            var loaded = priya.collect.require[jid].loaded ? priya.collect.require[jid].loaded : 0;
            priya.collect.require[jid].loaded = ++loaded;         
            if(priya.collect.require[jid].loaded == priya.collect.require[jid].toLoad){            
                closure();
            }
        }, false);        
        document.getElementsByTagName("head")[0].appendChild(element);
    } else {
        var element = document.createElement('script');
        if(Object.prototype.toString.call(priya) === '[object Function]'){
            element = this.attach(element);
        } else {
            element = priya.attach(element);
        }
        var jid = priya.collect.require.jid;
        element.setAttribute('src', url);
        element.setAttribute('defer', 'defer');
        element.setAttribute('data-require-once', true);        
        element.addEventListener('load', function(event){
            var file = priya.collect.require[jid].file ? priya.collect.require[jid].file : [];
            file.push(this.getAttribute('src'));
            if(typeof priya.collect.require[jid] == 'undefined'){
                priya.collect.require[jid] = {
                    'loaded' : 0                    
                };
            }
            var loaded = priya.collect.require[jid].loaded ? priya.collect.require[jid].loaded : 0;
            priya.collect.require[jid].file = file;            
            priya.collect.require[jid].loaded = ++loaded;         
            if(priya.collect.require[jid].loaded == priya.collect.require[jid].toLoad){            
                closure();
            }
        }, false);        
        document.getElementsByTagName("head")[0].appendChild(element);
    }        
    if(Object.prototype.toString.call(priya) === '[object Function]'){
        if(typeof this.collect.require[jid] == 'undefined'){
            this.collect.require[jid] = {
                'loaded' : 0                    
            };
        }
        var toLoad = this.collect.require[jid].toLoad ? this.collect.require[jid].toLoad : 0;
        this.collect.require[jid].toLoad = ++toLoad;
    } else {
        if(typeof priya.collect.require[jid] == 'undefined'){            
            priya.collect.require[jid] = {
                'loaded' : 0                    
            };
        }
        var toLoad = priya.collect.require[jid].toLoad ? priya.collect.require[jid].toLoad : 0;
        priya.collect.require[jid].toLoad = ++toLoad;
    }
    return element;
}

priya.prototype.require= function(url, closure){    
    var script = document.querySelectorAll('script');
    var link = document.querySelectorAll('link');
    var call = Object.prototype.toString.call(url);    
    var jid = priya.collect.require.jid ? priya.collect.require.jid : 0;
    priya.collect.require.jid = ++jid;
    if(call === '[object Array]'){
        var i;              
        for(i=0; i < url.length; i++){
            var item = url[i];                        
            var found = false;
            var index;
            if(script){                
                for(index = 0; index < script.length; index++){
                    if(Object.prototype.toString.call(priya) === '[object Function]'){
                        var node = this.attach(script[index]);
                    } else {
                        var node = priya.attach(script[index]);
                    }                    
                    if(node.getAttribute('data-require-once') === 'true' && node.src === item){
                        found = node;
                        break;
                    }                    
                }
            }
            if(link){
                for(index = 0; index < link.length; index++){
                    if(Object.prototype.toString.call(priya) === '[object Function]'){
                        var node = this.attach(link[index]);
                    } else {
                        var node = priya.attach(link[index]);
                    }                    
                    if(node.getAttribute('data-require-once') === 'true' && node.href === item){
                        found = node;
                        break;
                    }
                }
            }            
            if(found === false){                
                if(Object.prototype.toString.call(priya) === '[object Function]'){
                    element = this.requireElement(item, closure);
                } else {                    
                    element = priya.requireElement(item, closure);                    
                }
            } else {                               
                if(typeof priya.collect.require[jid] == 'undefined'){            
                    priya.collect.require[jid] = {
                       'loaded' : 0                            
                    };
                }
                var toLoad = priya.collect.require[jid].toLoad ? priya.collect.require[jid].toLoad : 0;
                priya.collect.require[jid].toLoad = ++toLoad;                
                if(typeof priya.collect.require[jid].file == 'undefined'){
                    priya.collect.require[jid].file = [];
                }
                priya.collect.require[jid].file.push(item);
                priya.collect.require[jid].loaded++;

                if(
                    priya.collect.require[jid].loaded === priya.collect.require[jid].toLoad &&
                    i === (url.length -1)
                ){                                    
                    closure();
                    return true;
                }                            
            }
        }                
        return true;
    } else {
        var item = url;
        var found = false;
        var index;
        if(script){
            for(index = 0; index < script.length; index++){
                if(Object.prototype.toString.call(priya) === '[object Function]'){
                    var node = this.attach(script[index]);
                } else {
                    var node = priya.attach(script[index]);
                }
                if(node.getAttribute('data-require-once') === 'true' && node.src === item){
                    found = true;
                }
            }
        }
        if(link){
            for(index = 0; index < link.length; index++){
                if(Object.prototype.toString.call(priya) === '[object Function]'){
                    var node = this.attach(link[index]);
                } else {
                    var node = priya.attach(link[index]);
                }
                if(node.getAttribute('data-require-once') === 'true' && node.href === item){
                    found = true;
                }
            }
        }        
        if(found === false){
            if(Object.prototype.toString.call(priya) === '[object Function]'){
                this.requireElement(item, closure);
            } else {
                priya.requireElement(item, closure);
            }
        } else {
            closure();
            return true;
        }
    }
}

priya.prototype.attach = function (element){
    if(element === null){
        return false;
    }
    if(typeof element != 'object'){
        return false;
    }
    if(typeof element['Priya'] == 'object'){
        return element;
    }
    var dom;
    if(this.isDom === true){
        dom = this;
    }
    else if(typeof this['Priya'] == 'undefined'){
        dom = this;
    }
    else if(typeof this['Priya']['dom'] == 'object'){
        dom = this['Priya']['dom'];
    } else {
        dom = this;
    }
    var property;
    for(property in dom){
        if(typeof dom[property] != 'function'){
            continue;
        }
        if(property === 'parentNode'){
            continue;
        }
        element[property] = dom[property].bind(element);
    }
    element['parent'] = dom['parentNode'].bind(element);
    element['Priya'] = {
            "version": priya.version,
            "dom" : dom
    };
    if(typeof element.tagName != 'undefined'){
        if(typeof this.microtime == 'function' && typeof element.data == 'function'){
            element.data('mtime', this.microtime(true));
        }
    }
    return element;
}

priya.prototype.get = function (url, script){
    var xhttp = new XMLHttpRequest();
    if(typeof this.collect.require == 'undefined'){
        this.collect.require = {};
    }
    this.collect.require.toLoad = this.collect.require.toLoad ? this.collect.require.toLoad : 0;
    this.collect.require.toLoad++;
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if(xhttp.status === 200){
                if(xhttp.responseText.substring(0, 1) === '{' && xhttp.responseText.substring(xhttp.responseText.length-1) === '}'){
                    var data = JSON.parse(xhttp.responseText);
                    priya.collect.require.loaded = priya.collect.require.loaded ? priya.collect.require.loaded : 0;
                    priya.collect.require.loaded++;
                    script(url, data);
                } else {
                    if(typeof priya.debug !== 'undefined' && typeof run !== 'undefined' ){
                        priya.debug(xhttp.responseText);
                    } else {
                        console.log(xhttp.responseText);
                    }
                }
            } else {
                alert(url);
                alert('error:' + xhttp.status);
                if(xhttp.responseText === ''){
                    alert('empty response / response rejected.');
                } else {
                    alert('have responseText');
                }
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}

priya.prototype.parentNode = function (parent){
    if(typeof parent == 'undefined'){
        if(typeof this['attach'] != 'function'){
            console.log('cannot attach without an atach method');
            console.log(this);
            if(typeof this['methods'] == 'function'){
                console.log('methods:');
                console.log(this.methods());
            }
            return this.parentNode;
        } else {
            return this.select(this.parentNode);
        }
    } else {
        return this.parentNode;
    }
}
