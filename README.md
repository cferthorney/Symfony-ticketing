Ticketing
=========

A Symfony project created on October 26, 2015, 5:21 pm.

See CHANGELOG.md for details on versions.

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