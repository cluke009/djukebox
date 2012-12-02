from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings
from dajaxice.core import dajaxice_autodiscover, dajaxice_config
dajaxice_autodiscover()
from last_fm import views

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('last_fm.views',
    # MyApps
    url(r'^$', 'index', name='last_fm_index'),
    url(r'^token/$', 'token', name='last_fm_token'),
    # url(r'^mp3/', include('mp3.urls')),
    # url(r'^log/', include('log.urls')),

    # url(r'^polls/', include('polls.urls')),

    # 3rd Party
    url(dajaxice_config.dajaxice_url, include('dajaxice.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)

# urlpatterns += staticfiles_urlpatterns()
urlpatterns += patterns('django.contrib.staticfiles.views',
    url(r'^static/(?P<path>.*)$', 'serve'),
)
