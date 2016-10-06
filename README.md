# Your weekly President, Willem Popelier

## Install instructions

* Install Raspbian Jessie Lite
* Set language to prevent compilation warnings & errors `sudo sh -c "echo 'LC_ALL=C.UTF-8' >> /etc/default/locale"`
* Install dependencies
  * `curl -sL https://deb.nodesource.com/setup_6.x | sudo bash -`
  * `yes | sudo apt-get upgrade`
  * `yes | sudo apt-get install git upstart libav-tools omxplayer nodejs libusb-1.0-0.dev`
