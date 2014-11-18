// via : http://qiita.com/yaegaki/items/b7ea40490b06bd4f8e4f

( function( $ ) {

    window.DROP_FILES = function( opt ) {
        var that = this;

        this.over_call  = opt.over  ? opt.over  : null;
        this.leave_call = opt.leave ? opt.leave : null;
        this.drop_call  = opt.drop  ? opt.drop  : null;
        this.load_call  = opt.load  ? opt.load  : null;

        this.$mask = $( '#drop_mask' );
        this._reader = new FileReader();

        this._reader.onloadend = function( e ) {
            that.get_file( e );
        };

        this.set_event();
    };

    DROP_FILES.prototype.set_event = function() {
        var that = this;

        // ドラッグ処理
        // ファイルを運んできているか判定するだけ
        $('body').bind( 'dragover.drag_file', function(e) {
            e.stopPropagation();
            e.preventDefault();
            that.$mask.show();

            if( $.isFunction( that.over_call ) ) {
                that.over_call( e );
            }
        } );

        // ドラッグアウトはマスク要素に
        this.$mask.bind( 'dragleave.drag_file', function(e) {
            e.stopPropagation();
            e.preventDefault();
            that.$mask.hide();

            if( $.isFunction( that.leave_call ) ) {
                that.leave_call( e );
            }
        } );

        // ドロップ処理
        this.$mask.bind( 'drop.drag_file', function(e) {
            e.stopPropagation();
            e.preventDefault();
            that.$mask.hide();

            if( $.isFunction( that.drop_call ) ) {
                that.drop_call( e.originalEvent );
            }

            // ファイルの読込開始
            that._reader.readAsDataURL( e.originalEvent.dataTransfer.files[0] );
        } );
    };

    // 読込完了
    DROP_FILES.prototype.get_file = function( e ) {
        if( $.isFunction( this.load_call ) ) {
            this.load_call( this._reader.result );
        }
    };

} )( jQuery );