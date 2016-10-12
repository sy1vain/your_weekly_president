#include "Frame.h"

Frame::Frame(std::string id, std::string filepath) : _id(id), _filepath(filepath) {

}

std::string& Frame::id(){
  return _id;
}

FrameRef Frame::next(){
  if(auto frame = _next.lock()) return frame;
  return FrameRef();
}

FrameRef Frame::prev(){
  if(auto frame = _prev.lock()) return frame;
  return FrameRef();
}
