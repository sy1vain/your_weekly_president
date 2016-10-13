#pragma once

#include "ofMain.h"
#include "ofxOsc.h"
#include "Frames.h"
#include "FrameLoader.h"

#define OSC_IN 8780
#define OSC_OUT 8781

class FramePlayer : public ofBaseApp{
	public:
		void setup();
		void update();
		void draw();

	protected:
		ofxOscReceiver oscIn;
		ofxOscSender oscOut;

		Frames frames;
		FrameRef currentFrame;
		FrameLoaderRef frameLoader;

		void show(const std::string& id);
		void requestFrames();
		void requestSettings();
		void parseSetting(ofxOscMessage &msg);

		void parseOSCMessage(ofxOscMessage &msg);
};
