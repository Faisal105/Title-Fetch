const express = require("express");
const app = express();
const route = require("./route");

app.use("/", route);

const port = 3000;
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
