const express = require("express");
const router = express.Router();
const fetch = require("node-fetch").default;

const { generateHTML } = require("./template");

router.get("/I/want/title", (req, res) => {
	const addresses = req.query.address;

	if (!addresses) {
		res.status(400).send("No addresses provided");
		return;
	}

	const addressList = Array.isArray(addresses) ? addresses : [addresses];
	const promises = addressList.map((address) => {
		const fullAddress = address.startsWith("http")
			? address
			: `http://${address}`;
		return fetch(fullAddress)
			.then((response) => response.text())
			.then((body) => {
				const titleMatch = body.match(/<title>(.*?)<\/title>/i);
				const title = titleMatch ? titleMatch[1] : "No Title Found";
				return { address, title };
			})
			.catch(() => ({ address, title: "Nod Response" }));
	});

	Promise.all(promises)
		.then((results) => {
			res.status(200).send(generateHTML(results));
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Internal Server Error");
		});
});

module.exports = router;
