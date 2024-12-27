import React from "react"
import {
  Box,
  Typography,
  Modal,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material"

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
  p: 3,
}

const ExpiryOverWriteModal = ({
  isOpen,
  onClose,
  onConfirm,
  product,
  message,
}) => {
  console.log({ product })
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="dispatch-modal-title"
      aria-describedby="dispatch-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          id="dispatch-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
        >
          Confirm Overwrite
        </Typography>
        <Typography
          id="dispatch-modal-description"
          variant="body1"
          gutterBottom
        >
          Would you like to override the following product?
        </Typography>
        <List>
          <ListItem disableGutters>
            <ListItemText
              primary={`${product?.productId?.name} - Reason: ${message}`}
            />
          </ListItem>
        </List>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}
        >
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onConfirm()
            }}
          >
            Ok
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default ExpiryOverWriteModal
