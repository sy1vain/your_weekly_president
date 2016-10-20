#!/bin/bash
script_dir=$(dirname $0)
cd $script_dir
project_dir=$(pwd)

# get current dir name and setup paths
dir_name=$(basename "$project_dir")

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

if [ $1 = "quick" ] || [ $1 = "fast" ] ; then
  # fast OF download
  echo "** Downloading openFrameworks **"
  mkdir -p FramePlayer/libs/openFrameworks
  wget http://openframeworks.cc/versions/v0.9.3/of_v0.9.3_linuxarmv6l_release.tar.gz -O /tmp/OF.tar.gz
  tar vxfz /tmp/OF.tar.gz -C FramePlayer/libs/openFrameworks --strip-components 1
  rm /tmp/OF.tar.gz
else
  # load git modules
  echo "** Initializing submodules **"
  git submodule update --init
fi

# openframeworks install
echo "** Installing openFrameworks dependencies **"
yes | sudo ./FramePlayer/libs/openFrameworks/scripts/linux/debian/install_dependencies.sh

echo "** Building FramePlayer **"
make Release -j4 -C ./FramePlayer/libs/openFrameworks/libs/openFrameworksCompiled/project/
make Release -j4 -C ./FramePlayer

echo "** Setting up upstart **"
sudo cp ./upstart/ywp.conf /etc/init/
sudo cp ./upstart/ywp_frameplayer.conf /etc/init/

node=$(which node)
frameplayer="$project_dir/FramePlayer/bin/FramePlayer"

sudo sed -i -e "s|~node|$node|" -e "s|~app|$project_dir|" /etc/init/ywp.conf
sudo sed -i "s|~app|$frameplayer|" /etc/init/ywp_frameplayer.conf

echo "*******************************"
echo "** Now copy files and reboot **"
echo "*******************************"
