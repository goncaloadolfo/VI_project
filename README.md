
# Visualization Proposal

G52

#### **1. Domain**

The visualization to be developed is inserted in the music field and focuses on the interpretation of musical trends in the year 2019, through the daily top data provided by Spotify API. The information to be interpreted may be relevant for artists to study &quot;what people like to hear&quot; (popularity) and for the general public who like to keep up with music trends throughout the year 2019.

#### **2. Dataset**

The dataset used in this project was gathered by us, using the csv files available at [Spotify Charts](https://spotifycharts.com) and making requests to the [Spotify API](https://developer.spotify.com/documentation/web-api/reference/tracks/) to obtain more information about the tracks. To retrieve the information, we used a small _JavaScript_ program, written by us, that allows us to select the dates from which we want the charts. Our dataset is not available online.

**3. Example Questions**

- **--** How does the features (energy, loudness, tempo, etc) of the track affect its popularity?
- **--** Are music trends affected by the song duration?
- **--** Do artists care about explicitness? Does that affect streaming numbers?
- **--** Which artists have had a good 2019? Which tracks were most played during a period?
- **--** What&#39;s the evolution of the track&#39;s streaming numbers during a period?
- **--** Which tracks lasted longer on the top? Why?
- **--** Is there any correlation between the happiness / danceability of the most listened tracks with the time of year?

**4. Data Sample**

(from &quot;spotify-charts.json&quot;)

[

    {

        &quot;Position&quot;: &quot;1&quot;,

        &quot;Track Name&quot;: &quot;Señorita&quot;,

        &quot;Artist&quot;: &quot;Shawn Mendes&quot;,

        &quot;Streams&quot;: &quot;5325913&quot;,

        &quot;URL&quot;: &quot;https://open.spotify.com/track/6v3KW9xbzN5yKLt9YKDYA2&quot;,

        &quot;Date&quot;: &quot;2019-09-25&quot;,

        &quot;Id&quot;: &quot;6v3KW9xbzN5yKLt9YKDYA2&quot;,

        &quot;Duration ms&quot;: 190800,

        &quot;Key&quot;: 9,

        &quot;Mode&quot;: 0,

        &quot;Time Signature&quot;: 4,

        &quot;Acousticness&quot;: 0.0392,

        &quot;Danceability&quot;: 0.759,

        &quot;Energy&quot;: 0.548,

        &quot;Instrumentalness&quot;: 0,

        &quot;Liveness&quot;: 0.0828,

        &quot;Loudness&quot;: -6.049,

        &quot;Speechiness&quot;: 0.029,

        &quot;Valence&quot;: 0.749,

        &quot;Tempo&quot;: 116.967,

        &quot;Album Art URL&quot;: &quot;https://i.scdn.co/image/93de84650354b3a8436a893332b436cf3bb000d0&quot;,

        &quot;Explicit&quot;: false,

        &quot;Popularity&quot;: 90,

        &quot;Preview URL&quot;: &quot;https://p.scdn.co/mp3-preview/2bb534db0407addc3b919265f9635a223fcf1a90?cid=7329cb28d47249b789d9c6c9cba8f7ec&quot;

    },

    {

        &quot;Position&quot;: &quot;2&quot;,

        &quot;Track Name&quot;: &quot;Circles&quot;,

        &quot;Artist&quot;: &quot;Post Malone&quot;,

        &quot;Streams&quot;: &quot;4347811&quot;,

        &quot;URL&quot;: &quot;https://open.spotify.com/track/21jGcNKet2qwijlDFuPiPb&quot;,

        &quot;Date&quot;: &quot;2019-09-25&quot;,

        &quot;Id&quot;: &quot;21jGcNKet2qwijlDFuPiPb&quot;,

        &quot;Duration ms&quot;: 215280,

        &quot;Key&quot;: 0,

        &quot;Mode&quot;: 1,

        &quot;Time Signature&quot;: 4,

        &quot;Acousticness&quot;: 0.192,

        &quot;Danceability&quot;: 0.695,

        &quot;Energy&quot;: 0.762,

        &quot;Instrumentalness&quot;: 0.00244,

        &quot;Liveness&quot;: 0.0863,

        &quot;Loudness&quot;: -3.497,

        &quot;Speechiness&quot;: 0.0395,

        &quot;Valence&quot;: 0.553,

        &quot;Tempo&quot;: 120.042,

        &quot;Album Art URL&quot;: &quot;https://i.scdn.co/image/94105e271865c28853bfb7b44b38353a2fea45d6&quot;,

        &quot;Explicit&quot;: false,

        &quot;Popularity&quot;: 92,

        &quot;Preview URL&quot;: &quot;https://p.scdn.co/mp3-preview/9cb3c8b7ccb399c2c5346ac424cc59be9fef3c98?cid=7329cb28d47249b789d9c6c9cba8f7ec&quot;

    },

    …

]
