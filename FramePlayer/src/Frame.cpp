#include "Frame.h"

Frame::Frame(std::string id, std::string filepath) : _id(id), _filepath(filepath) {

}

std::string& Frame::id(){
  return _id;
}
