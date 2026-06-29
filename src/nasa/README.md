# terra-orbit — NASA API Wrapper

Zero-dependency TypeScript client for the [NASA Open APIs](https://api.nasa.gov/). Wraps 7 API categories across 4 base URLs with full type coverage.

## Usage

```ts
import { NasaClient } from "./nasa"

const nasa = new NasaClient(process.env.NASA_API_KEY!)

// Each domain is a namespace on the client
const apod = await nasa.apod.today()
const asteroids = await nasa.neo.feed({ start_date: "2025-06-20" })
const flares = await nasa.donki.solarFlares({ startDate: "2024-01-01" })
```

## API Key

Get a key at https://api.nasa.gov/#signUp. The `DEMO_KEY` gives 30 requests/hour; a real key gives 1000/hour.

The Imagery module (images-api.nasa.gov) does not require a key.

## Modules

### APOD — Astronomy Picture of the Day

```
GET /planetary/apod
```

```ts
nasa.apod.today()                              // today's picture
nasa.apod.byDate("2024-06-01")                 // specific date
nasa.apod.getRange("2024-06-01", "2024-06-07") // date range → ApodResponse[]
nasa.apod.getRandom(3)                         // 3 random entries
nasa.apod.get({ date: "2024-06-01", thumbs: true }) // full control
```

**Response** (`ApodResponse`):
| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Image title |
| `explanation` | `string` | Astronomer-written explanation |
| `url` | `string` | Image/video URL |
| `hdurl` | `string?` | High-res image URL |
| `media_type` | `"image" \| "video"` | Content type |
| `date` | `string` | YYYY-MM-DD |
| `copyright` | `string?` | Copyright holder |
| `thumbnail_url` | `string?` | Video thumbnail (if `thumbs: true`) |

---

### NeoWs — Near Earth Object Web Service

```
GET /neo/rest/v1/feed
GET /neo/rest/v1/neo/{id}
GET /neo/rest/v1/neo/browse
```

```ts
nasa.neo.feed({ start_date: "2025-06-20", end_date: "2025-06-27" })
nasa.neo.lookup("3542519")
nasa.neo.browse(1)       // paginated, 20 per page
```

**`feed()`** returns `NeoFeedResponse`:
- `element_count` — total asteroids in range
- `near_earth_objects` — `Record<string, NearEarthObject[]>` keyed by date

**`lookup()`** returns `NearEarthObject` with full `orbital_data`.

**`browse()`** returns `NeoBrowseResponse` with pagination metadata.

Each `NearEarthObject` includes:
- `id`, `name`, `nasa_jpl_url`
- `estimated_diameter` (km/m/mi/ft ranges)
- `is_potentially_hazardous_asteroid`
- `close_approach_data[]` (velocity, miss distance, orbiting body)
- `orbital_data` (only from `lookup`)

---

### EPIC — Earth Polychromatic Imaging Camera

```
GET /EPIC/api/{natural|enhanced}
GET /EPIC/api/{type}/date/{date}
GET /EPIC/api/{type}/all
```

```ts
nasa.epic.getLatest("natural")               // recent images
nasa.epic.getByDate("natural", "2025-06-01") // by date
nasa.epic.getAvailableDates("natural")       // all available dates
nasa.epic.imageUrl("natural", "2025-06-01", "epic_1b")  // construct PNG URL
```

**`imageUrl()`** builds `https://epic.gsfc.nasa.gov/archive/{type}/{year}/{month}/{day}/png/{name}.png` — no network request.

---

### DONKI — Space Weather Database

```
GET /DONKI/CME, /CMEAnalysis, /GST, /FLR, /SEP, /MPC, /IPS, /RBE, /HSS, /WSAEnlilSimulations, /notifications
```

```ts
nasa.donki.cme({ startDate: "2024-01-01", endDate: "2024-01-07" })
nasa.donki.cmeAnalysis({ startDate: "2024-01-01", mostAccurateOnly: true })
nasa.donki.solarFlares({ startDate: "2024-01-01" })
nasa.donki.geomagneticStorms(range)
nasa.donki.solarEnergeticParticles(range)
nasa.donki.magnetopauseCrossings(range)
nasa.donki.interplanetaryShocks({ startDate: "...", location: "Earth" })
nasa.donki.radiationBeltEnhancements(range)
nasa.donki.hightSpeedStreams(range)
nasa.donki.wsaEnlilSimulations(range)
nasa.donki.notifications({ startDate: "...", type: "FLR" })
```

All accept optional `{ startDate, endDate }` in `YYYY-MM-DD` format. Defaults to ~30 day lookback.

---

### EONET — Natural Events

```
GET /events
GET /categories
```

Base URL: `https://eonet.gsfc.nasa.gov/api/v3`

```ts
nasa.eonet.events({ limit: 10, status: "open", category: "volcanoes" })
nasa.eonet.categories()
```

**Query params** for `events()`:
| Param | Type | Description |
|-------|------|-------------|
| `limit` | `number` | Max events |
| `days` | `number` | Lookback days |
| `status` | `"open" \| "closed" \| "all"` | Event status |
| `category` | `number \| string` | Category ID or name |
| `source` | `string` | Source ID |
| `startDate` / `endDate` | `string` | Date range |

---

### TechTransfer — NASA Technologies

```
GET /api/api/{patent|software|spinoff}/{query}
```

Base URL: `https://technology.nasa.gov`

```ts
nasa.techtransfer.patent("rocket")
nasa.techtransfer.software("visualization")
nasa.techtransfer.spinoff("polymers")
```

Each returns `{ results: T[], count: number, total: number }`.

---

### Image & Video Library

```
GET /search, /asset/{id}, /metadata/{id}, /captions/{id}
```

Base URL: `https://images-api.nasa.gov` (no API key needed)

```ts
nasa.imagery.search({ q: "moon", page_size: 10, media_type: "image" })
nasa.imagery.asset("GSFC_20171208_Archive_e000491")
nasa.imagery.metadata("GSFC_20171208_Archive_e000491")
nasa.imagery.captions("GSFC_20171208_Archive_e000491")
```

**Search params**:
| Param | Type | Description |
|-------|------|-------------|
| `q` | `string` | Free-text search |
| `center` | `string` | NASA center |
| `description` | `string` | Description keyword |
| `keywords` | `string` | Comma-separated keywords |
| `location` | `string` | Location |
| `media_type` | `"image" \| "video" \| "audio"` | Filter by type |
| `nasa_id` | `string` | Specific NASA ID |
| `page` / `page_size` | `number` | Pagination |
| `year_start` / `year_end` | `string` | Year range |

## Error Handling

All methods throw typed errors:

```ts
import { NasaApiError, RateLimitError } from "./nasa"

try {
  await nasa.apod.today()
} catch (err) {
  if (err instanceof RateLimitError) {
    console.log(`Rate limited, retry after ${err.retryAfter}s`)
  } else if (err instanceof NasaApiError) {
    console.log(`API error ${err.status}: ${err.message}`)
  }
}
```

| Error | Status | When |
|-------|--------|------|
| `NasaApiError` | varies | Non-2xx response |
| `RateLimitError` | 429 | Rate limited |
| `NasaApiError` | 408 | Request timeout (default 30s) |

## Low-Level Client

You can use `NasaBaseClient` directly for endpoints the modules don't cover:

```ts
import { NasaBaseClient } from "./nasa"

const client = new NasaBaseClient({
  apiKey: process.env.NASA_API_KEY,
  baseUrl: "https://api.nasa.gov",
  timeout: 15_000,
})

const data = await client.get("/planetary/apod", { date: "2024-06-01" })
```

**Client options**:
| Option | Default | Description |
|--------|---------|-------------|
| `apiKey` | — | NASA API key (optional) |
| `baseUrl` | `https://api.nasa.gov` | API base URL |
| `timeout` | `30000` | Request timeout in ms |

## Utilities

```ts
import { formatDate, toQueryString } from "./nasa"

formatDate(new Date())         // "2025-06-29"
toQueryString({ a: 1, b: "x" }) // "?a=1&b=x"
```

## Types

All response types are exported from `./nasa`:

```ts
import type {
  ApodResponse, ApodQueryParams,
  NearEarthObject, NeoFeedResponse, NeoLookupResponse, NeoBrowseResponse,
  EpicImage, EpicImageryType,
  CmeEvent, SolarFlare, GeomagneticStorm, DonkiNotification,
  EonetEvent, EonetEventsResponse,
  PatentResult, SoftwareResult,
  ImagerySearchResponse, ImagerySearchQuery,
} from "./nasa"
```

## Notes

- **Mars Rover Photos API** — previously at `api.nasa.gov/mars-photos/`, it was a Heroku app that has been permanently sunset. No replacement has been announced.
- **Rate limits** — the `DEMO_KEY` allows 30 requests/hour per IP. A real key allows 1000/hour.
- **Dates** — NASA uses `YYYY-MM-DD` format throughout. Use `formatDate()` from utils.
