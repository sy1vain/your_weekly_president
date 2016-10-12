#include "FramePlayer.h"

//--------------------------------------------------------------
void FramePlayer::setup(){
  frameLoader = FrameLoader::create();

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

  frameLoader->update();
}

//--------------------------------------------------------------
void FramePlayer::draw(){
  ofClear(0);

  if(currentFrame){
    auto frameTexture = currentFrame->frameTexture();
    if(frameTexture && frameTexture->isUploaded()){
      auto texture = frameTexture->getTexture();
      if(texture) texture->draw(0,0);
    }
  }
}

//--------------------------------------------------------------
void FramePlayer::show(const std::string& id){
  FrameRef frame = frames.get(id);
  if(!frame) return;
  frameLoader->setCurrentFrame(frame);
  currentFrame = frame;
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

  if(msg.getAddress()=="/show"){
    if(msg.getNumArgs()==1 && msg.getArgType(0)==OFXOSC_TYPE_STRING){
      show(msg.getArgAsString(0));
    }
    return;
  }
}
