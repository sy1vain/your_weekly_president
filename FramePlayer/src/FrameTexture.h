#pragma once

#include "ofImage.h"

typedef std::shared_ptr<class FrameTexture> FrameTextureRef;
typedef std::weak_ptr<class FrameTexture> FrameTextureWRef;

typedef std::shared_ptr<ofTexture> TextureRef;
typedef std::shared_ptr<ofImage> SurfaceRef;

class FrameTexture {
public:

  static FrameTextureRef create(const SurfaceRef& surface){
    return std::shared_ptr<FrameTexture>(new FrameTexture(surface));
  }

  ~FrameTexture();

  bool isTexturised(){
    return texture && texture->isAllocated();
  }

  TextureRef getTexture(){
    return texture;
  }

protected:
  FrameTexture(const SurfaceRef& surface);

  TextureRef texture;
};
