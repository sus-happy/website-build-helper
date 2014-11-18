
var fs = require( 'fs' );

exports.get_config = function ( app ) {
    var configfile = './conf/'+app+'.json';

    try {
        var conf = fs.readFileSync( configfile );
        return JSON.parse( conf );
    } catch( e ) {
        console.log( e );
        return false;
    }
};

exports.get_config_org = function ( app ) {
    var configfile = './conf/'+app+'.json.org';

    try {
        var conf = fs.readFileSync( configfile );
        return JSON.parse( conf );
    } catch( e ) {
        console.log( e );
        return false;
    }
};

exports.write_config = function( app, param ) {
    var configfile = './conf/'+app+'.json';

    try {
        var fd = fs.openSync( configfile, "w" );
        fs.writeSync( fd, param );
        fs.closeSync( fd );
    } catch( e ) {
        console.log( e );
        return false;
    }
};