import axios from "axios";
import JSZip from "jszip";
export async function getMelody(key = "", tempo = "", fixed = false) {
  let options;
  if (fixed) {
    options = { key: key, tempo: tempo, fixed: 1 };
  } else {
    options = { fixed: 0 };
  }
  const res = await axios({
    method: "get",
    url: "http://localhost:5011/audioOptions",
    params: options,
    responseType: "blob",
  });
  return res;
}

export async function getDrums(key, tempo) {
  console.log("drums", key, tempo);
  const res = await axios({
    method: "get",
    url: "http://localhost:5011/get_ind_track",
    responseType: "blob",
    params: {
      key: key,
      tempo: tempo,
    },
  });
  const data = await res.data;

  return data;
}
export async function unzipTracks(tracks) {
  let trackAudio = {};
  let zip = new JSZip();
  const zippy = await zip.loadAsync(tracks);
  //alert("zippy created")
  for (const filename of Object.keys(zippy.files)) {
    let trackName = filename.split(".")[0];
    console.log(trackName);
    const fileData = await zippy.files[filename].async("uint8array");
    //alert("filedata gathered");
    console.log("sssss", fileData);
    let audio = new Blob([fileData], { type: "audio/wav" });
    trackAudio[trackName] = audio;
    if (trackName == "drums") {
    }
  }

  return trackAudio;
}
export async function createMaster(melody, drums) {
  var form = new FormData();
  form.append("file", melody, "melody");
  form.append("files", drums, "drums");

  const res = await axios({
    method: "POST",
    url: "http://localhost:5011/save-record",
    data: form,
    headers: { "Content-Type": "multipart/form-data" },
    responseType: "blob",
  });
  const master = new Blob([res.data], { type: "audio/wav" });
  return master;
}

export async function refreshTrack(tracks, trackName) {
  if (trackName == "drums") {
    const files = await getDrums(tracks.key, tracks.tempo);

    let newTracks = await unzipTracks(files);
    console.log("newTracks", newTracks);
    newTracks.melody = tracks.melody;
    newTracks.key = tracks.key;
    newTracks.tempo = tracks.tempo;
    newTracks.master = await createMaster(newTracks.melody, newTracks.drums);
    return newTracks;
  } else if (trackName === "melody") {
    const melody = await getMelody(tracks.key, tracks.tempo, true);
    tracks.melody = melody.data;
    tracks.master = await createMaster(tracks.melody, tracks.drums);
    return tracks;
  } else {
    const newTrack = await getOneTrack(trackName, tracks.key, tracks.tempo);
    tracks[trackName] = newTrack;
    const drums = await combineDrums(tracks, tracks.key, tracks.tempo);
    tracks.drums = drums;
    tracks.master = await createMaster(tracks.melody, tracks.drums);
    return tracks;
  }
}
async function getOneTrack(trackName, key, tempo) {
  const options = {
    method: "get",
    url: "http://localhost:5011/get_one_track",
    params: {
      key: key,
      tempo: tempo,
      track: trackName,
    },
    responseType: "blob",
  };
  const track = await axios(options);
  return track.data;
}

async function combineDrums(trackAudio, key, tempo) {
  let form = new FormData();
  form.append("key", key);
  form.append("tempo", tempo);

  form.append("kick", trackAudio.kick, "kick");
  form.append("hat", trackAudio.hat, "hat");
  form.append("snare", trackAudio.snare, "snare");

  let options = {
    method: "post",
    url: "http://localhost:5011/combine_drums",
    data: form,
    headers: { "Content-Type": "multipart/form-data" },
    responseType: "blob",
  };

  const drums = await axios(options);

  return drums.data;
}
