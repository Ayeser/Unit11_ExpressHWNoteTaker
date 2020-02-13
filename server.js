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

app.delete("/api/notes/:note", function(req, res) {
    var chosen = req.params.note;
    console.log(chosen);
    for (var i=0;i<notes.length; i++) {
        if (chosen === notes[i].title.replace(/\s+/g, "").toLowerCase()) {
            notes[i].id = 'erase';
            const index = notes.findIndex(x => x.id === 'erase');
            if (index !== -1) {
                notes.splice(index, 1);
            }
            console.log("Note successfully removed");
            updateNotes();
            return res.json(notes[i]);
        }
    }
    return res.json("Sorry this note could not be found");
})

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