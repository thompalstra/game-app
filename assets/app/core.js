define = function( tag, constr ){
    if( typeof customElements == 'undefined' ){
        document.createElement( tag, constr );
    } else {
        customElements.define( tag, constr );
    }
}

class LayoutsElement extends HTMLElement{
    open( url, onsuccess, onerror ){

        var layout =  doc.create('x-layout', {
            'id': this.generateID( url ),
            'data-eval-js': ''
        });

        if( this.children.length > 0 ){
            layout = this.insertBefore( layout, this.children[0] );
        } else {
            var layout = this.appendChild( layout );
        }

        if( typeof onsuccess !== 'function' ){
            onsuccess = function(){};
        }
        if( typeof onerror !== 'function' ){
            onerror = function(){};
        }

        setTimeout(function(e){
            layout.load( {
                url: url,
                onsuccess: function(event){
                    onsuccess.call(this, event)
                },
                onerror: function(err){
                    onerror.call(this, err);
                }
            } );
        }, 100);
    }
    generateID( url ){
        return (url).replace(/\//g, "-").replace(/\./g, "-");
    }
    close( instance ){
        instance.setAttribute('data-dismissing', '');
        setTimeout(function(e){
            instance.removeAttribute('data-dismissing');
            instance.setAttribute('data-dismissed', '');
            instance.remove();
        });
    }
}
class LayoutElement extends HTMLElement{
    loading( bool, innerHTML ){
        if( bool === true ){
            var loadElement = this.appendChild( document.createElement('x-loading') );
            loadElement.innerHTML = "<x-message>" + innerHTML + "</x-message>";
        } else {
            var loadElement = this.one('x-loading');
            if( loadElement ){
                loadElement.remove();
            }
        }
    }
    close(){
        var beforedismiss = this.do('beforedismiss');
        if( beforedismiss.defaultPrevented == false ){
            this.setAttribute('data-dismissing', '');
            setTimeout(function(e){
                this.removeAttribute('data-dismissing');
                this.setAttribute('data-dismissed', '');
                this.remove();
            }.bind(this), 300);
        }
    }
}

class DialogElement extends HTMLElement{
    constructor(){
        super();
    }
    connectedCallback(){
        if( this.hasAttribute('data-backdrop') ){
            this.parentNode.insertBefore( doc.create( 'x-backdrop' ), this );
        }

        this.on('dismiss', function(event){
            var beforedismiss = this.do('beforedismiss');
            if( beforedismiss.defaultPrevented == false ){
                this.show = false;
                this.do('afterdismiss');
            }
        });

        this.find('[data-dialog-action]').on('click', function(event){
            this.closest('x-dialog').do( this.dataset.dialogAction );
        });
    }
    get show(){
        return this.hasAttribute('show');
    }
    set show( value ){
        if( value === true ){
            if( this.hasAttribute('data-backdrop') && this.previousElementSibling.matches('x-backdrop') ){
                this.previousElementSibling.show = true;
            }
            this.setAttribute('show', '');
        } else {
            this.removeAttribute('show');

            if( this.hasAttribute('data-backdrop') && this.previousElementSibling.matches('x-backdrop') ){
                this.previousElementSibling.show = false;
            }
        }
    }
}
class BackdropElement extends HTMLElement{
    constructor(){
        super();
    }
    get show(){
        return this.hasAttribute('show');
    }
    set show( value ){
        if( value === true ){
            this.setAttribute('show', '');
        } else {
            this.removeAttribute('show');
        }
    }
}

define('x-layouts', LayoutsElement);
define('x-layout', LayoutElement);
define('x-dialog', DialogElement);
define('x-backdrop', BackdropElement);

window['app'] = {
    main: document.body,
    menu: document.querySelector('x-menu'),
    body: document.querySelector('x-body'),
    layouts: document.querySelector('x-layouts')
};
