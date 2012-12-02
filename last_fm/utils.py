import requests
import hashlib
import json
import logging
import urllib

from django.conf import settings
from last_fm.models import LastFmSettings
from last_fm.models import LastFmSearch


# Get an instance of a logger
log = logging.getLogger(__name__)


'''
THIS IS FUCKING RETARDED PYTHON/DJANGO HAS TO HAVE A WAY TO GET STRINGS
'''
# API = settings.LASTFM_API
# KEY = settings.LASTFM_KEY
# SECRET = settings.LASTFM_SECRET

# API = str(''.join(LastFmSettings.objects.values_list('api', flat=True)))
# KEY = str(''.join(LastFmSettings.objects.values_list('key', flat=True)))
# SECRET = str(''.join(LastFmSettings.objects.values_list('secret', flat=True)))
# TOKEN = str(''.join(LastFmSettings.objects.values_list('token', flat=True)))
# SESSION = str(''.join(LastFmSettings.objects.values_list('session', flat=True)))
# SEARCH = str(''.join(LastFmSearch.objects.values_list('search', flat=True)))

API = "%s" % str(LastFmSettings.objects.values_list('api', flat=True)[0])
KEY = "%s" % str(LastFmSettings.objects.values_list('key', flat=True)[0])
SECRET = "%s" % str(LastFmSettings.objects.values_list('secret', flat=True)[0])
TOKEN = "%s" % str(LastFmSettings.objects.values_list('token', flat=True)[0])
SEARCH = "%s" % str(LastFmSearch.objects.values_list('search', flat=True)[0])


def lastfm_get_session(token):
    # Make request
    params = {
        'api_key': KEY,
        'method': 'auth.getSession',
        'token': token,
    }
    fsig = {
        'format': 'json',
        'api_sig': lastfm_sig(params),
    }
    params.update(fsig)

    req = requests.post(API, params)

    # Update session key
    json_load = json.loads(req.text)
    session = str(json_load["session"]["key"])
    LastFmSettings.objects.update(session=session)

    # Logging
    esc = req.text.strip(' \t\n\r')
    log.debug(esc.replace('"', '\\"'))

    return req


def lastfm_sig(params):
    # Generate lastfm signature
    api_sig = ""
    for key in sorted(params.iterkeys()):
        api_sig += "%s%s" % (key, params[key])

    api_sig = hashlib.md5(api_sig + SECRET).hexdigest()

    return api_sig


def lastfm_request(params, format='json'):
    # We have to call SESSION inside this fuction to update it in our request
    SESSION = "%s" % str(LastFmSettings.objects.values_list('session', flat=True)[0])

    # Prep for signature
    required = {
        'api_key': KEY,
        'sk': SESSION,
    }
    # print required
    params.update(required)

    # Merge params
    fsig = {
        'format': 'json',
        'api_sig': lastfm_sig(params),
    }
    params.update(fsig)

    # Make request
    req = requests.post(API, params)

    return req


def lastfm_get_playlist(search, to_json=False):
    # Gets playlist from saved station
    tune = lastfm_tune(search)

    try:
        # Stop lastfm_get_playlist() from loading if theres an error
        json.loads(tune.text)['message']
        return tune

    except:
        # Make request
        params = {
            'method': 'radio.getPlaylist',
        }
        req = lastfm_request(params)

        # Logging
        esc = req.text.strip(' \t\n\r')
        log.debug(esc.replace('"', '\\"'))

        return req


def lastfm_tune(search, to_json=False):

    # Only save if stations are different
    if search != SEARCH:
        lastfm_search = LastFmSearch(search=search)
        lastfm_search.save()

    # Make request
    params = {
        'method': 'radio.tune',
        'station': 'lastfm://artist/' + search + '/similarartists',
    }
    req = lastfm_request(params)

    # Logging
    esc = req.text.strip(' \t\n\r')
    log.debug(esc.replace('"', '\\"'))

    return req


def lastfm_artist_search(search, to_json=False):

    # Make request
    params = {
        'method': 'artist.search',
        'artist': search,
    }
    req = lastfm_request(params)

    # Logging
    esc = req.text.strip(' \t\n\r')
    log.debug(esc.replace('"', '\\"'))

    return req


def youtube_search(search, to_json=False):
    search = urllib.quote(search, '')
    print search
    api = 'https://gdata.youtube.com/feeds/api/videos?category=' + search + '&v=2&alt=json'
    req = requests.get(api)

    # Logging
    esc = req.text.strip(' \t\n\r')
    log.debug(esc.replace('"', '\\"'))

    return req
