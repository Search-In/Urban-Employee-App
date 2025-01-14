import React, { useState } from "react"
import {
  Modal,
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

const BatchModal = ({ data, onClose }) => {
  const [batchData, setBatchData] = useState(data)

  const handleCountChange = (index, action) => {
    setBatchData((prevData) => {
      const newData = [...prevData]
      const currentItem = newData[index]

      if (action === "increment") {
        currentItem.scannedCount += 1
      } else if (action === "decrement" && currentItem.scannedCount > 0) {
        currentItem.scannedCount -= 1
      }

      return newData
    })
  }

  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "95%",
          width: 450,
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          p: 3,
          outline: "none",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          "@media (max-width:600px)": {
            width: "90%", // Mobile responsiveness for smaller screens
          },
        }}
      >
        {/* Close icon at the top right */}
        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          <IconButton onClick={onClose} sx={{ color: "gray" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: "600", textAlign: "center" }}
        >
          Batch Details
        </Typography>

        <TableContainer
          sx={{
            maxHeight: "300px", // Limit the height of the table
            overflow: "auto", // Enable scrolling when content exceeds maxHeight
          }}
        >
          <Table sx={{ minWidth: 300 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "gray" }}>
                  Batch Code
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", color: "gray" }}
                >
                  Scanned Count
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {batchData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.batchCode}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => handleCountChange(index, "decrement")}
                        sx={{
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          minWidth: "32px",
                          padding: "0",
                          "&:hover": { backgroundColor: "#f0f0f0" },
                        }}
                      >
                        -
                      </Button>
                      <Typography>{item.scannedCount}</Typography>
                      <Button
                        variant="outlined"
                        onClick={() => handleCountChange(index, "increment")}
                        sx={{
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          minWidth: "32px",
                          padding: "0",
                          "&:hover": { backgroundColor: "#f0f0f0" },
                        }}
                      >
                        +
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Confirm button at the bottom */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={onClose} // You can replace this with a custom confirm handler if needed
            sx={{
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
              padding: "8px 20px",
              fontWeight: "500",
            }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default BatchModal
