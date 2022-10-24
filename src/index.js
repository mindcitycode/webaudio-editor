//import 'litegraph.js/src/litegraph.css'
import { waitAudioContext } from './audiolib/waitAudioContext'
import { Bloc } from './bloc.js'
import './components.js'
import { loadAudioSynth, defaultSynthDescription, defaultEmptySynthDescription, startAudioSynth, stopAudioSynth } from './import.js'
import { refreshUIBus } from './components'
import { ConnectionCanvas, getLinks } from './connectionsCanvas.js'
import { registerKeyboard } from './lib/keyboard'
import { OneBisAudioWorket } from './audioworklet.test'


const StartParams = {
    blank: new URL(document.URL).searchParams.has('blank'),
    asset: new URL(document.URL).searchParams.get('asset'),

}
import { Dropper } from './dragdrop.js'
const go = async () => {

    const dropper = Dropper()
    dropper.bus.addListener((...e) => {
        console.log('dropped', ...e)
    })
    const ac = await waitAudioContext()
    //OneBisAudioWorket(ac)
    //return
    let synthDescription

    if (StartParams.blank) {
        console.log('starting blank')
        synthDescription = defaultEmptySynthDescription
    } else if (StartParams.asset) {
        // "assets/synths/six.json"
        console.log('starting with asset', StartParams.asset)
        const assetPath = `assets/synths/${StartParams.asset}`
        try {
            synthDescription = (await (await fetch(assetPath)).json())
        } catch (e) {
            console.error(e)
            synthDescription = defaultSynthDescription
        }
    } else {
        console.log('starting with simple default synth')
        synthDescription = defaultSynthDescription
    }

    const synth = loadAudioSynth(ac, synthDescription)
    ConnectionCanvas(getLinks(synth))
    refreshUIBus.say(synth)
    startAudioSynth(synth)
    refreshUIBus.say(synth)

    setTimeout(() => {
        //        stopAudioSynth(synth)
        refreshUIBus.say(synth)
    }, 1000)
    setInterval(() => {
        //       refreshUIBus.say(synth)
        //     console.log(synth.description)//.nodes.map( nd => nd.type ))
    }, 1000)
}

go()