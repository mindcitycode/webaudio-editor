//import 'litegraph.js/src/litegraph.css'
if (false) {
    const canvas = document.createElement('canvas')
    canvas.id = "mycanvas"
    canvas.width = window.innerWidth - 50
    canvas.height = window.innerHeight - 50
    document.body.append(canvas)
}
import { waitAudioContext } from './lib/waitAudioContext'

import { Bloc } from './bloc.js'

const OneAudioWorket = async (ac) => {

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
const TwoAudioWorket = async (ac) => {

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




const go = async () => {

    const ac = await waitAudioContext()
    //OneAudioWorket(ac)
    //   TwoAudioWorket(ac)
    // console.log(ac)
    const blackList = ['createMediaElementSource', 'createMediaStreamSource', 'createMediaStreamTrackSource', 'createBuffer', 'createIIRFilter', 'createPeriodicWave']

    const parsed = {}
    for (var createFn in ac) {
        if (createFn.startsWith('create')) {
            parsed[createFn] = { unfit: [] }

            if (blackList.includes(createFn))
                continue;

            const audioNode = ac[createFn]()
            const $bloc = Bloc(createFn, audioNode)
            //parsed[createFn] = {}
            for (var audioNodePropName in audioNode) {
                const audioNodePropType = typeof audioNode[audioNodePropName]
                const audioNodePropConstructor = audioNode[audioNodePropName]?.constructor?.name

                let k = audioNodePropConstructor
                if (k) {
                    if (parsed[createFn][k] === undefined) {
                        parsed[createFn][k] = {}
                    }
                    parsed[createFn][k][audioNodePropName] = 1

                } else {
                    parsed[createFn].unfit.push(audioNodePropName)
                }

                //            console.log(audioNodePropName, audioNodePropType, audioNodePropConstructor)
                //console.log(audioNodePropName, typeof audioNode[audioNodePropName], audioNode[audioNodePropName].constructor.name)
            }
        }

    }
    // console.log(parsed)
    // document.body.innerHTML = JSON.stringify(parsed)
}
go()