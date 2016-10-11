#include "Frames.h"

#include <iostream>

Frames::Frames(){

}

void Frames::clear(){
  frames.clear();
}

void Frames::addFrame(FrameRef frame){
  if(!frame) return;
  frames.push_back(frame);
  std::sort(frames.begin(), frames.end(), [](FrameRef a, FrameRef b) -> bool {
    return (a->id().compare(b->id()) < 0);
  });
}
