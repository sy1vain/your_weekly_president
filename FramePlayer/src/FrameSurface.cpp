#include "FrameSurface.h"

FrameSurface::FrameSurface(const std::string& filepath) : filepath(filepath){

}

FrameSurface::~FrameSurface(){
  // std::cout << "deleting frame surface" << std::endl;
}

bool FrameSurface::isLoaded(){
  std::lock_guard<std::recursive_mutex> lock(mutex);
  return surface && surface->isAllocated();
}

SurfaceRef FrameSurface::getSurface(){
  std::lock_guard<std::recursive_mutex> lock(mutex);
  return surface;
}

bool FrameSurface::load(){
  std::lock_guard<std::recursive_mutex> lock(mutex);
  if(isLoaded()) return true;

  std::cout << "Loading " << filepath << std::endl;

  SurfaceRef s = SurfaceRef(new ofImage());
  s->setUseTexture(false);
  if(s->load(filepath)){
    surface = s;
    return true;
  }

  std::cout << "Unable to load: " << filepath << std::endl;
  return false;
}
