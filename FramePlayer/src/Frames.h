#pragma once

#include <vector>
#include "Frame.h"

class Frames {
public:
  Frames();

  void clear();
  void addFrame(FrameRef frame);
  void addFrame(const std::string& id, const std::string& path){ addFrame(Frame::create(id, path)); }

  FrameRef get(const std::string & id);

protected:
  std::map<std::string, FrameRef> frames;

  void relink();
};
