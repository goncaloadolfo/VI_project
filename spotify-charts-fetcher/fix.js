const fetch = require('node-fetch')
const fs = require('fs')

const toFix = require('./spotify-charts1.json')
const TOKEN = 'BQA77U47T84QJxSl4Y_PfczHoUp_TN3LLkS4BdZKCkhJ_9rz9TwuTTsVybOnVxo3KvLz9Igx7d2OML_X5_vMEYxcYq1XdBBf1aoyl6KhW3KDqCpb-aeOdy2SeeqtiWRc-RcocuyjKxx8K570ZuSFCJWFezcPojr_Slxjk-_n47_y7CDyoM23NFoCeZlbd9lq7uPppL2tvOE25SAU-qmyB3PHq8PhLdtjychMXg'

let e = 0

Promise.all(toFix.map(fix)).then(
    tracks => {
        console.log(tracks.length)
        writeJSONToFile(toFix)
    },
    err => console.log(err)
)

function writeJSONToFile(object) {
    let json = JSON.stringify(object)
    console.log('Writing to file...')
    fs.writeFileSync('spotify-charts.json', json)
}

async function fix(t) {
    if (t['Album Art URL'] === undefined || t['Explicit'] === undefined || t['Preview URL'] === undefined) {
        try {
            t = await getTrackInfo(t)
        } catch (err) {
            console.log(err)
            return await fix(t)
        }
    }
    if (t['Duration ms'] === undefined || t['Key'] === undefined || t['Mode'] === undefined ||
        t['Time Signature'] === undefined || t['Acousticness'] === undefined || t['Danceability'] === undefined ||
        t['Energy'] === undefined || t['Instrumentalness'] === undefined || t['Liveness'] === undefined ||
        t['Loudness'] === undefined || t['Speechiness'] === undefined || t['Valence'] === undefined ||
        t['Tempo'] === undefined
    ) {
        try {
            t = await getTrackFeatures(t)
        } catch (err) {
            console.log(err)
            return await fix(t)
        }
    }
    return t
}

async function getTrackInfo(t) {
    let tracks_json = await fetch(`https://api.spotify.com/v1/tracks/${t.Id}`, { headers: { Authorization: `Bearer ${TOKEN}` } })
        .then(res => res.json())
    // console.log(tracks_json)
    t['Album Art URL'] = tracks_json.album.images[0].url
    t['Explicit'] = tracks_json.explicit
    t['Preview URL'] = tracks_json.preview_url
    return t
}

async function getTrackFeatures(t) {
    let features_json = await fetch(`https://api.spotify.com/v1/audio-features/${t.Id}`, { headers: { Authorization: `Bearer ${TOKEN}` } })
        .then(res => res.json())
    // console.log(features_json)
    t['Duration ms'] = features_json.duration_ms
    t['Key'] = features_json.key
    t['Mode'] = features_json.mode
    t['Time Signature'] = features_json.time_signature
    t['Acousticness'] = features_json.acousticness
    t['Danceability'] = features_json.danceability
    t['Energy'] = features_json.energy
    t['Instrumentalness'] = features_json.instrumentalness
    t['Liveness'] = features_json.liveness
    t['Loudness'] = features_json.loudness
    t['Speechiness'] = features_json.speechiness
    t['Valence'] = features_json.valence
    t['Tempo'] = features_json.tempo
    return t
}