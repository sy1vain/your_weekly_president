#include "Frames.h"

#include <iostream>

Frames::Frames(){

}

size_t Frames::size(){
  return frames.size();
}

void Frames::clear(){
  frames.clear();
}

void Frames::addFrame(FrameRef frame){
  if(!frame) return;
  frames[frame->id()] = frame;
  relink();
}

FrameRef Frames::get(const std::string & id){
  return frames[id];
}

void Frames::relink(){
  if(frames.size()==0) return;

  //link prev & next, using a loop
  auto prev = frames.rbegin()->second;
  for(auto nextPair : frames){
    auto next = nextPair.second;
    prev->next(next);
    next->prev(prev);
    prev = next;
  }
}
