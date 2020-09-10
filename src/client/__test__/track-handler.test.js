import { getDrums, unzipTracks, getMelody } from "../Components/track-handler";
import { createMaster } from "../src/Components/track-handler";

test("get drums simple", async () => {
  const drums = await getDrums("C", "123", true);
  const blob = new Blob([drums], { type: "audio/mp3" });
  expect(blob.type).toBe("audio/mp3");
  expect(blob.size).toBeGreaterThan(0);
});

test("get drums complex routine", async () => {
  const tracks = await getDrums("Gb", "113");
  const blob = new Blob([tracks], { type: "application/zip" });
  expect(blob.type).toBe("application/zip");
  expect(blob.size).toBeGreaterThan(0);
  const trackMap = await unzipTracks(tracks);
  for (const trackName of ["drums", "hat", "snare"]) {
    expect(trackMap[trackName].type).toBe("audio/mp3");
    expect(trackMap[trackName].size).toBeGreaterThan(0);
  }
});

test("get melody", async () => {
  const melody = await getMelody("C", "110", "150");
  expect(Number(melody.headers.tempo)).toBeGreaterThan(110);
  expect(Number(melody.headers.tempo)).toBeLessThan(150);
  const blob = new Blob([melody.data], { type: "audio/mp3" });
  expect(blob.type).toBe("audio/mp3");
  expect(blob.size).toBeGreaterThan(0);
});

test("get melody fixed", async () => {
  const melody = await getMelody("Ab", "120", "120", true);
  expect(Number(melody.headers.tempo)).toBe(120);
  expect(melody.headers.key).toBe("Ab");
  const blob = new Blob([melody.data], { type: "audio/mp3" });
  expect(blob.type).toBe("audio/mp3");
  expect(blob.size).toBeGreaterThan(0);
});

test("create master", async () => {
  const melody = await getMelody("Ab", "120", "120", true);
  const drums = await getDrums("Ab", "120", true);
  const master = await createMaster(melody.data, drums);

  expect(master.type).toBe("audio/mp3");
  expect(master.size).toBeGreaterThan(0);
});
