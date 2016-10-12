#pragma once

#include "ofImage.h"
#include "FrameTexture.h"

typedef std::shared_ptr<class FrameSurface> FrameSurfaceRef;
typedef std::weak_ptr<class FrameSurface> FrameSurfaceWRef;

typedef std::shared_ptr<ofImage> SurfaceRef;

class FrameSurface {
public:

  static FrameSurfaceRef create(const std::string& file){
    return FrameSurfaceRef(new FrameSurface(file));
  }

  bool isLoaded(){
    return surface && surface->isAllocated();
  }

  SurfaceRef getSurface();
  FrameTextureRef createFrameTexture();

  void load();

protected:
  FrameSurface(const std::string& file);

  std::string filepath;
  SurfaceRef surface;
};
