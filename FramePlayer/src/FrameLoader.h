#pragma once

#include "Frame.h"

typedef std::shared_ptr<class FrameLoader> FrameLoaderRef;

class FrameLoader {
public:

  static FrameLoaderRef create(){
    return FrameLoaderRef(new FrameLoader());
  }

  void update();
  void setCurrentFrame(FrameRef frame);

protected:
  FrameLoader();

  FrameRef currentFrame;
  std::vector<FrameSurfaceRef> surfaces;
  std::vector<FrameTextureRef> textures;

};
