const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const loki = require("lokijs");

const PORT = 8282;
const expressApp = express();
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = new loki("db.json", {
    autoload: true,
    autosave: true,
    autosaveInterval: 4000
});

var entries = db.getCollection("fruits");
if (entries === null) {
    entries = db.addCollection("fruits");
}

class Server {
    constructor() {
        this.app = expressApp;
        this.app.use("/", express.static(path.join(__dirname, "public")));
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        // assign some endpoints
        this.assignEndpoints();
    }

    assignEndpoints() {
        // add fruits:
        this.app.post("/add-fruit", (req, res, next) => {
            const result = {
                FruitName: req.body.name,
                Quantity: req.body.quantity
            };
            db.getCollection("fruits").insert(result);
            res.send(result);
        });

        // get fruits:
        this.app.get("/get-fruits", (req, res, next) => {
            const result = db.getCollection("fruits").data;
            const addedUp = result.reduce((c, v) => {
                c[v.FruitName] = (c[v.FruitName] || 0) + v.Quantity;
                return c;
            }, {});
            res.send(addedUp);
        });

        // remove fruits:
        this.app.post("/remove-fruit", (req, res, next) => {
            const result = db
                .getCollection("fruits")
                .findAndRemove({ FruitName: req.body.name });
            const addedUp = db.getCollection("fruits").data.reduce((c, v) => {
                c[v.FruitName] = (c[v.FruitName] || 0) + v.Quantity;
                return c;
            }, {});
            // console.log(addedUp);
            res.send(addedUp);
        });
    }

    start() {
        this.app.listen(PORT, () =>
            console.log(`[Server is running on port ${PORT}]`)
        );
    }
}

const server = new Server();
server.start();
