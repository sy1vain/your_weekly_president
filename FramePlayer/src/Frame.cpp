#include "Frame.h"

Frame::Frame(std::string id, std::string filepath) : _id(id), _filepath(filepath) {

}

std::string& Frame::id(){
  return _id;
}

FrameRef Frame::next(){
  if(auto frame = _next.lock()) return frame;
  return FrameRef();
}

FrameRef Frame::prev(){
  if(auto frame = _prev.lock()) return frame;
  return FrameRef();
}

FrameSurfaceRef Frame::frameSurface(){
  if(auto frameSurface = _frameSurface.lock()){
    //make sure it is loaded
    frameSurface->load();
    return frameSurface;
  }

  //not set, se reload it
  auto frameSurface = FrameSurface::create(_filepath);
  frameSurface->load();
  _frameSurface = frameSurface;
  return frameSurface;
}

FrameTextureRef Frame::frameTexture(){
  if(auto frameTexture = _frameTexture.lock()) return frameTexture;

  auto frameSurface = this->frameSurface();
  auto frameTexture = FrameTexture::create(frameSurface->getSurface());
  _frameTexture = frameTexture;
  return frameTexture;
}
