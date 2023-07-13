"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TextField from "@mui/material/TextField";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Modal, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ModeEdit } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState } from "react";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  borderRadius: "5px",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 5,
};

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState({
    Region: "",
    Country: "",
    ItemType: "",
    SalesChannel: "",
    TotalProfit: "",
    _id: "",
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sales, setSales] = useState([]);
  const [newUserForm, setNewUserForm] = useState({
    Region: "",
    Country: "",
    ItemType: "",
    SalesChannel: "",
    TotalProfit: "",
  });

  async function loadSales() {
    const result = await axios("http://192.168.100.48:3001/sales");
    setSales(result.data);
  }

  useEffect(() => {
    loadSales();
  }, []);

  async function handleCreate() {
    const response = await axios.post(
      "http://192.168.100.48:3001/sales/create",
      newUserForm,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      setShowCreateModal(false); // close the modal
      setTimeout(loadSales, 500);
    }
  }

  async function handleEdit() {
    const response = await axios.post(
      "http://192.168.100.48:3001/sales/edit",
      selected,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      setShowModal(false);
      setTimeout(loadSales, 500);
    }
  }

  async function handleDelete(id) {
    const response = await axios.post(
      "http://192.168.100.48:3001/sales/delete",
      { _id: id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      setTimeout(loadSales, 500);
    }
  }

  return (
    <div className={styles.container}>
      <Button
        onClick={() => setShowCreateModal(true)}
        sx={{ backgroundColor: "success.main", color: "white" }}
        variant="contained"
        startIcon={<AddIcon />}
      >
        CREATE SALE
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Region</TableCell>
              <TableCell align="right">Country</TableCell>
              <TableCell align="right">Item Type</TableCell>
              <TableCell align="right">Sales Channel</TableCell>
              <TableCell align="right">Total Profit</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((row) => (
              <TableRow
                key={row._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {row.Region}
                </TableCell>
                <TableCell align="right">{row.Country}</TableCell>
                <TableCell align="right">{row.ItemType}</TableCell>
                <TableCell align="right">{row.SalesChannel}</TableCell>
                <TableCell align="right">{row.TotalProfit}</TableCell>
                <TableCell align="right">
                  <Box
                    onClick={() => {
                      setShowModal(true);
                      setSelected(row);
                    }}
                    sx={{
                      cursor: "pointer",
                      borderRadius: "7px",
                      backgroundColor: "info.light",
                      display: "flex",
                      justifyContent: "center",
                      padding: "6px",
                      marginRight: "6px",
                    }}
                  >
                    <ModeEdit fontSize="medium" sx={{ color: "white" }} />
                  </Box>
                  <Box
                    onClick={() => handleDelete(row._id)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: "7px",
                      backgroundColor: "error.light",
                      display: "flex",
                      justifyContent: "center",
                      padding: "6px",
                    }}
                  >
                    <ClearIcon fontSize="medium" sx={{ color: "white" }} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit User
          </Typography>
          <TextField
            margin="dense"
            id="Region"
            label="Region"
            type="text"
            value={selected.Region}
            onChange={(e) =>
              setSelected({ ...selected, Region: e.target.value })
            }
            fullWidth
          />
          <TextField
            margin="dense"
            id="Country"
            label="Country"
            type="text"
            value={selected.Country}
            onChange={(e) =>
              setSelected({ ...selected, Country: e.target.value })
            }
            fullWidth
          />
          <TextField
            margin="dense"
            id="ItemType"
            label="Item Type"
            type="text"
            value={selected.ItemType}
            onChange={(e) =>
              setSelected({ ...selected, ItemType: e.target.value })
            }
            fullWidth
          />
          <TextField
            margin="dense"
            id="SalesChannel"
            label="Sales Channel"
            type="text"
            value={selected.SalesChannel}
            onChange={(e) =>
              setSelected({ ...selected, SalesChannel: e.target.value })
            }
            fullWidth
          />
          <TextField
            margin="dense"
            id="TotalProfit"
            label="Total Profit"
            type="text"
            value={selected.TotalProfit}
            onChange={(e) =>
              setSelected({ ...selected, TotalProfit: e.target.value })
            }
            fullWidth
          />
          <Button onClick={handleEdit} color="primary">
            SUBMIT
          </Button>
          <Button onClick={() => setShowModal(false)} color="secondary">
            Cancel
          </Button>
        </Box>
      </Modal>
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            CREATE SALE
          </Typography>
          <TextField
            margin="dense"
            id="Region"
            label="Region"
            type="text"
            fullWidth
            onChange={(e) =>
              setNewUserForm({ ...newUserForm, Region: e.target.value })
            }
          />
          <TextField
            margin="dense"
            id="Country"
            label="Country"
            type="text"
            fullWidth
            onChange={(e) =>
              setNewUserForm({ ...newUserForm, Country: e.target.value })
            }
          />
          <TextField
            margin="dense"
            id="ItemType"
            label="Item Type"
            type="text"
            fullWidth
            onChange={(e) =>
              setNewUserForm({ ...newUserForm, ItemType: e.target.value })
            }
          />
          <TextField
            margin="dense"
            id="SalesChannel"
            label="Sales Channel"
            type="text"
            fullWidth
            onChange={(e) =>
              setNewUserForm({ ...newUserForm, SalesChannel: e.target.value })
            }
          />
          <TextField
            margin="dense"
            id="TotalProfit"
            label="Total Profit"
            type="text"
            fullWidth
            onChange={(e) =>
              setNewUserForm({ ...newUserForm, TotalProfit: e.target.value })
            }
          />
          <Button
            sx={{ backgroundColor: "success.main" }}
            onClick={handleCreate}
            variant="contained"
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
