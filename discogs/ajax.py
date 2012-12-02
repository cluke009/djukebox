from dajax.core import Dajax
from dajaxice.decorators import dajaxice_register
from dajaxice.utils import deserialize_form

from discogs.utils import *


@dajaxice_register
def get_image(request, search):
    r = discogs_get_image(search)
    return r
