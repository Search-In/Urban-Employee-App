import EmployeeLogin from "./Components/Employee/EmployeeLogin"
import EmployeeHome from "./Components/Employee/EmployeeHome"
import EmployeeOrder from "./Components/Employee/EmployeeOrder"
import EmployeeOrders from "./Components/Employee/EmployeeOrders"
import EmployeeDispatch from "./Components/Employee/EmployeeDispatch"
import DispatchSuccessAnimation from "./Components/Employee/Loader/DispatchSuccess"
import EmployeeNavbar from "./Components/Employee/EmployeeNavbar/EmployeeNavbar"
import PrivateEmployeeRoute from "./Components/PrivateRoute/PrivateRoutes"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"

function App() {
  const location = useLocation()
  const EmployeeRoutes = ["/employee-home", "/employee-orders"]
  const isEmployeeRoute = EmployeeRoutes.some((route) =>
    location.pathname.startsWith(route)
  )

  return (
    <>
      {isEmployeeRoute && <EmployeeNavbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/employee-login" />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route
          path="/employee-home"
          element={
            <PrivateEmployeeRoute>
              <EmployeeHome />
            </PrivateEmployeeRoute>
          }
        />
        <Route
          path="/employee-order"
          element={
            <PrivateEmployeeRoute>
              <EmployeeOrder />
            </PrivateEmployeeRoute>
          }
        />
        <Route
          path="/employee-orders"
          element={
            <PrivateEmployeeRoute>
              <EmployeeOrders />
            </PrivateEmployeeRoute>
          }
        />
        <Route
          path="/employee-dispatch"
          element={
            <PrivateEmployeeRoute>
              <EmployeeDispatch />
            </PrivateEmployeeRoute>
          }
        />
        <Route
          path="/dispatch-success"
          element={
            <PrivateEmployeeRoute>
              <DispatchSuccessAnimation />
            </PrivateEmployeeRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
