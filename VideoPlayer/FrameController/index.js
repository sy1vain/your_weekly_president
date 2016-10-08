"use struict";

const Broadcaster = require('../Broadcaster');

class FrameController {
  constructor(){
    this.current = null;
  }

  show(id){
    if(!id) return Broadcaster.send('/hide');
    Broadcaster.send('/show', id);
  }

  set current(frame){
    if(frame==this._current) return;
    this._current = frame;
    let id = (frame)?frame.timecode:null;
    this.show(id);
    console.log(`set current frame: ${id}`);
  }

  get current(){
    return this._current;
  }

  hasFrames(){
    return this._frames && this._frames.length > 0;
  }

  setFrames(frames){
    this.current = null;
    if(frames.length==0) return;

    frames.sort( (a,b)=>a.time - b.time );

    let prev = null;
    frames.forEach((frame)=>{
      if(prev){
        frame.prev = prev;
        prev.next = frame;
      }
      prev = frame;
    });
    let last = prev;
    last.next = frames[0];
    frames[0].prev = last;

    this._frames = frames;

    this.next();
  }

  next(){
    if(!this.hasFrames()) return;
    if(!this.current){
      this.current = this._frames[0];
      return;
    }

    this.current = this.current.next;
  }

  prev(){
    if(!this.hasFrames()) return;
    if(!this.current){
      this.prev = this._frames[this._frames.length-1];
      return;
    }

    this.current = this.current.prev;
  }
}

module.exports = FrameController;
