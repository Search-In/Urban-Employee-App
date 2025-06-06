import React, { useState } from "react"
import { Drawer, Box, Typography, IconButton, Button } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import PlaceIcon from "@mui/icons-material/Place"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import ConfirmDeliveryModal from "./ConfirmDeliveryModal"
import handleImageUpload from "../../../utils/handleImageUpload"
import { toast, ToastContainer } from "react-toastify"
import axios from "axios"
import server from "../../server"
import Compressor from "compressorjs"

const DeliveryConfirmationDrawer = ({
  open,
  onClose,
  order,
  deliveryImage,
  isDeliveryStarted,
  handleDeliveryConfirm,
}) => {
  console.log("temp[0]", deliveryImage)
  const data = localStorage.getItem("employee")
  const employeeData = JSON.parse(data)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(deliveryImage[0])

  const [imageFile, setImageFile] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirmModal = () => {
    handleDeliveryConfirm(order._id, imageFile)
  }

  const imageUpload = async (imageFile) => {
    try {
      const employeeId = employeeData._id
      const orderId = order._id
      const response = await axios.patch(
        `${server}/update-employee-order/employeeOrder?employeeId=${employeeId}&orderId=${orderId}`,
        { imageUrl: [imageFile] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateImageCaptureTime = async () => {
    try {
      const employeeId = employeeData._id
      const orderId = order._id

      const response = await axios.patch(
        `${server}/update-employee-order/employeeOrder?employeeId=${employeeId}&orderId=${orderId}`,
        {
          imageCaptureTime: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  const resizeImage = (
    file,
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 0.6
  ) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")

          let width = img.width
          let height = img.height

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height *= maxWidth / width
              width = maxWidth
            } else {
              width *= maxHeight / height
              height = maxHeight
            }
          }

          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, { type: file.type }))
            },
            file.type,
            quality
          )
        }
      }
    })
  }

  // // Use in your function
  // const handleImageupload = async (event, index, main) => {
  //   if (main) {
  //     const file = event.target.files[0]

  //     const resizedFile = await resizeImage(file)

  //     const file_url = await handleImageUpload({
  //       images: [resizedFile],
  //       onError: () => toast.error("Image upload failed"),
  //     })

  //     if (file_url) {
  //       await handleUpdateImageCaptureTime()
  //       await imageUpload(file_url)
  //     }

  //     setUploadedImage(file_url)
  //     setImageFile(file_url)
  //   }
  // }

  const handleImageupload = async (event, index, main) => {
    if (main) {
      const file = event.target.files[0]

      // Compress image before upload
      new Compressor(file, {
        quality: 0.6, // 0.1 (high compression) to 1.0 (low compression)
        maxWidth: 1024, // Resize width (optional)
        maxHeight: 1024, // Resize height (optional)
        success: async (compressedFile) => {
          const file_url = await handleImageUpload({
            images: [compressedFile],
            onError: () => toast.error("Image upload failed"),
          })

          if (file_url) {
            await handleUpdateImageCaptureTime()
            await imageUpload(file_url)
          }

          setUploadedImage(file_url)
          setImageFile(file_url)
        },
        error: (err) => {
          console.error("Compression Error:", err)
          toast.error("Failed to compress image")
        },
      })
    }
  }

  const handleImageCapture = async (event) => {
    if (!event.target.files || !event.target.files[0]) return

    setIsProcessing(true)
    const file = event.target.files[0]

    try {
      // Step 1: Immediately create a preview URL to release the camera resource
      const previewUrl = URL.createObjectURL(file)

      // Step 2: Process in chunks with timeouts to prevent memory overload
      const processedFile = await processImageInChunks(file)

      // Step 3: Upload the processed file
      const file_url = await handleImageUpload({
        images: [processedFile],
        onError: () => toast.error("Upload failed"),
      })

      if (file_url) {
        await Promise.all([
          handleUpdateImageCaptureTime(),
          imageUpload(file_url),
        ])
        setUploadedImage(file_url)
        setImageFile(file_url)
      }

      // Clean up
      URL.revokeObjectURL(previewUrl)
    } catch (error) {
      console.error("Image processing error:", error)
      toast.error(
        "Failed to process image. Try again or use a lower resolution."
      )
    } finally {
      setIsProcessing(false)
      // Clear the input to allow retries
      event.target.value = ""
    }
  }

  const processImageInChunks = (file) => {
    return new Promise((resolve) => {
      // Use a simple downscaling approach instead of heavy compression
      const img = new Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const maxSize = 800 // Target size for mobile

        // Calculate new dimensions
        let width = img.width
        let height = img.height
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw in steps with timeouts
        setTimeout(() => {
          const ctx = canvas.getContext("2d")
          ctx.drawImage(img, 0, 0, width, height)

          setTimeout(() => {
            canvas.toBlob(
              (blob) => {
                resolve(
                  new File([blob], file.name, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  })
                )
                URL.revokeObjectURL(url)
              },
              "image/jpeg",
              0.7
            )
          }, 100)
        }, 100)
      }

      img.src = url
    })
  }

  return (
    <>
      <ToastContainer />
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 2,
            height: "50vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography sx={titleText}>Order Details</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={dropLocationSection}>
          <Typography sx={dropLocationHeading}>
            <PlaceIcon />
            Drop Location
          </Typography>
          <Box sx={dropLocationBody}>
            <Typography variant="body1" sx={dropLocationHeading}>
              Name: {order?.recipientName}
            </Typography>
            <Typography variant="body1" sx={dropLocationText}>
              Phone: {order?.recipientPhoneNo}
            </Typography>
            <Typography variant="body1" sx={dropLocationText}>
              Location Type : {order?.locationType}
            </Typography>
            <Typography variant="body1" sx={dropLocationText}>
              Address: {`${order?.addressLine} ${order?.pincode}`}
            </Typography>
          </Box>
        </Box>

        {/* Upload Photo Button */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <input
            type="file"
            accept="image/*"
            capture="environment" // Forces the camera to open
            style={{ display: "none" }}
            id="upload-photo"
            // onChange={(event) => handleImageupload(event, 0, true)}
            onChange={handleImageCapture}
            disabled={!isDeliveryStarted}
          />
          <label htmlFor="upload-photo">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={!isDeliveryStarted || isProcessing}
            >
              {isProcessing ? "Processing..." : "Upload Photo"}
            </Button>
          </label>
        </Box>

        {/* Display uploaded image */}
        {uploadedImage && (
          <Box sx={previewContainer}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Uploaded Image:
            </Typography>
            <img src={uploadedImage} alt="Uploaded" style={previewImage} />
          </Box>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => setIsModalOpen(true)}
          disabled={!uploadedImage}
        >
          Confirm Delivery
        </Button>

        <ConfirmDeliveryModal
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          handleConfirm={handleConfirmModal}
          text={
            "Are you sure you want to confrim this delivery? This action cannot be undone."
          }
        />
      </Drawer>
    </>
  )
}

export default DeliveryConfirmationDrawer

// Styles
const titleText = {
  fontFamily: "Poppins",
  fontSize: "17px",
  fontWeight: 600,
  lineHeight: "25.5px",
  textAlign: "left",
}

const dropLocationSection = {
  margin: 0,
  border: "1px solid #EAEAEA",
  borderRadius: "4px",
  padding: "10px",
  backgroundColor: "#f5f5f5",
  flexGrow: 1,
  overflowY: "auto",
  mt: 2,
}

const dropLocationHeading = {
  marginBottom: "8px",
  fontWeight: "500",
  fontFamily: "Poppins",
  fontSize: "16px",
  lineHeight: "24px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
}

const dropLocationText = {
  fontSize: "14px",
  fontFamily: "Poppins",
}

const dropLocationBody = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  overflowY: "auto",
}

const previewContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "10px",
}

const previewImage = {
  width: "100px",
  height: "100px",
  borderRadius: "8px",
  objectFit: "cover",
  border: "1px solid #ddd",
}
