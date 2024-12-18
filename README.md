# Ansible Homeserver
## General Info
This is my Ansible playbook to setup my homeserver running Fedora Server.

This playbook assumes that you have one boot drive and 3 storage drives. 1 of the storage drives is an NVMe drive to store app config data and the other 2 are HDD drives which store other data like images, books and anything else that requires more space than configs.

## Services
The following services will be setup with this playbook:

- [Actual Budget](https://actualbudget.com/)
- [FreshRSS](https://freshrss.org/)
- [Home Assistant](https://www.home-assistant.io/)
- [Homepage](https://gethomepage.dev/latest/)
- [Immich](https://immich.app/)
- [Komga](https://komga.org/)
- [Nextcloud](https://nextcloud.com/)
- [Nginx Proxy Manager](https://nginxproxymanager.com/)
- [PaperlessNGX](https://github.com/paperless-ngx/paperless-ngx)
<!-- - [Photon](https://github.com/Xyphyn/Photon) -->
- [Pi-Hole](https://github.com/pi-hole/docker-pi-hole/)
<!-- - [Syncthing](https://syncthing.net/) -->
- [Uptime Kuma](https://github.com/louislam/uptime-kuma)
- [Watchtower](https://containrrr.dev/watchtower/)

## BTRFS Filesystem
The drives will be setup as follows (output from my test VM):
```
~$ sudo btrfs filesystem show
Label: 'fedora'  uuid: 2ee78a69-ec4f-41bc-af26-3f33d6b38d26
        Total devices 1 FS bytes used 5.16GiB
        devid    1 size 19.00GiB used 7.02GiB path /dev/sda3

Label: 'apps'  uuid: d4a08458-3ac6-429b-a6e5-3528a8ef9c1d
        Total devices 1 FS bytes used 1.18GiB
        devid    1 size 50.00GiB used 4.52GiB path /dev/sdb

Label: 'data'  uuid: 020571bf-743a-45a9-9c8b-4d10aabb8453
        Total devices 2 FS bytes used 37.46MiB
        devid    1 size 400.00GiB used 4.03GiB path /dev/sdc
        devid    2 size 400.00GiB used 4.03GiB path /dev/sdd
```

## Setup
Before using this playbook you need to generate an SSH keypair and name it `homeserver` and use it to connect to the homerserver once.

When running this playbook for the first time you need to use the command `ansible-playbook run.yml -e 'ansible_port=22'` because this playbook changes the SSH port to the one specified in the `secret.yml` (or `vars.yml` if you don't want to make it a secret) file.

After the playbook has run you need to ssh into the server and push the `id_ed25519` SSH key that has been generated by the playbook to the Hetzner Storage Box otherwise the rsync cron jobs won't work. `ssh-copy-id -p 23 -s uXXXXX@uXXXXX.your-storagebox.de` [How to push SSH key to Hetzner Storage Box](https://docs.hetzner.com/robot/storage-box/backup-space-ssh-keys#upload)

## Maintenance
For maintenance I have written tasks to create cron jobs that:
- take daily snapshots of the `apps` and `data` filesystems
- delete snapshots older than 30 days
- do monthly scrubs of all filesystems
- rsyncs `apps` and `data` filesystems to a storage box
- executes short SMART tests daily
- executes long SMART tests weekly
- automatic updates are enabled and if necessary the server reboots automatically (for example for kernel updates)
- send an email with the updated packages

## Security
Hardening methods used so far are:
- Change default SSH port to something different
- Disable SSH password authentication
- Disable login for `root`
- Closing default SSH port

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
watchtower_notification_url: "discord://token@id"
domain_name: "domain.tld"
storage_box_address: "uXXXXX@uXXXXX.your-storagebox.de"
borg_backup_password: "secretpassword"
rss_username: "username"
rss_password: "secretpassword"
immich_api_key: "secretkey"
paperless_secret_key: "secretkey"
pihole_admin_password: "secretpassword"
local_ipv4: "123.456.789.123"
ssh_port: "1234"
proton_email: "example@test.com"
proton_password: "secretpassword"
proton_name: "Firstname Lastname"
proton_port: "111"
proton_ip: "123.456.789.123"
```