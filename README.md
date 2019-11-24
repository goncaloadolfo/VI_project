# Visualization Proposal

G52

## 1. Domain

The visualization to be developed is inserted in the music field and focuses on the interpretation of musical trends in the year 2019, through the daily top data provided by Spotify API. The information to be interpreted may be relevant for artists to study "what people like to hear" (popularity) and for the general public who like to keep up with music trends throughout the year 2019.

## 2. Dataset

The dataset used in this project was gathered by us, using the csv files available at [Spotify Charts](https://spotifycharts.com) and making requests to the [Spotify API](https://developer.spotify.com/documentation/web-api/reference/tracks/) to obtain more information about the tracks. To retrieve the information, we used a small _JavaScript_ program, written by us, that allows us to select the dates from which we want the charts. Our dataset is not available online.

## 3. Example Questions

- How does the features (energy, loudness, tempo, etc) of the track affect its popularity?
- Are music trends affected by the song duration?
- Do artists care about explicitness? Does that affect streaming numbers?
- Which artists have had a good 2019? Which tracks were most played during a period?
- What's the evolution of the track's streaming numbers during a period?
- Which tracks lasted longer on the top? Why?
- Is there any correlation between the happiness / danceability of the most listened tracks with the time of year?

## 4. Data Sample

(from "spotify-charts.json")
```json
[
    {
        "Position": "1",
        "Track Name": "Señorita",
        "Artist": "Shawn Mendes",
        "Streams": "5325913",
        "URL": "https://open.spotify.com/track/6v3KW9xbzN5yKLt9YKDYA2",
        "Date": "2019-09-25",
        "Id": "6v3KW9xbzN5yKLt9YKDYA2",
        "Duration ms": 190800,
        "Key": 9,
        "Mode": 0,
        "Time Signature": 4,
        "Acousticness": 0.0392,
        "Danceability": 0.759,
        "Energy": 0.548,
        "Instrumentalness": 0,
        "Liveness": 0.0828,
        "Loudness": -6.049,
        "Speechiness": 0.029,
        "Valence": 0.749,
        "Tempo": 116.967,
        "Album Art URL": "https://i.scdn.co/image/93de84650354b3a8436a893332b436cf3bb000d0",
        "Explicit": false,
        "Popularity": 90,
        "Preview URL": "https://p.scdn.co/mp3-preview/2bb534db0407addc3b919265f9635a223fcf1a90?cid=7329cb28d47249b789d9c6c9cba8f7ec"
    },
    {
        "Position": "2",
        "Track Name": "Circles",
        "Artist": "Post Malone",
        "Streams": "4347811",
        "URL": "https://open.spotify.com/track/21jGcNKet2qwijlDFuPiPb",
        "Date": "2019-09-25",
        "Id": "21jGcNKet2qwijlDFuPiPb",
        "Duration ms": 215280,
        "Key": 0,
        "Mode": 1,
        "Time Signature": 4,
        "Acousticness": 0.192,
        "Danceability": 0.695,
        "Energy": 0.762,
        "Instrumentalness": 0.00244,
        "Liveness": 0.0863,
        "Loudness": -3.497,
        "Speechiness": 0.0395,
        "Valence": 0.553,
        "Tempo": 120.042,
        "Album Art URL": "https://i.scdn.co/image/94105e271865c28853bfb7b44b38353a2fea45d6",
        "Explicit": false,
        "Popularity": 92,
        "Preview URL": "https://p.scdn.co/mp3-preview/9cb3c8b7ccb399c2c5346ac424cc59be9fef3c98?cid=7329cb28d47249b789d9c6c9cba8f7ec"
    },
    ...
]
```
