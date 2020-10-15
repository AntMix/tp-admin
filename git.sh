#!/bin/bash
cd /var/www/tp-admin && git stash
cd /var/www/tp-admin && git pull
cd /var/www/tp-admin && git stash pop stash@{0}