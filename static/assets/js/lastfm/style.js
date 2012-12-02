/***************************************************************************
 *
 * Appearance
 *
 **************************************************************************/

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
/**
 * TODO: Make animation update after ajax load
 */
var hideFour = function(){
    // $('#custom-playlist li:gt(3)').hide();
    // $('#custom-playlist li:lt(4)').show();
};

/***************************************************************************
 *
 * Helpers
 *
 **************************************************************************/
var fauxLoader = function (id) {
    if ($(id).hasClass('ajax-loader')) {
        $(id).fadeTo('fast', 0, function () {
            $(this).removeClass('ajax-loader');
        })
        .fadeTo(1000, 1);
    }
    else {
        $(id).fadeTo('fast', 0.4, function () {
            $(this).addClass('ajax-loader');
        })
        .delay(1000)
        .fadeTo(500, 1);
    }
};
