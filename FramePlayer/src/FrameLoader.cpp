#include "FrameLoader.h"

FrameLoader::FrameLoader(){

}

void FrameLoader::update(){

}

//for now we just load the single one and keep it
void FrameLoader::setCurrentFrame(FrameRef frame){
  if(!frame) return;

  currentFrame = frame;

  std::vector<FrameSurfaceRef> surfaces;
  surfaces.push_back(frame->frameSurface());

  this->surfaces = surfaces;

  std::vector<FrameTextureRef> textures;
  textures.push_back(frame->frameTexture());

  this->textures = textures;
}
