export const reloadWithParams = (params) => {
    const url = new URL(document.URL)
    const sp = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
        sp.set(k, v)
    }
    url.search = `?${sp.toString()}`
    document.location = url
}
