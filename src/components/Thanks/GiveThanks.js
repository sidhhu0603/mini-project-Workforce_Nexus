import {
  Container,
  Card,
  Grid,
  TextField,
  Box,
  Button,
  MenuItem,
} from "@mui/material";
import { ref, push } from "firebase/database";
import { rtdb } from "../../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import React, { useState, useRef, useCallback, useContext } from "react";
import { associatesContext } from "../../utils/context/contexts";
import ReactCanvasConfetti from "react-canvas-confetti";
import { useAuth } from "../../utils/context/AuthContext";
import "./ThanksCardElements/cardMedia.css";

const GiveThanks = () => {
  const { userData } = useAuth();
  const { associates } = useContext(associatesContext);
  const [giveThanksData, setGiveThanksData] = useState({
    Comment: undefined,
    To: undefined,
    From: "",
    Timestamp: Math.round(new Date().getTime() / 1000),
    Category: undefined,
  });
  const canvasStyles = {
    position: "fixed",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 20,
  };

  const refAnimationInstance = useRef(null);

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.95, x: 0.6 },
        particleCount: Math.floor(250 * particleRatio),
      });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 20,
      startVelocity: 95,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  const onSubmit = () => {
    push(ref(rtdb, `Thanks`), giveThanksData).then((result) => {
      setGiveThanksData({
        Comment: undefined,
        To: undefined,
        From: "",
        Timestamp: Math.round(new Date().getTime() / 1000),
        Category: undefined,
      });
      console.log(result.key, "key");
      setDoc(doc(db, "Thanks-Comments-Likes", result.key), {
        Comments: {},
        Likes: [],
      });
    });
  };
  return (
    <Container>
      <Grid
        container
        direction="row"
        justifyContent="center"
        sx={{ paddingTop: 2 }}
      >
        <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
        <Grid item>
          <Box>
            <Card sx={{ width: { xs: 320, sm: 450, lg: 450 }, height: 500 }}>
              {giveThanksData.Category != undefined ? (
                <div
                  className={giveThanksData.Category}
                  style={{ height: 140 }}
                >
                  {giveThanksData.Category === "TeamPlayer"
                    ? "Team Player 🤼"
                    : giveThanksData.Category === "Hero"
                    ? "Hero 🏅"
                    : giveThanksData.Category === "ThankYou"
                    ? "Thank you! 🙏"
                    : ""}
                </div>
              ) : (
                <div className="Blank" style={{ color: "black ", height: 140 }}>
                  Give Thanks
                </div>
              )}
              <Grid container direction="column" padding={2} rowGap={1}>
                <Grid item>
                  <TextField
                    name="Category"
                    value={
                      giveThanksData.Category ? giveThanksData.Category : ""
                    }
                    select
                    label="Category"
                    fullWidth
                    onChange={(event) =>
                      setGiveThanksData({
                        ...giveThanksData,
                        [event.target.name]: event.target.value,
                        ["From"]: userData.id,
                      })
                    }
                  >
                    <MenuItem key="Team Player" value="TeamPlayer">
                      Team Player
                    </MenuItem>
                    <MenuItem key="Hero" value="Hero">
                      Hero
                    </MenuItem>
                    <MenuItem key="thank you" value="ThankYou">
                      Thank You!
                    </MenuItem>
                  </TextField>
                </Grid>

                <Grid item>
                  <TextField
                    label="For..."
                    select
                    name="To"
                    value={giveThanksData.To ? giveThanksData.To : ""}
                    fullWidth
                    onChange={(event) =>
                      setGiveThanksData({
                        ...giveThanksData,
                        [event.target.name]: event.target.value,
                      })
                    }
                  >
                    {associates
                      .sort((a, b) => (a.FirstName > b.FirstName ? 1 : -1))
                      .map((associate) => (
                        <MenuItem key={associate.id} value={associate.id}>
                          {associate.FirstName} {associate.LastName}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    name="Comment"
                    label="Your comments"
                    value={giveThanksData.Comment ? giveThanksData.Comment : ""}
                    onChange={(event) =>
                      setGiveThanksData({
                        ...giveThanksData,
                        [event.target.name]: event.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={
                      giveThanksData.Comment === undefined ||
                      giveThanksData.Comment === "" ||
                      giveThanksData.To === undefined ||
                      giveThanksData.Category === undefined
                    }
                    onClick={() => onSubmit()}
                    onMouseDown={fire}
                  >
                    Post
                  </Button>
                </Grid>
                <Grid item></Grid>
              </Grid>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GiveThanks;