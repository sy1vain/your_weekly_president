#!/bin/bash
script_dir=$(dirname $0)
cd $script_dir
project_dir=$(pwd)

# get current dir name and setup paths
dir_name=$(basename "$project_dir")
node=$(which node)
frameplayer="$project_dir/FramePlayer/bin/FramePlayer"

# set lang setting
sudo sh -c "echo 'LC_ALL=C.UTF-8' >> /etc/default/locale"
export LC_ALL=C.UTF-8
. /etc/default/locale

# set gpu memory
sudo sh -c "echo 'gpu_mem=256' >> /boot/config.txt"

# add the node repos
echo "** Adding node modules **"
curl -sL https://deb.nodesource.com/setup_6.x | sudo bash -
# upgrade all
echo "** Updating modules **"
yes | sudo apt-get upgrade
# install project dependencies
echo "** Install project dependencies **"
yes | sudo apt-get install git upstart libav-tools omxplayer nodejs libusb-1.0-0.dev

# npm install modules
echo "** Install node modules **"
npm install --production

# load git modules
echo "** Initializing submodules **"
git submodule update --init

# moving into FramePlayer directory
cd FramePlayer

# openframeworks install
echo "** Installing openFrameworks dependencies **"
yes | sudo ./libs/openFrameworks/scripts/linux/debian/install_dependencies.sh

echo "** Building FramePlayer **"
make Release

cd ..

echo "** Setting up upstart **"
sudo cp ./upstart/ywp.conf /etc/init/
sudo cp ./upstart/ywp_frameplayer.conf /etc/init/

sudo sed -i -e "s|~node|$node|" -e "s|~app|$project_dir|" /etc/init/ywp.conf
sudo sed -i "s|~app|$frameplayer|" /etc/init/ywp_frameplayer.conf

echo "*******************************"
echo "** Now copy files and reboot **"
echo "*******************************"
