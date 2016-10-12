#include "FrameTexture.h"

FrameTexture::FrameTexture(FrameSurfaceRef frameSurface) : frameSurface(frameSurface){
  texture = TextureRef(new ofTexture());
}

FrameTexture::~FrameTexture(){
  if(texture) texture->clear();
  // std::cout << "deleting frame texture" << std::endl;
}

bool FrameTexture::hasContent(){
  if(isUploaded()) return true;
  if(auto frameSurface = this->frameSurface.lock()){
    return frameSurface->isLoaded();
  }
  return false;
}

bool FrameTexture::upload(bool forceLoad){
  if(isUploaded()) return true;

  if(auto frameSurface = this->frameSurface.lock()){
    if(!frameSurface->isLoaded() && !forceLoad) return false;
    frameSurface->load();
    texture = TextureRef(new ofTexture());
    texture->allocate(frameSurface->getSurface()->getPixels());
    return true;
  }

  return false;
}
