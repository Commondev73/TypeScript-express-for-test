import express, { Request, Response, Application } from 'express'
import Router from './src/routes'
import * as Config from './src/config'
import * as Constants from './src/constants'
import cors from 'cors'
import logger from 'morgan'
import * as uuid from 'uuid'
import bodyParser from 'body-parser'

const app: Application = express()

app.use(cors())
app.use(bodyParser.json({ limit: '5mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

// path upload
app.use('/api/upload', express.static(Constants.UPLOAD))

//Request Log
app.use(
  logger((tokens, req: Request, res: Response) => {
    if (tokens.method(req, res) === 'OPTIONS') {
      return ''
    }
    const id = uuid.v4()
    const newLine = '*\n*\n*'
    const startDate = new Date()
    const responseTime = tokens['response-time'](req, res)
    if (responseTime) {
      startDate.setMilliseconds(startDate.getMilliseconds() - parseInt(responseTime))
    }
    const endDate = new Date()
    return [
      `========== [${startDate.toISOString()}] --> ${id} ==========`,
      newLine,
      `url: ${tokens.url(req, res)}`,
      `method: ${tokens.method(req, res)}`,
      `headers: ${JSON.stringify(
        {
          authorization: req.headers.authorization || 'none'
        },
        null,
        2
      )}`,
      `body: ${JSON.stringify(
        {
          ...req.body,
          password: undefined
        },
        null,
        2
      )}`,
      `status: ${tokens.status(req, res)}`,
      newLine,
      `========== [${endDate.toISOString()}] --> ${id} ==========`
    ].join('\n')
  })
)

// routes
Router(app)

//show all api
const showAllApi = () =>
  app._router.stack
    .filter((r: any) => r.route)
    .map((r: any) => Object.keys(r.route.methods)[0].toUpperCase().padEnd(7) + r.route.path)
    .join('\n')

console.log(showAllApi())

// server start
const port: number | string = Constants.PORT || 8001
app.listen(port)
console.log(`Server listening on ${port}`)

// connect db
Config.database.connect(Constants.DB_URL)
