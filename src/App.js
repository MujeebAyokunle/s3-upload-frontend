import "./App.css"
import { Uploader } from "./utils/upload"
import React, { useState, useEffect } from "react"
import axios from "axios"
import useSocket from './socket'

function App() {
  const [file, setFile] = useState(undefined)
  const [trailerfile, setTrailerFile] = useState(undefined)
  const [image, setImage] = useState(undefined)
  const [logo, setLogo] = useState(undefined)
  const [movieUrl, setMovieUrl] = useState(undefined)
  const [trailerUrl, setTrailer] = useState(undefined)
  const [uploader, setUploader] = useState(undefined)
  const [trailerUploader, setTrailerUploader] = useState(undefined)

  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [qc_notes, setQc_notes] = useState('')
  const [video_language, setVideo_language] = useState('')
  const [crow_exlusive, setCrow_exlusive] = useState('')
  const [trailer_qc_notes, setTrailer_qc_notes] = useState('')
  const [country, setCountry] = useState('')
  const [year, setYear] = useState('')
  const [copyrights, setCopyrights] = useState('')
  const [production_company, setProduction_company] = useState('')
  const [tags, setTags] = useState('')
  const [locations, setLocations] = useState('')
  const [casts, setCasts] = useState('')
  const [vendor_id, setVendor_id] = useState('')
  const [sku, setSku] = useState('')
  const [imdb_id, setImdb_id] = useState('')
  const [imdb_rating, setImdb_rating] = useState('')
  const [imdb_votes, setImdb_votes] = useState('')
  const [content_rating, setContent_rating] = useState('')
  const [content_rating_reasons, setContent_rating_reasons] = useState('')
  const [series, setSeries] = useState('')
  const [text_tracks, setText_tracks] = useState('')
  const [text_tracks_kind, setText_tracks_kind] = useState('')
  const [text_tracks_frame_rate, setText_tracks_frame_rate] = useState('')
  const [release_date, setRelease_date] = useState(new Date())

  const {socketRef} = useSocket()

  console.log("socketRef", socketRef)

  useEffect(() => {
    socketRef.current.on("new/notification", (data) => {
      console.log(data)
    })

    socketRef.current.on("no/notification", (data) => {
      console.log(data)
    })
  }, [socketRef.current])

  
  // console.log("file", file?.name)
  const onCancel = () => {
    if (uploader) {
      uploader.abort()
      trailerUploader.abort()
      setFile(undefined)
      setTrailerFile(undefined)
    }
  }

  const submitMovie = () => {
    if (file && trailerfile && logo && image) {
      const videoUploaderOptions = {
        fileName: file?.name,
        file: file,
      }

      let percentage = undefined

      const uploader = new Uploader(videoUploaderOptions)
      setUploader(uploader)

      uploader
        .onProgress(({ percentage: newPercentage, final_response }) => {
          // to avoid the same percentage to be logged twice
          if (newPercentage !== percentage) {
            percentage = newPercentage

            if (final_response) {
              console.log("first final response", final_response)
              setMovieUrl(final_response?.data?.completeUploadRes?.Location)

              submitTrailer()
            } else {
              console.log(`${percentage}%`)
            }
          }
        })
        .onError((error) => {
          setFile(undefined)
          console.error(error)
        })

      uploader.start()
    }
  }

  const submitTrailer = () => {
    const videoUploaderOptions = {
      fileName: trailerfile?.name,
      file: trailerfile,
    }

    // const trailerUploaderOptions = {
    //   fileName: trailerfile?.name,
    //   file: trailerfile,
    // }

    let percentage = undefined

    const uploader = new Uploader(videoUploaderOptions)
    // const traileruploader = new Uploader(trailerUploaderOptions)
    setUploader(uploader)

    uploader
      .onProgress(({ percentage: newPercentage, final_response }) => {
        // to avoid the same percentage to be logged twice
        if (newPercentage !== percentage) {
          percentage = newPercentage

          if (final_response) {
            console.log("second final response", final_response)
            setTrailer(final_response?.data?.completeUploadRes?.Location)
            finalizeSubmission()

          } else {
            console.log(`${percentage}%`)
          }
        }
      })
      .onError((error) => {
        setFile(undefined)
        console.error(error)
      })

    uploader.start()
  }

  const finalizeSubmission = async () => {
    const formData = new FormData()
    console.log("clicked")
    // Images
    formData.append("images", image)

    // Logo
    formData.set("logo", logo)

    formData.set("title", title)
    formData.set("genre", genre)
    formData.set("qc_notes", qc_notes)
    formData.set("video_type", "mp4")
    formData.set("video_language", video_language)
    formData.set("video_url", movieUrl)
    formData.set("crow_exlusive", crow_exlusive)
    formData.set("trailer_url", trailerUrl)
    formData.set("trailer_qc_notes", trailer_qc_notes)
    formData.set("country", country)
    formData.set("year", year)
    formData.set("copyrights", copyrights)
    formData.set("production_company", production_company)
    formData.set("tags", JSON.stringify([tags]))
    formData.set("locations", locations)
    formData.set("casts", casts)
    formData.set("vendor_id", vendor_id)
    formData.set("released", "true")
    formData.set("sku", sku)
    formData.set("imdb_id", imdb_id)
    formData.set("imdb_rating", imdb_rating)
    formData.set("imdb_votes", imdb_votes)
    formData.set("content_rating", content_rating)
    formData.set("content_rating_reasons", content_rating_reasons)
    formData.set("series", "false")
    formData.set("text_tracks", text_tracks)
    formData.set("text_tracks_kind", text_tracks_kind)
    formData.set("text_tracks_frame_rate", text_tracks_frame_rate)
    formData.set("release_date", release_date)

    try {
      const complete_resp = await axios.post("https://44.203.134.24.nip.io/api/finalizemovieupload", formData)

      console.log("complete_resp", complete_resp)
    } catch (err) {
      console.log("final error", err)
    }

  }

  return (
    <div className="App">
      <h4>title</h4>
      <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} />

      <h4>genre</h4>
      <select onChange={(event) => setGenre(event.target.value)} value={genre} >
        <option value={""}>...</option>
        <option value={"drama"}>Drama</option>
      </select>

      <h4>qc notes</h4>
      <input type="text" value={qc_notes} onChange={(event) => setQc_notes(event.target.value)} />

      <h4>video language</h4>
      <select onChange={(event) => setVideo_language(event.target.value)} value={video_language} >
        <option value={""}>...</option>
        <option value={"english"}>English</option>
      </select>

      <h4>Subtitle language</h4>
      <select onChange={(event) => setText_tracks(event.target.value)} value={text_tracks} >
        <option value={""}>...</option>
        <option value={"english"}>English</option>
      </select>

      <h4>Subtitle kind</h4>
      <select onChange={(event) => setText_tracks_kind(event.target.value)} value={text_tracks_kind} >
        <option value={""}>...</option>
        <option value={"standard subtitles"}>Standard Subtitles</option>
      </select>

      <h4>Subtitle frame rate</h4>
      <select onChange={(event) => setText_tracks_frame_rate(event.target.value)} value={text_tracks_frame_rate} >
        <option value={""}>...</option>
        <option value={"24 fps"}>24</option>
      </select>

      <h4>crow exlusive</h4>
      <select onChange={(event) => setCrow_exlusive(event.target.value)} value={crow_exlusive} >
        <option value={""}>...</option>
        <option value={"true"}>Yes</option>
        <option value={"false"}>No</option>
      </select>

      <h4>trailer qc notes</h4>
      <input type="text" value={trailer_qc_notes} onChange={(event) => setTrailer_qc_notes(event.target.value)} />

      <h4>country</h4>
      <select onChange={(event) => setCountry(event.target.value)} value={country} >
        <option value={""}>...</option>
        <option value={"nigeria"}>Nigeria</option>
      </select>

      <h4>year</h4>
      <input type="text" value={year} onChange={(event) => setYear(event.target.value)} />

      <h4>copyrights</h4>
      <input type="text" value={copyrights} onChange={(event) => setCopyrights(event.target.value)} />

      <h4>production_company</h4>
      <input type="text" value={production_company} onChange={(event) => setProduction_company(event.target.value)} />

      <h4>tags</h4>
      <input type="text" value={tags} onChange={(event) => setTags(event.target.value)} />

      <h4>locations</h4>
      <input type="text" value={locations} onChange={(event) => setLocations(event.target.value)} />

      <h4>casts</h4>
      <input type="text" value={casts} onChange={(event) => setCasts(event.target.value)} />

      <h4>vendor_id</h4>
      <input type="text" value={vendor_id} onChange={(event) => setVendor_id(event.target.value)} />

      <h4>sku</h4>
      <input type="text" value={sku} onChange={(event) => setSku(event.target.value)} />

      <h4>imdb_id</h4>
      <input type="text" value={imdb_id} onChange={(event) => setImdb_id(event.target.value)} />

      <h4>imdb_rating</h4>
      <select onChange={(event) => setImdb_rating(event.target.value)} value={imdb_rating} >
        <option value={""}>...</option>
        <option value={"1"}>1</option>
        <option value={"2"}>2</option>
        <option value={"3"}>3</option>
        <option value={"4"}>4</option>
        <option value={"5"}>5</option>
        <option value={"6"}>6</option>
        <option value={"7"}>7</option>
        <option value={"8"}>8</option>
        <option value={"9"}>9</option>
        <option value={"10"}>10</option>
      </select>

      <h4>imdb_votes</h4>
      <input type="text" value={imdb_votes} onChange={(event) => setImdb_votes(event.target.value)} />

      <h4>content_rating</h4>
      <input type="text" placeholder="e.g. 13" value={content_rating} onChange={(event) => setContent_rating(event.target.value)} />

      <h4>content_rating_reasons</h4>
      <input type="text" value={content_rating_reasons} onChange={(event) => setContent_rating_reasons(event.target.value)} />

      <h4>series</h4>
      <select onChange={(event) => setSeries(event.target.value)} value={series} >
        <option value={""}>...</option>
        <option value={"true"}>Yes</option>
        <option value={"false"}>No</option>
      </select>

      <h4>Release date</h4>
      <input type="date" value={release_date} onChange={(event) => setRelease_date(event.target.value)} />

      <h1>Upload your movie file</h1>
      <div>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target?.files?.[0])
          }}
        />

        <h1>Upload your trailer file</h1>
        <div>
          <input
            type="file"
            onChange={(e) => {
              setTrailerFile(e.target?.files?.[0])
            }}
          />
        </div>
        <br />
        <h1>Upload Cover image</h1>
        <input
          type="file"
          onChange={(e) => {
            setImage(e.target?.files?.[0])
          }}
        />

        <br />
        <h1>Upload logo</h1>
        <input
          type="file"
          onChange={(e) => {
            setLogo(e.target?.files?.[0])
          }}
        />

      </div>
      <div>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={submitMovie}>Submit movie</button>
      </div>
    </div>
  )
}

export default App


    // let json = {
    //   images: image,
    //   logo: logo,
    //   title: title,
    //   genre: genre,
    //   qc_notes: qc_notes,
    //   video_type: "mp4",
    //   video_language,
    //   video_url: 'video_url',
    //   crow_exlusive,
    //   trailer_url: 'trailer_url',
    //   trailer_qc_notes,
    //   country,
    //   year,
    //   copyrights,
    //   production_company,
    //   tags,
    //   locations,
    //   casts,
    //   vendor_id,
    //   released: true,
    //   sku,
    //   imdb_id,
    //   imdb_rating,
    //   imdb_votes,
    //   content_rating,
    //   content_rating_reasons,
    //   series,
    //   text_tracks,
    //   text_tracks_kind,
    //   text_tracks_frame_rate,
    //   release_date
    // }
    // https://44.203.134.24.nip.io/api/finalizemovieupload
    // http://localhost:8080/api/finalizemovieupload
    

// formData.set("title", "Unpredictable Test")
// formData.set("genre", "drama")
// formData.set("qc_notes", "A prediction movie is a film that explores a future scenario or makes projections about what might happen in the future. It often involves elements of science fiction, speculation, and imagination to depict potential advancements, societal changes, or events that have not yet occurred. These movies offer audiences a glimpse into possible futures, sparking curiosity and contemplation about the direction our world could take.")
// formData.set("video_type", "mp4")
// formData.set("video_language", "english")
// formData.set("video_url", movieUrl)
// formData.set("crow_exlusive", JSON.stringify(false))
// formData.set("trailer_url", trailerUrl)
// formData.set("trailer_qc_notes", "A prediction movie is a film that explores a future scenario or makes projections about what might happen in the future.")
// formData.set("country", "nigeria")
// formData.set("year", "2023")
// formData.set("copyrights", "Copyright © 2023 crow+. All rights reserved.")
// formData.set("production_company", "crow+")
// formData.set("tags", JSON.stringify(["Action-packed", "Inspiring"]))
// formData.set("locations", "nigeria")
// formData.set("casts", JSON.stringify(["Jerry", "Munah", "Francis"]))
// formData.set("vendor_id", "123456")
// formData.set("sku", "")
// formData.set("imdb_id", "1234")
// formData.set("imdb_rating", "9/10")
// formData.set("imdb_votes", "2300")
// formData.set("content_rating", "8/10")
// formData.set("content_rating_reasons", "Greate content with high quality resolution")
// formData.set("series", JSON.stringify(false))
// formData.set("text_tracks", JSON.stringify(false))
// formData.set("text_tracks", text_tracks)
// formData.set("text_tracks_kind", text_tracks_kind)
// formData.set("text_tracks_frame_rate", text_tracks_frame_rate)