export const OneAudioWorket = async (ac) => {

    //  const aw = new Worker(new URL("./randomAudio.audioworklet.js", import.meta.url))
    await ac.audioWorklet.addModule(new URL("./processors/random-noise-processor.js", import.meta.url))
    // await ac.audioWorklet.addModule("random-noise-processor.js");
    const randomNoiseNode = new AudioWorkletNode(
        ac,
        "random-noise-processor"
    );

    randomNoiseNode.connect(ac.destination);
    console.log(randomNoiseNode)
    randomNoiseNode.port.onmessage = (e) => console.log(e.data);

    setInterval(() => randomNoiseNode.port.postMessage("ping"), 1000);
}
export const TwoAudioWorket = async (ac) => {

    const src = await fetch("assets/fx.txt")
    const srcTxt = await src.text()
    console.log({ srcTxt })
    const blob = new Blob([srcTxt])
    const blobURL = window.URL.createObjectURL(blob);

    const aw = await ac.audioWorklet.addModule(blobURL)
    //  const aw = new Worker(new URL("./randomAudio.audioworklet.js", import.meta.url))
    //await ac.audioWorklet.addModule(new URL("./random-noise-processor.js", import.meta.url))
    // await ac.audioWorklet.addModule("random-noise-processor.js");
    const randomNoiseNode = new AudioWorkletNode(
        ac,
        "random-noise-processor"
    );
    /*
        var blob = new Blob([document.querySelector('#worker1').textContent]);
        var blobURL = window.URL.createObjectURL(blob);
    */

    randomNoiseNode.connect(ac.destination);
    console.log(randomNoiseNode)
    randomNoiseNode.port.onmessage = (e) => console.log(e.data);

    setInterval(() => randomNoiseNode.port.postMessage("ping"), 1000);
}

class LinearTransformNode extends AudioWorkletNode {
    constructor(context, offset, multiplier) {
        super(context, 'linear-transform-processor', {
            numberOfInputs: 1,
            numberOfOutputs: 1,
            channelCount: 1,
            processorOptions: {
                bump: "joe"
            },
            parameterData: { multiplier, offset }
        })
    }
}

export const OneBisAudioWorket = async (ac) => {

    const z = await ac.audioWorklet.addModule(new URL("./processors/linear-transform.js", import.meta.url))

    /*
    const modulePaths = [
        "./processors/linear-transform.js"
    ]
    for (let i = 0; i < modulePaths.length; i++) {
        const modulePath = modulePaths[i]
        //  const aw = new Worker(new URL("./randomAudio.audioworklet.js", import.meta.url))
        const z =  await ac.audioWorklet.addModule(new URL(modulePaths[0], import.meta.url))
        console.log('loaded',modulePath,z)
    }*/
    // await ac.audioWorklet.addModule("random-noise-processor.js");

    /*
        const linearTransformNode = new AudioWorkletNode(
            ac,
            "linear-transform-processor",
        //    { parameterData: { multiplier: 1.0 } }
        );
    */
    const linearTransformNode = new LinearTransformNode(ac, 0, 1)
    const osc = ac.createOscillator()
    osc.start()
    osc.connect(linearTransformNode)
    //linearTransformNode.getParameter('multiplier')//
    linearTransformNode.connect(ac.destination);
    //   console.log("x", linearTransformNode.multiplier)
    // randomNoiseNode.port.onmessage = (e) => console.log(e.data);

    setInterval(() => linearTransformNode.port.postMessage("ping"), 1000);
}