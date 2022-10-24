import { Persisted } from './persist.js'

class LocalJSONFileExistsError extends Error {}
export class LocalJSONFileSystem {

    static CREATION_DATE = 'CREATION_DATE'
    static LAST_MODIFIED_DATE = 'LAST_MODIFIED_DATE'

    name = undefined
    table = undefined

    constructor(name) {
        console.log('BUILD WITH', name)
        this.name = name
        this.table = Persisted(name)
        if (!this.table.get()) {
            this.table.set({ '___': Date.now() })
        }
    }
    getFileMetaData(filename) {
        return (this.table.get()[filename]) || undefined
    }
    getFileMetaDataAttribute(filename, attribute) {
        const md = this.getFileMetaData(filename)
        if (md) return md[attribute]
    }
    getFileCreationDate(filename) {
        return this.getFileMetaDataAttribute(filename, LocalJSONFileSystem.CREATION_DATE)
    }
    getFileLastModifiedDate(filename) {
        return this.getFileMetaDataAttribute(filename, LocalJSONFileSystem.LAST_MODIFIED)
    }
    writeFileMetaData(filename, creationDate, lastModifiedDate) {
        const table = this.table.get()
        const md = {}
        md[LocalJSONFileSystem.CREATION_DATE] = creationDate
        md[LocalJSONFileSystem.LAST_MODIFIED_DATE] = lastModifiedDate
        table[filename] = md
        this.table.set(table)
    }
    writeFile(filename, data, overwrite = false) {
        console.log('write file')
        const now = Date.now()
        const md = this.getFileMetaData(filename)

        if ((md === undefined) || overwrite) {

            let creationDate = md ? md[LocalJSONFileSystem.CREATION_DATE] : now
            let lastModifiedDate = now
            this.writeFileMetaData(filename, creationDate, lastModifiedDate)

            const p = Persisted(filename)
            p.set(data)
        } else {
            throw new LocalJSONFileExistsError(`file ${filename} exists`)
        }
    }
    fileExists(filename){
        const md = this.getFileMetaData(filename)
        return md?true:false
    }
    readFile(filename) {
        return Persisted(filename).get() || undefined
    }
    rm(filename){
        const table = this.table.get()
        if (table[filename]){
            delete table[filename]
            this.table.set(table)
            const p = Persisted(filename)
            p.clear()
        }
    }
    ls() {
        return this.table.get()
    }
}

