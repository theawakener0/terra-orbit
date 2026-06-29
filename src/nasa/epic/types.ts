export interface EpicImage {
  identifier: string
  caption: string
  image: string
  version: string
  date: string
  centroid_coordinates: {
    lat: number
    lon: number
  }
  dscovr_j2000_position: Position
  lunar_j2000_position: Position
  sun_j2000_position: Position
  attitude_quaternions: {
    q0: number
    q1: number
    q2: number
    q3: number
  }
}

export interface Position {
  x: number
  y: number
  z: number
}

export interface EpicAvailableDate {
  date: string
}

export type EpicImageryType = "natural" | "enhanced"
