const fetch = require('node-fetch')
const parse = require('csv-parse/lib/sync')
const fs = require('fs')

Date.prototype.subDays = function (days) {
    let date = new Date(this.valueOf())
    date.setDate(date.getDate() - days)
    return date
}

const REGION = 'global'
const TOKEN = 'BQBXDpzMkbLwqjh_v_c0U_ZFiRknJPJeJ8UyBgQlGcsrUYsrk0NMxCRdeqln7EzcwApSI3dvUXqV57ek5UPOWaUB5CZJXLnVswlQEi6V91ysbm14d_hOB9WgNjQaSLX74r60ec1oeGFlSzYTMI0Hlz90_Ez5pf1f9_YI1oHly9AzK80tgIvE8vhFDJUdthb_iSoEC076-XyE8G5RvhlkO27LJY7xAVKjlIo77g'

let requests_counter = 0

processLastNDays(22)

async function processLastNDays(nDays) {
    let today = new Date('2019-12-16')
    let entries = []

    for (let i = 1; i <= nDays; i++) {
        let date = today.subDays(i)
        let formattedDate = `${date.getFullYear()}-${getTwoDigits(date.getMonth() + 1)}-${getTwoDigits(date.getDate())}`
        console.log(`Processing Day ${i}... ${date.getFullYear()}-${getTwoDigits(date.getMonth() + 1)}-${getTwoDigits(date.getDate())}`)
        let csv = await fetchChart(formattedDate)
        entries = entries.concat(processCsv(csv, formattedDate))
    }

    await getSpotifyAPIInfo(entries)

    console.log('Writing to file...')
    writeJSONToFile(entries)

    function getTwoDigits(number) {
        return number < 10 ? `0${number}` : `${number}`
    }

    async function fetchChart(date) {
        let url = `https://spotifycharts.com/regional/${REGION}/daily/${date}/download`
        // console.log(url)
        let res = await fetch(url)
        res = await res.text()
        // console.log(res)
        return res
    }

    function processCsv(csv, date) {
        let output = parse(csv, { columns: ['Position', 'Track Name', 'Artist', 'Streams', 'URL'] })
        output.splice(0, 2)
        output.forEach(t => {
            t.Date = date
            let urlSplit = t.URL.split('/')
            t.Id = urlSplit[urlSplit.length - 1]
            return t
        })
        return output
    }

    async function getSpotifyAPIInfo(tracks) {
        let features_cache = {}
        let tracks_cache = {}

        for (let i = 0; i < tracks.length; i++) {
            const t = tracks[i]
            await getTrackInfo(t)
        }
        
        async function getTrackInfo(t) {
            let features_info
            let tracks_info
            if (features_cache[t.Id]) {
                features_info = features_cache[t.Id]
                tracks_info = tracks_cache[t.Id]
            } else {
                try {
                    console.log(++requests_counter)
                    let features_json = await fetch(`https://api.spotify.com/v1/audio-features/${t.Id}`, { headers: { Authorization: `Bearer ${TOKEN}` } })
                        .then(res => res.json())
                    let tracks_json = await fetch(`https://api.spotify.com/v1/tracks/${t.Id}`, { headers: { Authorization: `Bearer ${TOKEN}` } })
                        .then(res => res.json())
                    features_info = {
                        'Duration ms': features_json.duration_ms,
                        'Key': features_json.key,
                        'Mode': features_json.mode,
                        'Time Signature': features_json.time_signature,
                        'Acousticness': features_json.acousticness,
                        'Danceability': features_json.danceability,
                        'Energy': features_json.energy,
                        'Instrumentalness': features_json.instrumentalness,
                        'Liveness': features_json.liveness,
                        'Loudness': features_json.loudness,
                        'Speechiness': features_json.speechiness,
                        'Valence': features_json.valence,
                        'Tempo':features_json.tempo 
                    }
                    tracks_info = {
                        'Album Art URL': tracks_json.album.images[0].url,
                        'Explicit': tracks_json.explicit,
                        // 'Popularity': tracks_json.popularity,
                        'Preview URL': tracks_json.preview_url,
                    }
                    features_cache[t.Id] = features_info
                    tracks_cache[t.Id] = tracks_info
                } catch (err) {
                    console.error(`Error on track: ${t['Track Name']}`)
                    setTimeout(() => getTrackInfo(t), 5000)
                }
            }
            for (const key in features_info) {
                if (features_info.hasOwnProperty(key))
                    t[key] = features_info[key]
            }
            for (const key in tracks_info) {
                if (tracks_info.hasOwnProperty(key))
                    t[key] = tracks_info[key]
            }
        }
    }

    function writeJSONToFile(object) {
        let json = JSON.stringify(object)
        fs.writeFileSync('spotify-charts.json', json)
    }
}