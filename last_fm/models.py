from django.db import models
from django.forms import ModelForm


class LastFmSettings(models.Model):
    '''
    Store some configuration
    '''
    api = models.TextField(max_length=200)
    key = models.TextField(max_length=200)
    secret = models.TextField(max_length=200)

    token = models.TextField(max_length=200)
    session = models.TextField(max_length=200)

    def __unicode__(self):
        return self.api

    def save(self):
        """Save, but set id to 1"""
        self.id = 1
        super(LastFmSettings, self).save()


class LastFmSearch(models.Model):
    '''
    Save latest search
    '''
    search = models.CharField(max_length=200)

    def __unicode__(self):
        return self.search

    def save(self):
        """Save, but set id to 1"""
        self.id = 1
        super(LastFmSearch, self).save()


class LastFmSearchForm(ModelForm):
    class Meta:
        model = LastFmSearch
