import { render } from "@opentui/solid"
import { App } from "./tui/app"

render(() => <App />, {
  exitOnCtrlC: true,
  targetFps: 60,
})
