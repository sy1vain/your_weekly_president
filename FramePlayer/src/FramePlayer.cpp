#include "FramePlayer.h"

//--------------------------------------------------------------
void FramePlayer::setup(){

  ofSetFrameRate(30);

  ofHideCursor();

  frameLoader = FrameLoader::create();

  oscIn.setup(OSC_IN);
  oscOut.setup("127.0.0.1", OSC_OUT);

  requestSettings();
  requestFrames();
}

//--------------------------------------------------------------
void FramePlayer::update(){
  while(oscIn.hasWaitingMessages()){
    ofxOscMessage msg;
    if(oscIn.getNextMessage(msg)) parseOSCMessage(msg);
  }

  bool hasDoneWork = false;
  if(currentFrame){
    auto frameSurface = currentFrame->frameSurface(); //we request this just to make sure the frameTexture doesn't release it's frameSurface
    auto frameTexture = currentFrame->frameTexture();

    currentFrameTexture = frameTexture; //save it to keep it in memory for drawing and prevent release

    if(frameTexture && !frameTexture->isUploaded()){
      frameTexture->upload(true);
      hasDoneWork = true;
    }
  }

  //only update the frameLoader if there was no work done
  //this prevents we upload multiple textures per frame
  if(!hasDoneWork) frameLoader->update();
}

//--------------------------------------------------------------
void FramePlayer::draw(){
  ofClear(0);

  if(currentFrameTexture){
    auto texture = currentFrameTexture->getTexture();
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
  }else{
    ofPushMatrix();
    ofScale(5,5);
    ofDrawBitmapString("num frames: " + ofToString(frames.size()),48,27);
    ofPopMatrix();
  }

  // ofPushStyle();
  // ofSetColor(255,0,0);
  // ofDrawBitmapString("fps: " + ofToString(ofGetFrameRate(), 2), 48, 27);
  // ofPopStyle();
}

//--------------------------------------------------------------
void FramePlayer::show(const std::string& id){
  FrameRef frame = frames.get(id);
  if(!frame){
    cout << "Frame not found: " << id << endl;
    return;
  }
  frameLoader->setCurrentFrame(frame);
  currentFrame = frame;
}

//--------------------------------------------------------------
void FramePlayer::requestFrames(){
  cout << "request frames" << endl;

  {
    ofxOscMessage msg;
    msg.setAddress("/setting");
    msg.addStringArg("preload_surfaces");
    oscOut.sendMessage(msg, false);
  }

  {
    ofxOscMessage msg;
    msg.setAddress("/setting");
    msg.addStringArg("preload_textures");
    oscOut.sendMessage(msg, false);
  }
}

//--------------------------------------------------------------
void FramePlayer::requestSettings(){
  cout << "request settings" << endl;

  ofxOscMessage msg;
  msg.setAddress("/requestframes");
  oscOut.sendMessage(msg, false);
}

//--------------------------------------------------------------
void FramePlayer::parseSetting(ofxOscMessage &msg){
  if(msg.getArgType(0)!=OFXOSC_TYPE_STRING) return;
  std::string setting = msg.getArgAsString(0);

  if(setting=="preload_surfaces"){
    try{
      int value = msg.getArgAsInt(1);
      frameLoader->setNumSurfaces(value);
    }catch(...){
    }
  }

  if(setting=="preload_textures"){
    try{
      int value = msg.getArgAsInt(1);
      frameLoader->setNumTextures(value);
    }catch(...){
    }
  }
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
    currentFrame.reset();
    currentFrameTexture.reset();
    requestSettings();
    requestFrames();
    return;
  }

  if(msg.getAddress()=="/show"){
    if(msg.getNumArgs()==1 && msg.getArgType(0)==OFXOSC_TYPE_STRING){
      show(msg.getArgAsString(0));
    }
    return;
  }

  if(msg.getAddress()=="/setting"){
    parseSetting(msg);
  }
}
