import axios from "axios"
import { toast } from "react-toastify"
import server from "../Components/server"

export default async function handleImageUpload({
  images,
  setImages,
  onError,
}) {
  const length = images?.filter((item) => item != null)?.length
  let compiledUrl = ""
  for (let i = 0; i < length; i++) {
    const file = images[i]
    if (!file) continue
    if (typeof file === "string") {
      if (i === length - 1) {
        compiledUrl += file
      } else {
        compiledUrl += file + ", "
      }

      console.log(compiledUrl)
      continue
    }
    const fileName = file.name
    try {
      // Get presigned URL for upload
      console.log("server is ", server)
      const response = await axios.get(`${server}/get-upload-url`, {
        params: { fileName, fileType: file.type },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      const uploadURL = response.data.uploadURL
      const downloadURL = response.data.downloadURL.split("?")[0]

      console.log(uploadURL, downloadURL)

      // Upload the image to S3 using presigned URL
      await axios.put(uploadURL, file, {
        headers: {
          "Content-Type": file.type,
        },
      })

      if (i === length - 1) {
        compiledUrl += downloadURL
      } else {
        compiledUrl += downloadURL + ", "
      }

      console.log(compiledUrl)

      const newImages = [...images]
      newImages[i] = downloadURL
      // setImages(newImages)
    } catch (error) {
      console.log("Error uploading image:", error)
      toast.error(`Error uploading image: ${JSON.stringify(error?.data)}`)
      if (onError) onError()
    }
  }

  return compiledUrl
}
