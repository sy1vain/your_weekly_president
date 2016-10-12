#include "FrameSurface.h"

FrameSurface::FrameSurface(const std::string& filepath) : filepath(filepath){

}

SurfaceRef FrameSurface::getSurface(){
  return surface;
}

FrameTextureRef FrameSurface::createFrameTexture(){
  if(!isLoaded()) return FrameTextureRef();
  return FrameTexture::create(surface);
}

void FrameSurface::load(){
  if(isLoaded()) return;

  SurfaceRef s = SurfaceRef(new ofImage());
  s->setUseTexture(false);
  if(s->load(filepath)){
    surface = s;
  }else{
    std::cout << "Unable to load: " << filepath << std::endl;
  }
}
