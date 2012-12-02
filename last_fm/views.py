from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from django.template import RequestContext

from last_fm.models import LastFmSearchForm
from last_fm.models import LastFmSearch

from last_fm.utils import lastfm_get_session

def index(request, template_name='last_fm/index.html'):
    if request.method == 'POST':
        form = LastFmSearchForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('.')
    else:
        form = LastFmSearchForm(initial={'search': LastFmSearch.objects.get(id=1)})

    return render_to_response(template_name, {'form': form}, RequestContext(request))


def token(request, template_name='last_fm/token.html'):
    token = request.GET.get('token')
    lastfm_get_session(token)
    return render_to_response(template_name)



