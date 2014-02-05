# Djukebox Django Project #
![Djukebox](https://raw2.github.com/cluke009/djukebox/master/djukebox.jpg "Djukebox")
## Prerequisites ##

- python >= 2.5
- pip
- virtualenv/wrapper (optional)

### Unfortunately you need to be a LastFM subscriber to use this now :( ###

## Installation ##
### Creating the environment ###
Create a virtual python environment for the project.
If you're not using virtualenv or virtualenvwrapper you may skip this step.

#### For virtualenvwrapper ####
```bash
mkvirtualenv --no-site-packages djukebox-env
```

#### For virtualenv ####
```bash
virtualenv --no-site-packages djukebox-env
cd djukebox-env
source bin/activate
```

### Clone the code ###
Obtain the url to your git repository.

```bash
git clone git://github.com/cluke009/djukebox.git djukebox
```

### Install requirements ###
```bash
cd djukebox
pip install -r requirements.txt
```

### Configure project ###
```bash
cp djukebox/__local_settings.py djukebox/local_settings.py
vi djukebox/local_settings.py
```

### Sync database ###
```bash
python manage.py syncdb
```

### Collect static files ###
```bash
python manage.py collectstatic
```

## Running ##
```bash
python manage.py runserver
```

Open browser to http://127.0.0.1:8000
