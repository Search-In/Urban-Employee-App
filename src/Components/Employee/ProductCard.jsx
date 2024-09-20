import { Avatar, Box, Paper, Typography } from "@mui/material"
import verifyIcon from "../../../src/assets/verifyimage.png"

const ProductCard = ({ product }) => {
  const isScanned = product.scannedCount >= product.itemCount
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
            <Typography sx={styles.salePriceText}>
              ₹{product.productId.price?.toFixed(2)}
            </Typography>
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
          />
        )}
        <Typography variant="body2" sx={styles.scannedCount}>
          {product.scannedCount || 0}/{product.itemCount}
        </Typography>
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
    right: "16px",
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
  variantText: {
    position: "relative",
    top: 5,
    left: 25,
    color: "rgba(33, 37, 41, 0.7)",
    fontWeight: "600",
    margin: "0",
    fontSize: "14px",
    fontFamily: "Poppins, sans-serif",
    lineHeight: "20px",
  },
  scannedCount: {
    position: "absolute",
    top: "62px",
    right: "32px",
    width: "11px",
    height: "24px",
    fontSize: "20px",
  },

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