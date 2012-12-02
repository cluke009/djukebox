/*******************************************************************************
 *
 * Ready
 *
 ******************************************************************************/
$(document).ready(function () {

    /***************************************************************************
     *
     * Dom Change Listener / Might need this later
     *
     **************************************************************************/

    // $("#playlist").bind("DOMSubtreeModified", function(e) {
    //     var items;
    // });

    /***************************************************************************
     *
     * Load player with page
     *
     **************************************************************************/
    var myPlaylist = new jPlayerPlaylist({
        jPlayer: ".jquery_jplayer_N",
        cssSelectorAncestor: ".jp_container_N"
    }, [{
        // Intentionally empty
    }], {
        playlistOptions: {
            enableRemoveControls: true,
            autoPlay: false
        },
        swfPath: "/static/assets/jplayer",
        supplied: "mp3"
    });

    // Resize album art
    var thumbSize = function () {
        // Force images to display
        var width = $('#sidebar').width();
        $('#sidebar .jquery_jplayer_N img').css({
            'width': width - 2,
                'height': width - 2
        });
        $('#sidebar .jquery_jplayer_N').css({
            'width': width - 2,
                'height': width - 2
        });
    };
    thumbSize();
    $(window).resize(function () {
        thumbSize();
    });
});





/*****************************************************************************
*******************************************************************************/
function newAlert(type, message) {
    $(".alert").hide();
    var msg = '<div class="alert alert-' + type + '">';
    msg += '<a class="close" data-dismiss="alert">×</a><span><ul>';

    for (var i = 0; i < message.length; i++) {
        msg += "<li>" + message[i] + "</li>";
    }
    msg += '</ul></span></div>';
    $('.msg').append(msg).hide().fadeIn('slow');

}
