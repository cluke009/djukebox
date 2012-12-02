/*!
 * jQuery 'best options' plugin boilerplate
 * Author: @cowboy
 * Further changes: @addyosmani
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

    $.fn.bootstrapModal = function ( options ) {

        // Here's a best practice for overriding 'defaults'
        // with specified options. Note how, rather than a
        // regular defaults object being passed as the second
        // parameter, we instead refer to $.fn.pluginName.options
        // explicitly, merging it with the options passed directly
        // to the plugin. This allows us to override options both
        // globally and on a per-call level.

        options = $.extend( {}, $.fn.bootstrapModal.options, options );

        return this.each(function () {
            // Vars
            var iframe = '';
            if (options.iframe !== ''){
                iframe = "<iframe allowfullscreen id='iframe-" + options.id + "' name='iframe-" + options.id + "' width='100%' height='100%' frameborder='0' src='" + options.iframe + "'></iframe>";
            }
            var width = parseInt(options.width, 10);
            var height = parseInt(options.height, 10);
            // Add modal
            var a = "\
            <div class='modal container " + options.fx +"' id='" + options.id +"' data-remote='" + options.remote + "'> \
                <div class='modal-header'> \
                    <button class='close' data-dismiss='modal'>×</button> \
                    <h3>" + options.title + "</h3> \
                </div> \
                <div class='modal-body'> \
                    " + iframe + " \
                    " + options.body + " \
                </div> \
                <div class='modal-footer'> \
                    <button class='btn' data-dismiss='modal' type='button'>Close</button> \
                </div> \
            </div>";
            $('body').append(a);


            // Open/remove modal
            $('#' + options.id).modal('show');
            $('#' + options.id).on('hidden', function () {
                $('#' + options.id).remove();
            });

            // Set height/width
            $('#' + options.id).css({
                'margin-left': width * -0.5,
                'margin-top': height * -0.6,
                'width': width,
                'height': height
            });
            $('#' + options.id + ' .modal-body').css({
                'max-height': height - 100,
                'height': height - 100,
                'width': width - 30

            });
        });
    };

    // Globally overriding options
    // Here are our publicly accessible default plugin options
    // that are available in case the user doesn't pass in all
    // of the values expected. The user is given a default
    // experience but can also override the values as necessary.
    // eg. $fn.pluginName.key ='otherval';

    $.fn.bootstrapModal.options = {
        'fx': "fade",
        'id': "myModal",
        'remote': "",
        'title': "",
        'body': "",
        'buttons': "close",
        'class': "",
        'width': "",
        'height': "",
        'iframe': ""
    };

})( jQuery, window, document );
