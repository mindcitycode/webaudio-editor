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
const go = async () => {

    const localFs = new LocalJSONFileSystem("synths")
    console.log('ls', localFs.ls())
    /*   localFs.rm("fichier2")
       console.log('ls', localFs.ls())
       localFs.writeFile("fichier1",{ contenu: 'oo' },true)
       console.log('read',   localFs.readFile("fichier1"))
    //   localFs.writeFile("fichier2",{ contenu: 'aoo' })
       console.log('read',   localFs.readFile("fichier2"))
   */
    const dropper = Dropper()
    dropper.bus.addListener(drops => {
        console.log('dropped', drops)
        drops.forEach(drop => {

            console.log("write file", drop)
            localFs.writeFile(drop.name, drop.object)
        })

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
    } else if (StartParams.local){  
        console.log('starting with localstorage item', StartParams.local)
        synthDescription = localFs.readFile(StartParams.local)
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