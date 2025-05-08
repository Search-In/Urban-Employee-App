import React, { useState, useEffect, useRef } from "react"
import {
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  Chip,
  TextField,
} from "@mui/material"
import { SettingsBackupRestore, AutoFixHigh } from "@mui/icons-material"

const ScannerModeSelector = ({ mode, setMode, labelCode, setLabelCode }) => {
  const [area, setArea] = useState("")
  const [bayNo, setBayNo] = useState("")
  const [rack, setRack] = useState("")
  const [shelf, setShelf] = useState("")

  const areaNoRef = useRef(null)
  const bayNoRef = useRef(null)
  const rackRef = useRef(null)
  const shelfRef = useRef(null)

  const handleKeyPress = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault()
      nextFieldRef.current?.focus()
    }
  }

  useEffect(() => {
    const code = `${area}-${bayNo}-${rack}-${shelf}`
    setLabelCode(code)
  }, [area, bayNo, rack, shelf])

  return (
    <>
      <Paper elevation={3} sx={{ p: 2, mb: 2, textAlign: "center" }}>
        <Typography variant="subtitle1" gutterBottom>
          Select Update Mode
        </Typography>
        <ButtonGroup fullWidth>
          <Button
            variant={mode === "bulk" ? "contained" : "outlined"}
            onClick={() => setMode("bulk")}
            startIcon={<AutoFixHigh />}
            size="small"
          >
            Bulk Update
          </Button>
          <Button
            variant={mode === "single" ? "contained" : "outlined"}
            onClick={() => setMode("single")}
            startIcon={<SettingsBackupRestore />}
            size="small"
          >
            Single Update
          </Button>
        </ButtonGroup>
      </Paper>

      <Chip
        label={`Mode: ${mode === "bulk" ? "Bulk" : "Single"}`}
        color={mode === "bulk" ? "primary" : "secondary"}
        sx={{ mb: 2, fontSize: "0.875rem", ml: 2 }}
      />

      {mode === "bulk" && (
        <Box sx={{ padding: "1rem" }}>
          <Typography
            variant="body2"
            component="div"
            sx={{ fontWeight: "bold", marginBottom: 1 }}
          >
            Enter Label Code:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              label="Area"
              variant="outlined"
              size="small"
              value={area}
              onChange={(e) => setArea(e.target.value.toUpperCase())}
              onKeyDown={(e) => handleKeyPress(e, bayNoRef)}
              inputProps={{ maxLength: 1 }}
              inputRef={areaNoRef}
            />
            <Typography variant="h6">-</Typography>
            <TextField
              label="Bay No"
              variant="outlined"
              size="small"
              value={bayNo}
              onChange={(e) => setBayNo(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, rackRef)}
              inputProps={{ maxLength: 2 }}
              inputRef={bayNoRef}
            />
            <Typography variant="h6">-</Typography>
            <TextField
              label="Rack"
              variant="outlined"
              size="small"
              value={rack}
              onChange={(e) => setRack(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, shelfRef)}
              inputProps={{ maxLength: 2 }}
              inputRef={rackRef}
            />
            <Typography variant="h6">-</Typography>
            <TextField
              label="Shelf"
              variant="outlined"
              size="small"
              value={shelf}
              onChange={(e) => setShelf(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                }
              }}
              inputProps={{ maxLength: 2 }}
              inputRef={shelfRef}
            />
          </Box>
          {mode === "bulk" && labelCode && (
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              Applying: <strong>{labelCode}</strong>
            </Typography>
          )}
        </Box>
      )}
    </>
  )
}

export default ScannerModeSelector
