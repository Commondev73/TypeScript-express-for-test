import * as fs from 'fs'
import { Utils } from 'TypeScript-sdk-test'

const uploadFile = (base64Data: string, directory: string) => {
  if (!base64Data) return undefined
  const path = directory
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
  const fileName = `${Utils.Generator.genTransactionId()}.jpg`
  const pathName = `${path}/${fileName}`
  const rawBase64Data = base64Data.replace(/^data:image\/(\w+);base64,/gi, '')
  fs.writeFileSync(pathName, rawBase64Data, { encoding: 'base64' })
  return {
    fileName,
    pathName
  }
}

const getBase64Image = (path: string) => {
  let base64Image = ''
  if (fs.existsSync(path)) {
    base64Image = `data:image/jpeg;base64,${fs.readFileSync(path, { encoding: 'base64' })}`
  }
  return base64Image
}

const removeFile = (path: string) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path)
    return true
  }
  return false
}

export { uploadFile, getBase64Image, removeFile }
