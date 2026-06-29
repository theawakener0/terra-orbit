import type { NasaBaseClient } from "../client"
import type { PatentResult, SoftwareResult, SpinoffResult, TechtransferResponse } from "./types"

const TECHTRANSFER_BASE = "https://technology.nasa.gov"

export function createTechtransferModule(client: NasaBaseClient) {
  function patent(query: string): Promise<TechtransferResponse<PatentResult>> {
    return client.get<TechtransferResponse<PatentResult>>(
      `/api/api/patent/${encodeURIComponent(query)}`,
    )
  }

  function software(query: string): Promise<TechtransferResponse<SoftwareResult>> {
    return client.get<TechtransferResponse<SoftwareResult>>(
      `/api/api/software/${encodeURIComponent(query)}`,
    )
  }

  function spinoff(query: string): Promise<TechtransferResponse<SpinoffResult>> {
    return client.get<TechtransferResponse<SpinoffResult>>(
      `/api/api/spinoff/${encodeURIComponent(query)}`,
    )
  }

  return { patent, software, spinoff }
}

export { TECHTRANSFER_BASE }
