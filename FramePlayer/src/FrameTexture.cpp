#include "FrameTexture.h"

FrameTexture::FrameTexture(const SurfaceRef& surface){

  texture = TextureRef(new ofTexture());
  texture->allocate(surface->getPixels());
}
