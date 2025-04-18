#include "FrameLoader.h"

FrameLoader::FrameLoader() : numSurfaces(0), numTextures(0) {
  startThread();
}

void FrameLoader::update(){

  //see threaded function how this works, but this is on the main thread because they are textures
  std::vector<FrameTextureRef> textures;

  FrameRef next, prev;
  int numTextures;
  {
    lock();
    next = prev = currentFrame;
    numTextures = this->numTextures;
    unlock();
  }

  bool hasLoaded = false;

  while(next && prev && textures.size() < numTextures){
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

void FrameLoader::setNumSurfaces(int count){
  lock();
  numSurfaces = count;
  unlock();
}

void FrameLoader::setNumTextures(int count){
  lock();
  numTextures = count;
  unlock();
}

void FrameLoader::threadedFunction(){
  std::cout << "Starting loader thread" << std::endl;
  while(isThreadRunning()){

    std::vector<FrameSurfaceRef> surfaces;
    int numSurfaces;
    FrameRef next, prev;

    { //load the current frame in botc next & prev
      lock();
      next = prev = currentFrame;
      numSurfaces = this->numSurfaces;
      unlock();
    }

    //mark this iteration as nothing loaded yet
    bool hasLoaded = false;

    //while we have a prev/next and room
    //we add a surface and load it if needed
    //and we haven;t loaded any yet
    while(next && prev && surfaces.size() < numSurfaces){
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

    //if it has loaded something, do a short sleep, otherwise longer
    if(hasLoaded){
      sleep(10);
    }else{
      sleep(100);
    }

  }
  std::cout << "Stopped loader thread" << std::endl;
}
