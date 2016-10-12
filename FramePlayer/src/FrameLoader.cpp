#include "FrameLoader.h"

FrameLoader::FrameLoader(){
  startThread();
}

void FrameLoader::update(){

  //see threaded function how this works, but this is on the main thread because they are textures
  std::vector<FrameTextureRef> textures;

  FrameRef next, prev;
  {
    lock();
    next = prev = currentFrame;
    unlock();
  }

  bool hasLoaded = false;

  while(next && prev && textures.size() < LOAD_TEXTURES){
    FrameTextureRef frameTexture;

    frameTexture = next->frameTexture();
    if(!hasLoaded && !frameTexture->isUploaded()) hasLoaded = frameTexture->upload();
    if(frameTexture->hasContent()) textures.push_back(frameTexture);

    frameTexture = prev->frameTexture();
    if(!hasLoaded && !frameTexture->isUploaded()) hasLoaded = frameTexture->upload();
    if(frameTexture->hasContent()) textures.push_back(frameTexture);

    next = next->next();
    prev = prev->prev();
  }


  {
    lock();
    this->textures = textures;
    unlock();
  }
}

//for now we just load the single one and keep it
void FrameLoader::setCurrentFrame(FrameRef frame){
  if(!frame) return;

  {
    lock();
    currentFrame = frame;
    unlock();
  }
}

void FrameLoader::threadedFunction(){
  std::cout << "Starting loader thread" << std::endl;
  while(isThreadRunning()){

    std::vector<FrameSurfaceRef> surfaces;
    FrameRef next, prev;

    { //load the current frame in botc next & prev
      lock();
      next = prev = currentFrame;
      unlock();
    }

    //mark this iteration as nothing loaded yet
    bool hasLoaded = false;

    //while we have a prev/next and room
    //we add a surface and load it if needed
    //and we haven;t loaded any yet
    while(next && prev && surfaces.size() < LOAD_SURFACES){
      FrameSurfaceRef frameSurface;

      frameSurface = next->frameSurface();
      if(!hasLoaded && !frameSurface->isLoaded()) hasLoaded = frameSurface->load();
      surfaces.push_back(frameSurface);

      frameSurface = prev->frameSurface();
      if(!hasLoaded && !frameSurface->isLoaded()) hasLoaded = frameSurface->load();
      surfaces.push_back(frameSurface);

      //find next  /  prev
      next = next->next();
      prev = prev->prev();
    }

    //save them to our loaded surfaces
    {
      lock();
      this->surfaces = surfaces;
      unlock();
    }

  }
  std::cout << "Stopped loader thread" << std::endl;
}
