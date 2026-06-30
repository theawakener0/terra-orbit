import { createCliRenderer, InputRenderable, TextRenderable, BoxRenderable, InputRenderableEvents } from "@opentui/core";
import { NasaClient, NasaApiError, RateLimitError } from "../nasa";


const nasa = new NasaClient(Bun.env.NASA_API_KEY!);
const renderer = await createCliRenderer({ exitOnCtrlC: true });

const mainBox = new BoxRenderable(renderer, {
    flexDirection: "column",
    padding: 1,
    margin: 1
})

const banner = `
                                                               
▄▄▄▄▄▄▄▄▄                        ▄▄▄▄▄         ▄▄             
▀▀▀███▀▀▀                      ▄███████▄       ██    ▀▀  ██   
   ███ ▄█▀█▄ ████▄ ████▄  ▀▀█▄ ███   ███ ████▄ ████▄ ██ ▀██▀▀ 
   ███ ██▄█▀ ██ ▀▀ ██ ▀▀ ▄█▀██ ███▄▄▄███ ██ ▀▀ ██ ██ ██  ██   
   ███ ▀█▄▄▄ ██    ██    ▀█▄██  ▀█████▀  ██    ████▀ ██▄ ██   
                                                               

`

const title = new TextRenderable(renderer, {
    content: banner,
    fg: "#00FF00",
})
mainBox.add(title);

renderer.root.add(mainBox);

const containerBox = new BoxRenderable(renderer, {
    flexDirection: "column",
    padding: 1
});

const inputRow = new BoxRenderable(renderer, {
    flexDirection: "row",
    marginBottom: 1
});

const labelText = new TextRenderable(renderer, {
    content: "Terra: ".padEnd(12),
    fg: "#888888"
});

const textInput = new InputRenderable(renderer, {
    id: "user-input",
    placeholder: "Type here...",
    width: 20,
    backgroundColor: "#222",
    focusedBackgroundColor: "#333",
    textColor: "#FFF",
    cursorColor: "#0F0",
});

inputRow.add(labelText);
inputRow.add(textInput);
containerBox.add(inputRow);

let inputBuffer = "";

function addOutput(content: string, fg = "#00FF00") {
    containerBox.add(new TextRenderable(renderer, {
        content,
        fg,
        marginTop: 1,
    }))
}

async function apod(args: string[]) {
    try {
        if (args[0] === "help") {
            addOutput(
                "apod                        today's picture\n" +
                "apod <date>                 picture by date (YYYY-MM-DD)\n" +
                "apod <n>                    n random pictures\n" +
                "apod <start> <end>          date range\n" +
                "apod help                   this help"
            )
            return
        }

        if (args.length === 0) {
            const apod = await nasa.apod.today()
            addOutput(
                `Title: ${apod.title}\n` +
                `Date: ${apod.date}\n` +
                `Copyright: ${apod.copyright ?? "Public"}\n` +
                `Media Type: ${apod.media_type}\n` +
                `URL: ${apod.url}\n` +
                `${apod.explanation}`
            )
            return
        }

        if (args.length === 1) {
            const a0 = args[0]!
            if (/^\d+$/.test(a0)) {
                const results = await nasa.apod.getRandom(Number(a0))
                for (const ap of results) {
                    addOutput(
                        `Title: ${ap.title}\n` +
                        `Date: ${ap.date}\n` +
                        `Copyright: ${ap.copyright ?? "Public"}\n` +
                        `Media Type: ${ap.media_type}\n` +
                        `URL: ${ap.url}\n` +
                        `${ap.explanation}`
                    )
                }
            } else {
                const apod = await nasa.apod.byDate(a0)
                addOutput(
                    `Title: ${apod.title}\n` +
                    `Date: ${apod.date}\n` +
                    `Copyright: ${apod.copyright ?? "Public"}\n` +
                    `Media Type: ${apod.media_type}\n` +
                    `URL: ${apod.url}\n` +
                    `${apod.explanation}`
                )
            }
            return
        }

        if (args.length === 2) {
            const [a0, a1] = [args[0]!, args[1]!]
            const results = await nasa.apod.getRange(a0, a1)
            for (const ap of results) {
                addOutput(
                    `Title: ${ap.title}\n` +
                    `Date: ${ap.date}\n` +
                    `Copyright: ${ap.copyright ?? "Public"}\n` +
                    `Media Type: ${ap.media_type}\n` +
                    `URL: ${ap.url}\n` +
                    `${ap.explanation}`
                )
            }
        }
    } catch (err) {
        if (err instanceof RateLimitError) {
            addOutput(`Rate limited — retry after ${err.retryAfter}s`, "#FF0000")
        } else if (err instanceof NasaApiError) {
            addOutput(`API error ${err.status}: ${err.message}`, "#FF0000")
        } else {
            addOutput(`Error: ${(err as Error).message}`, "#FF0000")
        }
    }
}

async function neo(args: string[]) {
    try {
        if (args[0] === "help" || args.length === 0) {
            addOutput(
                "neo feed <start> <end>       asteroid feed for date range\n" +
                "neo lookup <id>              asteroid details\n" +
                "neo browse [page]            browse asteroid catalog\n" +
                "neo help                     this help"
            )
            return
        }

        if (args[0] === "feed" && args[1] && args[2]) {
            const result = await nasa.neo.feed({ start_date: args[1], end_date: args[2] })
            addOutput(`Near-Earth Objects: ${result.element_count} found`)
            for (const [date, objects] of Object.entries(result.near_earth_objects)) {
                for (const n of objects) {
                    const dia = n.estimated_diameter.kilometers
                    const approach = n.close_approach_data[0]
                    addOutput(
                        `Date: ${date}\n` +
                        `ID: ${n.id}\n` +
                        `Name: ${n.name}\n` +
                        `Hazardous: ${n.is_potentially_hazardous_asteroid}\n` +
                        `Diameter: ${dia.estimated_diameter_min.toFixed(3)}–${dia.estimated_diameter_max.toFixed(3)} km\n` +
                        (approach
                            ? `Close Approach: ${approach.close_approach_date}, ` +
                              `${approach.relative_velocity.kilometers_per_second} km/s, ` +
                              `miss ${approach.miss_distance.kilometers} km`
                            : "")
                    )
                }
            }
            return
        }

        if (args[0] === "lookup" && args[1]) {
            const result = await nasa.neo.lookup(args[1])
            const dia = result.estimated_diameter.kilometers
            const approach = result.close_approach_data[0]
            addOutput(
                `ID: ${result.id}\n` +
                `Name: ${result.name}\n` +
                `URL: ${result.nasa_jpl_url}\n` +
                `Hazardous: ${result.is_potentially_hazardous_asteroid}\n` +
                `Diameter: ${dia.estimated_diameter_min.toFixed(3)}–${dia.estimated_diameter_max.toFixed(3)} km\n` +
                `Magnitude: ${result.absolute_magnitude_h}\n` +
                (approach
                    ? `Close Approach: ${approach.close_approach_date}, ` +
                      `${approach.relative_velocity.kilometers_per_second} km/s\n` +
                      `Orbiting: ${approach.orbiting_body}`
                    : "")
            )
            if (result.orbital_data) {
                addOutput(
                    `Orbit Class: ${result.orbital_data.orbit_class.orbit_class_type}\n` +
                    `Eccentricity: ${result.orbital_data.eccentricity}\n` +
                    `Inclination: ${result.orbital_data.inclination}°\n` +
                    `Period: ${result.orbital_data.orbital_period} days`
                )
            }
            return
        }

        if (args[0] === "browse") {
            const page = args[1] ? Number(args[1]) : 1
            const result = await nasa.neo.browse(page)
            addOutput(
                `Page ${result.page.number} of ${result.page.total_pages} ` +
                `(${result.page.total_elements} total)`
            )
            for (const n of result.near_earth_objects) {
                const dia = n.estimated_diameter.kilometers
                addOutput(
                    `ID: ${n.id}  Name: ${n.name}\n` +
                    `Hazardous: ${n.is_potentially_hazardous_asteroid}\n` +
                    `Diameter: ${dia.estimated_diameter_min.toFixed(3)}–${dia.estimated_diameter_max.toFixed(3)} km`
                )
            }
            return
        }
    } catch (err) {
        if (err instanceof RateLimitError) {
            addOutput(`Rate limited — retry after ${err.retryAfter}s`, "#FF0000")
        } else if (err instanceof NasaApiError) {
            addOutput(`API error ${err.status}: ${err.message}`, "#FF0000")
        } else {
            addOutput(`Error: ${(err as Error).message}`, "#FF0000")
        }
    }
}

async function epic(args: string[]) {
    try {
        if (args[0] === "help") {
            addOutput(
                "epic                          latest natural images\n" +
                "epic enhanced                 latest enhanced images\n" +
                "epic <type> <date>            images by date (YYYY-MM-DD)\n" +
                "epic dates [type]             available dates\n" +
                "epic help                     this help"
            )
            return
        }

        if (args[0] === "dates") {
            const type = (args[1] as "natural" | "enhanced") ?? "natural"
            const dates = await nasa.epic.getAvailableDates(type)
            addOutput(dates.map(d => d.date).join("\n"))
            return
        }

        if (args[0] && args[1] && /^\d{4}-\d{2}-\d{2}$/.test(args[1])) {
            const type = (args[0] === "enhanced" ? "enhanced" : "natural") as "natural" | "enhanced"
            const images = await nasa.epic.getByDate(type, args[1])
            for (const img of images) {
                const url = nasa.epic.imageUrl(type, args[1], img.image)
                addOutput(
                    `ID: ${img.identifier}\n` +
                    `Date: ${img.date}\n` +
                    `Caption: ${img.caption}\n` +
                    `Coordinates: ${img.centroid_coordinates.lat.toFixed(2)}°, ${img.centroid_coordinates.lon.toFixed(2)}°\n` +
                    `Image URL: ${url}`
                )
            }
            return
        }

        const type = (args[0] === "enhanced" ? "enhanced" : "natural") as "natural" | "enhanced"
        const images = await nasa.epic.getLatest(type)
        for (const img of images.slice(0, 10)) {
            const datePart = img.date.split(" ")[0] ?? img.date
            const url = nasa.epic.imageUrl(type, datePart, img.image)
            addOutput(
                `ID: ${img.identifier}\n` +
                `Date: ${img.date}\n` +
                `Caption: ${img.caption}\n` +
                `Coordinates: ${img.centroid_coordinates.lat.toFixed(2)}°, ${img.centroid_coordinates.lon.toFixed(2)}°\n` +
                `Image URL: ${url}`
            )
        }
    } catch (err) {
        if (err instanceof RateLimitError) {
            addOutput(`Rate limited — retry after ${err.retryAfter}s`, "#FF0000")
        } else if (err instanceof NasaApiError) {
            addOutput(`API error ${err.status}: ${err.message}`, "#FF0000")
        } else {
            addOutput(`Error: ${(err as Error).message}`, "#FF0000")
        }
    }
}

async function donki(args: string[]) {
    try {
        if (args[0] === "help" || args.length === 0) {
            addOutput(
                "donki cme [start] [end]             coronal mass ejections\n" +
                "donki flares [start] [end]          solar flares\n" +
                "donki storms [start] [end]          geomagnetic storms\n" +
                "donki sep [start] [end]             solar energetic particles\n" +
                "donki notifications [start] [end] [type]  space weather notifications\n" +
                "donki help                          this help"
            )
            return
        }

        const startDate = args[1]
        const endDate = args[2]
        const range = startDate ? { startDate, endDate } : undefined

        switch (args[0]) {
            case "cme": {
                const events = await nasa.donki.cme(range)
                for (const e of events) {
                    const analysis = e.cmeAnalyses[0]
                    addOutput(
                        `ID: ${e.activityID}\n` +
                        `Start: ${e.startTime}\n` +
                        `Location: ${e.sourceLocation}\n` +
                        (analysis ? `Speed: ${analysis.speed} km/s\n` : "") +
                        (analysis ? `Type: ${analysis.type}` : "")
                    )
                }
                break
            }
            case "flares": {
                const events = await nasa.donki.solarFlares(range)
                for (const f of events) {
                    addOutput(
                        `ID: ${f.flrID}\n` +
                        `Begin: ${f.beginTime}\n` +
                        `Peak: ${f.peakTime}\n` +
                        `Class: ${f.classType}\n` +
                        `Location: ${f.sourceLocation}`
                    )
                }
                break
            }
            case "storms": {
                const events = await nasa.donki.geomagneticStorms(range)
                for (const s of events) {
                    const kp = s.allKpIndex[0]
                    addOutput(
                        `ID: ${s.gstID}\n` +
                        `Start: ${s.startTime}\n` +
                        (kp ? `Kp Index: ${kp.kpIndex} (${kp.observedTime})` : "")
                    )
                }
                break
            }
            case "sep": {
                const events = await nasa.donki.solarEnergeticParticles(range)
                for (const p of events) {
                    addOutput(
                        `ID: ${p.sepID}\n` +
                        `Time: ${p.eventTime}\n` +
                        `Instruments: ${p.instruments.map(i => i.displayName).join(", ")}`
                    )
                }
                break
            }
            case "notifications": {
                const type = args[3] as any
                const events = await nasa.donki.notifications({ startDate, endDate, type })
                for (const n of events) {
                    addOutput(
                        `Type: ${n.messageType}\n` +
                        `Time: ${n.messageIssueTime}\n` +
                        `Body: ${n.messageBody.slice(0, 200)}${n.messageBody.length > 200 ? "..." : ""}`
                    )
                }
                break
            }
        }
    } catch (err) {
        if (err instanceof RateLimitError) {
            addOutput(`Rate limited — retry after ${err.retryAfter}s`, "#FF0000")
        } else if (err instanceof NasaApiError) {
            addOutput(`API error ${err.status}: ${err.message}`, "#FF0000")
        } else {
            addOutput(`Error: ${(err as Error).message}`, "#FF0000")
        }
    }
}

async function eonet(args: string[]) {
    try {
        if (args[0] === "help" || args.length === 0) {
            addOutput(
                "eonet events [limit] [status] [category]  natural events\n" +
                "eonet categories                          event categories\n" +
                "eonet help                                this help"
            )
            return
        }

        if (args[0] === "events") {
            const result = await nasa.eonet.events({
                limit: args[1] ? Number(args[1]) : 10,
                status: args[2] as "open" | "closed" | "all" | undefined,
                category: args[3] as string | number | undefined,
            })
            for (const e of result.events) {
                addOutput(
                    `ID: ${e.id}\n` +
                    `Title: ${e.title}\n` +
                    `Categories: ${e.categories.map(c => c.title).join(", ")}\n` +
                    `Sources: ${e.sources.map(s => s.id).join(", ")}\n` +
                    `Status: ${e.closed ? "closed" : "open"}`
                )
            }
            return
        }

        if (args[0] === "categories") {
            const result = await nasa.eonet.categories()
            for (const c of result.categories) {
                addOutput(
                    `ID: ${c.id}  Title: ${c.title}\n` +
                    `${c.description}`
                )
            }
        }
    } catch (err) {
        if (err instanceof RateLimitError) {
            addOutput(`Rate limited — retry after ${err.retryAfter}s`, "#FF0000")
        } else if (err instanceof NasaApiError) {
            addOutput(`API error ${err.status}: ${err.message}`, "#FF0000")
        } else {
            addOutput(`Error: ${(err as Error).message}`, "#FF0000")
        }
    }
}

async function techtransfer(args: string[]) {
    try {
        if (args[0] === "help" || args.length < 2) {
            addOutput(
                "techtransfer patent <query>      search NASA patents\n" +
                "techtransfer software <query>    search NASA software\n" +
                "techtransfer spinoff <query>     search NASA spinoffs\n" +
                "techtransfer help                this help"
            )
            return
        }

        const query = args.slice(1).join(" ")

        switch (args[0]) {
            case "patent": {
                const result = await nasa.techtransfer.patent(query)
                addOutput(`Found ${result.count} results (${result.total} total)`)
                for (const p of result.results) {
                    addOutput(
                        `Title: ${p.title}\n` +
                        `Patent: ${p.patentNumber}\n` +
                        `Status: ${p.status}\n` +
                        `Abstract: ${p.abstract.slice(0, 200)}${p.abstract.length > 200 ? "..." : ""}`
                    )
                }
                break
            }
            case "software": {
                const result = await nasa.techtransfer.software(query)
                addOutput(`Found ${result.count} results (${result.total} total)`)
                for (const s of result.results) {
                    addOutput(
                        `Title: ${s.title}\n` +
                        `Software: ${s.softwareNumber}\n` +
                        `Abstract: ${s.abstract.slice(0, 200)}${s.abstract.length > 200 ? "..." : ""}`
                    )
                }
                break
            }
            case "spinoff": {
                const result = await nasa.techtransfer.spinoff(query)
                addOutput(`Found ${result.count} results (${result.total} total)`)
                for (const s of result.results) {
                    addOutput(
                        `Title: ${s.title}\n` +
                        `Abstract: ${s.abstract.slice(0, 200)}${s.abstract.length > 200 ? "..." : ""}`
                    )
                }
                break
            }
        }
    } catch (err) {
        if (err instanceof RateLimitError) {
            addOutput(`Rate limited — retry after ${err.retryAfter}s`, "#FF0000")
        } else if (err instanceof NasaApiError) {
            addOutput(`API error ${err.status}: ${err.message}`, "#FF0000")
        } else {
            addOutput(`Error: ${(err as Error).message}`, "#FF0000")
        }
    }
}

async function imagery(args: string[]) {
    try {
        if (args[0] === "help" || args.length < 2) {
            addOutput(
                "imagery search <query> [page_size]    search image library\n" +
                "imagery asset <nasa_id>               get asset details\n" +
                "imagery metadata <nasa_id>            get metadata\n" +
                "imagery help                          this help"
            )
            return
        }

        if (args[0] === "search") {
            const query = args.slice(1).join(" ")
            const result = await nasa.imagery.search({
                q: query,
                page_size: 10,
            })
            const total = result.collection.metadata.total_hits
            addOutput(`Found ${total} results for "${query}"`)
            for (const item of result.collection.items) {
                const d = item.data[0]
                addOutput(
                    `Title: ${d?.title ?? "Untitled"}\n` +
                    `ID: ${d?.nasa_id ?? ""}\n` +
                    `Date: ${d?.date_created ?? ""}\n` +
                    `Media: ${d?.media_type ?? ""}\n` +
                    `Description: ${(d?.description ?? "").slice(0, 200)}` +
                    ((d?.description ?? "").length > 200 ? "..." : "")
                )
            }
            return
        }

        if (args[0] === "asset" && args[1]) {
            const result = await nasa.imagery.asset(args[1])
            addOutput(`Asset: ${args[1]}`)
            for (const item of result.collection.items) {
                addOutput(`  ${item.href}`)
            }
            return
        }

        if (args[0] === "metadata" && args[1]) {
            const result = await nasa.imagery.metadata(args[1])
            addOutput(`Metadata location: ${result.location}`)
        }
    } catch (err) {
        if (err instanceof RateLimitError) {
            addOutput(`Rate limited — retry after ${err.retryAfter}s`, "#FF0000")
        } else if (err instanceof NasaApiError) {
            addOutput(`API error ${err.status}: ${err.message}`, "#FF0000")
        } else {
            addOutput(`Error: ${(err as Error).message}`, "#FF0000")
        }
    }
}

async function terraOrbit(input: string) {
    const [command, ...args] = input.split(/\s+/);
    switch (command) {
        case "apod":
            return apod(args);
        case "neo":
            return neo(args);
        case "epic":
            return epic(args);
        case "donki":
            return donki(args);
        case "eonet":
            return eonet(args);
        case "techtransfer":
            return techtransfer(args);
        case "imagery":
            return imagery(args);
        case "help":
            addOutput(
                "apod                        today's picture\n" +
                "apod <date>                 picture by date (YYYY-MM-DD)\n" +
                "apod <n>                    n random pictures\n" +
                "apod <start> <end>          date range\n" +
                "apod help                   this help\n" +
                "\n" +
                "neo feed <start> <end>       asteroid feed for date range\n" +
                "neo lookup <id>              asteroid details\n" +
                "neo browse [page]            browse asteroid catalog\n" +
                "neo help                     this help\n" +
                "\n" +
                "epic                          latest natural images\n" +
                "epic enhanced                 latest enhanced images\n" +
                "epic <type> <date>            images by date (YYYY-MM-DD)\n" +
                "epic dates [type]             available dates\n" +
                "epic help                     this help\n" +
                "\n" +
                "donki cme [start] [end]             coronal mass ejections\n" +
                "donki flares [start] [end]          solar flares\n" +
                "donki storms [start] [end]          geomagnetic storms\n" +
                "donki sep [start] [end]             solar energetic particles\n" +
                "donki notifications [start] [end] [type]  space weather notifications\n" +
                "donki help                          this help\n" +
                "\n" +
                "eonet events [limit] [status] [category]  natural events\n" +
                "eonet categories                          event categories\n" +
                "eonet help                                this help\n" +
                "\n" +
                "techtransfer patent <query>      search NASA patents\n" +
                "techtransfer software <query>    search NASA software\n" +
                "techtransfer spinoff <query>     search NASA spinoffs\n" +
                "techtransfer help                this help\n" +
                "\n" +
                "imagery search <query> [page_size]    search image library\n" +
                "imagery asset <nasa_id>               get asset details\n" +
                "imagery metadata <nasa_id>            get metadata\n" +
                "imagery help                          this help\n" +
                "\n" +
                "help                                this help"
            );
            return;
        default:
            addOutput(`Unknown command: ${command}. Available: apod, neo, epic, donki, eonet, techtransfer, imagery`, "#FF0000");
    }
}

textInput.on(InputRenderableEvents.CHANGE, (value) => {
    inputBuffer = value;
    const cmd = inputBuffer.trim();
    inputBuffer = "";
    terraOrbit(cmd);
});

renderer.root.add(containerBox);
textInput.focus();
