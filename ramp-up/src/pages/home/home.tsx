import React from "react";
import { AppBar, Toolbar, Button, Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import DataTable from "./DataGrid/DataTable";
import AddUser from "./AddUser/AddUser";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { logoutRequest } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../components/ErrorModal/ErrorModal";

const CustomButton = styled(Button)({
  padding: "6px 16px",
  width: "74px",
  height: "36px",
  letterSpacing: "0.4px",
  fontSize: "14px",
  fontFamily: "Roboto,sans-serif",
  fontStyle: "normal",
  lineHeight: "24px",
  fontWeight: 500,
});

const styles = {
  page: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    gap: "84px",
  },
  toolbar: {
    padding: "8px 24px",
    display: "flex",
    flexDirection: "row" as "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "36px !important",
  },

  toolbarTitle: {
    color: "#1E88E5",
    fontFeatureSettings: "'clig' off, 'liga' off",
    fontFamily: "Roboto,sans-serif",
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "133.4%",
  },

  login: {
    fontWeight: 500,
    width: "42px",
    height: "24px",
    letterSpacing: "0.4px",
    fontSize: "14px",
    fontFamily: "Roboto,sans-serif",
    fontStyle: "normal",
    lineHeight: "24px",
  },

  card: {
    position: "relative" as "relative",
    maxWidth: "calc(100vw - 32px)",
    padding: "0px",
    borderLeft: "1px solid rgba(0,0,0,0.01)",
    borderRight: "1px solid rgba(0,0,0,0.01)",
  },
  cardTitle: {
    padding: "16px",
    fontSize: "24px",
    fontWeight: 400,
    lineHeight: "133.4%",
    fontFamily: "Roboto,sans-serif",
    fontStyle: "normal",
    fontFeatureSettings: "'clig' off, 'liga' off",
    color: "var(--text-primary, rgba(0, 0, 0, 0.87))",
  },
};

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state : RootState) => state.user.user);

  const [isPressedLogout, setIsPressedLogout] = React.useState(false);

  const handleLogout = () => {
    dispatch(logoutRequest());
    navigate("/");
  }

  const handleButtonClick = () => {
    setIsPressedLogout(true);
  }

  return (
    <div style={styles.page}>
      <ErrorModal
        open={isPressedLogout}
        onClose={() => setIsPressedLogout(false)}
        message="Are you sure you want to logout"
        dismiss={true}
        buttonName="Confirm"
        onClick={handleLogout}
        />
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        variant="outlined"
        sx={{
          height: "52px",
        }}
      >
        <Toolbar sx={styles.toolbar}>
          <h5 style={styles.toolbarTitle}>Ramp Up Project</h5>
          <CustomButton 
          variant="outlined"
          onClick={handleButtonClick}
          >
            Logout
          </CustomButton>
        </Toolbar>
      </AppBar>

      <Card sx={styles.card}>
        {user?.role === "Admin" && <AddUser/>}
        <div style={styles.cardTitle}>User Details</div>
        <DataTable />
      </Card>
    </div>
  );
}

export default Home;
