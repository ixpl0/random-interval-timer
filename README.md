# ⏰random-interval-timer

<img src="./readme/1.png" alt="Screenshot1" width="297" height="157" />
<img src="./readme/2.png" alt="Screenshot2" width="297" height="157" />
<img src="./readme/3.png" alt="Screenshot3" width="297" height="157" />
<img src="./readme/4.png" alt="Screenshot4" width="297" height="157" />

Random interval timer with a beep sound, ranging from a minimum of **1 second** to a maximum of **99 hours, 59 minutes, and 59 seconds**

Created almost entirely by AI, so I take no responsibility for the code quality 🐸

## How to run
Once before running the app, you need to install the dependencies and build the project. After that, you can run the app without building it again.
```bash
npm i              # install dependencies
npm run build      # build the project
```

After the build is complete, you can run the app.
```bash
npm start          # start the app after building
```

You may also start the app in development mode by running the Vite server and Electron separately.
```bash
npm run dev:vite   # start Vite server with React app
npm run dev        # launch Electron in another terminal to serve the React app
```

To pack the app and get an .exe file, you can use the following command. The output will be in the `dist` folder.
```bash
npm run pack       # pack the app into an executable
```
