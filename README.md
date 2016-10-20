# Your weekly President, Willem Popelier

## Install instructions

* Install Raspbian Jessie Lite (27-05-2016 version)
* Install GIT `sudo apt-get update && sudo apt-get -y install git`
* Download repository `git clone https://github.com/sy1vain/your_weekly_president.git` and run install script `[path to project]/install.sh fast` The `fast` option is option is for raspberry pi
* Copy files using sftp program

## Files needes

Next to the project directory we need a directory named `ywp` containing the following files:

* `settings.json`
* `ywp.mp4`
* `markers.txt`

There are several locations where these files can be placed. On raspberry pi the default locations is `/home/pi/ywp`

The names for the files (except `settings.json`) can be changed in the `settings.json`
