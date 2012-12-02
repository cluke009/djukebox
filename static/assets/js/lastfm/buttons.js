/***************************************************************************
 *
 * SEARCH
 *
 **************************************************************************/
$('#search-submit').on('click', function (e) {
    e.preventDefault();
    var search = $('#id_search').val();
    Dajaxice.last_fm.search(playlist.create, {
        'search': search
    });
    fauxLoader('#jp_jplayer_0');

});

/***************************************************************************
 *
 * AUTHORIZE
 *
 **************************************************************************/
$('#authorize-submit').on('click', function (e) {
    e.preventDefault();
    $(window).bootstrapModal({
        'id': 'authorize',
        'title': 'Authorize',
        'buttons': "test",
        'iframe': 'http://www.last.fm/api/auth/?api_key=2a4025d4b0ed596867f0cf0ee4cc77d6',
        'height': ($(window).height()) * 0.7,
        'width': ($(window).width()) * 0.7
    });
    $('#authorize').addClass('ajax-loader');
});

/***************************************************************************
 *
 * Iframe // TODO: Fix this so it works with js modals
 *
 **************************************************************************/
$("#iframe-myModal").load(function () {
    if (typeof authOpen !== 'undefined') {
        $('#myModal').delay(2000).queue(function () {
            $(this).modal('hide');
        });
    }
});

$('#clear-submit').on('click', function () {
        var search = $('#id_search').val();
        Dajaxice.last_fm.search(playlist.update, {
            'search': search
        });
});
