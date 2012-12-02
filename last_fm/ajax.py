from dajax.core import Dajax
from dajaxice.decorators import dajaxice_register
from dajaxice.utils import deserialize_form

from last_fm.models import *
from last_fm.utils import *

SEARCH = "%s" % str(LastFmSearch.objects.values_list('search', flat=True)[0])


@dajaxice_register
def search(request, search):

    r = lastfm_get_playlist(search)
    return r.text

@dajaxice_register
def search_artist(request, search):

    r = lastfm_artist_search(search)
    return r.text

@dajaxice_register
def search_youtube(request, search):

    r = youtube_search(search)
    return r.text

# @dajaxice_register
# def send_form(request, form):
#     dajax = Dajax()
#     form = LastFmForm(deserialize_form(form))

#     if form.is_valid():
#         # LASTFM API
#         LastFm.options.username = form.cleaned_data['username']
#         LastFm.options.password = form.cleaned_data['password']
#         lastfm_connect(request, True)

#         # AJAX
#         dajax.remove_css_class('#my_form .control-group', 'error')
#         callback = lastfm_connect(request, True)
#         dajax.script('message_callback(%s);' % callback)
#     else:
#         dajax.remove_css_class('#my_form .control-group', 'error')
#         for error in form.errors:
#             dajax.add_css_class('.group-%s' % error, 'error')
#             dajax.assign('.help-inline', 'innerHTML', 'required' )

#     return dajax.json()
