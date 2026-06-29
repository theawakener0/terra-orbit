import type { NasaBaseClient } from "../client"
import type {
  CmeAnalysisQuery,
  CmeEvent,
  DonkiDateRange,
  DonkiNotification,
  GeomagneticStorm,
  HightSpeedStream,
  InterplanetaryShock,
  IpsQuery,
  MagnetopauseCrossing,
  NotificationQuery,
  RadiationBeltEnhancement,
  SolarEnergeticParticle,
  SolarFlare,
  WsaEnlilSimulation,
} from "./types"

export function createDonkiModule(client: NasaBaseClient) {
  function cme(params?: DonkiDateRange): Promise<CmeEvent[]> {
    return client.get<CmeEvent[]>("/DONKI/CME", { ...params })
  }

  function cmeAnalysis(params?: CmeAnalysisQuery): Promise<CmeEvent[]> {
    return client.get<CmeEvent[]>("/DONKI/CMEAnalysis", { ...params })
  }

  function geomagneticStorms(params?: DonkiDateRange): Promise<GeomagneticStorm[]> {
    return client.get<GeomagneticStorm[]>("/DONKI/GST", { ...params })
  }

  function solarFlares(params?: DonkiDateRange): Promise<SolarFlare[]> {
    return client.get<SolarFlare[]>("/DONKI/FLR", { ...params })
  }

  function solarEnergeticParticles(params?: DonkiDateRange): Promise<SolarEnergeticParticle[]> {
    return client.get<SolarEnergeticParticle[]>("/DONKI/SEP", { ...params })
  }

  function magnetopauseCrossings(params?: DonkiDateRange): Promise<MagnetopauseCrossing[]> {
    return client.get<MagnetopauseCrossing[]>("/DONKI/MPC", { ...params })
  }

  function interplanetaryShocks(params?: IpsQuery): Promise<InterplanetaryShock[]> {
    return client.get<InterplanetaryShock[]>("/DONKI/IPS", { ...params })
  }

  function radiationBeltEnhancements(params?: DonkiDateRange): Promise<RadiationBeltEnhancement[]> {
    return client.get<RadiationBeltEnhancement[]>("/DONKI/RBE", { ...params })
  }

  function hightSpeedStreams(params?: DonkiDateRange): Promise<HightSpeedStream[]> {
    return client.get<HightSpeedStream[]>("/DONKI/HSS", { ...params })
  }

  function wsaEnlilSimulations(params?: DonkiDateRange): Promise<WsaEnlilSimulation[]> {
    return client.get<WsaEnlilSimulation[]>("/DONKI/WSAEnlilSimulations", { ...params })
  }

  function notifications(params?: NotificationQuery): Promise<DonkiNotification[]> {
    return client.get<DonkiNotification[]>("/DONKI/notifications", { ...params })
  }

  return {
    cme,
    cmeAnalysis,
    geomagneticStorms,
    solarFlares,
    solarEnergeticParticles,
    magnetopauseCrossings,
    interplanetaryShocks,
    radiationBeltEnhancements,
    hightSpeedStreams,
    wsaEnlilSimulations,
    notifications,
  }
}
