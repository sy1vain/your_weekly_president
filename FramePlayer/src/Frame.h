#pragma once

#include <string>

#include "FrameSurface.h"

typedef std::shared_ptr<class Frame> FrameRef;

class Frame {
public:
  static FrameRef create(std::string id, std::string filepath){
    return std::shared_ptr<class Frame>(new Frame(id, filepath));
  }

  std::string& id();
protected:
  Frame(std::string id, std::string filepath);

  std::string _id;
  std::string _filepath;

  FrameSurfaceWRef frameSurface;

};
