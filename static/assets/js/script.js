/*******************************************************************************
 *
 * READY:
 * TODO: Good god is this ugly we need to refactor soon
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
        // Load an empty playlist on page load
    }], {
        playlistOptions: {
            enableRemoveControls: true,
            autoPlay: true
        },
        swfPath: "/static/assets/jplayer",
        supplied: "mp3"
    });


    /***************************************************************************
     *
     * Piggyback our playerlist update function onto jPlayer next event
     *
     **************************************************************************/
    (function() {
        // Bind an event handler
        o = {};
        $(o).on('bump', updatePlaylist);


        var oldVersion = myPlaylist.next;

        myPlaylist.next = function() {
            var result = oldVersion.apply(this, arguments);

            if(typeof playlist !== "undefined" && playlist.length !== 0){
                playlist.length = (playlist.length - 1);
                var first = $('#custom-playlist li:first');
                first.animate({
                   marginLeft:'-1000px',
                   opacity: 0,
                   height:0
                }, 500, function() {
                   first.remove();
                });
                if (playlist.length < 4) {
                    console.log('<4');
                    // Trigger an event
                    $(o).trigger('bump');
                    // Unbind event handlers
                    $(o).off('bump');
                }
            }
            var artist = $('#custom-playlist li:nth-child(2)').find('.creator').text();
            discogsImage(artist);
            // $(".jquery_jplayer_N").jPlayer("mute");
            return result;
        };
    })();


    /***************************************************************************
     *
     * Helpers functions
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

    var updatePlaylist = function (s) {
        var search = $('#id_search').val();
        Dajaxice.last_fm.search(playlist.update, {
            'search': search
        });
    };

    var createPlaylist = function (s) {
        var search = $('#id_search').val();
        Dajaxice.last_fm.search(playlist.create, {
            'search': search
        });
    };

    var artistSearch = function (s) {
        var search = $('#id_search').val();
        Dajaxice.last_fm.search_artist(background, {
            'search': search
        });
    };

    var youtubeSearch = function (s) {
        var search = $('#id_search').val();
        Dajaxice.last_fm.search_youtube(youtubeParse, {
            'search': search
        });
    };
    var discogsImage = function (search) {
        // var search = $('#id_search').val();
        log(search);
        Dajaxice.discogs.get_image(discogsBackground, {
            'search': search
        });
    };

    var log = function(s){
        console.log(s);
    };

    var youtubeParse = function(s) {
        // s.feed.entry[i].content.src
        // s.feed.entry[i].title['$t']
        // s.feed.entry[i]['media$group']['media$thumbnail'][1]
        var feed = s.feed.entry;

        for (var i in feed) {
            var thumb = feed[i]['media$group']['media$thumbnail'][1]['url'];
            var title = feed[i].title['$t'];
            var link = feed[i]['media$group']['media$content'][0]['url'];

            var html = "<a class='tube_a tube_a-" + i + "' href='" + link + "'><img title='" + title + "' class='tube_link tube_link-" + i + "' src='" + thumb + "'></a>";
            $('body').html(html);
            $(".tube_link-" + i).css({
                'top':  (120 * i) + 75
            });

            // images.push({
            //     src: artists[img].image[4]['#text'],
            //     fade: 5000,
            //     valign: 'top'
            // });
        }

        tubeLinks();
    };

    var tubeLinks = function(){
        $(".tube_link").live('click', function (e) {
            e.preventDefault();
            $(window).bootstrapModal({
                'title': $(this).attr('title'),
                'iframe': $(this).parent().attr('href'),
                'height': ($(window).height()) * 0.7,
                'width': ($(window).width()) * 0.5
            });
            $('#iframe-myModal').css({
                'width': $('.modal-body').width()
            });
            return false;
        });
    };

    var discogsBackground = function(data) {
        // var artists = data.results.artistmatches.artist;
        var images = [];
        for (var img in data) {
            var fade = 5000;
            if (img == 0) {
                fade = 1000;
            }

            images.push({
                src: data[img],
                fade: fade,
                valign: 'top'
            });
        }
        log(images)
        $.vegas('slideshow', {
            delay: 20000,
            backgrounds: images
        })('overlay', {
            src: '/static/lib/vegas/overlays/06.png'
        });
    };
    /**
     * TODO: Fix this retardedness
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    var background = function (data) {
        // var artists = data.results.artistmatches.artist[0].image;
        var artists = data.results.artistmatches.artist;
        var images = [];
        try {
            for (var img in artists) {

                if (artists[img].image[4]['#text'] !== "") {
                    images.push({
                        src: artists[img].image[4]['#text'],
                        fade: 5000,
                        valign: 'top'
                    });
                }
            }
        }
        catch (err) {
            for (var img in artists) {
                if (artists.image[4]['#text'] !== "") {
                    images.push({
                        src: artists.image[4]['#text'],
                        fade: 5000,
                        valign: 'top'
                    });
                }
            }
        }

        $.vegas('slideshow', {
            delay: 20000,
            backgrounds: images
        })('overlay', {
            src: '/static/lib/vegas/overlays/06.png'
        });
    };
    /***************************************************************************
     *
     * Container for our playlist operations
     *
     **************************************************************************/

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
                var creator = data.playlist.trackList.track[i].creator;

                if(i === 0){
                    li = '<li class="sliding-element item-' + (i + count) + '">';
                    li += '<span class="creator">' + creator + '</span>';
                    li += '<span class="title">' + title + '</span>';
                    li += '</li>';
                }
                else{
                    li += '<li class="sliding-element item-' + (i + count) + '">';
                    li += '<span class="creator">' + creator + '</span>';
                    li += '<span class="title">' + title + '</span>';
                    li += '</li>';
                }
                playlist.length = (count + i);
            }
            var playListDOM = $('#custom-playlist');
            if(create) {
                playListDOM.html(li);
            }
            else{
                playListDOM.append(li);
            }
            slide('#custom-playlist', 25, 15, 150, .8);
            playListDOM.find('li').removeClass('sliding-element');

            $(o).on('bump', updatePlaylist);
        },
        error: function (data) {
            $(window).bootstrapModal({
                'title': 'Error: ' + data.error,
                'body': '<h4>LastFM error: ' + data.error + ' ' + data.message + '</h4>'
            });
        }
    };

    /***************************************************************************
     *
     * SEARCH
     *
     **************************************************************************/
    $('#search-submit').on('click', function (e) {
        e.preventDefault();
        createPlaylist();
        fauxLoader('#jp_jplayer_0');
        setTimeout(function() {
            var artist = $('#custom-playlist li:first').find('.creator').text();
            discogsImage(artist);
        }, 5000);

        return false;
    });

    /***************************************************************************
     *
     * AUTHORIZE
     *
     **************************************************************************/
    $('#authorize-submit').on('click', function (e) {
        e.preventDefault();
        $(this).bootstrapModal({
            'id': 'authorize',
            'title': 'Authorize',
            'buttons': "test",
            'iframe': 'http://www.last.fm/api/auth/?api_key=2a4025d4b0ed596867f0cf0ee4cc77d6',
            'height': ($(window).height()) * 0.7,
            'width': ($(window).width()) * 0.7
        });
        $('#authorize').addClass('ajax-loader');
        return false;
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
        discogsImage(search);
        return false;
    });

    /***************************************************************************
     *
     * Appearance
     *
     **************************************************************************/

    // Resize album art
    var thumbSize = function () {
        // Force images to display
        var width = $('#sidebar').width();
        $('#jp_poster_0').css({
            'width': width - 2,
            'height': width - 2
        });
        $('#jp_jplayer_0').css({
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
});





/*******************************************************************************
*******************************************************************************/
function slide(navigation_id, pad_out, pad_in, time, multiplier)
{
    // creates the target paths
    var list_elements = navigation_id + " li.sliding-element";
    var link_elements = list_elements + " a";
    // initiates the timer used for the sliding animation
    var timer = 0;
    // creates the slide animation for all list elements
    $(list_elements).each(function(i)
    {
        // margin left = - ([width of element] + [total vertical padding of element])
        $(this).css("margin-left","-180px");
        // updates timer
        timer = (timer*multiplier + time);
        $(this).animate({ marginLeft: "0" }, timer);
        $(this).animate({ marginLeft: "15px" }, timer);
        $(this).animate({ marginLeft: "0" }, timer);
    });
    // creates the hover-slide effect for all link elements
    $(link_elements).each(function(i)
    {
        $(this).hover(
        function()
        {
            $(this).animate({ paddingLeft: pad_out }, 150);
        },
        function()
        {
            $(this).animate({ paddingLeft: pad_in }, 150);
        });
    });
}

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
