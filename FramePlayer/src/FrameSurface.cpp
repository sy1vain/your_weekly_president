#include "FrameSurface.h"

FrameSurface::FrameSurface(const std::string& filepath) : filepath(filepath){

}

SurfaceRef FrameSurface::getSurface(){
  return surface;
}

TextureRef FrameSurface::getTexture(){
  if(!isLoaded()) return TextureRef();
  if(texture) return texture;
}

void FrameSurface::load(){
  if(isLoaded()) return;
}
