import { createCliRenderer, InputRenderable, TextRenderable, BoxRenderable, InputRenderableEvents } from "@opentui/core";

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

textInput.on(InputRenderableEvents.CHANGE, (value) => {
    const submittedDisplay = new TextRenderable(renderer, {
        content: `Submitted Value: ${value}`,
        fg: "#00FF00",
        marginTop: 1
    });

    containerBox.add(submittedDisplay);
    
});

renderer.root.add(containerBox);
textInput.focus();
