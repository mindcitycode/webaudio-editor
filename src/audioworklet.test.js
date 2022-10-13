
export const OneAudioWorket = async (ac) => {

    //  const aw = new Worker(new URL("./randomAudio.audioworklet.js", import.meta.url))
    await ac.audioWorklet.addModule(new URL("./random-noise-processor.js", import.meta.url))
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
