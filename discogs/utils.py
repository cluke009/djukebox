import discogs_client as discogs
import json
import os
import errno
import urllib
import urlparse
import re

from django.conf import settings
from last_fm.models import LastFmSearch


discogs.user_agent = 'dJukebox/0.1'

SEARCH = "%s" % str(LastFmSearch.objects.values_list('search', flat=True)[0])


def discogs_get_image(search):
    artist = discogs.Artist(search)

    if search.startswith('The'):
        artist = discogs.Artist(search[3:] + ', The')

    images = artist.data['images']

    location = settings.STATIC_ROOT + 'discogs/images/' + clean_names(
        search) + '/'
    mkdir_p(location)

    for img in images:
        url = img['uri']
        if not os.path.isfile(location + filename(url)):
            urllib.urlretrieve(url, location + filename(url))

    json_dump = json.dumps(dir_contents(location))
    return json_dump


def mkdir_p(path):
    try:
        os.makedirs(path)
    except OSError as exc:  # Python >2.5
        if exc.errno == errno.EEXIST and os.path.isdir(path):
            pass
        else:
            raise


def filename(url):
    split = urlparse.urlsplit(url)
    filename = split.path.split("/")[-1]
    return filename


def dir_contents(location):
    l = []
    for dirname, dirnames, filenames in os.walk(location):
        # for subdirname in dirnames:
        #     print os.path.join(dirname, subdirname)
        for filename in filenames:
            l.append('/' + os.path.join(dirname, filename))
    return l


def clean_names(name):
    name = name.lower()
    name = re.sub(' +', '', name)
    return name
