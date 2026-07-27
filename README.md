# Ride Sharing Backend

Real-time ride-sharing platform backend built with NestJS, MongoDB, and WebSockets.

## Stack

- **Runtime** — Node.js, TypeScript
- **Framework** — NestJS 10
- **Database** — MongoDB via Mongoose
- **Real-time** — Socket.IO (WebSockets)
- **Validation** — class-validator + class-transformer
- **Config** — @nestjs/config (.env)

## Modules

| Module | What it does |
|--------|-------------|
| `Drivers` | Onboarding, verification, status/location updates, geospatial search |
| `Passengers` | Registration, ride history |
| `Rides` | Full ride lifecycle — request, accept, reject, start, complete, cancel. State-machine enforced. |
| `Matching` | Nearest-driver geo dispatch with rejection tracking |
| `Fare` | Pricing engine: base + distance + time + surge multiplier |
| `Location` | WebSocket gateway (`/realtime`) for live driver location streaming and ride events |
| `Ratings` | Submit, retrieve, and rolling-average updates per user |

## Getting Started

```bash
# install
npm install

# copy env and edit
cp .env.example .env

# run (dev with watch)
npm run start:dev

# build
npm run build

# production
npm run start:prod

# seed sample data
npm run seed
```

## Env Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3010 | HTTP server port |
| `MONGODB_URI` | mongodb://localhost:27017/ride_sharing | MongoDB connection string |
| `DRIVER_SEARCH_RADIUS_KM` | 5 | Max distance for driver matching |
| `RIDE_REQUEST_TIMEOUT_SECONDS` | 30 | How long a ride request waits before expiring |

## API Overview

### Drivers
- `POST /drivers` — onboard a driver
- `PATCH /drivers/:id/verification` — verify/reject
- `PATCH /drivers/:id/status` — online/offline/available
- `PATCH /drivers/:id/location` — update GPS
- `GET /drivers?lat=&lng=&radiusKm=` — find nearby available drivers

### Passengers
- `POST /passengers` — register
- `GET /passengers/:id` — get by ID

### Rides
- `POST /rides` — request a ride
- `PATCH /rides/:id/accept` — driver accepts
- `PATCH /rides/:id/reject` — driver rejects
- `PATCH /rides/:id/arriving` / `start` / `complete` / `cancel`
- `GET /rides/:id` — ride details
- `GET /rides/history/passenger/:passengerId` / `driver/:driverId`

### Ratings
- `POST /ratings` — submit a rating
- `GET /ratings/ride/:rideId`
- `GET /ratings/user/:userId`

## WebSocket Events

Namespace: `/realtime`

**Client -> Server:**
- `driver:register` — bind driver ID to socket
- `driver:location` — stream GPS coordinates
- `ride:join` / `ride:leave` — join/leave a ride room

**Server -> Client:**
- `ride:offer` — ride dispatched to driver
- `ride:accepted` / `ride:status` / `ride:completed` / `ride:cancelled` / `ride:expired`

## License

MIT
