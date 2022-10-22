import * as fs from 'fs'
import { Application } from 'express'

const Router = (app: Application) => {
  fs.readdirSync(__dirname).forEach(async (file) => {
    if (file === 'index.js' || file === 'index.ts') return
    const name = file.substring(0, file.indexOf('.'))
    // import Router Bug 
    // const importRouter = await import('./' + name)
    // importRouter.default(app)
    require('./' + name).default(app)
  })
}

export default Router
