import init from "./app";

init().then((app) => {
  console.log("development");
  app.listen(process.env.PORT);
});
