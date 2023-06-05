const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
var corsOptions = {
    origin: "*"
}
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.json());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud"
})
app.get('/', (req, res) => {
    const stmt = "select * from crud_contact";
    db.execute(stmt, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    })
})

app.get("/:id", (req, res) => {
    const { id } = req.params
    const stmt = "select * from crud_contact WHERE id=?";
    db.execute(stmt, [id], (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    })
})

app.post('/', (req, res) => {
    const data = req.body;
    const stmt = "INSERT INTO crud_contact(name, email, contact) VALUES (?, ?, ?)";
    const { name, email, contact } = data;
    db.execute(stmt, [name, email, contact], (err, result) => {
        if (err) {
            res.json({ err, status: 'error' });
        } else {
            res.json({ result, status: 'ok' });
        }
    })
});

app.delete("/", (req, res) => {
    const items = req.body;

    const idsString = items.join(",");
    const stmt = `DELETE FROM crud_contact WHERE id in (${idsString})`;
    db.execute(stmt, (err, result) => {
        if (err) {
            res.json({ err, status: 'error' });
        } else {
            res.json({ result, status: 'ok' });
        }
    })
})

app.patch("/:id", (req, res) => {
    const data = req.body;
    const stmt = "Update crud_contact SET name=?, email=?, contact=? WHERE id=?";
    const { name, email, contact } = data;
    const { id } = req.params;
    db.execute(stmt, [name, email, contact, id], (err, result) => {
        if (err) {
            res.json({ err, status: 'error' });
        } else {
            res.json({ result, status: 'ok' });
        }
    })
})

app.listen(8081, () => {
    console.log("listening on port 8081");
})