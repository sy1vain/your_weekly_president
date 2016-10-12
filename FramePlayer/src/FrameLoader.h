#pragma once

#include "Frame.h"
#include "ofThread.h"

typedef std::shared_ptr<class FrameLoader> FrameLoaderRef;

class FrameLoader : public ofThread {
public:

  static FrameLoaderRef create(){
    return FrameLoaderRef(new FrameLoader());
  }

  ~FrameLoader(){
    waitForThread(true);
  }

  void update();
  void setCurrentFrame(FrameRef frame);

protected:
  FrameLoader();
  void threadedFunction();

  FrameRef currentFrame;
  std::vector<FrameSurfaceRef> surfaces;
  std::vector<FrameTextureRef> textures;
};
