# Ansible Homeserver
## General Info
This is my Ansible playbook to setup my homeserver running Fedora Server.

This playbook assumes that you have one boot drive and 3 storage drives. 1 of the storage drives is an NVMe drive to store app config data and the other 2 are HDD drives which store other data like images, books and anything else that requires more space than configs.

## Setup
Before using this playbook you need to generate an SSH keypair and name it `homeserver` and use it to connect to the homerserver once.

After the playbook has run you need to ssh into the server and push the `id_ed25519` ssh key that has been generated by the playbook to the Hetzner Storage Box otherwise the rsync cron jobs won't work.

## Contents of the secret.yml
These variables need to be added to the `/group_vars/all/vars.yml` file if you don't want to store them as an encrypted file.

You can create an Ansible Vault with `ansible-vault create secret.yml` and edit it with `ansible-vault edit secret.yml`. When creating you are asked to set a password which is required when editing the file.

```yml
immich_postgres_db_password: "secretpassword"
nextcloud_mariadb_db_password: "secretpassword"
nextcloud_mariadb_root_password: "secretpassword"
nextcloud_admin_password: "secretpassword"
admin_username: "admin"
username: "username"
email: "example@test.com"
watchtower_notification_url: "discord://token@id
domain_name: "domain.tld"
storage_box_address: "uXXXXX@uXXXXX.your-storagebox.de"
```