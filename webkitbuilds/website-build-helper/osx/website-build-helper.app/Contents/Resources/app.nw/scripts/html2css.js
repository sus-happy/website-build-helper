// JavaScript Document

var cheerio = require( 'cheerio' );
var config  = process.mainModule.exports.get_config( 'html2css' );

( function( U ) {
    var $ = null;

    var HTML2CSS = function() {
        this._tree   = {};
        this._result = '';
        this._tab    = '';

        this.option = {
            ignored: {
                tag:   [  ],
                id:    [  ],
                class: [  ]
            },
            remove: {
                tag:   [  ],
                id:    [  ],
                class: [  ]
            },
            indent: {
                type: 'space',
                num:  4
            },
            lv_step: true,
            id_reset: true
        };
    };

    HTML2CSS.prototype = {
        set_option: function( param ) {
            this.option = jQuery.extend( this.option, param );
        },
        load_html: function( htmlbody ) {
            $ = cheerio.load( htmlbody );
        },
        set_init: function() {
            // 変数の初期化
            this._tree   = {};
            this._result = '';

            // タブ指定の初期化
            this._tab = '';
            var tab = this.option.indent.type === 'space' ? ' ' : '\t';
            for( var i=0; i<this.option.indent.num; i++ ) {
                this._tab += tab;
            }
        },
        get_root: function( root ) {
            this.set_init();

            this._tree[ root ] = {};
            this.walk( $( root ).children(), '', 0, this._tree[ root ] );

            return this._result;
        },
        walk: function( br, prefix, lv, tree ) {
            var that  = this;
            var index = 0;

            br.each( function() {
                var res = null;
                var tagObj = $(this);

                if(! tagObj.length ) {
                    return;
                }

                var csstext = '';
                var c_prefix = prefix;
                var c_lv     = lv;
                var tagname  = tagObj.get( 0 ).tagName.toLowerCase();

                // 除外タグ判定
                if( that.option.ignored.tag.indexOf( tagname ) >= 0 ) {
                    return;
                }

                var id_text = tagObj.attr( 'id' );
                var classes = tagObj.attr( 'class' ) ? tagObj.attr( 'class' ).split( ' ' ) : [];
                var class_l = classes.length;

                // ID指定有り？
                // 除外ID判定
                if( that.option.ignored.id.indexOf( id_text ) >= 0 ) {
                    return;
                }

                // class指定有り？
                if( class_l ) {
                    // 除外クラス判定
                    for( var i=0; i<class_l; i++ ) {
                        if( that.option.ignored.class.indexOf( classes[i] ) >= 0 ) {
                            return;
                        }
                    }
                }

                // 非表示タグ名判定
                if( that.option.remove.tag.indexOf( tagname ) < 0 ) {
                    csstext += tagname;
                }

                // ID指定有り？
                if( id_text ) {
                    // 非表示ID判定
                    if( that.option.remove.id.indexOf( id_text ) < 0 ) {
                        csstext += '#'+id_text;
                        // ルートを此処からにする(id_reset )
                        if( that.option.id_reset ) {
                            c_prefix  = '';
                            c_lv      = 0;
                        }
                    }
                }

                // class指定有り？
                if( class_l ) {
                    // 非表示クラス判定
                    for( var i=0; i<class_l; i++ ) {
                        if( that.option.remove.class.indexOf( classes[i] ) < 0 ) {
                            csstext += '.'+classes[i];
                        }
                    }
                }

                // ツリー確認
                if( tree[csstext] !== U ) {
                    return;
                }
                tree[csstext] = {};

                // 階層レベルのインデントを生成
                var tab = '';
                if( that.option.lv_step ) {
                    for( var i=0; i<c_lv; i++ ) {
                        tab += that._tab;
                    }
                }
                that._result += tab+c_prefix+csstext+' {\n'+tab+'}\n';

                that.walk( $(this).children(), c_prefix+csstext+' ', c_lv+1, tree[csstext] );

                index ++;
            } );
        }
    };

    var HTML2CSS_OPTION = function() {
    };

    HTML2CSS_OPTION.prototype = {
        set_default: function( param ) {
            jQuery( '#ig-tags'    ).val( param.ignored.tag.join( '\n'   ) );
            jQuery( '#ig-ids'     ).val( param.ignored.id.join( '\n'    ) );
            jQuery( '#ig-classes' ).val( param.ignored.class.join( '\n' ) );
            jQuery( '#rm-tags'    ).val( param.remove.tag.join( '\n'    ) );
            jQuery( '#rm-ids'     ).val( param.remove.id.join( '\n'     ) );
            jQuery( '#rm-classes' ).val( param.remove.class.join( '\n'  ) );

            if( param.lv_step ) {
                jQuery( '#lv_step'  ).prop( 'checked', true );
            } else {
                jQuery( '#lv_step'  ).prop( 'checked', false );
            }
            if( param.id_reset ) {
                jQuery( '#id_reset' ).prop( 'checked', true );
            } else {
                jQuery( '#id_reset' ).prop( 'checked', false );
            }
            jQuery( '#indent_type' ).val( param.indent.type );
            jQuery( '#indent_num'  ).val( param.indent.num );
        },
        save: function() {
            var param = {
                ignored: {
                    tag:   jQuery( '#ig-tags'    ).val().split( /\r\n|\n|\r/ ),
                    id:    jQuery( '#ig-ids'     ).val().split( /\r\n|\n|\r/ ),
                    class: jQuery( '#ig-classes' ).val().split( /\r\n|\n|\r/ )
                },
                remove: {
                    tag:   jQuery( '#rm-tags'    ).val().split( /\r\n|\n|\r/ ),
                    id:    jQuery( '#rm-ids'     ).val().split( /\r\n|\n|\r/ ),
                    class: jQuery( '#rm-classes' ).val().split( /\r\n|\n|\r/ )
                },
                indent: {
                    type:   jQuery( '#indent_type' ).val(),
                    num:  ~~jQuery( '#indent_num'  ).val()
                },
                lv_step:  jQuery( "#lv_step"  ).prop( 'checked' ) ? true : false,
                id_reset: jQuery( "#id_reset" ).prop( 'checked' ) ? true : false
            };
            process.mainModule.exports.write_config( 'html2css', JSON.stringify( param, '', 4 ) );

            return param;
        }
    };

    jQuery( function() {
        var h2c = new HTML2CSS();
        h2c.set_option( config );

        var h2c_opt = new HTML2CSS_OPTION();
        h2c_opt.set_default( config );

        /**
         * 設定情報を設定
         */
        jQuery( '#save_btn' ).click( function() {
            var param = h2c_opt.save();
            h2c.set_option( param );
            config = param;

            jQuery('#save_modal').modal();
            return false;
        } );

        /**
         * 設定情報をキャンセル
         */
        jQuery( '#cancel_btn' ).click( function() {
            h2c_opt.set_default( config );

            jQuery('#select_tab a:first').tab( 'show' );
            return false;
        } );

        /**
         * 設定情報を初期化
         */
        jQuery( '#revert_btn' ).click( function() {
            var param = process.mainModule.exports.get_config_org( 'html2css' );

            h2c_opt.set_default( param );
            h2c_opt.save();
            h2c.set_option( param );
            config = param;

            jQuery('#revert_modal').modal();
            return false;
        } );

        /**
         * 実行処理
         */
        jQuery( '#convert' ).click( function() {
            h2c.load_html( jQuery('#reader').val() );
            jQuery('#result').val( h2c.get_root( 'body' ) );

            return false;
        } );

        var drop = new DROP_FILES( { 'load': function( result ) {

            var result = result.split( ',' );

            // PHPとかあるので取り敢えず全部通す
            if( true || result[0] === 'data:text/html;base64' ) {
                var decode = new Buffer( result[1], 'base64' ).toString();
                jQuery('#reader').val( decode );

                h2c.load_html( decode );
                jQuery('#result').val( h2c.get_root( 'body' ) );
            } else {
                alert( 'Not HTML File.' );
            }

        } } );
    } );

} )();
