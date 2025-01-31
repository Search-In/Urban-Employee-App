import React, { useState } from "react"
import { Drawer, Box, Typography, IconButton, Button } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import PlaceIcon from "@mui/icons-material/Place"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import ConfirmDeliveryModal from "./ConfirmDeliveryModal"
import handleImageUpload from "../../../utils/handleImageUpload"
import { toast, ToastContainer } from "react-toastify"

const DeliveryConfirmationDrawer = ({
  open,
  onClose,
  order,
  handleDeliveryConfirm,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)

  const [imageFile, setImageFile] = useState("")

  const handleConfirmModal = () => {
    handleDeliveryConfirm(order._id, imageFile)
  }

  // Handle file selection
  //   const handleImageUpload = (event) => {
  //     const file = event.target.files[0]
  //     if (file) {
  //       const imageUrl = URL.createObjectURL(file)
  //       setUploadedImage(imageUrl)
  //     }
  //   }

  const handleImageupload = async (event, index, main) => {
    if (main) {
      const file = event.target.files[0]
      const file_url = await handleImageUpload({
        images: [file],
        onError: () => toast.error("Image upload failed"),
      })
      console.log("this is file url", file_url)
      setUploadedImage(file_url)
      setImageFile(file_url)
    }
  }

  console.log("details ", order)
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
            style={{ display: "none" }}
            id="upload-photo"
            onChange={(event) => handleImageupload(event, 0, true)}
          />
          <label htmlFor="upload-photo">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Upload Photo
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
          disabled={!imageFile}
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
