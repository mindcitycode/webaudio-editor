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
    local: new URL(document.URL).searchParams.get('local'),
}
import { Dropper } from './dragdrop.js'
import { LocalJSONFileSystem } from './lib/locaJSONFileSystem.js'

import { reloadWithParams} from './lib/reload.js'

const go = async () => {


    // init localstorage wrapper
    const localFs = new LocalJSONFileSystem("synths")
    console.log('ls', localFs.ls())

    // save dropped synth descriptions to localstorage
    const dropper = Dropper()
    dropper.bus.addListener(drops => {
        let lastDrop = undefined
        drops.forEach(drop => {
            console.log("write drop", drop)
            localFs.writeFile(drop.name, drop.object, true)
            lastDrop = drop
        })
        reloadWithParams({ local: lastDrop.name })
    })


    // load a synth description

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
    } else if (StartParams.local) {
        console.log('starting with localstorage item', StartParams.local)
        synthDescription = localFs.readFile(StartParams.local)
    } else {
        console.log('starting with simple default synth')
        synthDescription = defaultSynthDescription
    }

    const ac = await waitAudioContext()
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