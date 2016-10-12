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
    return frameSurface;
  }

  //not set, so cerate it
  auto frameSurface = FrameSurface::create(_filepath);
  _frameSurface = frameSurface;
  return frameSurface;
}

FrameTextureRef Frame::frameTexture(){
  if(auto frameTexture = _frameTexture.lock()) return frameTexture;

  auto frameSurface = this->frameSurface();
  // frameSurface->load(); // make sure it is loaded
  auto frameTexture = FrameTexture::create(frameSurface);
  _frameTexture = frameTexture;
  return frameTexture;
}
