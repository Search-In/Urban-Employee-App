import { Avatar, Box, Paper, Typography } from "@mui/material"
import verifyIcon from "../../../src/assets/verifyimage.png"

const ProductCard = ({
  product,
  setDrawerOpen,
  setSelectedProductBatch,
  updatedProductBatches,
}) => {
  const isScanned = product.scannedCount >= product.itemCount
  // console.log("Setiiing the dats ", product?.batch_scanned_count)

  // const handleOpenBatch = () => {
  //   const sampleBatchData = product?.batch_scanned_count?.map((item) => ({
  //     batchCode: item.product_batch.batch,
  //     scannedCount: item.scannedCount,
  //     expiry: item.product_batch?.expiry,
  //     totalScannedCount: item?.scannedCount,
  //   }))
  //   setSelectedProductBatch(sampleBatchData)

  //   // Update the global state with the updated data for this product
  //   setUpdatedProductBatches((prevData) => {
  //     // Remove existing batch data for this product
  //     const updatedData = prevData.filter(
  //       (batch) => batch.productId !== product.productId
  //     )
  //     // Add the new data for this product
  //     return [
  //       ...updatedData,
  //       { productId: product.productId, batchData: sampleBatchData },
  //     ]
  //   })
  //   // Open the drawer
  //   setDrawerOpen(true)
  // }

  const handleOpenBatch = () => {
    console.log("updatedproductbatches", updatedProductBatches)
    console.log("product is ", product)

    // Filter all matching batch data for this product
    const existingBatchData = updatedProductBatches.filter(
      (item) => item.productId === product.productId._id
    )

    console.log("existingBatchData is ", existingBatchData)

    // Ensure the existing batch data is treated as an array or fallback to initial API data
    const batchDataToUse =
      existingBatchData.length > 0
        ? existingBatchData // Use filtered batch data if available
        : product?.batch_scanned_count?.map((item) => ({
            batchCode: item.product_batch.batch,
            scannedCount: item.scannedCount,
            expiry: item.product_batch?.expiry,
            totalScannedCount: item?.scannedCount,
            productId: item.product_batch.productId,
          })) || [] // Fallback to empty array if no data exists

    console.log("batchto use ", batchDataToUse)

    // Directly set the batch data to the state
    setSelectedProductBatch(batchDataToUse)

    // Open the drawer
    setDrawerOpen(true)
  }

  return (
    <Paper
      elevation={1}
      sx={{ ...styles.card, ...(isScanned && styles.scanned) }}
    >
      <Box sx={styles.container}>
        {/* Product Image */}

        <Box>
          <Avatar
            alt={product.productId?.name}
            src={product.productId?.imageUrl}
            sx={styles.avatar}
            variant="square"
          />
          <Typography sx={styles.labelId}>Product Label:</Typography>
          <Box sx={styles.scanPriceTextBox}>
            <Typography sx={styles.scanPriceText}>
              ₹{product?.productId?.price?.toFixed(2)}
            </Typography>
            <Typography sx={styles.scanRate}> Scan Rate</Typography>
          </Box>
        </Box>

        <Box sx={styles.details}>
          <Typography variant="h6" sx={styles.productName}>
            {product.productId?.name}
          </Typography>
          <div style={styles.priceContainer}>
            {product.productId.mrpPrice && (
              <Typography sx={styles.priceText}>
                ₹{product.productId.mrpPrice?.toFixed(2)}
              </Typography>
            )}
            <Box>
              <Typography sx={styles.salePriceText}>
                ₹{product?.price?.toFixed(2)}
              </Typography>
              <Typography sx={styles.salesPrice}>Ordered At</Typography>
            </Box>

            <Typography sx={styles.variantText}>
              {product?.variant &&
                `${
                  product.variant >= 100
                    ? product.variant + " gm"
                    : product.variant + " Kg"
                }`}
            </Typography>
          </div>
          <div style={styles.labelCodeDiv}>
            <Typography variant="body1" sx={styles.labelCode}>
              {product.productId?.labelcode}
            </Typography>
          </div>
        </Box>
        {isScanned && (
          <Box
            component="img"
            src={verifyIcon}
            alt="Verified"
            sx={styles.verifyIcon}
            onClick={handleOpenBatch}
          />
        )}
        <Box sx={styles.scannedCountContainer}>
          <Typography variant="body2" sx={styles.scannedCount}>
            {product.scannedCount || 0}/{product.itemCount}
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

const styles = {
  card: {
    padding: 0,
    margin: 0,
    backgroundColor: "#fafafa",
    border: "1px solid #F0F0F0",
  },
  container: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    height: "160px",
  },
  avatar: {
    width: "71px",
    height: "75px",
    marginLeft: "14px",
    borderRadius: "9px 0px 0px 0px",
    marginRight: "16px",
    marginBottom: "0px",
  },
  details: {
    position: "relative",
    right: 8,
    top: 0,
  },
  productName: {
    width: "190px",
    height: "48px",
    fontFamily: "Poppins, sans-serif",
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "24px",
    letterSpacing: "0.6px",
    textAlign: "left",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  labelId: {
    visibility: "hidden",
    marginLeft: "15px",
    fontFamily: "Poppins, sans-serif",
    fontSize: "10px",
    fontWeight: "600",
    lineHeight: "19.5px",
    letterSpacing: "0.6px",
    textAlign: "left",
    marginTop: "20px",
  },
  scanned: {
    opacity: 0.9,
  },
  verifyIcon: {
    position: "absolute",
    top: "20px",
    right: "22px",
    width: "30px",
    height: "32px",
  },
  priceContainer: {
    display: "flex",
    alignItems: "space-between",
    gap: "5px",
    flexWrap: "nowrap",
    // overflowX: "auto",
  },
  priceText: {
    position: "relative",
    top: 5,
    fontWeight: "600",
    color: "rgba(55, 71, 79, 0.54);",
    textDecoration: "line-through",
    margin: "0",
    fontSize: "14px",
    fontFamily: "Poppins",
  },
  salePriceText: {
    color: "#F37A20",
    fontWeight: "600",
    margin: "0",
    fontSize: "20px",
    fontFamily: "Poppins",
  },
  salesPrice: {
    position: "absolute",
    fontSize: "12px",
    fontFamily: "Poppins",
    color: "rgba(55, 71, 79, 0.54);",
  },

  scanPriceTextBox: {
    position: "absolute",
    left: 20,
    bottom: 6,
  },
  scanPriceText: {
    color: "#455d7a",
    fontWeight: "600",
    margin: "0",
    fontSize: "20px",
    fontFamily: "Poppins",
  },
  scanRate: {
    fontSize: "12px",
    margin: 0,
    fontSize: "12px",
    fontFamily: "Poppins",
    color: "rgba(55, 71, 79, 0.54);",
  },
  variantText: {
    position: "relative",
    top: 5,
    left: 10,
    color: "#475053",
    fontWeight: "600",
    margin: "0",
    fontSize: "16px",
    fontFamily: "Poppins, sans-serif",
    lineHeight: "20px",
  },
  scannedCountContainer: {
    position: "absolute", // Position it absolutely
    top: "62px", // Adjust based on your design
    right: "5px", // Adjust based on your design
    width: "60px", // Fixed width
    height: "auto", // Set to auto to allow wrapping
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Center align text
    padding: "4px", // Padding to avoid text touching borders
    overflowWrap: "break-word", // Allow text to wrap
    wordWrap: "break-word", // Allow text to wrap
    whiteSpace: "normal", // Allow normal wrapping
  },
  scannedCount: {
    fontSize: "20px",
    textAlign: "center", // Center align text
  },
  // scannedCount: {
  //   position: "absolute",
  //   top: "62px",
  //   right: "32px",
  //   width: "11px",
  //   height: "24px",
  //   fontSize: "20px",
  //   whiteSpace: "wrap", // Prevent line breaks
  //   maxWidth: "50px", // Limit the maximum width
  // },

  labelCodeDiv: {
    width: "124px",
    height: "30px",
    backgroundColor: "#FFF2E7",
    borderRadius: "6px",
    opacity: 0.9,
    marginLeft: "138px",
    marginTop: "18px",
    border: "2px solid #FFD4D4",
  },
  labelCode: {
    marginLeft: "5px",
    textAlign: "center",
  },
}

export default ProductCard
