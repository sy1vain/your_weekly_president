#pragma once

#include "ofImage.h"
#include "ofThread.h"
#include "FrameSurface.h"

typedef std::shared_ptr<class FrameTexture> FrameTextureRef;
typedef std::weak_ptr<class FrameTexture> FrameTextureWRef;

typedef std::shared_ptr<ofTexture> TextureRef;
typedef std::shared_ptr<ofImage> SurfaceRef;

class FrameTexture : public ofThread {
public:

  static FrameTextureRef create(FrameSurfaceRef frameSurface){
    return std::shared_ptr<FrameTexture>(new FrameTexture(frameSurface));
  }

  ~FrameTexture();

  bool isUploaded(){
    return texture && texture->isAllocated();
  }

  bool hasContent();

  bool upload(bool forceLoad=false);

  TextureRef getTexture(){
    return texture;
  }

protected:
  FrameTexture(FrameSurfaceRef frameSurface);

  FrameSurfaceWRef frameSurface;
  TextureRef texture;
};
