#include "FrameTexture.h"

FrameTexture::FrameTexture(FrameSurfaceRef frameSurface) : frameSurface(frameSurface){
  texture = TextureRef(new ofTexture());
}

FrameTexture::~FrameTexture(){
}

void FrameTexture::upload(bool forceLoad){
  if(isUploaded()) return;

  if(auto frameSurface = this->frameSurface.lock()){
    if(!frameSurface->isLoaded() && !forceLoad) return;
    frameSurface->load();
    texture = TextureRef(new ofTexture());
    texture->allocate(frameSurface->getSurface()->getPixels());
  }
}
