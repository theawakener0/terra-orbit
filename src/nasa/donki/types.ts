export interface DonkiDateRange {
  startDate?: string
  endDate?: string
}

export interface CmeEvent {
  activityID: string
  catalog: string
  startTime: string
  sourceLocation: string
  activeRegionNum: number | null
  note: string
  instruments: { displayName: string }[]
  cmeAnalyses: CmeAnalysis[]
}

export interface CmeAnalysis {
  time21_5: string
  latitude: number
  longitude: number
  halfAngle: number
  speed: number
  type: string
  isMostAccurate: boolean
}

export interface GeomagneticStorm {
  gstID: string
  startTime: string
  allKpIndex: {
    observedTime: string
    kpIndex: number
    source: string
  }[]
}

export interface SolarFlare {
  flrID: string
  instruments: { displayName: string }[]
  beginTime: string
  peakTime: string
  endTime: string
  classType: string
  sourceLocation: string
  activeRegionNum: number
}

export interface SolarEnergeticParticle {
  sepID: string
  eventTime: string
  instruments: { displayName: string }[]
}

export interface MagnetopauseCrossing {
  mpcID: string
  eventTime: string
  location: string
}

export interface InterplanetaryShock {
  shockID: string
  eventTime: string
  location: string
}

export interface RadiationBeltEnhancement {
  rbeID: string
  eventTime: string
}

export interface HightSpeedStream {
  hssID: string
  eventTime: string
}

export interface WsaEnlilSimulation {
  simulationID: string
  startTime: string
  note: string
}

export interface DonkiNotification {
  messageType: string
  messageID: string
  messageURL: string
  messageIssueTime: string
  messageBody: string
}

export type NotificationType = "all" | "FLR" | "SEP" | "CME" | "IPS" | "MPC" | "GST" | "RBE" | "report"

export interface CmeAnalysisQuery extends DonkiDateRange {
  mostAccurateOnly?: boolean
  speed?: number
  halfAngle?: number
  catalog?: "ALL" | "SWRC_CATALOG" | "JANG_ET_AL_CATALOG"
}

export interface IpsQuery extends DonkiDateRange {
  location?: "Earth" | "MESSENGER" | "STEREO A" | "STEREO B"
  catalog?: "ALL" | "SWRC_CATALOG" | "WINSLOW_MESSENGER_ICME_CATALOG"
}

export interface NotificationQuery extends DonkiDateRange {
  type?: NotificationType
}
