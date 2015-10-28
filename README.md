Ticketing
=========

Ticketing (To be later better named.) is designed to be a ticketing or issue
system written in Symfony 2.7 LTS.  It takes many influences from various systems
(Ticketing and project management related) used by the author including:
- Redmine
- Bugzilla
- Trac
- Jira
- Basecamp

Eventually this will probably become more than a pet project and actually be an
Open Source project.  Published under MIT license.

LICENSE
-------
MIT see [LICENSE](/LICENSE)

CHANGELOG
---------

See [CHANGELOG.md](/CHANGELOG.md) for details on versions.

Installation
-----------

Although optional ff you wish to use vagrant and use the provided ansible
playbook, please ensure that vagrant is installed, ideally with the
vagrant-hostsupdater plugin.  You will also require ansible is installed and
that you have run:
```ansible-galaxy install provisioning/requirements.txt```
prior to initialising vagrant.  This will add the roles to `provisioning/roles`

After this run
```vagrant up --provision```
then SSH into the machine and from web directory (/var/www/html) run
```
  php app/console cache:clear --env=-dev && \
  php app/console cache:clear --env=-prod
```

ROADMAP
-------

Roadmap can be found in [ROADMAP.md](/ROADMAP.md)