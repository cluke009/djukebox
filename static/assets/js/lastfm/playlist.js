
/*******************************************************************************
 *
 * Container for our playlist operations
 *
 ******************************************************************************/

var playlist = {
    length: 0,
    update: function (data) {
        try {
            // Update playlist
            for (var tracks in data.playlist.trackList.track) {
                myPlaylist.add({
                    title: data.playlist.trackList.track[tracks].title,
                    artist: data.playlist.trackList.track[tracks].creator,
                    mp3: data.playlist.trackList.track[tracks].location,
                    poster: data.playlist.trackList.track[tracks].image
                });
            }
            playlist.list(data);
        }
        catch (err) {
            // Catch errors
            if (data.message) {
                playlist.error(data);
            }
            fauxLoader('#jp_jplayer_0');
        }
    },

    create: function (data) {
        try {
            if (data.playlist.trackList.track[0]) {
                // Add multiple tracks
                var songs = [];
                for (var tracks in data.playlist.trackList.track) {
                    songs.push({
                        title: data.playlist.trackList.track[tracks].title,
                        artist: data.playlist.trackList.track[tracks].creator,
                        mp3: data.playlist.trackList.track[tracks].location,
                        poster: data.playlist.trackList.track[tracks].image
                    });
                }
                myPlaylist.setPlaylist(songs);
            }
            else {
                // Add single track
                myPlaylist.setPlaylist([{
                    title: data.playlist.trackList.track.title,
                    artist: data.playlist.trackList.track.creator,
                    mp3: data.playlist.trackList.track.location,
                    poster: data.playlist.trackList.track.image
                }]);
            }
            playlist.list(data, 'create');

        }
        catch (err) {

            // Catch errors
            if (data.message) {
                playlist.error(data);
            }
            fauxLoader('#jp_jplayer_0');
        }
    },
    list: function(data, create) {
        var count = (playlist.length + 1);
        var length = data.playlist.trackList.track.length;
        var li;

        // Zero out count if create
        if(create) {
            $('#custom-playlist li').remove();
            playlist.length = 0;
            count = playlist.length;
        }


        // Append list items
        for (var i=0; i<length; i++){
            var title = data.playlist.trackList.track[i].title;
            if(i === 0){
                li = '<li class="item-' + (i + count) + '">' + title + '</li>';
            }
            else{
                li += '<li class="item-' + (i + count) + '">' + title + '</li>';
            }
            playlist.length = (count + i);
        }

        $('#custom-playlist').append(li);
        $(o).on('bump', updatePlaylist);
        hideFour();
    },
    error: function (data) {
        $(window).bootstrapModal({
            'title': 'Error: ' + data.error,
            'body': '<h4>LastFM error: ' + data.error + ' ' + data.message + '</h4>'
        });
    }
};


/*******************************************************************************
 *
 * CALLBACKS:
 * These likely need to stay outside the playlist object
 * as dajax uses it for its callbacks
 *
 ******************************************************************************/
var updatePlaylist = function (s) {
        var search = $('#id_search').val();
        Dajaxice.last_fm.search(playlist.update, {
            'search': search
        });
        return false;
};

var createPlaylist = function (s) {
        var search = $('#id_search').val();
        Dajaxice.last_fm.search(playlist.create, {
            'search': search
        });
        return false;
};

/*******************************************************************************
 *
 * Piggyback our playerlist update function onto jPlayer next event
 * TODO: this is fugly.
 *
 ******************************************************************************/
(function() {

    o = {}
    // Bind an event handler
    $(o).on('bump', updatePlaylist);


    var oldVersion = myPlaylist.next;
    myPlaylist.next = function() {
        // do some stuff
        var result = oldVersion.apply(this, arguments);

        if(typeof playlist !== "undefined" && playlist.length !== 0){
            playlist.length = (playlist.length - 1);

            $('#custom-playlist li:first').remove();

            if (playlist.length < 4) {
                console.log('<4');
                // Trigger an event
                $(o).trigger('bump')

                // Unbind event handlers
                $(o).off('bump')

            }

        }
        // $(".jquery_jplayer_N").jPlayer("mute");
        return result;
    };
})();
