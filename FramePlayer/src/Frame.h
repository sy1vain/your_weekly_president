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
    std::lock_guard<std::recursive_mutex> lock(mutex);
    _next = frame;
  }

  FrameRef next();

  void prev(FrameWRef frame){
    std::lock_guard<std::recursive_mutex> lock(mutex);
    _prev = frame;
  }

  FrameRef prev();

  void frameSurface(FrameSurfaceRef frameSurface){
    std::lock_guard<std::recursive_mutex> lock(mutex);
    _frameSurface = frameSurface;
  }

  FrameSurfaceRef frameSurface();

  void frameTexture(FrameTextureRef frameTexture){
    std::lock_guard<std::recursive_mutex> lock(mutex);
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

  std::recursive_mutex mutex;

};
