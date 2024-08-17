import init from "./app";
const port = process.env.PORT;
import http from "http";
import https from "https";
import fs from "fs";
init().then((app) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("development");
    const server = http.createServer(app);
    server.listen(port);
  } else {
    console.log("PRODUCTION");
    const options2 = {
      key: fs.readFileSync("../client-key.pem"),
      cert: fs.readFileSync("../client-cert.pem"),
    };
    const server = https.createServer(options2, app);
    server.listen(process.env.HTTPS_PORT);
  }
});
