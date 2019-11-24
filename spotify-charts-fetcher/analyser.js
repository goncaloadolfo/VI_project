const tracks = require('./spotify-charts.json')

let res = {
    'count': 0,
    'Danceability': 0,
    'Energy': 0,
    'Key': 0,
    'Loudness': 0,
    'Mode': 0,
    'Speechiness': 0,
    'Acousticness': 0,
    'Instrumentalness': 0,
    'Liveness': 0,
    'Valence': 0,
    'Tempo': 0,
    'Duration ms': 0,
    'Time Signature': 0,
    Position: 0,
    'Track Name': 0,
    Artist: 0,
    Streams: 0,
    URL: 0,
    Date: 0,
    Id: 0,
    'Album Art URL': 0,
    Explicit: 0,
    'Preview URL': 0
}

tracks.forEach(element => {
    res.count++
    for (const key in element) {
        if (element.hasOwnProperty(key)) {
            res[key]++
        }
    }
    // if (element.Danceability) res.danceability++
    // if (element.Energy) res.energy++
    // if (element.Key) res.key++
    // if (element.Loudness) res.loudness++
    // if (element.Mode) res.mode++
    // if (element.Speechiness) res.speechiness++
    // if (element.Acousticness) res.acousticness++
    // if (element.Instrumentalness) res.instrumentalness++
    // if (element.Liveness) res.liveness++
    // if (element.Valence) res.valence++
    // if (element.Tempo) res.tempo++
    // if (element['Duration ms']) res.duration_ms++
    // if (element['Time Signature']) res.time_signature++
})

console.log(res)

// for (let i = 0; i < tracks.length; i++) {
//     const t = tracks[i]
//     if (!t.Instrumentalness && t.Instrumentalness !== 0) {
//         console.log(t)
//         break
//     }
// }