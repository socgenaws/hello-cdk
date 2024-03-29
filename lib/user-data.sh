#!/bin/bash
yum update -y
sudo su

### Initial steps to mount the volume  ###

mkfs -t xfs /dev/xvdf
yum install xfsprogs -y
mkdir /wddProjects
mount /dev/xvdf /wddProjects

### On Server reboot re-attach volume 
sudo cp /etc/fstab /etc/fstab.orig
blkid | egrep "/dev/xvdf: UUID="
echo "UUID=xxx  /wddProjects  xfs  defaults,nofail  0  2" >> /etc/fstab

amazon-linux-extras install -y nginx1
systemctl start nginx
systemctl enable nginx

chmod 2775 /usr/share/nginx/html
find /usr/share/nginx/html -type d -exec chmod 2775 {} \;
find /usr/share/nginx/html -type f -exec chmod 0664 {} \;

echo "<h1>this is first demo</h1>" > /usr/share/nginx/html/index.html