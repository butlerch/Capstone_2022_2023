import React, {useState} from "react";
import {Alert, Button, Dialog, Snackbar, TextField} from "@mui/material";
import {  useNavigate } from "react-router-dom";
import "./Tabs.css";
import UserData from "./UserData";

export default function Tabs() {
    const [type, setType] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [mesType, setMsgType] = useState("success");
    const [msg, setMsg] = useState("");
    const [timer, setTimer] = useState("");
    const [isLogin, setIsLogin] = useState(localStorage.getItem("login"));
    const navigate = useNavigate();
    const toDashed = () => {
    navigate("/dashboard")
    }
    const changeType = (value) => {
        setType(value);
    };
    const vertical = "top";
    const horizontal = "center";
    const handleClickOpen = () => {
        setOpen2(true);
    };

    const handleClose2 = () => {
        setOpen2(false);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const changeNmae = (e) => {
        setName(e.target.value);
    };
    const chagnePassword = (e) => {
        setPassword(e.target.value);
    };
    const submit = () => {
        if (!name) return openMsg("error", "Please enter name");
        if (!password) return openMsg("error", "Please enter password");
        // sent request
        // axios({
        //   url: "http://localhost:9264/wine_lake_manage/admin_login",
        //   method: "post",
        //   data: {
        //     userName: name,
        //     userPassword: password,
        //   },
        // }).then((res) => {
        //   localStorage.setItem("login", true);
        //   setIsLogin(true);
        //   setOpen2(false);
        //   openMsg("success", "login success");
        // });
        localStorage.setItem("login", true);
        setIsLogin(true);
        setOpen2(false);
        openMsg("success", "login success");
    };

    const openMsg = (type, msg) => {
        setOpen(true);
        setMsgType(type);
        setMsg(msg);
    };
    return (
        <div className="tabs">
            <Snackbar
                open={open}
                autoHideDuration={1500}
                onClose={handleClose}
                anchorOrigin={{vertical, horizontal}}
            >
                <Alert onClose={handleClose} severity={mesType} sx={{width: "100%"}}>
                    {msg}
                </Alert>
            </Snackbar>
            <div className="tabs_region">
                <div className="nav">
                    <div
                        className={type === 0 ? "nav_active nav_item" : "nav_item"}
                        onClick={() => toDashed()}
                    >
                        Dashboard
                    </div>
                    <div
                        className={type === 1 ? "nav_active nav_item" : "nav_item"}
                        onClick={() => handleClickOpen()}
                    >
                        adminLogin
                    </div>
                    {isLogin ? (
                        <>
                            <div className={type === 1 ? "nav_active nav_item" : "nav_item"} onClick={() => {
                                localStorage.removeItem("login");
                                setIsLogin(false);
                                openMsg("success", "logout success");
                            }}>
                                adminLogout
                            </div>
                            <div
                                className={type === 2 ? "nav_active nav_item" : "nav_item"}
                                onClick={() => changeType(2)}
                            >
                                Upload data
                            </div>
                        </>
                    ) : (
                        ""
                    )}
                </div>
                <div className="body">
                    <UserData></UserData>
                </div>
                <Dialog
                    open={open2}
                    onClose={handleClose2}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <div className="adminLoing">
                        <h3 className="form_title">adminLogin</h3>
                        <div className="form">
                            <div className="form_item">
                                <TextField
                                    id="outlined-basic"
                                    label="Name"
                                    variant="outlined"
                                    onChange={changeNmae}
                                />
                            </div>
                            <div className="form_item">
                                <TextField
                                    id="outlined-basic"
                                    label="Password"
                                    variant="outlined"
                                    type="password"
                                    onChange={chagnePassword}
                                />
                            </div>
                        </div>
                        <Button variant="contained" onClick={submit}>
                            Login
                        </Button>
                    </div>
                </Dialog>
            </div>
        </div>
    );
}
