#!/bin/bash
cd /var/www/tp-admin && git stash && git pull && git stash pop stash@{0}
