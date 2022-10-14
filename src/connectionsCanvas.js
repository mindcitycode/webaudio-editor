import { rafLoop } from './lib/loop.js'
import { getScrollPosition } from './dom.js'

export const getLinks = synth => () => {

    const connectedElements = []
    synth.description.connections.forEach(([from, to]) => {
        const fromId = from.id
        const toId = to.id
        const fromNode = document.getElementById(fromId)
        if (!fromNode ) return 

        let fromElement = fromNode.querySelector(`[name="${1}"].wa-audio-output`)
        if (!fromElement ) return 

        const toNode = document.getElementById(toId)
        if (!toNode) return
        let toElement = undefined
        if (to.audioParam) {
            toElement = toNode.querySelector(`[name="${to.audioParam}"].wa-audio-param`)
        } else {
            toElement = toNode.querySelector(`[name="${1}"].wa-audio-input`)
        }
        if (fromElement && toElement) {
            connectedElements.push({ fromElement, toElement })
        }
    })

    const links = []
    connectedElements.forEach(({ fromElement, toElement }) => {

        const fromRect = fromElement.getBoundingClientRect()
        const toRect = toElement.getBoundingClientRect()

        const from = {
            x: fromRect.right,
            y: (fromRect.top + fromRect.bottom) / 2
        }
        const to = {
            x: toRect.left,
            y: (toRect.top + toRect.bottom) / 2
        }
        links.push(
            { from, to }
        )

    })

    return links
}


export const ConnectionCanvas = (getLinks) => {
    const canvas = document.createElement('canvas')
    canvas.classList.add('link')
    document.body.append(canvas)
    const ctx = canvas.getContext('2d')

    const resize = () => {
        if ((canvas.width !== window.innerWidth) || (canvas.height !== window.innerHeight)) {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
    }

    rafLoop((delta, time) => {
        resize()
        const topleft = getScrollPosition()
        canvas.style.left = `${topleft.x}px`
        canvas.style.top = `${topleft.y}px`
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        getLinks().forEach(({ from, to }) => {
            ctx.strokeStyle = 'black'
            ctx.beginPath()
            ctx.moveTo(from.x, from.y)
            const sw = to.x - from.x
            ctx.bezierCurveTo(
                from.x + sw, from.y,
                to.x - sw, to.y,
                to.x, to.y,
            )
            ctx.stroke()
        })
    })
}

