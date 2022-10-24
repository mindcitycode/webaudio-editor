import { Bus } from './lib/bus.js'
export const Dropper = () => {

    const bus = new Bus()
    var dragged;

    const markAsDropZone = () => document.body.classList.add('drop-zone')
    const unMarkAsDropZone = () => document.body.classList.remove('drop-zone')

    const LOGIT = e => console.log('dragdrop', e)
    /* Les événements sont déclenchés sur les cibles du drop */
    document.addEventListener("dragover", function (event) {
        markAsDropZone()
        event.preventDefault();
    }, false);

    document.addEventListener("dragenter", function (event) {
        markAsDropZone()
        //        event.preventDefault();
    }, false);

    document.addEventListener("dragleave", function (event) {
        unMarkAsDropZone()
        //        event.preventDefault();

    }, false);

    const droppedContent = async (ev) => {
        const droppedFiles = [],
            droppedStrings = []
        if (ev.dataTransfer.items) {
            [...ev.dataTransfer.items].forEach((item, i) => {
                if (item.kind === 'file') {
                    droppedFiles.push(item.getAsFile())
                } else if (item.kind === 'string') {
                    console.log(item)
                    droppedStrings.push(item)
                }
            });
        } else {
            [...ev.dataTransfer.files].forEach((file, i) => {
                item.comesFromB = true
                droppedFiles.push(item)
                console.log('B', item)
            });
        }
        const objects = []
        for (const file of droppedFiles) {
            const name = file.name
            const text = await file.text()
            const object = JSON.parse(text)
            objects.push({ name, object })
        }
        for (const string of droppedStrings) {
            const text = await new Promise((a, r) => string.getAsString(text => a(text)))
            console.log('TTTT',text)
            const object = JSON.parse(text)
            const name = `text-drop-${Date.now()}`
            objects.push({ name, object })
        }

        bus.say(objects)
    }

    document.addEventListener("drop", function (event) {
        unMarkAsDropZone()
        droppedContent(event)
        event.preventDefault();
    }, false);

    return { bus }
}