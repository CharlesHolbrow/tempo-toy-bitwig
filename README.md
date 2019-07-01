# Tempic Integrator

This is a collection of classes for sending data to `charles-bitwig-osc` BitWig studio extension.

## Installation

Before you can install the server, you must do the following: 

1. Install [node.js](https://nodejs.org/)
2. Install [Bitwig Studio](https://www.bitwig.com/)
3. Bitwig includes an API for custom controllers. This allows MIDI controller manufacturers to write script so their hardware can talk directly to BitWig. You need to install [this custom script](https://raw.githubusercontent.com/CharlesHolbrow/charles-bitwig-osc/master/bitwig-controller/index.control.js) before you can use the The Tempic Integrator in BitWig. If memory serves me correctly, this is how to install the script:
    - Download [the script](https://raw.githubusercontent.com/CharlesHolbrow/charles-bitwig-osc/master/bitwig-controller/index.control.js) and put it in the appropriate directory. Double check, but I believe this is:
        - Mac: `~/Documents/Bitwig Studio/Controller Scripts/`
        - Windows: `%USERPROFILE%\Documents\Bitwig Studio\Controller Scripts\`
    - Close and reopen BitWig Studio and go to `Settings -> controllers`. 
    - Click `Add -> Charles -> charles-bitwig-osc` If this option is not available, the controller script may not be in the correct directory. 
    - Click the power button icon next to `charles-bitwig-osc` to activate the controller script. BitWig is now listening for OSC messages from the Tempic Integrator.  
    - Note that depending on your version of BitWig studio, you may need to re-activate the script every time you open bitwig. 


Now you are ready to run the Tempic Integrator server, which includes a GUI

Run the following from your terminal/command prompt

```bash
git clone https://github.com/CharlesHolbrow/tempo-toy-bitwig.git
cd tempo-toy-bitwig
npm install
node server.js
```

1. Open Chrome, and navigate to http://127.0.0.1:3001
1. In your browser, you should see several large buttons. Each button corresponds to a clip in BitWig's clip view. 
1. Click one of the large button to activate it.
1. Play any chord on your midi keyboard. The text in the active button should update, indicating the cord that you played.
1. Click the button again. If everything is working correctly, this will add a clip to the clip view in bitwig studio that has a tempo ramp.


