import React, { useEffect, useState } from "react"
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import server from "../../server"
import axios from "axios"

const DeliveryPartnerDrawer = ({
  open,
  onClose,
  onConfirm,
  handleNotDpartner,
  deliveryPartnerId,
  imageUrl,
}) => {
  const [loading, setLoading] = useState(true)
  const [deliveryPartners, setDeliveryPartners] = useState([])
  const [selectedPartner, setSelectedPartner] = useState(
    deliveryPartnerId || null
  )

  useEffect(() => {
    if (open) {
      fetchDeliveryPartners()
    }
  }, [open])

  const fetchDeliveryPartners = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${server}/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      console.log("REsponse is ", response.data)
      const data = response.data

      const filteredData = data.filter(
        (emp) => emp.role === "DELIVERY" && emp.isActive == true
      )
      setDeliveryPartners(filteredData)
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          height: "60vh",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: "17px",
            fontWeight: 600,
            lineHeight: "25.5px",
            textAlign: "left",
            textUnderlinePosition: "from-font",
            textDecorationSkipInk: "none",
          }}
        >
          Select Delivery Partner
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexGrow={1}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Scrollable List */}
          <Box sx={{ flexGrow: 1, overflowY: "auto", maxHeight: "40vh" }}>
            <List>
              {deliveryPartners.length > 0 ? (
                deliveryPartners.map((partner) => (
                  <ListItem
                    key={partner._id}
                    button
                    selected={selectedPartner === partner._id}
                    onClick={() => setSelectedPartner(partner._id)}
                    sx={{
                      borderRadius: "8px",
                      mb: 1,
                      bgcolor:
                        selectedPartner === partner._id
                          ? "#FF5722"
                          : "transparent",
                      color: selectedPartner === partner._id ? "#fff" : "#333",
                      "&:hover": { bgcolor: "#FFAB91" },
                    }}
                  >
                    <ListItemText
                      primary={partner.name}
                      secondary={partner.mobile}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography align="center" sx={{ mt: 2, color: "#757575" }}>
                  No Delivery Partners Found
                </Typography>
              )}
            </List>
          </Box>

          <Box sx={{ paddingTop: 2, marginTop: 8 }}>
            {deliveryPartners.length > 0 ? (
              <Button
                variant="contained"
                fullWidth
                disabled={!selectedPartner}
                onClick={() => onConfirm(selectedPartner)}
                sx={{
                  bgcolor: "#FF5722",
                  color: "white",
                  fontWeight: 600,
                  borderRadius: "8px",
                  "&:hover": { bgcolor: "#E64A19" },
                }}
              >
                Confirm
              </Button>
            ) : (
              <Button
                variant="contained"
                fullWidth
                disabled={deliveryPartners.length > 0}
                onClick={handleNotDpartner}
                sx={{
                  bgcolor: "#FF5722",
                  color: "white",
                  fontWeight: 600,
                  borderRadius: "8px",
                  "&:hover": { bgcolor: "#E64A19" },
                  marginBottom: "4px",
                }}
              >
                Assign dpartner later
              </Button>
            )}
          </Box>
        </>
      )}
    </Drawer>
  )
}

export default DeliveryPartnerDrawer
