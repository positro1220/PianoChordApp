

const keys = document.querySelectorAll(".key");
const resultElement = document.getElementById("chord-result");
const notes = [
    "C", "C#", "D", "D#", "E", "F",
    "F#", "G", "G#", "A", "A#", "B"
];

const chordPatterns = {
    major: {
        label: "",
        intervals: [0, 4, 7]
    },
    minor: {
        label: "m",
        intervals: [0, 3, 7]
    },
    major7: {
        label: "maj7",
        intervals: [0, 4, 7, 11]
    },
    minor7: {
        label: "m7",
        intervals: [0, 3, 7, 10]
    },
    dominant7: {
        label: "7",
        intervals: [0, 4, 7, 10]
    }
};

function makeChord(root, type) {
    const rootIndex = notes.indexOf(root);
    const chordNotes = [];
    const pattern = chordPatterns[type].intervals;

    pattern.forEach(function(interval) {
        chordNotes.push(notes[(rootIndex + interval) % 12]);
    });

    return chordNotes;
}

keys.forEach(function(key) {
    key.addEventListener("click", function(event) {
        event.stopPropagation();

        key.classList.toggle("selected");

        const selectedKeys = document.querySelectorAll(".key.selected");

const selectedNotes = [];
const selectedPitches = [];


selectedKeys.forEach(function(selectedKey) {
    const note = selectedKey.dataset.note;
    const octave = Number(selectedKey.dataset.octave);
    const noteIndex = notes.indexOf(note);

    selectedNotes.push(note);
    selectedPitches.push(octave * 12 + noteIndex);
});

const uniqueNotes = [...new Set(selectedNotes)];

        console.log(selectedNotes);

           resultElement.textContent = "該当するコードなし";

            const exactMatches = [];

            chords.forEach(function(chord) {
                const allNotesMatch = chord.notes.every(function(note) {
                return uniqueNotes.includes(note);
                });

             const sameLength = uniqueNotes.length === chord.notes.length;

                  if (allNotesMatch && sameLength) {
                   exactMatches.push(chord);
                  }


            });

       const omittedMatches = [];

if (exactMatches.length === 0) {
    chords.forEach(function(chord) {

        // 4音コードだけを対象にする
        if (chord.intervals.length !== 4) {
            return;
        }

        const fifthIndex = (notes.indexOf(chord.root) + 7) % 12;
        const fifthNote = notes[fifthIndex];

        const omittedNotes = chord.notes.filter(function(note) {
            return note !== fifthNote;
        });

        const allNotesMatch = omittedNotes.every(function(note) {
            return uniqueNotes.includes(note);
        });

        const sameLength = uniqueNotes.length === omittedNotes.length;

        if (allNotesMatch && sameLength) {
            omittedMatches.push(chord);
        }
    });
} 


function formatChord(chord) {
    const lowestPitch = Math.min(...selectedPitches);
    const lowestNote = notes[lowestPitch % 12];

    if (chord.root === lowestNote) {
        return chord.name;
    } else {
        return chord.name + "/" + lowestNote;
    }
}

if (exactMatches.length > 0) {
    resultElement.textContent = exactMatches.map(formatChord).join(", ");
} else if (omittedMatches.length > 0) {
    resultElement.textContent =
        omittedMatches.map(formatChord).join(", ") + "（5度省略候補）";
} else {
    resultElement.textContent = "該当するコードなし";
}


    });
});



const chords = [];
const types = Object.keys(chordPatterns);

notes.forEach(function(note) {
    types.forEach(function(type) {
        chords.push({
           name: note + chordPatterns[type].label,
           root: note,
           notes: makeChord(note, type),
           intervals: chordPatterns[type].intervals
        });
    });
});


const showChordButton = document.getElementById("show-chord");
const reverseRoot = document.getElementById("reverse-root");
const reverseType = document.getElementById("reverse-type");


showChordButton.addEventListener("click", function() {
    const root = reverseRoot.value;
    const type = reverseType.value;

    const chordNotes = makeChord(root, type);
    console.log("構成音:", chordNotes);

    // ルート音を4オクターブ目に配置
    const rootPitch = 4 * 12 + notes.indexOf(root);

    // コードの構成音までの音程
    const intervals = chordPatterns[type].intervals;

    // 鍵盤を1つずつ確認
    keys.forEach(function(key) {
        const note = key.dataset.note;
        const octave = Number(key.dataset.octave);

        const keyPitch = octave * 12 + notes.indexOf(note);

        // ルート音から何半音離れているか
        const distance = keyPitch - rootPitch;

        // 構成音なら光らせる
        const shouldSelect = intervals.includes(distance);

        key.classList.toggle("selected", shouldSelect);
    });

    // コード名も更新
    resultElement.textContent =
        root + chordPatterns[type].label;
});



