
export const getAudioNodeAudioParamNames = (audioNode) => {
    const aps = []
    for (var prop in audioNode) {
        if (audioNode[prop] instanceof AudioParam)
            aps.push(prop)
    }
    return aps
}
export const inspectAudioParams = (audioNode) => {
    const names = getAudioNodeAudioParamNames(audioNode)
}