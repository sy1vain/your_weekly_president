#include "FrameTexture.h"

FrameTexture::FrameTexture(const SurfaceRef& surface){
  std::cout << "allocating texture" << std::endl;
  texture = TextureRef(new ofTexture());
  texture->allocate(surface->getPixels());
}

FrameTexture::~FrameTexture(){
  std::cout << "de-allocating texture" << std::endl;
}
