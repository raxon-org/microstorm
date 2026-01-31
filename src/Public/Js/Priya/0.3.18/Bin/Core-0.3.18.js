/**
 * Active.prototype.js
 */
_('prototype').active = function (){
    return document.activeElement;
}

priya.active = _('prototype').active;

/**
 * Append.prototype.js
 */
//might not work anymore use appendChild instead...
_('prototype').append = function(node){
    this.appendChild(node);
    return this;
}

priya.append = _('prototype').append;

/**
 * Attach.prototype.js
 */
/**
 * required & written in Priya.prototype.js
 */


/**
 * Attribute.prototype.js
 */
_('prototype').attribute = function (attribute, value){
    if(attribute == 'has'){
        var attr;
        for (attr in this.attributes){
            if(typeof this.attributes[attr].value == 'undefined'){
                continue;
            }
            if(this.attributes[attr].name == value){
                return true;
            }
        }
        return false;
    }
    else if(attribute == 'remove' || attribute == 'delete'){
        this.removeAttribute(value);
        return;
    }
    if(typeof value == 'undefined'){
        if(typeof attribute == 'undefined'){
            var attr;
            value = {};
            for (attr in this.attributes){
                if(typeof this.attributes[attr].value == 'undefined'){
                    continue;
                }
                value[this.attributes[attr].name] = this.attributes[attr].value;
            }
            return value;
        } else {
            var attr;
            value = null;
            for (attr in this.attributes){
                if(this.attributes[attr].name == attribute){
                    value = this.attributes[attr].value;
                }
            }
            return value;
        }
    } else {
        if (typeof this.setAttribute == 'function'){
            if(value === null){
                this.setAttribute(attribute, value);
            }
            else if(typeof value == 'object' && typeof value.nodeType != 'undefined'){
                var selector = value.tagName;
                if(typeof selector == 'undefined' && value instanceof HTMLDocument){
                    return value;
                }
                selector = selector.toLowerCase();
                if(value.id){
                    selector += ' #' + value.id;
                }
                if(value.className){
                    selector += ' .' + this.str_replace(' ','.',value.className);
                }
                this.setAttribute(attribute, selector);
            }
            else if(typeof value == 'object'){
                for(attr in value){
                    this.attribute(attribute + '-' + attr, value[attr]);
                }
            } else {
                this.setAttribute(attribute, value);
            }

        }
        return value;
    }
}

priya.attribute = _('prototype').attribute;

/**
 * Basename.prototype.js
 */
_('prototype').basename = function (path, suffix){
    var b = path;
    var lastChar = b.charAt(b.length - 1);
    if (lastChar === '/' || lastChar === '\\') {
        b = b.slice(0, -1);
    }
    b = b.replace(/^.*[\/\\]/g, '');
    if (typeof suffix === 'string' && b.substr(b.length - suffix.length) == suffix) {
        b = b.substr(0, b.length - suffix.length);
    }
    return b;
}

priya.basename = _('prototype').basename;

/**
 * Calculate.prototype.js
 */
_('prototype').calculate = function (calculate){
    var result = null;
    switch(calculate){
        case 'all':
        	var className = this.className;
        	this.addClass('display-block overflow-auto');
            var rect = this.getBoundingClientRect();
            var result = {};
            result.window = {};
            result.dimension = {};
            result.window.width = window.innerWidth;
            result.window.height = window.innerHeight;
            for (attribute in rect){
                result['dimension'][attribute] = rect[attribute];
            }
            var style = window.getComputedStyle(this);
            result.margin = {
                left: parseInt(style["margin-left"]),
                right: parseInt(style["margin-right"]),
                top: parseInt(style["margin-top"]),
                bottom: parseInt(style["margin-bottom"])
            };
            result.padding = {
                left: parseInt(style["padding-left"]),
                right: parseInt(style["padding-right"]),
                top: parseInt(style["padding-top"]),
                bottom: parseInt(style["padding-bottom"])
            };
            result.border = {
                left: parseInt(style["border-left-width"]),
                right: parseInt(style["border-right-width"]),
                top: parseInt(style["border-top-width"]),
                bottom: parseInt(style["border-bottom-width"])
            };
            result.top = result.dimension.top;
            result.bottom = result.window.height - result.dimension.bottom;
            result.height = result.dimension.height;
            result.width = result.dimension.width;
            result.left = result.dimension.left;
            result.right = result.dimension.right;
            result.offset = {};
            result.offset.parent = this.createSelector(this.offsetParent);
            result.offset.left = this.offsetLeft;
            result.offset.top = this.offsetTop;
            delete result.dimension;
            this.data(result);
            this.className = className;
            return result;
        break;
        case 'offset':
            var result = {};
            result.offset = {};
            result.offset.parent = this.createSelector(this.offsetParent);
            result.offset.left = this.offsetLeft;
            result.offset.top = this.offsetTop;
            this.data(result);
            return result.offset;
        break;
        case 'window-width':
            result =  window.innerWidth;
            return result;
        break;
        case 'window-height':
            result =  window.innerHeight;
            return result;
        break;
        case 'width':
            var className = this.className;
            this.addClass('display-block overflow-auto');
            result =  this.offsetWidth;
            this.className = className;
            return result;
        break;
        case 'height':
            var className = this.className;
            this.addClass('display-block overflow-auto');
            result =  this.offsetHeight;
            this.className = className;
            return result;
        break;
    }
}

priya.calculate = _('prototype').calculate;

/**
 * Children.prototype.js
 */
_('prototype').children = function (index){
    var children;
    if(typeof index == 'undefined'){
        children = this.childNodes;
        var count;
        for(count=0; count < children.length; count++){
            children[count] = this.attach(children[count]);
        }
        return children;
    } else {
        if(index === 'first' || index === ':first'){
            return this.attach(this.childNodes[0]);
        }
        else if(index === 'last' || index === ':last'){
            return this.attach(this.childNodes[this.childNodes.length-1]);
        } else {
            var i;
            for(i=0; i < this.childNodes.length; i++){
                if(index === i){
                    return this.attach(this.childNodes[i]);
                }
            }
        }
    }
    return false;
}

priya.children = _('prototype').children;

/**
 * Class.prototype.js
 */
_('prototype').addClass = function(className){
    var className = this.str_replace('&&', ' ', className);
    var list = className.split(' ');
    var index;
    for(index = 0; index < list.length; index++){
        var name = this.trim(list[index]);
        if(this.is_empty(name)){
            continue;
        }
        if(this.is_nodeList(this)){
            var i;
            for(i = 0; i < this.length; i++){
                var node = this[i];
                if(node.classList.contains(name) === false){
                    node.classList.add(name);
                }
            }
        } else {            
            if(this.classList && this.classList.contains(name) === false){
                if(typeof this.classList == 'object'){
                    this.classList.add(name);
                } else {
                    this.debug('error in classlist with ' + this.classname + ' ' + name);
                    console.log(this);
                }
            }
        }
    }
    return this;
}

_('prototype').getClass = function(){
    let index;
    let array = [];
    for(index=0; index < this.classList.length; index++){
        array.push(this.classList[index]);
    }
    return array.join(' ');
}

_('prototype').removeClass = function(className){
    if(!className){
        return;
    }
    var className = this.str_replace('&&', ' ', className);
    if(typeof this.className == 'undefined'){
        var index;
        for(index=0; index < this.length; index++){
            if(typeof this[index].className != 'undefined' && typeof this[index].Priya != 'undefined'){
                this[index].removeClass(className);
            }
        }
        return this;
    }
    var list = className.split(' ');
    var index;
    for(index = 0; index < list.length; index++){
        var name = this.trim(list[index]);
        if(this.is_empty(name)){
            continue;
        }
        if(this.classList.contains(name) !== false){
            this.classList.remove(name);
        }
        if(this.classList.contains(name) !== false){
            console.warn('could not remove class (' + name + ')');
        }
    }
    return this;
}

_('prototype').toggleClass = function(className){
    var className = this.str_replace('&&', ' ', className);
    if(typeof this.className == 'undefined'){
        var index;
        for(index=0; index < this.length; index++){
            if(typeof this[index].className != 'undefined' && typeof this[index].Priya != 'undefined'){
                this[index].toggleClass(className);
            }
        }
        return this;
    }
    var list = className.split(' ');
    var index;
    for(index = 0; index < list.length; index++){
        var name = this.trim(list[index]);
        if(this.is_empty(name)){
            continue;
        }
        if(this.classList.contains(name) !== false){            
            this.classList.remove(className);
        } else {
            this.classList.add(className);
        }
    }
    return this;
}

_('prototype').hasClass = function (className){
    var className = this.str_replace('&&', ' ', className);
    if(typeof this.className == 'undefined'){
        var index;
        var collection = [];
        for(index=0; index < this.length; index++){
            if(typeof this[index].className != 'undefined' && typeof this[index].Priya != 'undefined'){
                collection.push(this[index].hasClass(className));
            }
        }
        for(index=0; index < collection.length; index++){
            if(collection[index] === false){
                return false;
            }
        }
        return true;
    }
    var list = className.split(' ');
    var index;
    for(index = 0; index < list.length; index++){
        var name = this.trim(list[index]);
        if(this.is_empty(name)){
            continue;
        }
        if(this.classList.contains(name) !== false){            
            return true;
        }
    }
    return false;
}

priya.addClass = _('prototype').addClass;
priya.getClass = _('prototype').getClass;
priya.removeClass = _('prototype').removeClass;
priya.toggleClass = _('prototype').toggleClass;
priya.hasClass = _('prototype').hasClass;

/**
 * Clone.prototype.js
 */
_('prototype').clone = function (deep){
    var clone  = this.cloneNode(deep);
    clone = this.select(clone);
    if(typeof this['Priya']['eventListener'] != 'undefined'){
        var event;
        for(event in this['Priya']['eventListener']){
            var list = this['Priya']['eventListener'][event];
            var index;
            for(index = 0; index < list.length; index++){
                var action = list[index];
                clone.on(event, action);
            }
        }
    }
    return clone;
}

priya.clone = _('prototype').clone;

/**
 * Closest.prototype.js
 */
_('prototype').closest = function(attribute, node, type){
    var parent;    
    if(this.function_exist(node)){
        parent = this.parent();
        if(parent === false){
            var priya = this.attach(this.create('element', attribute));
            priya.data('selector', attribute);
            return priya;
        }
        var bool = parent[node](attribute, type);
        if(bool === false){
            parent = parent.closest(attribute, node, type);
        }
        return this.attach(parent);
    } else {
        if(typeof node == 'undefined'){
            if(typeof this.parent != 'function'){
                var priya = this.attach(this.create('element', attribute));
                priya.data('selector', attribute);
                return priya;
            } else {
                parent = this.parent();
                parent = this.attach(parent);
            }
        } else {
            parent = node.parent();
            parent = this.attach(parent);
        }
        if(parent === false){
            var priya = this.attach(this.create('element', attribute));
            priya.data('selector', attribute);
            return priya;
        }
        if(this === parent && parent === node){
            parent = this.attach(this.parentNode);
        }
        if(
            typeof attribute.toLowerCase === 'function' &&
            parent.tagName.toLowerCase() === attribute.toLowerCase()
        ){
            parent = this.attach(parent);
            return parent;
        }

        var select = parent.select(attribute);
        if(!select){
            select = parent.closest(attribute, parent);
        }
        /*
        if(select === false){
            select = parent.closest(attribute, parent);
        }
        */
        var select = this.attach(select);
        return select;
    }
}

priya.closest = _('prototype').closest;

/**
 * Collection.prototype.js
 */
_('prototype').collection = function (attribute, value){
    if(typeof attribute != 'undefined'){
        if(typeof value != 'undefined'){
            if(attribute === 'delete' || attribute === 'remove'){
                return this.deleteCollection(value);
            } else {
                this.object_delete(attribute, this.collection());
                this.object_set(attribute, value, this.collection());
                return;//@deprecated this.object_get(attribute, this.collection());
            }
        } else {
            if(typeof attribute == 'string'){
                return this.object_get(attribute, this.collection());
            } else {
                this.setCollection(attribute);
                return this.getCollection();
            }
        }
    }
    return this.getCollection();
}

_('prototype').getCollection = function (attribute){
    if(typeof attribute == 'undefined'){
        if(typeof this.collect == 'undefined'){
            this.collect = {};
        }
        return this.collect;
    }
    if(this.is_set(this.collect[attribute])){
        return this.collect[attribute];
    } else {
        return false;
    }
}

_('prototype').setCollection = function (attribute, value){
    if(typeof attribute == 'object'){
        if(typeof this.collect == 'object'){
            var key;
            for (key in attribute){
                this.collect[key] = attribute[key];
            }
        } else {
            this.collect = attribute;
        }
    } else {
        if(typeof this.collect == 'object'){
            this.collect[attribute] = value;
        } else {
            this.collect = {};
            this.collect[attribute] = value;
        }
    }
}

_('prototype').deleteCollection = function(attribute){
    return this.object_delete(attribute, this.collect);
}

priya.collection = _('prototype').collection;
priya.setCollection = _('prototype').setCollection;
priya.getCollection = _('prototype').getCollection;
priya.deleteCollection = _('prototype').deleteCollection;


/**
 * Compare.natural.prototype.js
 */
_('prototype').naturalICompare = function (a, b){
    a = a.toLowerCase();
    b = b.toLowerCase();
    return _('prototype').naturalCompare(a, b);
}

_('prototype').naturalCompare = function (a, b){
    var i, codeA
    , codeB = 1
    , posA = 0
    , posB = 0
    , alphabet = String.alphabet

    function getCode(str, pos, code) {
        if (code) {
            for (i = pos; code = getCode(str, i), code < 76 && code > 65;) ++i;
            return +str.slice(pos - 1, i)
        }
        code = alphabet && alphabet.indexOf(str.charAt(pos))
        return code > -1 ? code + 76 : ((code = str.charCodeAt(pos) || 0), code < 45 || code > 127) ? code
            : code < 46 ? 65               /* - */
            : code < 48 ? code - 1
            : code < 58 ? code + 18        /* 0-9 */
            : code < 65 ? code - 11
            : code < 91 ? code + 11        /* A-Z */
            : code < 97 ? code - 37
            : code < 123 ? code + 5        /* a-z */
            : code - 63
    }
    if ((a+="") !== (b+="")) for (;codeB;) {
        codeA = getCode(a, posA++)
        codeB = getCode(b, posB++)

        if (codeA < 76 && codeB < 76 && codeA > 66 && codeB > 66) {
            codeA = getCode(a, posA, posA)
            codeB = getCode(b, posB, posA = i)
            posB = i
        }

        if (codeA !== codeB) return (codeA < codeB) ? -1 : 1
    }
    return 0
}

priya.naturalICompare = _('prototype').naturalICompare;
priya.naturalCompare = _('prototype').naturalCompare;

/**
 * Content.prototype.js
 */
_('prototype').content = function (data){
    console.log(data);
    if(Object.prototype.toString.call(priya) !== '[object Function]'){
        var priya = window.priya;
    }
    if(typeof data == 'undefined'){
        console.warn('json.content failed (data)');
        return;
    }
    if(typeof data['method'] == 'undefined'){
        return;
    }
    if(typeof data['target'] == 'undefined'){
        console.warn('json.content failed (target)');
        return;
    }
    if(typeof data['html'] == 'undefined' && (data['method'] !== 'replace' && data['method'] !== 'unwrap')){
        return;
    }
    var target = select(data['target']);
    var method = data['method'];

    if(!target){
        if(method === 'replace-or-append-to-body'){
            target = select('body');
            if(target){
                target.insertAdjacentHTML('beforeend', data['html']);
            }            
        }
        else if(method === 'replace-with-or-append-to-body'){
            target = select('body');
            if(target){
                target.insertAdjacentHTML('beforeend', data['html']);            
            }
        }
        else if(method === 'replace-or-append-to'){
            var append = data['append']['to'];
            if(append){
                target = select(append);
                if(target){
                    target.insertAdjacentHTML('beforeend', data['html']);            
                } else {
                    console.warn('cannot find append to (' + data['append']['to'] + ')');
                }
            } else {
                console.warn('data append.to is empty');
            }
        }
        else if(method === 'replace-with-or-append-to'){
            if(data['append']){
                var append = data['append']['to'];
                if(append){
                    target = select(append);
                    if(target){
                        target.insertAdjacentHTML('beforeend', data['html']);            
                    } else {
                        console.warn('cannot find append to (' + data['append']['to'] + ')');
                    }
                } else {
                    console.warn('data append.to is empty');
                }                
            } else {
                console.warn('data append.to is empty');
            }
        }
        else {
            console.warn(target);
            console.warn('no target or unknown method (' + method + ') in content');
        }
        return target;
    } else {
        if(this.is_nodeList(target)){
            var i = 0;
            for(i =0; i < target.length; i++){
                var node = target[i];
                if(method === 'replace'){
                    node.html(data['html']);
                }
                else if (method === 'replace-with'){
                    node.html(data['html'], 'outer');
                }                
                else if(method === 'replace-or-append-to-body'){
                    node.html(data['html']);                
                }
                else if(method === 'replace-or-append-to'){
                    node.html(data['html']);                
                }
                else if(method === 'replace-with-or-append-to-body'){
                    node.html(data['html'], 'outer');
                }
                else if(method === 'replace-with-or-append-to'){
                    node.html(data['html'], 'outer');
                }
                else if(method === 'append' || method === 'beforeend'){
                    node.insertAdjacentHTML('beforeend', data['html']);
                }
                else if(method === 'prepend' || method === 'afterbegin'){
                    node.insertAdjacentHTML('afterbegin', data['html']);
                }
                else if(method === 'after' || method === 'afterend'){
                    node.insertAdjacentHTML('afterend', data['html']);
                }
                else if(method === 'before' || method === 'beforebegin'){
                    node.insertAdjacentHTML('beforebegin', data['html']);
                } else {
                    console.log('unknown method (' + method + ') in content');
                }
            }
        } else {
            if(method === 'replace'){
                target.html(data['html']);
            }
            else if(method === 'replace-with'){
                target.html(data['html'], 'outer');
            }
            else if(method === 'replace-or-append-to-body'){
                target.html(data['html']);                
            }
            else if(method === 'replace-or-append-to'){
                target.html(data['html']);                
            }
            else if(method === 'replace-with-or-append-to-body'){
                target.html(data['html'], 'outer');
            }
            else if(method === 'replace-with-or-append-to'){
                target.html(data['html'], 'outer');
            }
            else if(method === 'append' || method === 'beforeend'){
                target.insertAdjacentHTML('beforeend', data['html']);
            }
            else if(method === 'prepend' || method === 'afterbegin'){
                target.insertAdjacentHTML('afterbegin', data['html']);
            }
            else if(method === 'after' || method === 'afterend'){
                target.insertAdjacentHTML('afterend', data['html']);
            }
            else if(method === 'before' || method === 'beforebegin'){
                target.insertAdjacentHTML('beforebegin', data['html']);
            } else {
                console.log('unknown method (' + method + ') in content');
            }
        }
        return target;
    }
}

priya.content = _('prototype').content;

/**
 * Cookie.prototype.js
 */
_('prototype').cookie = function (attribute, value){
    console.log(attribute);
    console.log(value);
    const cookie = document.cookie;
    console.log(cookie);
}

priya.cookie = _('prototype').cookie;

/**
 * Create.prototype.js
 */
_('prototype').create = function (type, create){
    if(typeof type.toLowerCase != 'function'){
        console.log('no function toLowerCase______________________________________________');
        console.log(type);
        console.log(create);
        console.log(_('prototype').create.caller);
        return;
    }
    switch(type.toLowerCase()){
        case 'id':
            if(typeof create == 'undefined'){
                create = 'priya';
            }
            var data = priya.collection('id.' + create);
            if(this.is_empty(data)){
                data = [];
            }
            var id = 1;
            var index;
            for(index =0; index < data.length; index++){
                if(index >= id){
                    id = index + 1;
                }
            }
            data[id] = {"id": create + '-' + id};
            priya.collection('id.' + create, data);
            return create + '-' + id;
        break;
        case 'link':
            var element = document.createElement('LINK');
            element.rel = 'stylesheet';
            if(typeof create == 'string'){
                element.href = create;
            } else {
                alert('todo');
            }
            return element;
        break;
        case 'script':
            var element = document.createElement('SCRIPT');
            element.type = 'text/javascript';
            if(typeof create == 'string'){
                element.src = create;
            } else {
                alert('todo');
            }
            return element;
        break;
        case 'element':
            var element = document.createElement('PRIYA-NODE');
            element.className = this.str_replace('.', ' ', create);
            element.className = this.str_replace('#', '', element.className);
            element.className = this.trim(element.className);
            return this.attach(element);
        break;
        case 'nodeList' :
              var fragment = document.createDocumentFragment();
              if(Object.prototype.toString.call(create) === '[object Array]'){
                  var i;
                  for(i=0; i < create.length; i++){
                      fragment.appendChild(create[i]);
                  }
                  fragment.childNodes.item = false;
              }
              else if (typeof create == 'object'){
                  fragment.appendChild(create);
                  fragment.childNodes.item = false;
              }
              else if (typeof create != 'undefined'){
                  console.log('unknown type (' + typeof create + ') in priya.create()');
              }
              return fragment.childNodes;
        break;
        default :
            var element = document.createElement(type.toUpperCase());
            if(create){
                element.className = this.str_replace('.', ' ', create);
                element.className = this.str_replace('#', '', element.className);
                element.className = this.trim(element.className);
            }
            return this.attach(element);
    }
    return false;
}

priya.create = _('prototype').create;

/**
 * Create.selector.prototype.js
 */
_('prototype').createSelector = function(element){
    if(this.is_empty(element)){
        return '';
    }
    var selector = element.tagName;
    if(typeof selector == 'undefined' && element instanceof HTMLDocument){
        return element;
    }
    selector = selector.toLowerCase();
    if(element.id){
        selector += ' #' + element.id;
    }
    if(element.className){
        selector += ' .' + this.str_replace(' ','.',element.className);
    }
    return selector;
}

priya.createSelector = _('prototype').createSelector;

/**
 * Css.prototype.js
 */
_('prototype').css = function(attribute, value){
    if(is.empty(value) && value !== 0 && value !== '0'){
        if(typeof this.style == 'undefined'){
            return '';
        }
        return this.computedStyle(attribute);
    }
    if(typeof this.style == 'undefined'){
        return '';
    }
    if(attribute === 'has'){
        return !!this.style[value];
    }
    else if(attribute === 'delete'){
        this.style[value] = '';
    }
    if(is.nodeList()){
        var index;
        for(index=0; index < this.length; index++){
            var node = this[index];
            value = node.computeStyle(attribute, value);
            node.style[attribute] = value;
        }
    } else {
        value = this.computeStyle(attribute, value);
        this.style[attribute] = value;
    }
}

_('prototype').computeStyle = function(attribute, value){
    if(attribute === 'top' && value === 'middle'){
        var height = parseInt(this.css('height'));
        value = 'calc(50% - ' + (height /2) + 'px)';
    }
    else if(attribute === 'left' && value === 'center'){
        var width = parseInt(this.css('width'));
        value = 'calc(50% - ' + (width /2) + 'px)';
    }
    return value;
}

_('prototype').computedStyle = function(attribute){
    if(!this.Priya.style){
        this.Priya.style = window.getComputedStyle(this);
    }
    if(attribute){
        return this.Priya.style[attribute];
    } else {
        return this.Priya.style;
    }
}

priya.css = _('prototype').css;
priya.computeStyle = _('prototype').computeStyle;
priya.computedStyle = _('prototype').computedStyle;


/**
 * Data.prototype.js
 */
_('prototype').data = function (attribute, value){
    if(attribute === 'remove' || attribute === 'delete'){
        if(this.attribute('has', 'data-' + value)){
            return this.attribute('remove','data-' + value);
        } else {
            var data = this.data(value);
            if(typeof data == 'object'){
                var attr;
                var result = false;
                for(attr in data){
                    this.data('remove', value + '-' + attr);
                    result = true;
                }
                return result;
            } else {
                return
            }
        }
    }
    else if (attribute === 'clear' && value === 'error'){
        if(this.tagName === 'FORM'){
            /*
             * clear errors from form
             */
            var input = this.select('input');
            var textarea = this.select('textarea');
            var select = this.select('select');
            var dropdown = this.select('.dropdown');
            var index;
            if(this.is_nodeList(input)){
                for(index=0; index < input.length; index++){
                    var elem = input[index];
                    elem.removeClass('error');
                }
            } else if(input) {
                input.removeClass('error');
            }
            if(this.is_nodeList(textarea)){
                 for(index=0; index < textarea.length; index++){
                     var elem = textarea[index];
                     elem.removeClass('error');
                 }
            } else if(textarea) {
                textarea.removeClass('error');
            }
            if(this.is_nodeList(select)){
                for(index=0; index < select.length; index++){
                    var elem = select[index];
                    elem.removeClass('error');
                }
            } else if(select) {
                select.removeClass('error');
            }
            if(this.is_nodeList(dropdown)){
                for(index=0; index < dropdown.length; index++){
                    var elem = select[index];
                    elem.removeClass('error');
                }
            } else if(dropdown){
                dropdown.removeClass('error');
            }
        }
    }
    else if (attribute === 'serialize'){
        if(this.tagName === 'FORM'){
            /*
             * return all data for form
             */
            var data = this.data();
            var input = this.select('input');
            var textarea = this.select('textarea');
            var select = this.select('select');
            var index;
            value = [];
            for(index in data){
                var object = {};
                object.name = index;
                object.value = data[index];
                value.push(object);
            }
            if(this.is_nodeList(input)){
                var collection = {};
                for(index=0; index < input.length; index++){
                    if(this.is_empty(input[index].name)){
                        continue;
                    }
                    if(input[index].type === 'radio' && input[index].checked !== true){
                        continue;
                    }
                    if(input[index].type === 'checkbox' && input[index].checked !== true){
                        continue;
                    }
                    if(this.stristr(input[index].name, '[]')){
                        if(!this.is_set(collection[input[index].name])){
                            collection[input[index].name] = {};
                            collection[input[index].name].name = input[index].name.split('[]').join('');
                            collection[input[index].name].value = [];
                        }
                        collection[input[index].name].value.push(input[index].value);
                    } else {
                        var object = {};
                        object.name = input[index].name;
                        object.value = input[index].value;
                        value.push(object);
                    }
                }
                for(name in collection){
                    value.push(collection[name]);
                }
            } else {
                if(!this.is_empty(input.name)){
                    var object = {};
                    object.name = input.name.split('[]').join('');
                    object.value = input.value;
                    value.push(object);
                }
            }
            if(this.is_nodeList(textarea)){
                var collection = {};
                for(index=0; index < textarea.length; index++){
                    if(this.is_empty(textarea[index].name)){
                        continue;
                    }
                    if(this.stristr(textarea[index].name, '[]')){
                        if(!this.is_set(collection[textarea[index].name])){
                            collection[textarea[index].name] = {};
                            collection[textarea[index].name].name = textarea[index].name.split('[]').join('');
                            collection[textarea[index].name].value = [];
                        }
                        collection[textarea[index].name].value.push(textarea[index].value);
                    } else {
                        var object = {};
                        object.name = textarea[index].name;
                        object.value = textarea[index].value;
                        value.push(object);
                    }
                }
                for(name in collection){
                    value.push(collection[name]);
                }
            } else {
                if(!this.is_empty(textarea.name)){
                    var object = {};
                    object.name = textarea.name.split('[]').join('');
                    object.value = textarea.value;
                    value.push(object);
                }
            }
            if(this.is_nodeList(select)){
                var collection = {};
                for(index=0; index < select.length; index++){
                    if(this.is_empty(select[index].name)){
                        continue;
                    }
                    if(this.stristr(select[index].name, '[]')){
                        if(!this.is_set(collection[select[index].name])){
                            collection[select[index].name] = {};
                            collection[select[index].name].name = select[index].name.split('[]').join('');
                            collection[select[index].name].value = [];
                        }
                        collection[select[index].name].value.push(select[index].value);
                    } else {
                        var object = {};
                        object.name = select[index].name;
                        object.value = select[index].value;
                        value.push(object);
                    }
                }
                for(name in collection){
                    value.push(collection[name]);
                }
            } else {
                if(!this.is_empty(select.name)){
                    var object = {};
                    object.name = select.name.split('[]').join('');
                    object.value = select.value;
                    value.push(object);
                }
            }
            return value;
        }
    } else {
        if(typeof attribute === 'undefined' || attribute === 'ignore' || attribute === 'select'){
            var select = value;
            var attr;
            value = {};
            for (attr in this.attributes){
                if(typeof this.attributes[attr].value == 'undefined'){
                    continue;
                }
                var key = this.stristr(this.attributes[attr].name, 'data-');
                if(key === false){
                    continue;
                }
                key = this.attributes[attr].name.substr(5);
                if(attribute === 'ignore'){
                    if(typeof select == 'string' && key == select){
                        continue;
                    }
                    if(typeof select == 'object' && this.in_array(key, select)){
                        continue;
                    }
                }
                if(attribute === 'select'){
                    if(typeof select == 'string' && key != select){
                        continue;
                    }
                    if(typeof select == 'object' && !this.in_array(key, select)){
                        continue;
                    }
                }
                var split = key.split('.');
                if(split.length === 1){
                    value[key] = this.attributes[attr].value;
                } else {
                    var object = this.object_horizontal(split, this.attributes[attr].value);
                    value = this.object_merge(value, object);
                }
            }
            return value;
        }
        else if(typeof attribute === 'object'){
            for(attr in attribute){
                this.data(attr, attribute[attr]);
            }
        } else {
            if(attribute === 'has'){
                if(this.attribute('has', 'data-' + value)){
                    return true;
                }
                return false;
            }
            var data = this.attribute('data-' + attribute, value);
            if(this.is_empty(data) && data !== '0' &&  data !== '' && !this.is_empty(attribute)){
                data = this.data();
                var collection = {};
                /*
                for(key in data){
                    console.log(key);
                    console.log(attribute);
                    if(this.stristr(key, attribute) !== false){
                        collection[this.str_replace(attribute + '-', '', key)] = data[key];
                    }
                }
                 */
                if(this.is_empty(collection)){
                    return null;
                } else {
                    return collection;
                }
            } else {
                return data;
            }
        }
    }
}

priya.data = _('prototype').data;

/**
 * Date.prototype.js
 */
_('prototype').date = function(format, timestamp) {
  //  discuss at: https://locutus.io/php/date/
  // original by: Carlos R. L. Rodrigues (https://www.jsfromhell.com)
  // original by: gettimeofday
  //    parts by: Peter-Paul Koch (https://www.quirksmode.org/js/beat.html)
  // improved by: Kevin van Zonneveld (https://kvz.io)
  // improved by: MeEtc (https://yass.meetcweb.com)
  // improved by: Brad Touesnard
  // improved by: Tim Wiel
  // improved by: Bryan Elliott
  // improved by: David Randall
  // improved by: Theriault (https://github.com/Theriault)
  // improved by: Theriault (https://github.com/Theriault)
  // improved by: Brett Zamir (https://brett-zamir.me)
  // improved by: Theriault (https://github.com/Theriault)
  // improved by: Thomas Beaucourt (https://www.webapp.fr)
  // improved by: JT
  // improved by: Theriault (https://github.com/Theriault)
  // improved by: Rafał Kukawski (https://blog.kukawski.pl)
  // improved by: Theriault (https://github.com/Theriault)
  //    input by: Brett Zamir (https://brett-zamir.me)
  //    input by: majak
  //    input by: Alex
  //    input by: Martin
  //    input by: Alex Wilson
  //    input by: Haravikk
  // bugfixed by: Kevin van Zonneveld (https://kvz.io)
  // bugfixed by: majak
  // bugfixed by: Kevin van Zonneveld (https://kvz.io)
  // bugfixed by: Brett Zamir (https://brett-zamir.me)
  // bugfixed by: omid (https://locutus.io/php/380:380#comment_137122)
  // bugfixed by: Chris (https://www.devotis.nl/)
  //      note 1: Uses global: locutus to store the default timezone
  //      note 1: Although the function potentially allows timezone info
  //      note 1: (see notes), it currently does not set
  //      note 1: per a timezone specified by date_default_timezone_set(). Implementers might use
  //      note 1: $locutus.currentTimezoneOffset and
  //      note 1: $locutus.currentTimezoneDST set by that function
  //      note 1: in order to adjust the dates in this function
  //      note 1: (or our other date functions!) accordingly
  //   example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400)
  //   returns 1: '07:09:40 m is month'
  //   example 2: date('F j, Y, g:i a', 1062462400)
  //   returns 2: 'September 2, 2003, 12:26 am'
  //   example 3: date('Y W o', 1062462400)
  //   returns 3: '2003 36 2003'
  //   example 4: var $x = date('Y m d', (new Date()).getTime() / 1000)
  //   example 4: $x = $x + ''
  //   example 4: var $result = $x.length // 2009 01 09
  //   returns 4: 10
  //   example 5: date('W', 1104534000)
  //   returns 5: '52'
  //   example 6: date('B t', 1104534000)
  //   returns 6: '999 31'
  //   example 7: date('W U', 1293750000.82); // 2010-12-31
  //   returns 7: '52 1293750000'
  //   example 8: date('W', 1293836400); // 2011-01-01
  //   returns 8: '52'
  //   example 9: date('W Y-m-d', 1293974054); // 2011-01-02
  //   returns 9: '52 2011-01-02'
  //        test: skip-1 skip-2 skip-5

  var jsdate, f
  // Keep this here (works, but for code commented-out below for file size reasons)
  // var tal= [];
  var txtWords = [
    'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  // trailing backslash -> (dropped)
  // a backslash followed by any character (including backslash) -> the character
  // empty string -> empty string
  var formatChr = /\\?(.?)/gi
  var formatChrCb = function (t, s) {
    return f[t] ? f[t]() : s
  }
  var _pad = function (n, c) {
    n = String(n)
    while (n.length < c) {
      n = '0' + n
    }
    return n
  }
  f = {
    // Day
    d: function () {
      // Day of month w/leading 0; 01..31
      return _pad(f.j(), 2)
    },
    D: function () {
      // Shorthand day name; Mon...Sun
      return f.l()
        .slice(0, 3)
    },
    j: function () {
      // Day of month; 1..31
      return jsdate.getDate()
    },
    l: function () {
      // Full day name; Monday...Sunday
      return txtWords[f.w()] + 'day'
    },
    N: function () {
      // ISO-8601 day of week; 1[Mon]..7[Sun]
      return f.w() || 7
    },
    S: function () {
      // Ordinal suffix for day of month; st, nd, rd, th
      var j = f.j()
      var i = j % 10
      if (i <= 3 && parseInt((j % 100) / 10, 10) === 1) {
        i = 0
      }
      return ['st', 'nd', 'rd'][i - 1] || 'th'
    },
    w: function () {
      // Day of week; 0[Sun]..6[Sat]
      return jsdate.getDay()
    },
    z: function () {
      // Day of year; 0..365
      var a = new Date(f.Y(), f.n() - 1, f.j())
      var b = new Date(f.Y(), 0, 1)
      return Math.round((a - b) / 864e5)
    },

    // Week
    W: function () {
      // ISO-8601 week number
      var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3)
      var b = new Date(a.getFullYear(), 0, 4)
      return _pad(1 + Math.round((a - b) / 864e5 / 7), 2)
    },

    // Month
    F: function () {
      // Full month name; January...December
      return txtWords[6 + f.n()]
    },
    m: function () {
      // Month w/leading 0; 01...12
      return _pad(f.n(), 2)
    },
    M: function () {
      // Shorthand month name; Jan...Dec
      return f.F()
        .slice(0, 3)
    },
    n: function () {
      // Month; 1...12
      return jsdate.getMonth() + 1
    },
    t: function () {
      // Days in month; 28...31
      return (new Date(f.Y(), f.n(), 0))
        .getDate()
    },

    // Year
    L: function () {
      // Is leap year?; 0 or 1
      var j = f.Y()
      return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0
    },
    o: function () {
      // ISO-8601 year
      var n = f.n()
      var W = f.W()
      var Y = f.Y()
      return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0)
    },
    Y: function () {
      // Full year; e.g. 1980...2010
      return jsdate.getFullYear()
    },
    y: function () {
      // Last two digits of year; 00...99
      return f.Y()
        .toString()
        .slice(-2)
    },

    // Time
    a: function () {
      // am or pm
      return jsdate.getHours() > 11 ? 'pm' : 'am'
    },
    A: function () {
      // AM or PM
      return f.a()
        .toUpperCase()
    },
    B: function () {
      // Swatch Internet time; 000..999
      var H = jsdate.getUTCHours() * 36e2
      // Hours
      var i = jsdate.getUTCMinutes() * 60
      // Minutes
      // Seconds
      var s = jsdate.getUTCSeconds()
      return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3)
    },
    g: function () {
      // 12-Hours; 1..12
      return f.G() % 12 || 12
    },
    G: function () {
      // 24-Hours; 0..23
      return jsdate.getHours()
    },
    h: function () {
      // 12-Hours w/leading 0; 01..12
      return _pad(f.g(), 2)
    },
    H: function () {
      // 24-Hours w/leading 0; 00..23
      return _pad(f.G(), 2)
    },
    i: function () {
      // Minutes w/leading 0; 00..59
      return _pad(jsdate.getMinutes(), 2)
    },
    s: function () {
      // Seconds w/leading 0; 00..59
      return _pad(jsdate.getSeconds(), 2)
    },
    u: function () {
      // Microseconds; 000000-999000
      return _pad(jsdate.getMilliseconds() * 1000, 6)
    },

    // Timezone
    e: function () {
      // Timezone identifier; e.g. Atlantic/Azores, ...
      // The following works, but requires inclusion of the very large
      // timezone_abbreviations_list() function.
      /*              return that.date_default_timezone_get();
       */
      var msg = 'Not supported (see source code of date() for timezone on how to add support)'
      throw new Error(msg)
    },
    I: function () {
      // DST observed?; 0 or 1
      // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
      // If they are not equal, then DST is observed.
      var a = new Date(f.Y(), 0)
      // Jan 1
      var c = Date.UTC(f.Y(), 0)
      // Jan 1 UTC
      var b = new Date(f.Y(), 6)
      // Jul 1
      // Jul 1 UTC
      var d = Date.UTC(f.Y(), 6)
      return ((a - c) !== (b - d)) ? 1 : 0
    },
    O: function () {
      // Difference to GMT in hour format; e.g. +0200
      var tzo = jsdate.getTimezoneOffset()
      var a = Math.abs(tzo)
      return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4)
    },
    P: function () {
      // Difference to GMT w/colon; e.g. +02:00
      var O = f.O()
      return (O.substr(0, 3) + ':' + O.substr(3, 2))
    },
    T: function () {
      // The following works, but requires inclusion of the very
      // large timezone_abbreviations_list() function.
      /*              var abbr, i, os, _default;
      if (!tal.length) {
        tal = that.timezone_abbreviations_list();
      }
      if ($locutus && $locutus.default_timezone) {
        _default = $locutus.default_timezone;
        for (abbr in tal) {
          for (i = 0; i < tal[abbr].length; i++) {
            if (tal[abbr][i].timezone_id === _default) {
              return abbr.toUpperCase();
            }
          }
        }
      }
      for (abbr in tal) {
        for (i = 0; i < tal[abbr].length; i++) {
          os = -jsdate.getTimezoneOffset() * 60;
          if (tal[abbr][i].offset === os) {
            return abbr.toUpperCase();
          }
        }
      }
      */
      return 'UTC'
    },
    Z: function () {
      // Timezone offset in seconds (-43200...50400)
      return -jsdate.getTimezoneOffset() * 60
    },

    // Full Date/Time
    c: function () {
      // ISO-8601 date.
      return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb)
    },
    r: function () {
      // RFC 2822
      return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb)
    },
    U: function () {
      // Seconds since UNIX epoch
      return jsdate / 1000 | 0
    }
  }

  var _date = function (format, timestamp) {
    jsdate = (timestamp === undefined ? new Date() // Not provided
      : (timestamp instanceof Date) ? new Date(timestamp) // JS Date()
      : new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
    )
    return format.replace(formatChr, formatChrCb)
  }

  return _date(format, timestamp)
}

priya.date = _('prototype').date;

/**
 * Debug.prototype.js
 */
_('prototype').debug = function (data){
    let string = 'Loading Debug...';
    let node = select('.debug');
    if(!node){
        node = priya.create('div', 'dialog no-select debug');
        node.html('<div class="head"><span><i class="icon fas fa-bug"></i></span><span><h2>Debug</h2></span></div><div class="menu"><ul class="tab-head"><li class="tab-debug selected"><p>Debug</p></li><li class="tab-collection"><p>Collection</p></li><li class="tab-session"><p>Session</p></li></ul></div><div class="body"><div class="tab tab-body tab-debug selected"></div><div class="tab tab-body tab-collection"></div><div class="tab tab-body tab-session"></div></div><div class="footer"><button type="button" class="button-default button-close">Close</button><button type="button" class="button-default button-debug-clear"><i class="far fa-trash-alt"></i></button></div></div>');
        let body = select('body');
        if(body){
            body.append(node);
        }        
        node.on('open', () => {
            let head = node.select('div.head');
            if(head){
                let debug = head.closest('.debug');
                if(debug){
                    debug.addClass('has-head');
                }
            }            
            let menu = node.select('div.menu');
            if(menu){
                let debug = menu.closest('.debug');
                if(debug){
                    debug.addClass('has-menu');
                }
            }
            let icon = node.select('div.icon');
            if(icon){
                let debug = icon.closest('.debug');
                if(debug){
                    debug.addClass('has-icon');
                }
            }
            let footer = node.select('div.footer');
            if(footer){
                let debug = footer.closest('.debug');
                if(debug){
                    debug.addClass('has-footer');
                }
            }
            let debug = select('.debug');
            if(debug){
                debug.addClass('display-block');
                debug.removeClass('d-none');
                let display = debug.select('.display-none');
                if(display){
                    display.removeClass('display-none');
                }
            }
        });
        node.on('close', () => {
            let debug = select('.debug');
            if(debug){
                debug.removeClass('display-block');
                debug.addClass('d-none');
            }
        });
        node.on('debug', () => {
            let head = select('.debug .tab-head li');
            if(head){
                head.removeClass('selected');
            }
            let body = select('.debug .tab-body');
            if(body){
                body.removeClass('selected');
            }
            let node = select('.debug .tab-body.tab-debug');
            if(node){
                node.addClass('selected');
            }            
        });
        node.on('debug-clear', () => {
            let debug = select('.debug .tab-body.tab-debug');
            debug.html('');
        });
        node.on('collection', () => {
            let head = select('.debug .tab-head li');
            if(head){
                head.removeClass('selected');
            }
            let body = select('.debug .tab-body');
            if(body){
                body.removeClass('selected');
            }
            let node = select('.debug .tab-body.tab-collection');
            if(node){
                node.addClass('selected');
                let collection = priya.collection();
                if (typeof JSON.decycle == "function") {
                    collection = JSON.decycle(collection);
                }
                collection = JSON.stringify(collection, null, 2);
                node.html('<pre>' + collection + '</pre>');
            }                        
        });
        node.on('session', () => {
            let head = select('.debug .tab-head li');
            if(head){
                head.removeClass('selected');
            }
            let body = select('.debug .tab-body');
            if(body){
                body.removeClass('selected');
            }
            let node = select('.debug .tab-body.tab-session');
            if(node){
                node.addClass('selected');
                let data = {};
                data.method = 'replace';
                data.target = '.tab-body.tab-session';
                request(priya.collection('url') + 'Session', data);
                node.html('<pre>Retrieving session...</pre>');
            }                
        });
        let close = node.select('.button-close');
        if(close){
            close.on('click', () => { node.trigger('close')});
        }
        let clear = node.select('.button-debug-clear');
        if(clear){
            clear.on('click', () => { node.trigger('debug-clear')});
        }
        let collection = node.select('.tab-head .tab-collection');
        if(collection){
            collection.on('click', () => { node.trigger('collection')});
        }
        let debug = node.select('.tab-head .tab-debug');
        if(debug){
            debug.on('click', () => {
                node.trigger('debug');
                this.addClass('selected');
            });
        }
        let session = node.select('.tab-head .tab-session');
        if(session){
            session.on('click', () => {
                node.trigger('session');
                this.addClass('selected');
            });
        }
    }
    let debug = select('.debug .tab-body.tab-debug');
    if(debug){
        if(typeof data == 'string'){
            if(data === 'run'){
                data = string;
            }
            let item = priya.create('pre', '');
            item.html(data);
            debug.append(item);
            node.trigger('open');
            node.trigger('debug');
            if(data === string){
                setTimeout(function(){
                    item.remove();
                }, 1500);
            }
        }
        else if(typeof data == 'object'){
            /*
            let remove = priya.collection('debug');
            if(remove){
                let index;
                for(index in remove){
                    priya.debug(index);
                    delete data.index;
                }
            }
            if (typeof JSON.decycle == "function") {
                data = JSON.decycle(data);
            }
             */
            data = JSON.stringify(data, null, 2);
            let item = priya.create('pre', '');
            item.html(data);
            debug.append(item);
            node.trigger('open');
            node.trigger('debug');
            /*
            let scrollable = debug.closest('has', 'scrollbar', 'vertical');
            scrollable.scrollbar('to', {'x': 0, 'y': scrollable.scrollbar('height')});
            node.trigger('open');
            node.trigger('debug');
             */
        } else {
            node.trigger('open');
        }
    } else {
        node.trigger('open');
    }
}

priya.debug = _('prototype').debug;

/**
 * Drag.prototype.js
 */
_('prototype').drag = function (handle, subject, callback) {
    this.collection('drag.handle', handle);
    this.collection('drag.subject', subject);
    this.collection('drag.callback', callback);
    handle.on('mousedown', this.dragMouseDown)
    document.addEventListener('mousemove', this.dragMouseMove);
    document.addEventListener('mouseup', this.dragMouseUp);   
}

_('prototype').dragMouseDown = function(event){
	var section = this.collection('drag.subject');
	if(!section){
		return;
	}
	var size = this.collection('drag.size');
	if(!size){
		var size = section.calculate('all');
		this.collection('drag.size', size);
	}	
	var state = {}
	state.isDragging = true;
	state.x = size.left;
	state.y = size.top;
	state.width = size.width;
	state.height = size.height;
	state.xDiff = event.pageX - state.x;
	state.yDiff = event.pageY - state.y;	
	state.dialog = section;
    this.collection('drag.state', state);	
    callback = this.collection('drag.callback');
    if(typeof callback == 'function'){
		callback();
	}
}

_('prototype').dragClampX = function(n){
	var size = this.collection('drag.size');	
    return Math.min(Math.max(n, 0), size.window.width);
}

_('prototype').dragClampY = function(n){
	var size = this.collection('drag.size');
    return Math.min(Math.max(n, 0), size.window.height);
}

_('prototype').dragMouseMove = function(event){
	state = this.collection('drag.state');	
	if(
		state && 
		state.isDragging
	){
		state.x = this.dragClampX(event.pageX - state.xDiff);
		state.y = this.dragClampY(event.pageY - state.yDiff);
		state.dialog.css('left',  state.x + 'px');
		state.dialog.css('top', state.y + 'px');
		this.collection('drag.state', state);		
	}	
}

_('prototype').dragMouseUp = function(event){
	state = this.collection('drag.state');
	if(state){
		state.isDragging = false;
		this.collection('drag.state', state);
		var section = this.collection('drag.subject');
		if(!section){
			return;
		}
		var size = section.calculate('all');
		this.collection('drag.size', size);
	}	
}

priya.drag = _('prototype').drag;
priya.dragMouseDown = _('prototype').dragMouseDown;
priya.dragClampX = _('prototype').dragClampX;
priya.dragClampY = _('prototype').dragClampY;
priya.dragMouseMove = _('prototype').dragMouseMove;
priya.dragMouseUp = _('prototype').dragMouseUp;

/**
 * Dump.prototype.js
 */
_('prototype').dump = function () {
    var output = ''
    var padChar = ' '
    var padVal = 4
    var lgth = 0
    var i = 0
    var _getFuncName = function (fn) {
      var name = (/\W*function\s+([\w$]+)\s*\(/)
        .exec(fn)
      if (!name) {
        return '(Anonymous)'
      }
      return name[1]
    }
    var _repeatChar = function (len, padChar) {
      var str = ''
      for (var i = 0; i < len; i++) {
        str += padChar
      }
      return str
    }
    var _getInnerVal = function (val, thickPad) {
      var ret = ''
      if (val === null) {
        ret = 'NULL'
      } else if (typeof val === 'boolean') {
        ret = 'bool(' + val + ')'
      } else if (typeof val === 'string') {
        ret = 'string(' + val.length + ') "' + val + '"'
      } else if (typeof val === 'number') {
        if (parseFloat(val) === parseInt(val, 10)) {
          ret = 'int(' + val + ')'
        } else {
          ret = 'float(' + val + ')'
        }
      } else if (typeof val === 'undefined') {
        // The remaining are not PHP behavior because these values
        // only exist in this exact form in JavaScript
        ret = 'undefined'
      } else if (typeof val === 'function') {
        var funcLines = val.toString()
          .split('\n')
        ret = ''
        for (var i = 0, fll = funcLines.length; i < fll; i++) {
          ret += (i !== 0 ? '\n' + thickPad : '') + funcLines[i]
        }
      } else if (val instanceof Date) {
        ret = 'Date(' + val + ')'
      } else if (val instanceof RegExp) {
        ret = 'RegExp(' + val + ')'
      } else if (val.nodeName) {
        // Different than PHP's DOMElement
        switch (val.nodeType) {
          case 1:
            if (typeof val.namespaceURI === 'undefined' ||
              val.namespaceURI === 'http://www.w3.org/1999/xhtml') {
            // Undefined namespace could be plain XML, but namespaceURI not widely supported
              ret = 'HTMLElement("' + val.nodeName + '")'
            } else {
              ret = 'XML Element("' + val.nodeName + '")'
            }
            break
          case 2:
            ret = 'ATTRIBUTE_NODE(' + val.nodeName + ')'
            break
          case 3:
            ret = 'TEXT_NODE(' + val.nodeValue + ')'
            break
          case 4:
            ret = 'CDATA_SECTION_NODE(' + val.nodeValue + ')'
            break
          case 5:
            ret = 'ENTITY_REFERENCE_NODE'
            break
          case 6:
            ret = 'ENTITY_NODE'
            break
          case 7:
            ret = 'PROCESSING_INSTRUCTION_NODE(' + val.nodeName + ':' + val.nodeValue + ')'
            break
          case 8:
            ret = 'COMMENT_NODE(' + val.nodeValue + ')'
            break
          case 9:
            ret = 'DOCUMENT_NODE'
            break
          case 10:
            ret = 'DOCUMENT_TYPE_NODE'
            break
          case 11:
            ret = 'DOCUMENT_FRAGMENT_NODE'
            break
          case 12:
            ret = 'NOTATION_NODE'
            break
        }
      }
      return ret
    }
    var _formatArray = function (obj, curDepth, padVal, padChar) {
      if (curDepth > 0) {
        curDepth++
      }
      var basePad = _repeatChar(padVal * (curDepth - 1), padChar)
      var thickPad = _repeatChar(padVal * (curDepth + 1), padChar)
      var str = ''
      var val = ''
      if (typeof obj === 'object' && obj !== null) {
        if (obj.constructor && _getFuncName(obj.constructor) === 'LOCUTUS_Resource') {
          return obj.var_dump()
        }
        lgth = 0
        for (var someProp in obj) {
          if (obj.hasOwnProperty(someProp)) {
            lgth++
          }
        }
        str += 'array(' + lgth + ') {\n'
        for (var key in obj) {
          var objVal = obj[key]
          if (typeof objVal === 'object' &&
            objVal !== null &&
            !(objVal instanceof Date) &&
            !(objVal instanceof RegExp) &&
            !objVal.nodeName) {
            str += thickPad
            str += '['
            str += key
            str += '] =>\n'
            str += thickPad
            str += _formatArray(objVal, curDepth + 1, padVal, padChar)
          } else {
            val = _getInnerVal(objVal, thickPad)
            str += thickPad
            str += '['
            str += key
            str += '] =>\n'
            str += thickPad
            str += val
            str += '\n'
          }
        }
        str += basePad + '}\n'
      } else {
        str = _getInnerVal(obj, thickPad)
      }
      return str
    }
    output = _formatArray(arguments[0], 0, padVal, padChar)
    for (i = 1; i < arguments.length; i++) {
      output += '\n' + _formatArray(arguments[i], 0, padVal, padChar)
    }
    console.log(output)
    // Not how PHP does it, but helps us test:
    return output
  }


/**
 * Exception.prototype.js
 */
_('prototype').exception = function (data, except){
    console.log(data);
    if(
        !is.empty(data.class) &&
        (
            data.class.toLowerCase() === 'exception' ||
            data.class.toLowerCase() === 'errorexception' ||
            in_array(data.class, [
                'R3m\\Io\\Exception\\LocateException',
                'R3m\\Io\\Exception\\ObjectException',
                'R3m\\Io\\Exception\\PluginNotFoundException',
                'R3m\\Io\\Exception\\UrlEmptyException',
                'R3m\\Io\\Exception\\UrlNotExistException',
            ])
        )
    ){
        console.log('exception triggered');
        this.debug(JSON.stringify(data, null, 2));
    }
    if(
        !is.empty(data.class) &&
        _('_').stristr(data.class, 'locateException') !== false
    ){
        console.log('exception triggered');
        this.debug(JSON.stringify(data, null, 2));
        if(data?.code === 1){
            console.log('debug location information added...');
        }
    }
}

priya.exception = _('prototype').exception;

/**
 * Explode.multi.prototype.js
 */
_('prototype').explode_multi = function(delimiter, string, limit){
    var result = [];
    var index;
    for(index =0; index < delimiter.length; index++){
        var delim = delimiter[index];
        if(typeof limit != 'undefined' && this.is_set(limit[index])){
            var tmp = this.explode(delim. string. limit[index]);
        } else {
            var tmp = this.explode(delim, string);
        }
        if(tmp.length === 1){
            continue;
        }
        var i;
        for(i = 0; i < tmp.length; i++){
            var value = tmp[i];
            result.push(value);
        }
    }
    if(this.is_empty(result)){
        result.push(string);
    }
    return result;
}

priya.explode_multi = _('prototype').explode_multi;

/**
 * Explode.prototype.js
 */
_('prototype').explode = function (delimiter, string, limit){
    if (arguments.length < 2 || typeof delimiter === 'undefined' || typeof string === 'undefined'){
        return null;
    }
    if (delimiter === '' || delimiter === false || delimiter === null){
        return false;
    }
    if (typeof delimiter === 'function' || typeof delimiter === 'object' || typeof string === 'function' || typeof string ==='object') {
        return {
              0: ''
        };
    }
    if (delimiter === true){
        delimiter = '1';
    }
    delimiter += '';
    string += '';
    var s = string.split(delimiter);
    if (typeof limit === 'undefined'){
        return s;
    }
    if (limit === 0){
        limit = 1;
    }
    if (limit > 0) {
        if (limit >= s.length){
            return s;
        }
        return s.slice(0, limit - 1)
                  .concat([s.slice(limit - 1)
                .join(delimiter)
          ]);
      }
      if (-limit >= s.length){
          return [];
      }
      s.splice(s.length + limit);
      return s;
}

priya.explode = _('prototype').explode;

/**
 * Extended.prototype.js
 */
priya.init = function (data, configuration){
    console.log('deprecated, use select or run');
    if(typeof data == 'undefined'){
        return this;
    }
    if(typeof data == 'string'){
        var element = this.select(data);
        return element;
    }
    return data;
}

/**
 * Find.prototype.js
 */
_('prototype').find = function(selector, attach) {
    if (!this.id) {
        this.id = this.attribute('id', 'priya-find-' + this.rand(1000, 9999) + '-' + this.rand(1000, 9999) + '-' + this.rand(1000, 9999) + '-' + this.rand(1000, 9999));
        var removeId = true;
    }
    if(typeof selector == 'object'){
        console.log(selector);
    }
    selector = '#' + this.id + ' ' + selector;
    var list = document.querySelectorAll(selector);
    if (removeId) {
        this.attribute('remove', 'id');
    }
    if(attach){
        if(list.length === 0){
            var priya = this.attach(this.create('element', selector));
            priya.data('selector', selector);
            /*add to document for retries? */
            return priya;
        }
        else if(list.length === 1){
            return this.attach(list[0]);
        } else {
            var item;
            for(item in list){
                list[item] = this.attach(list[item]);
            }
            return this.attach(list);
        }
    }
    return list;
};

priya.find = _('prototype').find;

/**
 * Function.exist.prototype.js
 */
_('prototype').function_exist = function (name){
    if (typeof name === 'string'){
        if(typeof this == 'undefined'){
            return false;
        }
        if(typeof this.Priya == 'object'){
            name = this[name];
        } else {
            name = this.window[name];
        }
    }
    return typeof name === 'function';
}

priya.function_exist = _('prototype').function_exist;

/**
 * Header.prototype.js
 */
_('prototype').header = function(attribute, value){
    let header = priya.collection('request.header');
    if(header === null){
        header = [];
    }
    if(value === null){
        header.push(attribute);
    } else {
        let object = {};
        object[attribute] = value;
        header.push(object);
    }
    priya.collection('request.header', header);
}

priya.header = _('prototype').header;

/**
 * Html.prototype.js
 */
_('prototype').html = function (html, where){
    if(typeof where == 'undefined'){
        where = 'inner';
    }
    if(typeof html == 'undefined'){
        return this.innerHTML;
    } else {
        if(html === true){
            var attribute = this.attribute();
            html =  '<' + this.tagName.toLowerCase();
            var attr;
            for(attr in attribute){
                html += ' ' + attr + '="' + attribute[attr] + '"';
            }
            //fix <img> etc (no </img>)
            html += '>' + this.innerHTML + '</' + this.tagName.toLowerCase() + '>';
            return html;
        } else {
            if(where === 'outer'){
                if(this.is_nodeList()){
                     var index;
                     for(index=0; index < this.length; index++){
                         this[index].outerHTML = html;
                     }
                     return html;
                } else {
                    this.outerHTML = html;
                    return this.outerHTML;
                }

            } else {
                if(this.is_nodeList()){
                    var index;
                    for(index=0; index < this.length; index++){
                        this[index].innerHTML = html;
                    }
                    return html;
               } else {
                   this.innerHTML = html;
                   return this.innerHTML;
               }
            }
        }
    }
}

priya.html = _('prototype').html;

/**
 * HtmlSpecialChars.prototype.js
 */
_('prototype').htmlspecialchars = function (string, quoteStyle, charset, doubleEncode) {
  //       discuss at: http://locutus.io/php/htmlspecialchars/
  //      original by: Mirek Slugen
  //      improved by: Kevin van Zonneveld (http://kvz.io)
  //      bugfixed by: Nathan
  //      bugfixed by: Arno
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //       revised by: Kevin van Zonneveld (http://kvz.io)
  //         input by: Ratheous
  //         input by: Mailfaker (http://www.weedem.fr/)
  //         input by: felix
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //           note 1: charset argument not supported
  //        example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES')
  //        returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
  //        example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES'])
  //        returns 2: 'ab"c&#039;d'
  //        example 3: htmlspecialchars('my "&entity;" is still here', null, null, false)
  //        returns 3: 'my &quot;&entity;&quot; is still here'
  var optTemp = 0
  var i = 0
  var noquotes = false
  if (typeof quoteStyle === 'undefined' || quoteStyle === null) {
    quoteStyle = 2
  }
  string = string || ''
  string = string.toString()
  if (doubleEncode !== false) {
    // Put this first to avoid double-encoding
    string = string.replace(/&/g, '&amp;')
  }
  string = string
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  var OPTS = {
    'ENT_NOQUOTES': 0,
    'ENT_HTML_QUOTE_SINGLE': 1,
    'ENT_HTML_QUOTE_DOUBLE': 2,
    'ENT_COMPAT': 2,
    'ENT_QUOTES': 3,
    'ENT_IGNORE': 4
  }
  if (quoteStyle === 0) {
    noquotes = true
  }
  if (typeof quoteStyle !== 'number') {
    // Allow for a single string or an array of string flags
    quoteStyle = [].concat(quoteStyle)
    for (i = 0; i < quoteStyle.length; i++) {
      // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
      if (OPTS[quoteStyle[i]] === 0) {
        noquotes = true
      } else if (OPTS[quoteStyle[i]]) {
        optTemp = optTemp | OPTS[quoteStyle[i]]
      }
    }
    quoteStyle = optTemp
  }
  if (quoteStyle & OPTS.ENT_HTML_QUOTE_SINGLE) {
    string = string.replace(/'/g, '&#039;')
  }
  if (!noquotes) {
    string = string.replace(/"/g, '&quot;')
  }
  return string
}

_('prototype').htmlspecialchars_decode = function (string, quoteStyle) { // eslint-disable-line camelcase
  //       discuss at: http://locutus.io/php/htmlspecialchars_decode/
  //      original by: Mirek Slugen
  //      improved by: Kevin van Zonneveld (http://kvz.io)
  //      bugfixed by: Mateusz "loonquawl" Zalega
  //      bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //         input by: ReverseSyntax
  //         input by: Slawomir Kaniecki
  //         input by: Scott Cariss
  //         input by: Francois
  //         input by: Ratheous
  //         input by: Mailfaker (http://www.weedem.fr/)
  //       revised by: Kevin van Zonneveld (http://kvz.io)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //        example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES')
  //        returns 1: '<p>this -> &quot;</p>'
  //        example 2: htmlspecialchars_decode("&amp;quot;")
  //        returns 2: '&quot;'
  var optTemp = 0
  var i = 0
  var noquotes = false
  if (typeof quoteStyle === 'undefined') {
    quoteStyle = 2
  }
  string = string.toString()
    .replace(/&lt;/g, '<')
.replace(/&gt;/g, '>')
  var OPTS = {
    'ENT_NOQUOTES': 0,
'ENT_HTML_QUOTE_SINGLE': 1,
'ENT_HTML_QUOTE_DOUBLE': 2,
'ENT_COMPAT': 2,
'ENT_QUOTES': 3,
'ENT_IGNORE': 4
  }
  if (quoteStyle === 0) {
    noquotes = true
  }
  if (typeof quoteStyle !== 'number') {
// Allow for a single string or an array of string flags
quoteStyle = [].concat(quoteStyle)
for (i = 0; i < quoteStyle.length; i++) {
  // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
      if (OPTS[quoteStyle[i]] === 0) {
        noquotes = true
      } else if (OPTS[quoteStyle[i]]) {
        optTemp = optTemp | OPTS[quoteStyle[i]]
      }
    }
    quoteStyle = optTemp
  }
  if (quoteStyle & OPTS.ENT_HTML_QUOTE_SINGLE) {
    // PHP doesn't currently escape if more than one 0, but it should:
string = string.replace(/&#0*39;/g, "'")
// This would also be useful here, but not a part of PHP:
// string = string.replace(/&apos;|&#x0*27;/g, "'");
  }
  if (!noquotes) {
    string = string.replace(/&quot;/g, '"')
  }
  // Put this in last place to avoid escape being double-decoded
  string = string.replace(/&amp;/g, '&')
  return string
}

priya.htmlspecialchars = _('prototype').htmlspecialchars;
priya.htmlspecialchars_decode = _('prototype').htmlspecialchars_decode;

/**
 * Implode.prototype.js
 */
_('prototype').implode = function (glue, pieces){
    var i = '',
        retVal = '',
        tGlue = '';
    if (arguments.length === 1) {
        pieces = glue;
        glue = '';
    }
    if (typeof pieces === 'object') {
        if (Object.prototype.toString.call(pieces) === '[object Array]') {
            return pieces.join(glue);
        }
        for (i in pieces) {
            retVal += tGlue + pieces[i];
            tGlue = glue;
        }
        return retVal;
    }
    return pieces;
}

priya.implode = _('prototype').implode;

/**
 * In.array.prototype.js
 */
_('prototype').in_array = function (needle, haystack, strict) {
    var key = '';
    var strict = !!strict;
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }
    return false;
}

priya.in_array = _('prototype').in_array;

/**
 * Is.array.prototype.js
 */
_('prototype').is_array = function (mixedVar) {
    var _getFuncName = function (fn) {
        var name = (/\W*function\s+([\w$]+)\s*\(/).exec(fn)
        if (!name) {
          return '(Anonymous)';
        }
        return name[1];
    }
    var _isArray = function (mixedVar) {
        if (!mixedVar || typeof mixedVar !== 'object' || typeof mixedVar.length !== 'number') {
            return false;
        }
        var len = mixedVar.length;
        mixedVar[mixedVar.length] = 'bogus';
        if (len !== mixedVar.length) {
            mixedVar.length -= 1;
            return true;
        }
        delete mixedVar[mixedVar.length];
        return false;
    }
    if (!mixedVar || typeof mixedVar !== 'object') {
        return false;
    }
    var isArray = _isArray(mixedVar);
    if (isArray) {
        return true;
    }
    return false;
}

priya.is_array = _('prototype').is_array;

/**
 * Is.empty.prototype.js
 */
_('prototype').is_empty = function (mixed_var){
    var key;
     if (
        mixed_var === "" ||
        mixed_var === 0 ||
        mixed_var === "0" ||
        mixed_var === null ||
        mixed_var === false ||
        typeof mixed_var === 'undefined') {
        return true;
    }
    if (typeof mixed_var == 'object') {
        for (key in mixed_var) {
            return false;
        }
        return true;
    }
    return false;
}

if(typeof priya != 'undefined'){
    priya.is_empty = _('prototype').is_empty;
}

/**
 * Is.nodelist.prototype.js
 */
_('prototype').is_nodeList = function (nodes){
    if(typeof nodes == 'undefined'){
        nodes = this;
    }
    var stringRepr = Object.prototype.toString.call(nodes);

    return typeof nodes === 'object' &&
        /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
        (typeof nodes.length === 'number') &&
        (nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
}

priya.is_nodeList = _('prototype').is_nodeList;

/**
 * Is.numeric.prototype.js
 */
_('prototype').is_numeric = function (mixed_var){
    var whitespace =
        " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    return (
        typeof mixed_var === 'number' ||
        (
            typeof mixed_var === 'string' &&
            whitespace.indexOf(mixed_var.slice(-1)) === -1)
        ) &&
        mixed_var !== '' && !isNaN(mixed_var)
    ;
}

priya.is_numeric = _('prototype').is_numeric;

/**
 * Is.set.prototype.js
 */
_('prototype').is_set = function (){
    var a = arguments,
        l = a.length,
        i = 0,
        undef;
    if (l === 0) {
        return false;
    }
    while (i !== l) {
        if (a[i] === undef || a[i] === null) {
            return false;
        }
        i++;
    }
    return true;
}

priya.is_set = _('prototype').is_set;

/**
 * Jid.prototype.js
 */
_('prototype').jid = function (list){
    if(typeof list == 'undefined'){
        list = 'priya.jid';
    }
    var data = this.collection(list);
    if(this.is_empty(data)){
    	data = 1;
    	this.collection(list, data);
    	return data;
    } else{
    	data++
    	this.collection(list, data);
    	return data;
    }
}

priya.jid = _('prototype').jid;

/**
 * Link.prototype.js
 */
_('prototype').link = function (data, closure){
    if(typeof data == 'undefined'){
        return;
    }
    if(typeof data == 'string'){
        var data = {
            link : [data]
        };
    }
    if(this.is_set(data.href)){
        priya.select('head').appendChild(data);
        priya.load++;
        data.addEventListener('load', function(event){
            priya.load--;
        }, false);
        if(closure){
            data.addEventListener('load', function(event){
                closure();
            }, false);
            data.addEventListener('error', function(event){
                console.log('error');
                closure();
            }, false);
        }
        return data;
    } else {
        if(!this.is_set(data.link)){
            return data;
        }
        var index;
        for(index in data.link){
            if(data.link[index].substr(0, 4) === '&lt;'){
                data.link[index] = data.link[index].toString()
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');
            }
            var link = {
                "method":"append",
                "target":"head",
                "html":data.link[index]
            };
            this.content(link);
        }
        return this;
    }
}

priya.link = _('prototype').link;

/**
 * Methods.prototype.js
 */
_('prototype').methods = function (){
    var result = {};
    var property;
    for(property in this){
        if(typeof this[property] != 'function'){
            continue;
        }
        result[property] = this[property];
    }
    return result;
}

priya.methods = _('prototype').methods;

/**
 * Microtime.prototype.js
 */
_('prototype').microtime = function (get_as_float){
    var now = new Date().getTime() / 1000;
    var s = parseInt(now, 10);
    return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
}

priya.microtime = _('prototype').microtime;

/**
 * Namespace.prototype.js
 */
/**
 * required & written in Priya.prototype.js
 */


/**
 * Next.prototype.js
 */
_('prototype').next = function (tagName){
    if(!tagName){
        tagName = this.tagName;
    }
    var parent = this.parentNode;
    var index;
    var found;
    for(index = 0; index < parent.childNodes.length; index++){
        var child = parent.childNodes[index];
        if(child.isEqualNode(this)){
            found = true;
            continue;
        }
        if(!is.empty(found)){
            if(typeof child.tagName == 'undefined'){
                continue;
            }
            if(child.tagName.toLowerCase() === tagName.toLowerCase()){
                found = child;
                break;
            }
        }
    }
    if(found !== true && !is.empty(found)){
        return attach(found);
    }
}

priya.next = _('prototype').next;

/**
 * Object.delete.prototype.js
 */
_('prototype').object_delete = function(attributeList, object, parent, key){
    if(typeof attributeList == 'string'){
        attributeList = this.explode_multi(['.', ':', '->'], attributeList);
    }
    if(this.is_array(attributeList)){
        attributeList = this.object_horizontal(attributeList);
    }
    if(!this.is_empty(attributeList)){
        var index;
        for(index in attributeList){
            var attribute = attributeList[index];
            if(this.is_set(object[index])){
                return this.object_delete(attribute, object[index], object, index);
            } else {
                return false;
            }
        }
    } else {
        delete parent[key];
        return true;
    }
}

priya.object_delete = _('prototype').object_delete;

/**
 * Object.get.prototype.js
 */
_('prototype').object_get = function(attributeList, object){
    if(this.is_empty(object)){
        return null;
    }
    if(typeof attributeList == 'string'){
        attributeList = this.explode_multi(['.', ':', '->'], attributeList);
        var key;
        for(key in attributeList){
            if(this.is_empty(attributeList[key])){
                delete attributeList[key];
            }
        }
    }
    if(this.is_array(attributeList)){
        attributeList = this.object_horizontal(attributeList);
    }
    if(this.is_empty(attributeList)){
        return object;
    }
    var key;
    for (key in attributeList){
        if(this.is_empty(key)){
            continue;
        }
        var attribute = attributeList[key];
        if(this.is_set(object[key])){
            return this.object_get(attributeList[key], object[key]);
        }
    }
    return null;
}

priya.object_get = _('prototype').object_get;

/**
 * Object.has.prototype.js
 */
_('prototype').object_has = function(attributeList, object){
    if(this.is_empty(object)){
        return false;
    }
    if(typeof attributeList == 'string'){
        attributeList = this.explode_multi(['.', ':', '->'], attributeList);
        var key;
        for(key in attributeList){
            if(this.is_empty(attributeList[key])){
                delete attributeList[key];
            }
        }
    }
    if(this.is_array(attributeList)){
        attributeList = this.object_horizontal(attributeList);
    }
    if(this.is_empty(attributeList)){
        return false;
    }
    var key;
    for (key in attributeList){
        if(this.is_empty(key)){
            continue;
        }
        var attribute = attributeList[key];
        if(this.is_set(object[key])){
            return true;
        }
    }
    return false;
}

priya.object_has = _('prototype').object_has;

/**
 * Object.horizontal.prototype.js
 */
_('prototype').object_horizontal = function (verticalArray, value, result){
    if(this.is_empty(result)){
        result = 'object';
    }
    if(this.is_empty(verticalArray)){
        return false;
    }
    var object = {};
    var last = verticalArray.pop();
    var key;
    for(key in verticalArray){
        var attribute = verticalArray[key];
        if(typeof deep == 'undefined'){ //is_set...
            object[attribute] = {};
            var deep = object[attribute];
        } else {
            deep[attribute] = {};
            deep = deep[attribute];
        }
    }
    if(typeof deep == 'undefined'){
        object[last] = value;
    } else {
        deep[last] = value;
    }
    return object;
}

priya.object_horizontal = _('prototype').object_horizontal;

/**
 * Object.merge.prototype.js
 */
_('prototype').object_merge = function (main, merge){
    var key;
    if (typeof main == 'undefined'){
        main = {};
    }
    for (key in merge){
        var value = merge[key];
        if(typeof main[key] == 'undefined'){
            main[key] = value;
        } else {
            if(typeof value == 'object' && typeof main[key] == 'object'){
                main[key] = this.object_merge(main[key], value);
            } else {
                main[key] = value;
            }
        }
    }
    return main;
}

priya.object_merge = _('prototype').object_merge;

/**
 * Object.set.prototype.js
 */
_('prototype').object_set = function(attributeList, value, object, result){
    if(typeof result == 'undefined'){
        result = 'child';
    }
    if(typeof result == 'string' && result !== 'child'){
        if(result === 'root'){
            result = object;
        } else {
            result = this.object_get(result, object);
        }
    }
    if(typeof attributeList == 'string'){
        attributeList = this.explode_multi(['.', ':', '->'], attributeList);
    }
    if(this.is_array(attributeList)){
        attributeList = this.object_horizontal(attributeList);
    }
    if(!this.is_empty(attributeList)){
        var index;
        for(index in attributeList){
            var attribute = attributeList[index];
            if(this.is_set(object[index]) && typeof object[index] == 'object'){
                if(this.is_empty(attribute) && typeof value == 'object'){
                    var key;
                    for(key in value){
                        var value_value = value[key];
                        object[index][key] = value_value;
                    }
                    return object[index];
                }
                return this.object_set(attribute, value, object[index], result);
            }
            else if(typeof attribute == 'object'){
                object[index] = {};
                return this.object_set(attribute, value, object[index], result);
            } else {
                object[index] = value;
            }
        }
    }
    if(result === 'child'){
        return value;
    }
    return result;
}

priya.object_set = _('prototype').object_set;

/**
 * Off.prototype.js
 */
_('prototype').off = function (event, action){
    this.removeEventListener(event, action)
}

priya.off = _('prototype').off;

/**
 * On.prototype.js
 */
_('prototype').on = function (event, action, capture){
    if(typeof this['Priya'] == 'undefined'){
        console.log('Priya undefined');
        console.log(this);
        console.log(event);
        console.log(action);
        return this;
    }
    if(typeof this['Priya']['eventListener'] != 'object'){
        this['Priya']['eventListener'] = {};
    }
    if(typeof event == 'object'){
        var index;
        for (index=0; index < event.length; index++){
            this.on(event[index], action, capture);
        }
        return this;
    } else {
        if(typeof this['Priya']['eventListener'][event] == 'undefined'){
            this['Priya']['eventListener'][event] = [];
        }
        if(this.is_empty(capture)){
            capture = false;
        } else {
            capture = true;
        }
        this['Priya']['eventListener'][event].push(action);
        if(this.is_nodeList(this)){
            var index;
            for (index=0; index < this.length; index++){
                var node = this[index];
                if(typeof action == 'undefined'){
                    console.log('action undefined with event: ' + event);
                }
                node.addEventListener(event, action, capture);
            }
        } else {
            this.addEventListener(event, action, capture);
        }
        return this;
    }
}

priya.on = _('prototype').on;

/**
 * Prepend.prototype.js
 */
_('prototype').prepend = function(node){
    this.insertBefore(node, this.children('first'));
    return this;
}

priya.prepend = _('prototype').prepend;

/**
 * Previous.prototype.js
 */
_('prototype').previous = function (tagName){
    if(!tagName){
        tagName = this.tagName;
    }
    var parent = this.parentNode;
    var index;
    var found;
    var nodeList = parent.childNodes;
    for(index = nodeList.length-1; index >= 0; index--){
        var child = nodeList[index];
        if(child.isEqualNode(this)){
            found = true;
            continue;
        }
        if(!is.empty(found)){
            if(typeof child.tagName == 'undefined'){
                continue;
            }
            if(child.tagName.toLowerCase() === tagName.toLowerCase()){
                found = child;
                break;
            }
        }
    }
    if(found !== true && !is.empty(found)){
        return attach(found);
    }
    return null;
}

priya.previous = _('prototype').previous;

/**
 * Rand.prototype.js
 */
_('prototype').rand = function (min, max) {
    var argc = arguments.length;
    if (argc === 0) {
        min = 0;
        max = 2147483647;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

priya.rand = _('prototype').rand;

/**
 * Redirect.prototype.js
 */
_('prototype').redirect = function (data){
    if(typeof data == 'undefined'){
        return;
    }
    if(!_('prototype').is.set(data.redirect)){
        if(typeof data == 'object'){
            return;
        }
        var data = {"redirect": data};
    }        
    window.location.href = data.redirect;
    return data;
}

priya.redirect = _('prototype').redirect;

/**
 * Remove.prototype.js
 */
_('prototype').remove = function (){
    if(this.is_nodeList(this)){
        var index;
        for(index=0; index < this.length; index++){
            var node = this[index];
            if(typeof node.parentNode !== 'undefined'){
                node.parentNode.removeChild(node);
            }
        }
        return true;
    } else {
        var node = this.parentNode;
        if(node != null){
            return node.removeChild(this);
        } else {
            return false;
        }
    }
}

priya.remove = _('prototype').remove;

/**
 * Request.prototype.js
 */
_('prototype').request = function (url, data, script){
    const request = this;
    let type = 'GET';
    if(typeof url == 'object' && url !== null){
        data = url;
        url = '';
        if (typeof data.altKey != "undefined") {//event
            priya.debug('event');
            let event = data;
            url = request.data('url');
            data = request.data();
            delete data.request;
        }
    }
    if(_('prototype').is_empty(url)){
        if(typeof request.data == 'function'){
            url = request.data('url');
        }
    }    
    if(_('prototype').is_empty(url)){
        return;
    }
    let has_request_method = false;
    if(_('prototype').is_empty(data)){
        if(!_('prototype').is_empty(request.tagName) && request.tagName === 'FORM'){
            data = request.data('serialize');
            let number;
            for(number in data){
                let attribute = data[number];
                if(!_('prototype').is_empty(attribute.name) && attribute.name === 'request-method'){
                    type = attribute.value;
                    delete data[number];
                    has_request_method = true;
                }
            }
        } else {            
            if(typeof request.data != 'undefined'){
                data = request.data();
                let number;
                for(number in data){
                    let attribute = data[number];
                    if(!_('prototype').is_empty(attribute.name) && attribute.name === 'request-method'){
                        type = attribute.value;
                        delete data[number];
                        has_request_method = true;
                    }
                }
            }            
        }
    }
    if(has_request_method === true){
        //intended
    } else {
        if(_('prototype').is_empty(data)){
            type = 'GET';
        } else {
            let tmpData = data;
            delete tmpData['mtime'];
            if(_('prototype').is_empty(tmpData)){
                type = 'GET';
            }
            let is_found = false;
            let number;
            for(number in tmpData){
                if(tmpData[number]?.name === 'request-method'){
                    type = tmpData[number].value;
                    delete tmpData[number];
                    delete data[number];
                    is_found = true;
                    break;
                }
            }
            if(is_found){
                //type = is_found type
            }
            else if(!_('prototype').is_empty(tmpData['request-method'])){
                type = tmpData['request-method'];
                delete tmpData['request-method'];
                delete data['request-method'];
            }
            else if(!_('prototype').is_empty(tmpData['request']) && !_('prototype').is_empty(tmpData['request']['method'])) {
                type = tmpData['request']['method'];
                delete tmpData['request']['method'];
                delete data['request']['method'];
                if(_('prototype').is_empty(tmpData['request'])){
                    delete tmpData['request'];
                    delete data['request'];
                }
            } else {
                type = 'POST';
            }
        }
    }
    const xhttp = new XMLHttpRequest();
    xhttp.priority = 'high';
    let header = priya.collection('request.header');
    priya.collection('delete', 'request.header');
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if(
                xhttp.responseText.substr(0, 1) === '{' &&
                xhttp.responseText.substr(-1) === '}' &&
                xhttp.responseText.substr(0, 2) !== '{{' &&
                xhttp.responseText.substr(-2) !== '}}'
            ){
                const data = JSON.parse(xhttp.responseText);
                if(_('prototype').is_empty(data.trace)){
                    priya.link(data);
                    priya.styler(data);
                    priya.script(data);
                    priya.content(data);
                    priya.redirect(data);
                    if(typeof script == 'function'){
                        script(url, data);
                    }
                } else {
                    priya.exception(data);
                    if(typeof script == 'function'){
                        script(url, data);
                    }
                }
                return;
            }
            if(xhttp.responseText.substr(0, 1) === '[' && xhttp.responseText.substr(-1) === ']'){
                const data = JSON.parse(xhttp.responseText);
                if(typeof script == 'function'){
                    script(url, data);
                }
            } else {
                if(!_('prototype').is_empty(_('exception'))){
                    // intended
                } else {
                    if (xhttp.responseText) {
                        priya.debug(xhttp.responseText);
                    }
                }
                if(typeof script == 'function'){
                    script(url, xhttp.responseText);
                }
            }
        } else {
            if(xhttp.readyState === 0){
                // unsent
            }
            else if (xhttp.readyState === 1){
                // opened
            }
            else if(xhttp.readyState === 2){
                // header received
            }
            if(xhttp.readyState === 3){
                 // loading
            }
        }
    };
    if(type === 'GET'){
        let urlEncodedDataPairs = [];
        let name;
        for( name in data ) {
            urlEncodedDataPairs.push(encodeURIComponent(name)+'='+encodeURIComponent(data[name]));
        }
        let params = '';
        let split = url.split('?');
        if(split.length === 2){
            params = urlEncodedDataPairs.join('&');
        }
        else if (urlEncodedDataPairs.length >= 1) {
            params = '?' + urlEncodedDataPairs.join('&');
        }
        priya.collection('request.microtime', microtime(true));
        xhttp.open(type, url + params, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        if(header !== null){
            let index;
            for(index=0; index < header.length; index++){
                let request_header = header[index];
                let attribute;
                for(attribute in request_header){
                    xhttp.setRequestHeader(attribute, request_header[attribute]);
                }
            }
        }
        xhttp.send();
    } else {
        priya.collection('request.microtime', microtime(true));
        xhttp.open(type, url, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        if(header !== null){
            let index;
            for(index=0; index < header.length; index++){
                let request_header = header[index];
                let attribute;
                for(attribute in request_header){
                    xhttp.setRequestHeader(attribute, request_header[attribute]);
                }
            }
        }
        if (typeof JSON.decycle == "function") {
            data = JSON.decycle(data);
        }
        console.log(data);
        const send = JSON.stringify(data);
        xhttp.send(send);
    }
}

priya.request = _('prototype').request;

/**
 * Round.prototype.js
 */
_('prototype').round = function (value, precision, mode) {
    var m, f, isHalf, sgn;
    // making sure precision is integer
    precision |= 0
    m = Math.pow(10, precision)
    value *= m
    // sign of the number
    sgn = (value > 0) | -(value < 0)
    isHalf = value % 1 === 0.5 * sgn
    f = Math.floor(value)
    if (isHalf) {
        switch (mode) {
            case 'PHP_ROUND_HALF_DOWN':
                // rounds .5 toward zero
                value = f + (sgn < 0)
            break
            case 'PHP_ROUND_HALF_EVEN':
                // rouds .5 towards the next even integer
                value = f + (f % 2 * sgn)
            break
            case 'PHP_ROUND_HALF_ODD':
                // rounds .5 towards the next odd integer
                value = f + !(f % 2)
                break
            default:
                // rounds .5 away from zero
                value = f + (sgn > 0)
        }
    }
    return (isHalf ? value : Math.round(value)) / m
}

priya.round = _('prototype').round;

/**
 * Run.prototype.js
 */
_('prototype').run = function (data){
    console.warn('element.run() is deprecated, use select() instead');
    if(Object.prototype.toString.call(priya) === '[object Function]'){
        var object = this;
    } else {
        var object = priya;
    }
    var require = object.collection('require');
    if(require.toLoad === require.loaded){
        var element = select(data);
        if(is.empty(element) || element.tagName === 'PRIYA-NODE'){
            return;
        }
        var request = element.data('request');
        if(!is.empty(request)){
            return element.request(request);
        }
        if(typeof microtime == 'undefined'){
            priya.expose('prototype');
        }
        element.data('mtime', microtime(true));
        return element;
    } else {
        setTimeout(function(){
            _('prototype').run(data);
        }, 1/30);
    }
}

priya.run = _('prototype').run;

/**
 * Script.prototype.js
 */
_('prototype').script = function (data, closure){
    if(typeof data == 'undefined'){
        return;
    }
    if(this.is_set(data.src) && this.is_set(data.type) && data.type === 'text/javascript'){
        let script = priya.create('script', data.src);
        priya.select('head').appendChild(script);
        priya.load++;
        script.addEventListener('load', function(event){
            priya.load--;
        }, false);
        if(closure){
            script.addEventListener('load', function(event){
                closure();
            }, false);
        }
        return script;
    }
    if(typeof attempt == 'undefined'){
        attempt = 0;
    }
    if(parseInt(priya.load) !== 0 && attempt < 500){
        setTimeout(function(){
            priya.script(data, ++attempt);
            priya.hit++;
        }, parseFloat(1000/30));
        return data;
    }
    if(!this.is_set(data.script)){
        return data;
    }
    var index;
    for(index in data.script){
        if(data.script[index].substr(0, 4) === '&lt;'){
            data.script[index] = data.script[index].toString()
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
        }
        this.addScriptSrc(data.script[index]);
        this.addScriptText(data.script[index]);
    }
    return this;
}

_('prototype').addScriptSrc = function (data){
    var tag = this.readTag(data);
    if(!this.is_set(tag['tagName']) || tag['tagName'] !== 'script'){
        return;
    }
    if(!this.is_set(tag['src'])){
        return;
    }
    var element = document.createElement(tag.tagName);
    var index;
    for(index in tag){
        if(index === 'tagName'){
            continue;
        }
        element.setAttribute(index, tag[index]);
    }
    document.getElementsByTagName("head")[0].appendChild(element);
}

_('prototype').addScriptText = function (data){
    var tag = this.readTag(data);
    if(!this.is_set(tag['tagName']) || tag['tagName'] !== 'script'){
        return;
    }
    var temp = this.explode('<'+tag.tagName, data);
    if(!this.is_set(temp[1])){
        return;
    }
    temp = this.explode('</' +tag.tagName, temp[1]);
    temp = this.explode('>', temp[0]);
    temp.shift();
    var text = this.trim(this.implode('>', temp));
    delete temp;
    if(this.is_empty(text)){
        return;
    }
    var element = document.createElement(tag.tagName);
    var index;
    for(index in tag){
        if(index === 'tagName'){
            continue;
        }
        if(this.stristr(index, '[') !== false){
            continue;
        }
        if(this.stristr(index, '\'') !== false){
            continue;
        }
        element.setAttribute(index, tag[index]);
    }
    element.text = text;
    document.getElementsByTagName("head")[0].appendChild(element);
}

_('prototype').readTag = function (data){
    var temp = this.explode('>', this.trim(data));
    temp = this.explode(' ', this.trim(temp[0]));
    var index;
    var tag = {
        "tagName": temp[0].substr(1)
    };
    for (index in temp){
        var key = this.explode('="', temp[index]);
        var value = this.explode('"',key[1]);
        key = key[0];
        if(this.is_empty(value)){
            continue;
        }
        value.pop();
        value = this.implode('"', value);
        tag[key] = value;
    }
    return tag;
}

priya.script = _('prototype').script;
priya.addScriptSrc = _('prototype').addScriptSrc;
priya.addScriptText = _('prototype').addScriptText;
priya.readTag = _('prototype').readTag;

/**
 * Scrollbar.prototype.js
 */
_('prototype').scrollbar = function(attribute, type){
    if(attribute === 'y' || attribute === 'top'){
        return this.data('scrollbar-y', this.scrollTop);
    }
    if(attribute === 'x' || attribute === 'left'){
        return this.data('scrollbar-x', this.scrollLeft);
    }
    var width = this.offsetWidth - this.clientWidth;
    var height = this.offsetHeight - this.clientHeight;
    if(attribute === 'width'){
        return this.data('scrollbar-width', width);
    }
    if(attribute === 'height'){
        return this.data('scrollbar-height', height);
    }
    if(attribute === 'all'){
        var scrollbar = {
                'y': this.scrollTop,
                'x': this.scrollLeft,
                'width': width,
                'height': height
        };
        return this.data('scrollbar', scrollbar);
    }
    if(attribute === 'to'){
        this.scrollTo(type.x, type.y);
    }
    if(attribute === 'has'){
        if(type && type === 'horizontal'){
            return this.scrollWidth > this.clientWidth;
        }
        else if (type && type === 'vertical'){
            return this.scrollHeight > this.clientHeight;
        } else {
            var hasHorizontalScrollbar = this.scrollWidth > this.clientWidth;
            var hasVerticalScrollbar = this.scrollHeight > this.clientHeight;
            if(hasHorizontalScrollbar || hasVerticalScrollbar){
                return true;
            }
            return false;
        }
    }
}

priya.scrollbar = _('prototype').scrollbar;

/**
 * Select.prototype.js
 */
_('prototype').select = function(selector){
    if(_('prototype').is_empty(selector)){
		console.log('empty selector');
		return;
	}
    if(this.nodeName){
    }
    if(Object.prototype.toString.call(priya) === '[object Function]'){
    } else {
        if(Object.prototype.toString.call(this) === '[object Window]'){
            object = window.priya;
        } else {
            if(Object.prototype.toString.call(this) === '[object HTMLElement]'){
                if(typeof this.nodeName != 'undefined' && this.nodeName === 'PRIYA-NODE'){
                    return false;
                }
            }
            object = this;
        }
    }

    if(typeof selector == 'undefined' || selector === null){
        var priya = object.attach(object.create('element', selector));
        priya.data('selector', selector);
//        console.log('here 1');
//        console.log(priya);
//        return priya;
        return false;
    }
    var call = Object.prototype.toString.call(selector);
    if(call === '[object HTMLDocument]'){
        var priya = object.attach(object.create('element', selector));
        priya.data('selector', selector);
        return false;
//        console.log('here 2');
//        console.log(priya);
//        return priya;
    }
    else if(call === '[object HTMLBodyElement]'){
        if(typeof object['Priya'] == 'object'){
            return object;
        } else {
            console.log('error, cannot attach ??? with priya.attach(object)');
        }
    }
    else if(call === '[object String]'){
        if(typeof object.querySelectorAll == 'function'){
            var list = object.find(selector);
        } else {
            var list = document.querySelectorAll(selector);
        }
        var index;
        for (index = 0; index < list.length; index++){
            var node = list[index];
            if(typeof node['Priya'] != 'object'){
                node = object.attach(node);
            }
            list[index] = node;
        }
        if (list.length === 0){
            var priya = object.attach(object.create('element', selector));
            priya.data('selector', selector);
//            console.log('here 3');
//            console.log(priya);
//            return priya;
            return false;
        }
        else if(list.length === 1){
           return node;
       } else {
           return object.attach(list);
       }
    } else {
        if(typeof object['Priya'] == 'object'){
            return object;
        }
        else if(typeof selector['Priya'] == 'object'){
            return selector;
        } else {
            console.log(object);
            console.log(selector);
            console.log(call);
            console.log('error, cannot attach ??? with priya.attach(object)');
            var object =  object.attach(call);
            console.log(object);
            return object;
        }
    }
}

priya.select = _('prototype').select;

/**
 * Str.replace.prototype.js
 */
_('prototype').str_replace = function (search, replace, subject, count){
    var i = 0,
        j = 0,
        temp = '',
        repl = '',
        sl = 0,
        fl = 0,
        f = [].concat(search),
        r = [].concat(replace),
        s = subject,
        ra = Object.prototype.toString.call(r) === '[object Array]',
        sa = Object.prototype.toString.call(s) === '[object Array]';
          s = [].concat(s);
      if (count) {
        this.window[count] = 0;
      }
      for (i = 0, sl = s.length; i < sl; i++) {
        if (s[i] === '') {
              continue;
        }
        for (j = 0, fl = f.length; j < fl; j++) {
              temp = s[i] + '';
              repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
              s[i] = (temp).split(f[j]).join(repl);
              if (count && s[i] !== temp) {
                this.window[count] += (temp.length - s[i].length) / f[j].length;
              }
        }
      }
      return sa ? s : s[0];
}

priya.str_replace = _('prototype').str_replace;

/**
 * Str.stri.prototype.js
 */
_('prototype').stristr = function (haystack, needle, bool){
    var pos = 0;
    haystack += '';
    pos = haystack.toLowerCase().indexOf((needle + '').toLowerCase());
    if (pos === -1) {
        return false;
    } else {
        if (bool) {
            return haystack.substring(0, pos);
        } else {
            return haystack.slice(pos);
        }
    }
}

priya.stristr = _('prototype').stristr;

/**
 * Strftime.prototype.js
 */
/* Port of strftime(). Compatibility notes:
 *
 * %c - formatted string is slightly different
 * %D - not implemented (use "%m/%d/%y" or "%d/%m/%y")
 * %e - space is not added
 * %E - not implemented
 * %h - not implemented (use "%b")
 * %k - space is not added
 * %n - not implemented (use "\n")
 * %O - not implemented
 * %r - not implemented (use "%I:%M:%S %p")
 * %R - not implemented (use "%H:%M")
 * %t - not implemented (use "\t")
 * %T - not implemented (use "%H:%M:%S")
 * %U - not implemented
 * %W - not implemented
 * %+ - not implemented
 * %% - not implemented (use "%")
 *
 * strftime() reference:
 * http://man7.org/linux/man-pages/man3/strftime.3.html
 *
 * Day of year (%j) code based on Joe Orost's answer:
 * http://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
 *
 * Week number (%V) code based on Taco van den Broek's prototype:
 * http://techblog.procurios.nl/k/news/view/33796/14863/calculate-iso-8601-week-and-year-in-javascript.html
 */
_('prototype').strftime = function (sFormat, date) {
  if (!(date instanceof Date)) date = new Date();
  var nDay = date.getDay(),
    nDate = date.getDate(),
    nMonth = date.getMonth(),
    nYear = date.getFullYear(),
    nHour = date.getHours(),
    aDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    aMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
    isLeapYear = function() {
      return (nYear%4===0 && nYear%100!==0) || nYear%400===0;
    },
    getThursday = function() {
      var target = new Date(date);
      target.setDate(nDate - ((nDay+6)%7) + 3);
      return target;
    },
    zeroPad = function(nNum, nPad) {
      return ('' + (Math.pow(10, nPad) + nNum)).slice(1);
    };
  return sFormat.replace(/%[a-z]/gi, function(sMatch) {
    return {
      '%a': aDays[nDay].slice(0,3),
      '%A': aDays[nDay],
      '%b': aMonths[nMonth].slice(0,3),
      '%B': aMonths[nMonth],
      '%c': date.toUTCString(),
      '%C': Math.floor(nYear/100),
      '%d': zeroPad(nDate, 2),
      '%e': nDate,
      '%F': date.toISOString().slice(0,10),
      '%G': getThursday().getFullYear(),
      '%g': ('' + getThursday().getFullYear()).slice(2),
      '%H': zeroPad(nHour, 2),
      '%I': zeroPad((nHour+11)%12 + 1, 2),
      '%j': zeroPad(aDayCount[nMonth] + nDate + ((nMonth>1 && isLeapYear()) ? 1 : 0), 3),
      '%k': '' + nHour,
      '%l': (nHour+11)%12 + 1,
      '%m': zeroPad(nMonth + 1, 2),
      '%M': zeroPad(date.getMinutes(), 2),
      '%p': (nHour<12) ? 'AM' : 'PM',
      '%P': (nHour<12) ? 'am' : 'pm',
      '%s': Math.round(date.getTime()/1000),
      '%S': zeroPad(date.getSeconds(), 2),
      '%u': nDay || 7,
      '%V': (function() {
              var target = getThursday(),
                n1stThu = target.valueOf();
              target.setMonth(0, 1);
              var nJan1 = target.getDay();
              if (nJan1!==4) target.setMonth(0, 1 + ((4-nJan1)+7)%7);
              return zeroPad(1 + Math.ceil((n1stThu-target)/604800000), 2);
            })(),
      '%w': '' + nDay,
      '%x': date.toLocaleDateString(),
      '%X': date.toLocaleTimeString(),
      '%y': ('' + nYear).slice(2),
      '%Y': nYear,
      '%z': date.toTimeString().replace(/.+GMT([+-]\d+).+/, '$1'),
      '%Z': date.toTimeString().replace(/.+\((.+?)\)$/, '$1')
    }[sMatch] || sMatch;
  });
}

priya.strftime = _('prototype').strftime;

/**
 * Styler.prototype.js
 */
_('prototype').styler = function (data, closure){
    if(typeof data == 'undefined'){
        return;
    }
    if(typeof data == 'string'){
        var data = {
            style : [data]
        };
    }
    if(!_('prototype').is_set(data.style)){
            return data;
    }
    var index;
    for(index in data.style){
        if(data.style[index].substr(0, 4) === '&lt;'){
            data.style[index] = data.style[index].toString()
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
        }
        var style = {
            "method":"append",
            "target":"head",
            "html":data.style[index]
        };
        this.content(style);
    }
    return this;
}

priya.styler = _('prototype').styler;

/**
 * Trigger.prototype.js
 */
_('prototype').trigger = function (trigger, bubble, cancel){
    if(this.is_empty(bubble)){
        bubble = false;
    } else {
        bubble = true;
    }
    if(this.is_empty(cancel)){
        cancel = false;
    } else {
        cancel = true;
    }
    var event = new Event(trigger, {
        'bubbles'    : bubble, /* Whether the event will bubble up through the DOM or not */
        'cancelable' : cancel  /* Whether the event may be canceled or not */
    });
    /*event.initEvent(trigger, true, true);*/
    event.synthetic = true;
    if(trigger==='click'){
    	event.detail = 1;
    }
    else if(trigger==='dblclick'){
    	event.detail = 2;
    }
    if(typeof this.dispatchEvent == 'undefined'){
        if(priya.is_nodeList(this)){
            var index;
            for(index=0; index < this.length; index++){
                var node = this[index];
                node.dispatchEvent(event, true);
            }
        } else {
            console.log('dispatch problem');
            console.log(this);
        }
    } else {
        this.dispatchEvent(event, true);
    }
}

priya.trigger = _('prototype').trigger;

/**
 * Trim.prototype.js
 */
_('prototype').trim = function(str, charlist){
    var whitespace, l = 0,
    i = 0;
    str += '';
    if (!charlist) {
        // default list
        whitespace =
            ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    } else {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }
    l = str.length;
    for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }
    l = str.length;
    for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

priya.trim = _('prototype').trim;

/**
 * Usleep.prototype.js
 */
_('prototype').usleep = function (msec){
    var start = new Date().getTime();
    var current = new Date().getTime() - start;
    while(current < msec) {
        current = new Date().getTime() - start;
    }
}

priya.usleep = _('prototype').usleep;

/**
 * Val.prototype.js
 */
_('prototype').val = function (value){
    if(typeof this.value == 'undefined'){
        return false;
    }
    if(typeof value != 'undefined'){
        this.value = value
    }

    return this.value;
}

priya.val = _('prototype').val;

/**
 * Week.prototype.js
 */
_('prototype').week = function (date) {
    if(typeof date == 'undefined'){
        date = new Date();
    }
    var tdt = new Date(date.valueOf());
    var dayn = (date.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    var firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
        tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}

priya.week = _('prototype').week;

/**
 * Zzz.is.prototype.js
 */
_('prototype').is = {};
_('prototype').is.array = _('prototype').is_array;
_('prototype').is.empty = _('prototype').is_empty;
_('prototype').is.nodeList = _('prototype').is_nodeList;
_('prototype').is.numeric = _('prototype').is_numeric;
_('prototype').is.set = _('prototype').is_set;
priya.is = _('prototype').is;

/**
 * Zzz.object.prototype.js
 */
_('prototype').object = {};
_('prototype').object.delete = _('prototype').object_delete;
_('prototype').object.get = _('prototype').object_get;
_('prototype').object.horizontal = _('prototype').object_horizontal;
_('prototype').object.merge = _('prototype').object_merge;
_('prototype').object.set = _('prototype').object_set;
_('prototype').object.has = _('prototype').object_has;
priya.object = _('prototype').object;

/**
 * Zzz.string.prototype.js
 */
_('prototype').string = {};
_('prototype').string.replace = _('prototype').str_replace;
_('prototype').string.contains = _('prototype').stristr;
_('prototype').string.from = {};
_('prototype').string.from.time = _('prototype').strftime;
priya.string = _('prototype').string;
