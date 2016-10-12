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
}

void Frames::sortAndLink(){
  if(frames.size()==0) return;
  std::sort(frames.begin(), frames.end(), [](FrameRef a, FrameRef b) -> bool {
    return (a->id().compare(b->id()) < 0);
  });

  //link prev & next, using a loop
  auto prev = frames.back();
  for(auto next : frames){
    prev->next(next);
    next->prev(prev);
    prev = next;
  }
}
