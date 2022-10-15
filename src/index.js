//import 'litegraph.js/src/litegraph.css'
import { waitAudioContext } from './audiolib/waitAudioContext'
import { Bloc } from './bloc.js'
import './components.js'
import { loadAudioSynth, defaultSynthDescription, startAudioSynth, stopAudioSynth } from './import.js'
import { refreshUIBus } from './components'
import { ConnectionCanvas, getLinks } from './connectionsCanvas.js'
import { registerKeyboard } from './lib/keyboard'
import { OneBisAudioWorket } from './audioworklet.test'

const go = async () => {

    const ac = await waitAudioContext()
    OneBisAudioWorket(ac)
    return
    const loadedSynthDescription = await (await fetch("assets/synths/six.json")).json()
    const synthDescription = defaultSynthDescription
    //const synthDescription = loadedSynthDescription
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