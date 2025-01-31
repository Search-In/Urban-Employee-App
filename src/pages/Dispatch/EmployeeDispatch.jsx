import { ArrowBack } from "@mui/icons-material"
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded"
import PlaceIcon from "@mui/icons-material/Place"
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import server from "../../Components/server"
import ProductCard from "../../Components/Employee/ProductCard"
import { useMqtt } from "../../context/MqttContext"
// import BatchModal from "../../Components/Employee/BatchModal/BatchModal"
import BatchDrawer from "../../Components/Employee/BatchDrawer/BatchDrawer"
import DeliveryPartnerDrawer from "../../Components/Employee/DeliveryPartnerDrawer/DeliveryPartnerDrawer"

const EmployeeDispatch = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { orderId } = location.state || {}
  const { publish, disconnect, setIsSessionEnded } = useMqtt()

  const [products, setProducts] = useState([])
  const data = localStorage.getItem("employee")
  const employeeData = JSON.parse(data)
  const employeeId = employeeData._id
  const [recipientInfo, setRecipientInfo] = useState({})
  const [productBatchData, setProductBatchData] = useState([])
  const [updatedProductBatches, setUpdatedProductBatches] = useState([]) // Tracks updated batch data for all products
  const [selectedProductBatch, setSelectedProductBatch] = useState([]) // Tracks batch data for the selected product
  const [isDPartnerDrawerOpen, setIsDPartnerDrawerOpen] = useState(false)
  const [isOrderUpdated, setIsOrderUpdated] = useState(false)

  const sampleBatchData = [
    { batchCode: "BATCH001", scannedCount: 0 },
    { batchCode: "BATCH002", scannedCount: 0 },
    { batchCode: "BATCH001", scannedCount: 0 },
    { batchCode: "BATCH002", scannedCount: 0 },
    { batchCode: "BATCH001", scannedCount: 0 },
    { batchCode: "BATCH002", scannedCount: 0 },
    { batchCode: "BATCH001", scannedCount: 0 },
    { batchCode: "BATCH002", scannedCount: 0 },
    { batchCode: "BATCH001", scannedCount: 0 },
    { batchCode: "BATCH002", scannedCount: 0 },
    { batchCode: "BATCH001", scannedCount: 0 },
    { batchCode: "BATCH002", scannedCount: 0 },
    { batchCode: "BATCH001", scannedCount: 0 },
    { batchCode: "BATCH002", scannedCount: 0 },
    { batchCode: "BATCH001", scannedCount: 0 },
    { batchCode: "BATCH002", scannedCount: 0 },
    { batchCode: "BATCH001", scannedCount: 0 },
    { batchCode: "BATCH002", scannedCount: 0 },
    { batchCode: "BATCH001", scannedCount: 0 },
    { batchCode: "BATCH002", scannedCount: 0 },
    { batchCode: "BATCH001", scannedCount: 0 },
    { batchCode: "BATCH002", scannedCount: 0 },
    { batchCode: "BATCH001", scannedCount: 0 },
    { batchCode: "BATCH002", scannedCount: 0 },
    { batchCode: "BATCH001", scannedCount: 0 },
    { batchCode: "BATCH002", scannedCount: 0 },
    { batchCode: "BATCH001", scannedCount: 0 },
    { batchCode: "BATCH002", scannedCount: 0 },
    { batchCode: "BATCH001", scannedCount: 0 },
    { batchCode: "BATCH002", scannedCount: 0 },
  ]
  const sample = [
    {
      batchCode: "60",
      scannedCount: 2,
      expiry: "2025-09-20T18:30:00.000Z",
      totalScannedCount: 3,
    },
    {
      batchCode: "61",
      scannedCount: 1,
      expiry: "2025-09-20T18:30:00.000Z",
      totalScannedCount: 3,
    },
  ]

  console.log("all updated product batches", updatedProductBatches)

  // State to manage drawer visibility
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Function to open the drawer
  const openDrawer = () => {
    setDrawerOpen(true)
  }

  // Function to close the drawer
  const closeDrawer = () => {
    setDrawerOpen(false)
  }

  const handleDPartnerConfirm = async (selectedPartnerId) => {
    try {
      const response = await axios.patch(
        `${server}/update-employee-order/employeeOrder?employeeId=${employeeId}&orderId=${orderId}`,
        {
          deliveryPartnerId: selectedPartnerId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      console.log("Selected Delivery Partner ID:", selectedPartnerId)
      setIsDPartnerDrawerOpen(false)
      setIsOrderUpdated(true)
    } catch (error) {
      console.log(error)
    }
  }

  const getOrders = async () => {
    const data = localStorage.getItem("employee")
    const employeeData = JSON.parse(data)
    const result = await axios.get(`${server}/admin/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    const deliveryCharge = result?.data?.totalAmount > 999 ? 0 : 50
    setRecipientInfo({
      name: result?.data?.deliveryAddressId?.recipientName,
      phone: result?.data?.deliveryAddressId?.recipientPhoneNo,
      addressLine: result?.data?.deliveryAddressId?.addressLine,
      locationType: result?.data?.deliveryAddressId?.locationType,
      pincode: result?.data?.deliveryAddressId?.pincode,
      message: result?.data?.message,
      orderNo: result?.data?.orderId,
      totalAmount: result?.data?.totalAmount,
      deliveryCharge: deliveryCharge,
    })
    const arr = result.data?.productList
    setProducts(arr)
  }

  const updateOrderStatus = async () => {
    try {
      const result = await axios.put(
        `${server}/orders/update/${orderId}`,
        {
          status: "inprogress",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      console.log("result.data.id", result)
    } catch (error) {
      console.log(error)
    }
  }

  const updatedispatchTime = async () => {
    try {
      const result = await axios.patch(
        `${server}/update-employee-order/employeeOrder?employeeId=${employeeId}&orderId=${orderId}`,
        {
          dispatchTime: new Date(),
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

  const handleCloseDrawer = () => {
    setIsDPartnerDrawerOpen(false)
  }
  useEffect(() => {
    getOrders()
  }, [])

  const handleDispatch = async () => {
    try {
      await updateOrderStatus()
      // setIsDPartnerDrawerOpen(true)
      const isTrolleyConnected =
        sessionStorage.getItem("trolleyConnection") === "true"
      if (isTrolleyConnected) {
        const session = localStorage.getItem("session")
        publish("guestUser/endSession", { sessionId: session })
        setIsSessionEnded(true)
        disconnect()
      }
      localStorage.setItem("virtualcartweight", 0)
      localStorage.removeItem("session")
      localStorage.removeItem("trolley")
      sessionStorage.clear()
      await updatedispatchTime()
    } catch (error) {
      console.log(error)
    }
  }

  const handleNotDpartner = async () => {
    await handleDispatch()
    setIsDPartnerDrawerOpen(false)
    navigate("/dispatch-success")
  }

  useEffect(() => {
    if (products.length > 0) {
      const count = products.filter(
        (product) => product.scannedCount === product.itemCount
      ).length

      setRecipientInfo((prevrecipientInfo) => ({
        ...prevrecipientInfo,
        scannedTotal: count,
      }))

      const getTotalPrice = () => {
        return products.reduce((total, product) => {
          const price = product?.price || 0
          const scannedCount = product?.scannedCount || 0

          if (product?.variant) {
            const proportion =
              product.variant < 100 ? product.variant : product.variant / 1000
            return total + scannedCount * price * proportion
          }
          return total + scannedCount * price
        }, 0)
      }

      // const getTotalPrice = () => {
      //   return products.reduce((total, product) => {
      //     return total + product.scannedCount * (product?.price || 0)
      //   }, 0)
      // }
      const value = getTotalPrice()
      setRecipientInfo((prevrecipientInfo) => ({
        ...prevrecipientInfo,
        scannedAmout: value,
      }))
    }
  }, [products])

  return (
    <Box
      sx={{
        border: 0,
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        border: "1px solid blue",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <BatchDrawer
        drawerOpen={drawerOpen}
        batchData={selectedProductBatch} // Pass data to the BatchDrawer
        setBatchData={setUpdatedProductBatches}
        onClose={closeDrawer} // Close drawer when clicking "Confirm" or Close icon
      />
      <Box sx={header}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="back"
          onClick={() => navigate(-1)}
          sx={{ position: "absolute", top: "10px", left: "10px" }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={CategoryTitle}>
          Order #{recipientInfo.orderNo}
        </Typography>
      </Box>

      <Box sx={TopDiv}>
        <Typography sx={TotalTotal}>Total</Typography>
        <Typography sx={TotalTotal}>
          {recipientInfo.scannedTotal}/{products.length}
        </Typography>
      </Box>

      <Container maxWidth={false} disableGutters>
        <Grid container spacing={0}>
          {products.map((product, index) => (
            <Grid item xs={12} key={index}>
              <ProductCard
                product={product}
                setDrawerOpen={setDrawerOpen}
                setSelectedProductBatch={setSelectedProductBatch}
                productBatchData={productBatchData}
                updatedProductBatches={updatedProductBatches}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={dropLocationSection}>
        <Typography variant="h6" sx={dropLocationHeading}>
          <PlaceIcon />
          Drop Location
        </Typography>
        <Box sx={dropLocationBody}>
          <Typography variant="body1" sx={dropLocationHeading}>
            Name:{recipientInfo.name}
          </Typography>
          <Typography variant="body1" sx={dropLocationText}>
            Phone: {recipientInfo.phone}
          </Typography>
          <Typography variant="body1" sx={dropLocationText}>
            Location Type : {recipientInfo.locationType}
          </Typography>
          <Typography variant="body1" sx={dropLocationText}>
            Address:
            {`${recipientInfo.addressLine} ${recipientInfo.pincode}`}
          </Typography>
          <Typography variant="body1" sx={dropLocationText}>
            Delivery Charge:
            {`${recipientInfo.deliveryCharge}`}
          </Typography>
        </Box>
      </Box>
      {recipientInfo.message && (
        <Box sx={messageSection}>
          <Typography variant="h6" sx={messageHeading}>
            Customer's Special Message
          </Typography>
          <Box sx={messageBody}>
            <Typography variant="body2">{recipientInfo.message}</Typography>
          </Box>
        </Box>
      )}
      <Box sx={TotalDivTotal}>
        <Typography sx={TotalTotal}>Order Amount</Typography>
        <Typography sx={TotalTotal}>
          ₹{recipientInfo.scannedAmout}/₹{recipientInfo.totalAmount}
        </Typography>
      </Box>

      <Box sx={bottomStickyContainer}>
        {isOrderUpdated ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleDispatch}
            sx={ButtonCart}
          >
            Ready For Dispatch
            <ArrowForwardRoundedIcon
              sx={{ position: "absolute", right: "20px" }}
            />
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsDPartnerDrawerOpen(true)}
            sx={ButtonCart}
          >
            Assign Order to Delivery
            <ArrowForwardRoundedIcon
              sx={{ position: "absolute", right: "20px" }}
            />
          </Button>
        )}
      </Box>

      <DeliveryPartnerDrawer
        open={isDPartnerDrawerOpen}
        onClose={handleCloseDrawer}
        onConfirm={handleDPartnerConfirm}
        handleNotDpartner={handleNotDpartner}
      />
    </Box>
  )
}

const header = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px",
  backgroundColor: "#fff",
  borderBottom: "1px solid #EAEAEA",
}

const TopDiv = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "2px solid #EAEAEA",
  padding: "10px 20px",
}

const TotalTotal = {
  fontSize: "16px",
  fontWeight: "500",
  fontFamily: "Poppins",
  lineHeight: "24px",
  letterSpacing: "0.6px",
  textalign: "left",
  margin: "1px 10px",
}

const CategoryTitle = {
  fontWeight: "600",
  fontFamily: "Quicksand",
}

const ButtonCart = {
  backgroundColor: "#5EC401",
  color: "#fff",
  marginBottom: 0,
  marginLeft: "10px",
  textTransform: "none",
  // padding: "10px 10px",
  fontSize: "18px",
  fontWeight: "500",
  fontFamily: "Poppins",
  width: "95%",
  "&.MuiButtonBase-root:hover": {
    background: "#64cf00",
  },
}

const TotalDivTotal = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  // margin: "10px 0px",
  // borderBottom: "2px solid #EAEAEA",
  // borderTop: "2px solid #EAEAEA",
  padding: "10px 0px",
}

const messageSection = {
  margin: 0,
  border: "1px solid #EAEAEA",
  borderRadius: "4px",
  padding: "10px",
  backgroundColor: "#fafafa",
}

const messageHeading = {
  marginBottom: "8px",
  fontWeight: "600",
  fontFamily: "Quicksand",
  fontSize: "13px",
  lineHeight: "16.25px",
  textalign: "left",
}

const messageBody = {
  maxHeight: "80px",
  overflowY: "auto",
}

const dropLocationSection = {
  margin: 0,
  border: "1px solid #EAEAEA",
  borderRadius: "4px",
  padding: "10px",
  backgroundColor: "#f5f5f5",
}

const dropLocationHeading = {
  marginBottom: "8px",
  fontWeight: "500",
  fontFamily: "Poppins",
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0.6000000238418579px",
  textalign: "left",
}

const dropLocationBody = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  maxHeight: "110px",
  overflowY: "auto",
}

const dropLocationText = {
  fontSize: "14px",
  fontFamily: "Poppins",
}

const bottomStickyContainer = {
  position: "sticky",
  bottom: 0,
  width: "95%",
  backgroundColor: "#fff",
  borderTop: "1px solid #EAEAEA",
  padding: "10px",
  textAlign: "left",
  zIndex: 1000,
}
export default EmployeeDispatch
