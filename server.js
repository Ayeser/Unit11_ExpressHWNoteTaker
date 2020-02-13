const express = require("express");
const path = require("path");
const fs = require("fs");

//loads up the notes
var notes = [];
function getCurrentNotes() {
    fs.readFile('./db/db.json', (err, response) => {
        notes = JSON.parse(response);
    })
}
getCurrentNotes();

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    fs.readFile('./db/db.json', (err, response) => {
        return res.json(JSON.parse(response));
    })
});

function updateNotes() {
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
        if (err) throw err;
    })
};

app.post("/api/notes", function(req, res) {
    var newNote = req.body;
    notes.push(newNote);
    updateNotes();
    console.log(newNote);
    res.send("Note added!");
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
})