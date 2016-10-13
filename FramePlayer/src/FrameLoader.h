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

  void setNumSurfaces(int count);
  void setNumTextures(int count);

protected:
  FrameLoader();
  void threadedFunction();

  int numSurfaces;
  int numTextures;

  FrameRef currentFrame;
  std::vector<FrameSurfaceRef> surfaces;
  std::vector<FrameTextureRef> textures;
};
