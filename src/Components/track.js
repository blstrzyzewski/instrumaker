import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  Fragment,
} from "react";
import { Button, Dropdown, Icon } from "semantic-ui-react";
import { refreshTrack } from "./track-handler";
import { WaveSurfer, WaveForm } from "wavesurfer-react";
const trackOptions = [
  {
    key: "Drums",
    text: "Drums",
    value: "drums",
    image: {
      src:
        "https://icons.iconarchive.com/icons/ergosign/free-instruments/32/drums-icon.png",
    },
  },
  {
    key: "Snare",
    text: "Snare",
    value: "snare",
    image: {
      src:
        "https://icons.iconarchive.com/icons/icons8/windows-8/32/Music-Bass-Drum-icon.png",
    },
  },
  {
    key: "Melody",
    text: "Melody",
    value: "melody",
    image: {
      src:
        "https://icons.iconarchive.com/icons/iconsmind/outline/32/Piano-icon.png",
    },
  },
  {
    key: "Hat",
    text: "Hat",
    value: "hat",
    image: {
      src: "/hi-hat.png",
    },
  },
];
let containers = [];

function Track(props) {
  console.log(props);
  const [tracks, setTracks] = useState(props.props);
  const [dropdownDisplay, setDropdownDisplay] = useState(false);
  const [title, setTitle] = useState("drums");
  const [containers, setContainers] = useState([]);
  const wavesurferRef = useRef();
  const [indContainer, setIndContainer] = useState();
  const [masterContainer, setMasterContainer] = useState({});

  async function updateTrack() {
    console.log("1", tracks);
    let output = await refreshTrack(tracks, title);
    console.log("output", output);
    setTracks(output);
    console.log("12", tracks);
    containers[1].loadBlob(output[title]);
    containers[0].loadBlob(output.master);
  }

  const handleWSMount = useCallback(async (waveSurfer, track) => {
    console.log("wavesss", waveSurfer);
    let container;

    console.log("llllllllllllll");

    console.log("ffffffff", containers);
    wavesurferRef.current = waveSurfer;

    if (wavesurferRef.current) {
      wavesurferRef.current.loadBlob(track);

      wavesurferRef.current.on("ready", () => {
        console.log("WaveSurfer is ready");
      });

      wavesurferRef.current.on("loading", (data) => {
        console.log("loading --> ", data);
      });

      if (window) {
        window.surferidze = wavesurferRef.current;
      }
    }
  }, []);
  const handleChange = async (event, data) => {
    console.log(data);
    containers[1].loadBlob(tracks[data.value]);
    setTitle(data.value);
  };
  const play = (id) => {
    console.log(containers);
    if (id == "ind") {
      containers[1].playPause();
      return;
    }
    console.log(dropdownDisplay);
    containers[0].playPause();
    setMasterContainer(wavesurferRef.current);
  };
  return (
    <div>
      <h1 style={{ marginLeft: "5%", color: "white" }}>Instrumental</h1>
      <div
        style={{
          width: "90%",
          margin: "3% auto 3% auto",
          border: "3px solid white",
        }}
      >
        <WaveSurfer
          onMount={(wave) => {
            handleWSMount(wave, tracks.master);
            setContainers((oldArray) => [...oldArray, wave]);
          }}
        >
          <WaveForm id="waveform"></WaveForm>
          <div id="timeline" />
        </WaveSurfer>
      </div>
      <Button
        style={{ marginLeft: "5%" }}
        primary
        size="large"
        onClick={() => {
          play("master");
        }}
      >
        {" "}
        Play / Pause
      </Button>
      <Button
        primary
        color="purple"
        size="large"
        onClick={() => {
          setDropdownDisplay(true);
        }}
      >
        {" "}
        Show individual tracks <Icon name="angle down"></Icon>
      </Button>
      {dropdownDisplay ? (
        <Fragment>
          {/*             <h1
            style={{
              marginLeft: "5%",
              color: "white",
              textTransform: "capitalize",
            }}
          >
            {title}
          </h1> */}
          <Dropdown
            style={{
              marginLeft: "5%",
              marginTop: "20px",
              display: "block",
              width: "150px",
            }}
            defaultValue={"drums"}
            selection
            onChange={handleChange}
            options={trackOptions}
          ></Dropdown>
          <Button
            style={{ marginLeft: "5%" }}
            primary
            size="large"
            onClick={() => {
              updateTrack("melody");
            }}
          >
            {" "}
            Refresh track
          </Button>
          <div
            style={{
              width: "90%",
              margin: "3% auto 3% auto",
              border: "3px solid white",
            }}
          >
            <WaveSurfer
              id="ind"
              onMount={(wave) => {
                handleWSMount(wave, tracks.drums);
                setContainers((oldArray) => [...oldArray, wave]);
              }}
            >
              <WaveForm id="waveform2"></WaveForm>
              <div id="timeline" />
            </WaveSurfer>
          </div>
          <Button
            style={{ marginLeft: "5%" }}
            primary
            size="large"
            onClick={() => {
              play("ind");
            }}
          >
            {" "}
            Play / Pause
          </Button>
        </Fragment>
      ) : (
        <Fragment />
      )}
    </div>
  );
}
export default Track;
