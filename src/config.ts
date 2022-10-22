import mongoose, { ConnectOptions } from 'mongoose'

export const database = {
  connect: async (dbAddress: string) => {
    try {
      await mongoose.connect(dbAddress, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      } as ConnectOptions)
      console.log(`DB connected on ${dbAddress}`)
    } catch (error) {
      console.log(error)
    }
  },
  close: async () => {
    try {
      await mongoose.connection.close()
      console.log(`DB disconnected`)
    } catch (error) {
      console.log(error)
    }
  }
}

