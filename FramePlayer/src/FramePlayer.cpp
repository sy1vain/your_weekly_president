#include "FramePlayer.h"

//--------------------------------------------------------------
void FramePlayer::setup(){
  oscIn.setup(OSC_IN);
  oscOut.setup("127.0.0.1", OSC_OUT);

  ofxOscMessage msg;
  msg.setAddress("/requestframes");
  oscOut.sendMessage(msg, false);
}

//--------------------------------------------------------------
void FramePlayer::update(){
  while(oscIn.hasWaitingMessages()){
    ofxOscMessage msg;
    if(oscIn.getNextMessage(msg)) parseOSCMessage(msg);
  }
}

//--------------------------------------------------------------
void FramePlayer::draw(){
  ofClear(0);
}

//--------------------------------------------------------------
void FramePlayer::parseOSCMessage(ofxOscMessage &msg){
  if(msg.getAddress()=="/frame"){
    if(msg.getNumArgs()!=2) return;
    if(msg.getArgType(0)!=OFXOSC_TYPE_STRING) return;
    if(msg.getArgType(1)!=OFXOSC_TYPE_STRING) return;
    frames.addFrame(msg.getArgAsString(0), msg.getArgAsString(1));
    return;
  }

  if(msg.getAddress()=="/start"){
    frames.clear();
    return;
  }
}
