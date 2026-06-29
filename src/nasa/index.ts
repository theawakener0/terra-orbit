import { NasaBaseClient } from "./client"
import { createApodModule } from "./apod"
import { createNeoModule } from "./neo"
import { createEpicModule } from "./epic"
import { createDonkiModule } from "./donki"
import { createEonetModule } from "./eonet"
import { createTechtransferModule } from "./techtransfer"
import { createImageryModule } from "./imagery"

export class NasaClient {
  apod: ReturnType<typeof createApodModule>
  neo: ReturnType<typeof createNeoModule>
  epic: ReturnType<typeof createEpicModule>
  donki: ReturnType<typeof createDonkiModule>
  eonet: ReturnType<typeof createEonetModule>
  techtransfer: ReturnType<typeof createTechtransferModule>
  imagery: ReturnType<typeof createImageryModule>

  constructor(apiKey: string) {
    const mainClient = new NasaBaseClient({ apiKey, baseUrl: "https://api.nasa.gov" })
    const eonetClient = new NasaBaseClient({ apiKey, baseUrl: "https://eonet.gsfc.nasa.gov/api/v3" })
    const techtransferClient = new NasaBaseClient({ apiKey, baseUrl: "https://technology.nasa.gov" })
    const imageryClient = new NasaBaseClient({ baseUrl: "https://images-api.nasa.gov" })

    this.apod = createApodModule(mainClient)
    this.neo = createNeoModule(mainClient)
    this.epic = createEpicModule(mainClient)
    this.donki = createDonkiModule(mainClient)
    this.eonet = createEonetModule(eonetClient)
    this.techtransfer = createTechtransferModule(techtransferClient)
    this.imagery = createImageryModule(imageryClient)
  }
}

export * from "./errors"
export * from "./types"
export * from "./utils"
export * from "./client"

export * from "./apod/types"
export * from "./neo/types"
export * from "./epic/types"
export * from "./donki/types"
export * from "./eonet/types"
export * from "./techtransfer/types"
export * from "./imagery/types"
