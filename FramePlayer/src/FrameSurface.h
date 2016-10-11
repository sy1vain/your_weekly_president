#pragma once

#include "ofImage.h"

typedef std::shared_ptr<class FrameSurface> FrameSurfaceRef;
typedef std::weak_ptr<class FrameSurface> FrameSurfaceWRef;

typedef std::shared_ptr<ofImage> SurfaceRef;
typedef std::shared_ptr<ofTexture> TextureRef;

class FrameSurface {
public:

  static FrameSurfaceRef create(const std::string& file){
    return std::shared_ptr<class FrameSurface>(new FrameSurface(file));
  }

  bool isLoaded(){
    return !!surface;
  }

  SurfaceRef getSurface();
  TextureRef getTexture();

  void load();

protected:
  FrameSurface(const std::string& file);

  std::string filepath;

  SurfaceRef surface;
  TextureRef texture;
};
