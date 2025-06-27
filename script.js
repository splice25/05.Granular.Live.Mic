// Define the path to the exported RNBO patcher JSON file
const patchExportURL = "patch.export.json";

// Create a new AudioContext for managing and playing audio
const context = new AudioContext();

// Create a GainNode for volume control
const outputNode = context.createGain();

// Connect the gain node to the device's audio output (speakers/headphones)
outputNode.connect(context.destination);

// Select the <button> element from the HTML document
let onoffCtl = document.getElementById("onOff");
let granularCraziness = document.getElementById("granCrazy");

const micStream = await navigator.mediaDevices.getUserMedia({audio: true});
const source = context.createMediaStreamSource(micStream);

// Define an asynchronous setup function to initialize the RNBO device
const setup = async () => {
    // Fetch the exported RNBO patch JSON file from the provided URL
    let response = await fetch(patchExportURL);

    // Parse the JSON response into a JavaScript object
    let patcher = await response.json();

    // Create an RNBO device using the AudioContext and patch data
    let device = await RNBO.createDevice({ context, patcher });

    source.connect(device.node)
    // Connect the RNBO device’s audio output to the gain node
    device.node.connect(outputNode);

    // Get a reference to the "play" parameter from the RNBO device
    let play = device.parametersById.get("play");


    let rate = device.parametersById.get("p_obj-1/rate");
    let grainDuration = device.parametersById.get("p_obj-1/grainDur")
    let jitter = device.parametersById.get("p_obj-1/inJitter")



    // Add an event listener for when the button is pressed down
    onoffCtl.addEventListener('input', async (event) => {
        // Resume the AudioContext if it's not already running (required by browsers)
        if (context.state === 'suspended') {
            await context.resume();
            console.log("Audio on")



        }
        if (event.target.checked){
            // Set the "play" parameter to 1 (on)
            play.value = 1;
        } else {
            // Set the "play" parameter to 0 (off)
            play.value = 0;
        }


    });

    granularCraziness.addEventListener('input', (event)=>{
        rate.value = event.target.value * (rate.max-rate.min) + rate.min;

        grainDuration.value = (1-event.target.value) * (grainDuration.max-grainDuration.min) + grainDuration.min;
        jitter.value = event.target.value * (jitter.max-jitter.min) + jitter.min;
        console.log(rate.value, grainDuration.value, jitter.value);
    })

};

// Call the setup function to start everything
setup();
