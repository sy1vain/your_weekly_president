#include "Frame.h"

Frame::Frame(std::string id, std::string filepath) : _id(id), _filepath(filepath) {

}

std::string& Frame::id(){
  std::lock_guard<std::recursive_mutex> lock(mutex);
  return _id;
}

FrameRef Frame::next(){
  std::lock_guard<std::recursive_mutex> lock(mutex);
  if(auto frame = _next.lock()) return frame;
  return FrameRef();
}

FrameRef Frame::prev(){
  std::lock_guard<std::recursive_mutex> lock(mutex);
  if(auto frame = _prev.lock()) return frame;
  return FrameRef();
}

FrameSurfaceRef Frame::frameSurface(){
  std::lock_guard<std::recursive_mutex> lock(mutex);
  if(auto frameSurface = _frameSurface.lock()){
    return frameSurface;
  }

  //not set, so cerate it
  auto frameSurface = FrameSurface::create(_filepath);
  _frameSurface = frameSurface;
  return frameSurface;
}

FrameTextureRef Frame::frameTexture(){
  std::lock_guard<std::recursive_mutex> lock(mutex);
  if(auto frameTexture = _frameTexture.lock()){
    if(frameTexture->hasContent()) return frameTexture;
  }

  auto frameSurface = this->frameSurface();
  auto frameTexture = FrameTexture::create(frameSurface);

  _frameTexture = frameTexture;
  return frameTexture;
}
