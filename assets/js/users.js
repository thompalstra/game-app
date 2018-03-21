const GAME_PUBG = 0;
const GAME_BF4 = 1;
const GAME_CSGO = 2;

const STATUS_ERROR = 0;
const STATUS_SUCCESS = 4;


class Users{
    constructor( callback ){
        var db = new Database();
        var table = db.connect( 'user.users', 1, function(data){
            window.idb['user.users'].all(function(data){
                if( data.length == 0 ){
                    this.bf4 = null;
                    this.csgo = null;
                    this.pubg = null;
                } else {
                    data.forEach(function(x){
                        Object.defineProperty( this, x.id, {
                            value: x.value,
                            readable: true,
                            writable: true,
                            enumerable: true
                        } );
                    }.bind(this));
                }
                callback.call( this, data );
            }.bind(this));
        }.bind(this));
    }
    save( callback ){
        var keys = Object.keys( app.users );
        (function put( i ){
            if( i < keys.length ){
                var index = keys[i];
                this.setItem( index, this[index], function(data){
                    put.call( this, ++i );
                }.bind(this) )
            } else {
                callback.call( this, null );
            }
        }.bind(this))(0);
    }
    setItem( id, value, callback ){
        this[id] = value;
        window.idb['user.users'].put( {
            id: id,
            value: value
        }, callback);
    }
    getItem( key ){
        return window.idb['user.users'].get( key );
    }
    getUser( username, game, callback ){
        switch( game ){
            case GAME_PUBG:
                app.users.getPUBG( username, function(e){
                    callback.call( this, e );
                } )
            break;
            case GAME_BF4:
                app.users.getBF4( username, function(e){
                    callback.call( this, e );
                } )
            break;
            case GAME_CSGO:
                app.users.getCSGO( username, function(e){
                    console.log(e);
                    callback.call( this, e );
                } )
            break;
        }
    }

    getPUBG( username, callback ){
        console.log('getting PUBG user...');
        setTimeout(function(event){
            if( username.length > 4 ){
                app.users.setItem( 'pubg', {
                    id: 'pubg',
                    value: {
                        username: username,
                        rank: 9999
                    }
                }, function(event){
                    callback.call( this, {
                        message: 'Sync complete',
                        status: STATUS_SUCCESS
                    } )
                } );
            } else {
                callback.call( this, {
                    message: 'Username must be longer than 4 characters',
                    status: STATUS_ERROR
                } )
            }
        }, 2000);
    }
    getBF4( username, callback ){
        console.log('getting BF4 user...');
    }
    getCSGO( username, callback ){
        console.log('getting CSGO user...');
    }
}
