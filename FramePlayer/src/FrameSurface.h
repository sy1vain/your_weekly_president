#pragma once

#include "ofImage.h"

typedef std::shared_ptr<class FrameSurface> FrameSurfaceRef;
typedef std::weak_ptr<class FrameSurface> FrameSurfaceWRef;

typedef std::shared_ptr<ofImage> SurfaceRef;

class FrameSurface {
public:

  static FrameSurfaceRef create(const std::string& file){
    return FrameSurfaceRef(new FrameSurface(file));
  }

  ~FrameSurface();

  bool isLoaded();

  SurfaceRef getSurface();

  bool load();

protected:
  FrameSurface(const std::string& file);

  std::string filepath;
  SurfaceRef surface;

  std::recursive_mutex mutex;
};
