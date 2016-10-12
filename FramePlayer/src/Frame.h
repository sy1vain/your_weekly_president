#pragma once

#include <string>

#include "FrameSurface.h"
#include "FrameTexture.h"

typedef std::shared_ptr<class Frame> FrameRef;
typedef std::weak_ptr<class Frame> FrameWRef;

class Frame {
public:
  static FrameRef create(std::string id, std::string filepath){
    return std::shared_ptr<class Frame>(new Frame(id, filepath));
  }

  std::string& id();

  void next(FrameWRef frame){
    _next = frame;
  }

  FrameRef next();

  void prev(FrameWRef frame){
    _prev = frame;
  }

  FrameRef prev();

  void frameSurface(FrameSurfaceRef frameSurface){
    _frameSurface = frameSurface;
  }

  FrameSurfaceRef frameSurface();

  void frameTexture(FrameTextureRef frameTexture){
    _frameTexture = frameTexture;
  }

  FrameTextureRef frameTexture();
  
protected:
  Frame(std::string id, std::string filepath);

  std::string _id;
  std::string _filepath;

  FrameSurfaceWRef _frameSurface;
  FrameTextureWRef _frameTexture;

  FrameWRef _next, _prev;

};
