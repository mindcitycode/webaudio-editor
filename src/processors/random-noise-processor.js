// random-noise-processor.js
class RandomNoiseProcessor extends AudioWorkletProcessor {

    constructor(...args) {
        super(...args);
        this.port.onmessage = (e) => {
            console.log(e.data);
            this.port.postMessage("pong");
        };
    }

    static get parameterDescriptors() {
        return [
            {
                name: "customGain",
                defaultValue: 1,
                minValue: 0,
                maxValue: 1,
                automationRate: "a-rate",
            },
        ];
    }

    process(inputs, outputs, parameters) {
        const output = outputs[0];
        output.forEach((channel) => {
            for (let i = 0; i < channel.length; i++) {
                channel[i] = (Math.random() * 2 - 1) * ((parameters["customGain"].length > 1
                    ? parameters["customGain"][i]
                    : parameters["customGain"][0]));
            }
        });
        return true;
    }
}

registerProcessor("random-noise-processor", RandomNoiseProcessor);
