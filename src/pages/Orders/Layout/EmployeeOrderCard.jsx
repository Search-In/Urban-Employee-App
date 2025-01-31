import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined"
import { Box, Button, IconButton, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import DeliveryPartnerDrawer from "../../../Components/Employee/DeliveryPartnerDrawer/DeliveryPartnerDrawer"
import { useState } from "react"
import axios from "axios"
import server from "../../../Components/server"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import ConfirmDeliveryModal from "../../../Components/Employee/DeliveryConfirmationDrawer/ConfirmDeliveryModal"

const EditButton = { backgroundColor: "#F37A20", margin: "5px 5px" }

const OrderTitle = {
  fontSize: "14px",
  color: "#37474F",
  fontFamily: "Poppins",
  fontWeight: "600",
}

const ShippingStatusDeliver = {
  color: "#5EC401",
  fontSize: "14px",
  fontFamily: "Poppins",
  fontWeight: "500",
}

const OrderDate = {
  fontSize: "13px",
  fontWeight: "400",
  fontFamily: "Poppins",
  color: "#868889",
}

const salePriceText = {
  color: "#F37A20",
  fontWeight: "500",
  fontSize: "18px",
  fontFamily: "Poppins",
  textAlign: "end",
  right: 5,
}

const buttonProductCard = {
  color: "#fff",
  backgroundColor: "#5EC401",
  display: "flex",
  height: "40px",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 2px",
  textTransform: "capitalize",
  borderRadius: "7px",
  position: "relative",
  bottom: 0,
  "&.MuiButtonBase-root:hover": {
    background: "#64cf00",
  },
  maxWidth: "80px",
}

const OrderDoneText = {
  fontSize: "22px",
  fontWeight: "600",
  fontFamily: "quicksand",
  textAlign: "center",
  padding: "0px 10px",
  color: "#181725",
  margin: "10px 0px",
}

const OrderPlacedText = {
  fontSize: "14px",
  fontWeight: "600",
  fontFamily: "quicksand",
  textAlign: "center",
  padding: "0px 10px",
  color: "#7C7C7C",
  margin: "10px 0px",
}

const ButtonCart = {
  backgroundColor: "#5EC401",
  color: "#fff",
  textTransform: "none",
  padding: "12px 10px",
  fontSize: "14px",
  fontWeight: "500",
  width: "100%",
  borderRadius: "19px",
  fontFamily: "quicksand",
  "&.MuiButtonBase-root:hover": {
    background: "#64cf00",
  },
}

const ButtonCartSecond = {
  backgroundColor: "#fff",
  color: "#181725",
  textTransform: "none",
  padding: "12px 10px",
  fontSize: "14px",
  fontWeight: "600",
  width: "100%",
  borderRadius: "19px",
  fontFamily: "quicksand",
  "&.MuiButtonBase-root:hover": {
    background: "#e9e8e8",
  },
}
const EmployeeOrderCard = (props) => {
  const selected = props?.deliveryPartnerId || props.deliveryStartTime
  const [isDPartnerDrawerOpen, setIsDPartnerDrawerOpen] = useState(false)
  const employeeData = JSON.parse(localStorage.getItem("employee"))
  const [isConfirmModal, setIsConfrimModal] = useState(false)
  const [orderId, setOrderId] = useState("")
  const navigate = useNavigate()

  const handleDPartnerConfirm = async (selectedPartnerId) => {
    try {
      const employeeId = employeeData._id
      const orderId = props.orderdetails._id
      console.log("props.orderdeails", props.orderdetails)
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

      setOrderId("")
      setIsDPartnerDrawerOpen(false)
      props.getOrders()
    } catch (error) {
      console.log(error)
    }
  }

  const handleNotDpartner = () => {
    setIsDPartnerDrawerOpen(false)
  }

  const handleConfirmModal = async () => {
    const employeeId = employeeData._id
    try {
      const result = await axios.patch(
        `${server}/update-employee-order/employeeOrder?employeeId=${employeeId}&orderId=${orderId}`,
        {
          deliveryStartTime: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      setIsConfrimModal(false)
      props.getOrders()
    } catch (error) {
      console.log(error)
    }
  }

  const handleClick = (e) => {
    e.preventDefault()
    if (props.orderdetails.status === "pending") {
      props?.handleOpenModal()
    }
  }
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #E1E1E1",
          paddingBottom: "20px",
          marginRight: "2px",
          marginTop: "10px",
          width: "100%",
          backgroundColor: selected ? "#E6F9E6" : "white",
          boxShadow: selected ? "0px 4px 10px rgba(0, 128, 0, 0.2)" : "none",
        }}
        // onClick={handleClick}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          onClick={(e) => {
            e.preventDefault()
            // props?.handleOpenModal()
            // props.orderdetails.status === "pending"
            //   ? navigate(`/employee-order`, {
            //       state: { orderId: props.orderdetails._id },
            //     })
            //   : null

            if (props.orderdetails.status === "pending") {
              props?.handleNavigate(props.orderdetails._id)
            } else if (
              props.orderdetails.status === "inprogress" &&
              employeeData.role === "DELIVERY"
            ) {
              props?.handleOpenDeliveryDrawer(props.orderdetails)
            } else if (
              props.orderdetails.status === "inprogress" &&
              employeeData.role === "PICKER"
            ) {
              setIsDPartnerDrawerOpen(true)
            }
          }}
        >
          <IconButton
            sx={{ backgroundColor: selected ? "#008000" : "#1976d2" }}
          >
            {selected ? (
              <LocalShippingIcon />
            ) : (
              <ShoppingBasketOutlinedIcon sx={{ color: "#fff" }} />
            )}
          </IconButton>
          <Box
            sx={{ margin: "0px 0px 0px 10px" }}
            onClick={(e) => {
              e.preventDefault()
              // props?.handleOpenModal()
              // props.orderdetails.status === "pending"
              //   ? navigate(`/employee-order`, {
              //       state: { orderId: props.orderdetails._id },
              //     })
              //   : null

              if (props.orderdetails.status === "pending") {
                props?.handleNavigate(props.orderdetails._id)
              }
            }}
          >
            <Typography sx={OrderTitle}>
              Order #{props.orderdetails.orderId}
            </Typography>
            {employeeData.role === "DELIVERY" ? (
              <Typography sx={ShippingStatusDeliver}>
                {props.orderdetails.recipientName}
              </Typography>
            ) : (
              <Typography sx={ShippingStatusDeliver}>
                {props.orderdetails.status}
              </Typography>
            )}

            {employeeData.role === "DELIVERY" ? (
              <Typography sx={OrderDate}>
                {props.orderdetails.recipientPhoneNo}
              </Typography>
            ) : (
              <Typography sx={OrderDate}>
                {props.orderdetails.createdAt?.toString().substring(0, 10)}
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <Typography sx={salePriceText}>
            ₹
            {props.orderdetails.totalAmount !== null
              ? props.orderdetails.totalAmount?.toFixed(2)
              : props.orderdetails.returnAmount?.toFixed(2)}
          </Typography>
          {props.orderdetails.status === "pending" && (
            <Button
              sx={buttonProductCard}
              onClick={(e) => {
                e.preventDefault()
                // props?.handleOpenModal()
                // navigate(`/employee-order`, {
                //   state: { orderId: props.orderdetails._id },
                // })
                props?.handleNavigate(props.orderdetails._id)
              }}
            >
              Start
            </Button>
          )}
          {props.orderdetails.status === "inprogress" &&
            employeeData.role === "DELIVERY" &&
            !props.deliveryStartTime && (
              <Button
                sx={buttonProductCard}
                onClick={(e) => {
                  e.preventDefault()
                  setOrderId(props.orderdetails._id)
                  setIsConfrimModal(true)
                }}
              >
                Start
              </Button>
            )}
        </Box>
      </Box>
      <DeliveryPartnerDrawer
        open={isDPartnerDrawerOpen}
        onClose={() => setIsDPartnerDrawerOpen(false)}
        onConfirm={handleDPartnerConfirm}
        handleNotDpartner={handleNotDpartner}
        deliveryPartnerId={props?.deliveryPartnerId}
        imageUrl={props.imageUrl}
      />
      <ConfirmDeliveryModal
        open={isConfirmModal}
        handleClose={() => setIsConfrimModal(false)}
        handleConfirm={handleConfirmModal}
        text={"Are you sure you want to start this delivery?"}
      />
    </>
  )
}

export default EmployeeOrderCard
