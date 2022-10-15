// random-noise-processor.js
class LinearTransformProcessor extends AudioWorkletProcessor {

    constructor(...args) {
        console.log('AudioWorkletProcessor args', ...args)
        super(...args);

        this.port.onmessage = (e) => {
           // console.log(this.badaboum)
            //console.log(e.data);
            //console.log(this11)
            //this.port.postMessage('ooo');
        };
    }

    static get parameterDescriptors() {
        return [
            {
                name: "offset",
                defaultValue: 1,
                minValue: -1000,
                maxValue: 1000,
                automationRate: "a-rate",
            },
            {
                name: "multiplier",
                defaultValue: 0.5,
                minValue: -1000,
                maxValue: 1000,
                automationRate: "a-rate",
            },
        ];
    }

    process(inputs, outputs, parameters, x) {
        const output = outputs[0];
        output.forEach((channel) => {
            for (let i = 0; i < channel.length; i++) {
                const offset = (parameters["offset"].length > 1) ? (parameters["offset"][i]) : (parameters["offset"][0])
                const multiplier = (parameters["multiplier"].length > 1) ? (parameters["multiplier"][i]) : (parameters["multiplier"][0])

                channel[i] = (inputs[0][0][i] + offset) * multiplier
            }
        });
        return true;
    }
}

registerProcessor("linear-transform-processor", LinearTransformProcessor);
