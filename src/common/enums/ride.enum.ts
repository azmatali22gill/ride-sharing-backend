export enum RideStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  ARRIVING = 'ARRIVING',
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum RideType {
  ECONOMY = 'ECONOMY',
  COMFORT = 'COMFORT',
  PREMIUM = 'PREMIUM',
  XL = 'XL',
}

// Allowed forward transitions for the ride state machine
export const RIDE_STATUS_TRANSITIONS: Record<RideStatus, RideStatus[]> = {
  [RideStatus.REQUESTED]: [RideStatus.ACCEPTED, RideStatus.CANCELLED, RideStatus.EXPIRED],
  [RideStatus.ACCEPTED]: [RideStatus.ARRIVING, RideStatus.CANCELLED],
  [RideStatus.ARRIVING]: [RideStatus.STARTED, RideStatus.CANCELLED],
  [RideStatus.STARTED]: [RideStatus.COMPLETED, RideStatus.CANCELLED],
  [RideStatus.COMPLETED]: [],
  [RideStatus.CANCELLED]: [],
  [RideStatus.EXPIRED]: [],
};
