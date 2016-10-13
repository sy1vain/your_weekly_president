#include "FramePlayer.h"

//--------------------------------------------------------------
void FramePlayer::setup(){

  ofSetFrameRate(30);

  ofHideCursor();

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
      if(texture){
        ofPushMatrix();
        float w = ofGetWidth();
        float h = ofGetHeight();
        float tw = texture->getWidth();
        float th = texture->getHeight();
        float s = min(w/tw, h/th);
        ofTranslate(w/2, h/2);
        ofScale(s,s);
        ofTranslate(tw/-2, th/-2);
        texture->draw(0,0);
        ofPopMatrix();
      }
    }
  }

  // ofPushStyle();
  // ofSetColor(255,0,0);
  // ofDrawBitmapString("fps: " + ofToString(ofGetFrameRate(), 2), 48, 27);
  // ofPopStyle();
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
