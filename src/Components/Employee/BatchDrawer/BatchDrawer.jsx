import React, { useEffect, useState } from "react"
import {
  Drawer,
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

const BatchDrawer = ({ drawerOpen, batchData, setBatchData, onClose }) => {
  //   const [batchData, setBatchData] = useState(data)
  const [localBatchData, setLocalBatchData] = useState([])
  const [netScannedCount, setNetScannedCount] = useState(0) // Track the net scanned count
  console.log("bd of drawer", batchData)

  //   useEffect(() => {
  //     setBatchData(data)
  //     setNetScannedCount(
  //       data.reduce((total, item) => total + item.scannedCount, 0)
  //     )
  //   }, [data])

  //   const handleCountChange = (index, action) => {
  //     setBatchData((prevData) => {
  //       const newData = [...prevData]
  //       const currentItem = newData[index]

  //       // Calculate current total scanned count
  //       const currentTotalCount = newData.reduce(
  //         (total, item) => total + item.scannedCount,
  //         0
  //       )

  //       // Calculate the overall limit
  //       const maxAllowedCount = newData.reduce(
  //         (total, item) => total + item.totalScannedCount,
  //         0
  //       )

  //       if (action === "increment") {
  //         // Check if incrementing would exceed the total allowed count
  //         if (currentTotalCount < maxAllowedCount) {
  //           currentItem.scannedCount += 1
  //         } else {
  //           alert("You have reached the maximum total scanned count.")
  //         }
  //       } else if (action === "decrement" && currentItem.scannedCount > 0) {
  //         currentItem.scannedCount -= 1
  //       }

  //       // Recalculate net scanned count after updating the batch
  //       const updatedNetScannedCount = newData.reduce(
  //         (total, item) => total + item.scannedCount,
  //         0
  //       )
  //       setNetScannedCount(updatedNetScannedCount)

  //       return newData
  //     })
  //   }

  // const handleCountChange = (index, action) => {
  //   setBatchData((prevData) => {
  //     const newData = [...prevData]
  //     const currentItem = newData[index]
  //     console.log("newData", newData)
  //     console.log("currentItem", currentItem)

  //     if (action === "increment") {
  //       // Prevent incrementing beyond totalScannedCount
  //       console.log("currentItem.scannedCount", currentItem.scannedCount)
  //       console.log(
  //         "currentItem.totalScannedCount",
  //         currentItem.totalScannedCount
  //       )
  //       if (netScannedCount < currentItem.totalScannedCount) {
  //         currentItem.scannedCount += 1
  //       } else {
  //         alert("You cannot exceed the total scanned count for this batch.")
  //       }
  //     } else if (action === "decrement") {
  //       // Prevent decrementing below zero
  //       if (currentItem.scannedCount > 0) {
  //         currentItem.scannedCount -= 1
  //       }
  //     }

  //     // Recalculate net scanned count after updating the batch
  //     const updatedNetScannedCount = newData.reduce(
  //       (total, item) => total + item.scannedCount,
  //       0
  //     )
  //     setNetScannedCount(updatedNetScannedCount)

  //     return newData
  //   })
  // }

  useEffect(() => {
    if (drawerOpen) {
      // When drawer opens, initialize with current batch data
      setLocalBatchData([...batchData])
      const totalScanned = batchData.reduce(
        (total, item) => total + item.scannedCount,
        0
      )
      setNetScannedCount(totalScanned)
    }
  }, [drawerOpen, batchData])

  const handleCountChange = (index, action) => {
    setLocalBatchData((prevData) => {
      const newData = [...prevData] // Create a shallow copy of local data
      const currentItem = newData[index] // Target the specific batch

      if (action === "increment") {
        // Calculate the maximum allowed scanned count
        const overallLimit = batchData.reduce(
          (total, item) => total + item.totalScannedCount,
          0
        )
        if (netScannedCount < overallLimit) {
          currentItem.scannedCount += 1
        } else {
          alert("You have reached the maximum total scanned count.")
        }
      } else if (action === "decrement") {
        if (currentItem.scannedCount > 0) {
          currentItem.scannedCount -= 1
        } else {
          alert("Scanned count cannot be less than 0.")
        }
      }

      // Update net scanned count
      const updatedNetScannedCount = newData.reduce(
        (total, item) => total + item.scannedCount,
        0
      )
      setNetScannedCount(updatedNetScannedCount)

      return newData
    })
  }

  // const handleConfirm = () => {
  //   // Update global state with confirmed changes
  //   setBatchData([...localBatchData]) // Save changes to parent state
  //   onClose() // Close drawer
  // }

  const handleConfirm = () => {
    // Map through localBatchData and update the global batchData
    const updatedBatchData = [...batchData]
    console.log("handle confirm is updatedBatchData", updatedBatchData)
    console.log("localBatch Data is ", localBatchData)

    localBatchData.forEach((localItem) => {
      const existingIndex = updatedBatchData.findIndex(
        (item) => item.productId === localItem.productId
      )

      if (existingIndex !== -1) {
        // If the productId exists, update the scannedCount
        updatedBatchData[existingIndex].scannedCount = localItem.scannedCount
      } else {
        // If the productId doesn't exist, add a new entry
        updatedBatchData.push({
          productId: localItem.productId,
          batchCode: localItem.batchCode,
          expiry: localItem.expiry,
          scannedCount: localItem.scannedCount,
          totalScannedCount: localItem.totalScannedCount, // Ensure all necessary fields are added
        })
      }
    })

    console.log("saving the updatedBatchdata", updatedBatchData)
    // setBatchData(updatedBatchData) // Save changes to parent state
    // Set the updatedBatchData with the new values, while ensuring duplicates are avoided
    setBatchData((prevBatchData) => {
      // For each item in the previous batchData, check if it exists in updatedBatchData
      const mergedData = [...prevBatchData]

      updatedBatchData.forEach((updatedItem) => {
        const existingIndex = mergedData.findIndex(
          (item) =>
            item.productId === updatedItem.productId &&
            item.batchCode === updatedItem.batchCode
        )

        if (existingIndex !== -1) {
          // If the combination exists, update the scannedCount
          mergedData[existingIndex].scannedCount += updatedItem.scannedCount
        } else {
          // If not, add the new item
          mergedData.push(updatedItem)
        }
      })

      return mergedData // Return the updated batchData
    })
    onClose() // Close the drawer
  }

  console.log("net total full scanned coutn is ", netScannedCount)

  return (
    <Drawer
      anchor="bottom"
      open={drawerOpen}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          maxWidth: "450px",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
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
            maxHeight: "300px",
            overflow: "auto",
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
                  Expiry Date
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
              {batchData?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.batchCode}</TableCell>
                  <TableCell align="center">
                    {item.expiry
                      ? new Date(item.expiry).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
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

        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "16px" }}
        >
          <Button
            variant="contained"
            onClick={handleConfirm}
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
    </Drawer>
  )
}

export default BatchDrawer
