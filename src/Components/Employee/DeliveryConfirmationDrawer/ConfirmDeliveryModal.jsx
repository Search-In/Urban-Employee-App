import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material"

const ConfirmDeliveryModal = ({ open, handleClose, handleConfirm, text }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle> Confirm Delivery</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{text}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          No
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDeliveryModal
