import "./App.css"
import { Uploader } from "./utils/upload"
import { useState } from "react"
import axios from "axios"

function App() {
  const [file, setFile] = useState(undefined)
  const [trailerfile, setTrailerFile] = useState(undefined)
  const [image, setImage] = useState(undefined)
  const [logo, setLogo] = useState(undefined)
  const [movieUrl, setMovieUrl] = useState(undefined)
  const [trailerUrl, setTrailer] = useState(undefined)
  const [uploader, setUploader] = useState(undefined)
  const [trailerUploader, setTrailerUploader] = useState(undefined)

  // useEffect(() => {

  // }, [file])
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

    // Images
    formData.append("images", image)

    // Logo
    formData.append("logo", logo)

    formData.append("title", "Unpredictable Test")
    formData.append("genre", "drama")
    formData.append("qc_notes", "A prediction movie is a film that explores a future scenario or makes projections about what might happen in the future. It often involves elements of science fiction, speculation, and imagination to depict potential advancements, societal changes, or events that have not yet occurred. These movies offer audiences a glimpse into possible futures, sparking curiosity and contemplation about the direction our world could take.")    
    formData.append("video_type", "mp4")
    formData.append("video_language", "english")
    formData.append("video_url", movieUrl)
    formData.append("crow_exlusive", JSON.stringify(false))
    formData.append("trailer_url", trailerUrl)
    formData.append("trailer_qc_notes", "A prediction movie is a film that explores a future scenario or makes projections about what might happen in the future.")
    formData.append("country", "nigeria")
    formData.append("year", "2023")
    formData.append("copyrights", "Copyright © 2023 crow+. All rights reserved.")
    formData.append("production_company", "crow+")
    formData.append("tags", JSON.stringify(["Action-packed", "Inspiring"]))
    formData.append("locations", "nigeria")
    formData.append("casts", JSON.stringify(["Jerry", "Munah", "Francis"]))
    formData.append("vendor_id", "123456")
    formData.append("sku", "")
    formData.append("imdb_id", "1234")
    formData.append("imdb_rating", "9/10")
    formData.append("imdb_votes", "2300")
    formData.append("content_rating", "8/10")
    formData.append("content_rating_reasons", "Greate content with high quality resolution")
    formData.append("series", JSON.stringify(false))

    try {
      const complete_resp = await axios.post("http://localhost:8080/api/finalizemovieupload", formData)

      console.log("complete_resp", complete_resp)
    } catch (err) {
      console.log("final error", err)
    }

  }

  return (
    <div className="App">
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
