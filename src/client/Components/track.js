import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  Fragment,
} from "react";
import hihat from "./hi-hat.png";
import Navbar from "./navbar";
import Loader from "./loader";
import { Button, Dropdown, Icon, Divider, Transition } from "semantic-ui-react";
import { refreshTrack, download } from "./track-handler";
import { WaveSurfer, WaveForm } from "wavesurfer-react";
const trackOptions = [
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
    key: "Hat",
    text: "Hat",
    value: "hat",
    image: {
      src: hihat,
    },
  },
];

function Track(props) {
  console.log(props);
  const [tracks, setTracks] = useState(props.props);
  const [dropdownDisplay, setDropdownDisplay] = useState(false);
  const [title, setTitle] = useState("drums");
  const [error, setError] = useState(false);
  const wavesurferRef = useRef();
  const [loading, setLoading] = useState(false);
  const [indContainer, setIndContainer] = useState();
  const [masterContainer, setMasterContainer] = useState({});
  const [buttonText, setButtonText] = useState("Refresh track");
  async function updateTrack() {
    console.log("1", tracks);
    setLoading(true);
    let output = await refreshTrack(tracks, title);
    console.log("output", output);
    setTracks(output);
    console.log("12", tracks);
    indContainer.loadBlob(output[title]);
    masterContainer.loadBlob(output.master);
    setLoading(false);
  }

  const handleWSMount = useCallback(async (waveSurfer, track) => {
    console.log("wavesss", waveSurfer);

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
    indContainer.loadBlob(tracks[data.value]);
    setTitle(data.value);
  };
  const play = (id) => {
    id == "ind" ? indContainer.playPause() : masterContainer.playPause();

    console.log(dropdownDisplay);
  };
  return (
    <div>
      <Navbar />
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
            setMasterContainer(wave);
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
          download(tracks.master);
        }}
      >
        {" "}
        Download
      </Button>
      <Button
        primary
        id="show-tracks"
        color="purple"
        size="large"
        style={{ paddingRight: "5px" }}
        onClick={() => {
          setDropdownDisplay(!dropdownDisplay);
          if (dropdownDisplay) {
            indContainer.pause();
          }
        }}
      >
        {" "}
        Show tracks {"  "} <Icon name="angle down"></Icon>
      </Button>
      <Divider style={{ opacity: 0 }} />
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
              display: "inline-block",
              width: "150px",
            }}
            defaultValue={"drums"}
            selection
            onChange={handleChange}
            options={tracks.simple ? trackOptions.slice(0, 2) : trackOptions}
          ></Dropdown>

          <div
            style={{
              width: "90%",
              margin: "3% auto 3% auto",
              border: "3px solid white",
            }}
          >
            <Transition
              visible={dropdownDisplay}
              animation="fade"
              duration={500}
            >
              <WaveSurfer
                id="ind"
                onMount={(wave) => {
                  handleWSMount(wave, tracks.drums);
                  setIndContainer(wave);
                }}
              >
                <WaveForm id="waveform2"></WaveForm>
                <div id="timeline" />
              </WaveSurfer>
            </Transition>
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
          <Button
            style={{ marginLeft: 4, backgroundColor: "red !important" }}
            primary
            negative={true}
            loading={loading}
            size="large"
            onClick={async () => {
              try {
                await updateTrack("melody");
              } catch (error) {
                setLoading(false);
                setError(true);
                setButtonText("Error refreshing");
                setTimeout(() => {
                  setError(false);
                  setButtonText("Refresh track");
                }, 1000);
              }
            }}
          >
            {" "}
            {buttonText}
          </Button>
        </Fragment>
      ) : (
        <Fragment />
      )}
    </div>
  );
}
export default Track;
