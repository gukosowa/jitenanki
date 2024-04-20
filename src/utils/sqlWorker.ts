import sqlite3InitModule from '@sqlite.org/sqlite-wasm'
import dbUrl from 'root/public/db2.sqllite3?url'

let db: Database

sqlite3InitModule().then((sqlite3) => {
  const openDatabase = async () => {
    try {
      const response = await fetch(dbUrl)
      const arrayBuffer = await response.arrayBuffer()
      const p = sqlite3.wasm.allocFromTypedArray(new Uint8Array(arrayBuffer))
      db = new sqlite3.oo1.DB()
      const deserialize_flags =
        sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE | sqlite3.capi.SQLITE_DESERIALIZE_RESIZEABLE
      const rc = sqlite3.capi.sqlite3_deserialize(
        db.pointer,
        'main',
        p,
        arrayBuffer.byteLength,
        arrayBuffer.byteLength,
        deserialize_flags,
      )
      db.checkRc(rc)
      postMessage({ type: 'ready' })
    } catch (err) {
      postMessage({ type: 'error', payload: 'Database init error: ' + err.message })
    }
  }

  openDatabase()
})

onmessage = (e) => {
  if (e.data.type === 'exec' && db) {
    try {
      const result = db.exec({
        sql: e.data.sql,
        bind: e.data.params,
        // resultRows: 'object',
        rowMode: 'object',
        returnValue: 'resultRows',
      })
      postMessage({ type: 'result', payload: result, id: e.data.id })
    } catch (err) {
      postMessage({ type: 'error', payload: 'SQL error: ' + err.message, id: e.data.id })
    }
  } else if (!db) {
    postMessage({ type: 'error', payload: 'Database not initialized', id: e.data.id })
  }
}
