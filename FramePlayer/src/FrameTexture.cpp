#include "FrameTexture.h"

FrameTexture::FrameTexture(FrameSurfaceRef frameSurface) : frameSurface(frameSurface){
  texture = TextureRef(new ofTexture());
}

FrameTexture::~FrameTexture(){
  if(texture) texture->clear();
  // std::cout << "deleting frame texture" << std::endl;
}

bool FrameTexture::hasContent(){
  std::lock_guard<std::recursive_mutex> lock(mutex);
  if(isUploaded()) return true;
  if(auto frameSurface = this->frameSurface.lock()) return true;
  return false;
}

bool FrameTexture::upload(bool forceLoad){
  std::lock_guard<std::recursive_mutex> lock(mutex);
  if(isUploaded()) return true;

  if(auto frameSurface = this->frameSurface.lock()){
    if(!frameSurface->isLoaded() && !forceLoad) return false;
    if(frameSurface->load()){
      texture = TextureRef(new ofTexture());
      texture->allocate(frameSurface->getSurface()->getPixels());
      return true;
    }
  }

  return false;
}
