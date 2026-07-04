import { createContext, createSignal, useContext, type ParentProps } from "solid-js"

type InputContext = {
  onSubmit: (value: string) => void
  getValue: () => string
  setValue: (val: string) => void
  clear: () => void
}

const ctx = createContext<InputContext>()

export function InputProvider(props: ParentProps & { onSubmit: (value: string) => void }) {
  const [value, setValue] = createSignal("")

  const inputCtx: InputContext = {
    onSubmit: props.onSubmit,
    getValue: value,
    setValue,
    clear: () => setValue(""),
  }

  return <ctx.Provider value={inputCtx}>{props.children}</ctx.Provider>
}

export function useInput() {
  const value = useContext(ctx)
  if (!value) throw new Error("useInput must be used within InputProvider")
  return value
}
