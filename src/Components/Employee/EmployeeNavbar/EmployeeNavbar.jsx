import { Box } from "@mui/material"
import { createContext } from "react"
import { NavLink } from "react-router-dom"
import { ReactComponent as Account } from "../../../assets/account.svg"
import { ReactComponent as Cart } from "../../../assets/cart.svg"
import { ReactComponent as ScannerImg } from "../../../assets/qr-code-scan-icon.svg"

export const NavBarContext = createContext()

const Navbar = () => {
  const items = 0
  const employeeData = JSON.parse(localStorage.getItem("employee"))
  const employeType = employeeData?.role
  console.log("reol", employeType)
  return (
    <Box sx={NavbarContainer}>
      <Box sx={NavbarDiv}>
        <NavLink
          to="/employee-orders"
          style={({ isActive }) =>
            isActive ? activenavbarclass : notactivenavbarclass
          }
        >
          <Box sx={NavItemStyle} className="nav-items">
            <Box
              sx={{
                borderRadius: "100%",
                backgroundColor: "#F37A20",
                position: "absolute",
                width: "5vw",
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
                marginLeft: "25px",
                justifyContent: "center",
              }}
            >
              {items > 0 ? <>{items}</> : <></>}
            </Box>
            <Cart />
          </Box>
        </NavLink>

        {employeType === "PICKER" && (
          <NavLink
            to="/employee-order"
            style={({ isActive }) =>
              isActive ? activenavbarclass : notactivenavbarclass
            }
          >
            <Box sx={NavItemStyle} className="nav-items">
              <ScannerImg style={{ width: "20px", height: "20px" }} />
            </Box>
          </NavLink>
        )}

        <NavLink
          to="/employee-home"
          style={({ isActive }) =>
            isActive ? activenavbarclass : notactivenavbarclass
          }
        >
          <Box sx={NavItemStyle} className="nav-items">
            <Account />
          </Box>
        </NavLink>
      </Box>
    </Box>
  )
}

export default Navbar

const NavbarContainer = {
  backgroundColor: "#ffffff",
  boxShadow: "0px 2px 7px rgba(0, 0, 0, 0.84)",
  borderRadius: "20px 20px 0px 0px;",
  padding: "16px 0px",
  position: "fixed",
  bottom: "0",
  width: "100%",
  minHeight: "5vh",
  zIndex: 10,
}

const NavbarDiv = {
  display: "flex",
  justifyContent: "space-evenly",
}

const NavItemStyle = {
  borderRadius: "50%",
  width: "54px",
  height: "54px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "black",
}

const notactivenavbarclass = {
  textDecoration: "none",
  backgroundColor: "#ffffff",
}

const activenavbarclass = {
  textDecoration: "none",
  backgroundColor: "#5ec401",
  color: "#ffffff",
  borderRadius: "50%",
}
