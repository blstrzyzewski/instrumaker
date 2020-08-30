from pydub import AudioSegment
from random import choice, choices, randint
import soundfile as sf
from glob import glob
import os
import librosa
from effects import Effects
from os.path import join, sep


def audio_clip(audio_segment, length):
    return AudioSegment.silent(duration=length).overlay(audio_segment)


def normalize(sound, target_db):
    loudness_fix = target_db - int(round(sound.max_dBFS))

    return sound.apply_gain(loudness_fix)


class beatCreator:
    def __init__(self, key, tempo):
        self.key = key
        self.tempo = tempo


class MelodyGenerator(beatCreator):
    def __init__(self, key, tempo, base_sample_folder="", fixed=False, chords=False):
        super().__init__(key, tempo)

        self.base_sample_folder = base_sample_folder
        self.fixed = fixed
        self.sample_filepath_dic = {}
        self.root_filepath = ""
        self.melody_layout = []
        self.ms_per_beat = int(round((60 / self.tempo) * 1000))
        self.loop = False
        self.loop_filepath = ""
        self.chords = chords
        self.sample_folder = "samps"

    def get_sample_folder(self):

        self.base_sample_folder = choice(
            glob(join(self.sample_folder, "lead", "samps", "*"))
        )
        # self.base_sample_folder='samps\\lead\\samps\\Chords'
        if self.fixed:
            self.base_sample_folder = choice(
                [
                    join(self.sample_folder, "lead", "samps", "Chords"),
                    join(self.sample_folder, "lead", "samps", "Synths"),
                ]
            )
            temp_list = []
            chord_str = "*"
            if "Chords" in self.base_sample_folder:
                self.chords = True
            # print(self.sample_folder+"lead\\"+chord_str)
            for directory in glob(join(self.base_sample_folder, "*")):
                print("directprui", directory)
                if self.key == directory.rsplit(sep)[-1][: len(self.key)]:
                    # #print(directory)
                    temp_list.append(directory)
            self.base_sample_folder = choice(temp_list)

        # print('xxxxxxxxxxx',self.base_sample_folder)
        if "Loops" in self.base_sample_folder:
            index_shift = 0
            self.loop = True
            self.loop_filepath = choice(
                glob(join(self.sample_folder, "lead", "Loops", "*"))
            )
            if self.loop_filepath.rsplit(sep)[-1][1] == "b":
                index_shift = 1
            self.key = self.loop_filepath.rsplit(sep)[-1][: 1 + index_shift]
            self.tempo = int(
                self.loop_filepath.rsplit(sep)[-1][5 + index_shift : 8 + index_shift]
            )
            self.ms_per_beat = int(round((60 / self.tempo) * 1000))
            return
        if "Chords" in self.base_sample_folder and not self.fixed:

            self.base_sample_folder = choice(
                glob(join(self.sample_folder, "lead", "samps", "Chords", "*"))
            )
            self.chords = True
        elif not self.fixed:
            self.base_sample_folder = choice(
                glob(join(self.sample_folder, "lead", "samps", "Synths", "*"))
            )
        x = (
            self.base_sample_folder
            + sep
            + self.base_sample_folder.rsplit(sep)[-1]
            + ".wav"
        )
        self.root_filepath = x
        key_str = self.base_sample_folder.rsplit(sep)[-1][:2]
        if "_" in key_str or " " in key_str:
            self.key = key_str[:1]
        else:
            self.key = key_str
        # print("hello sire",self.base_sample_folder,self.key)

    def create_notes(self, key_shift=0):
        notes_list = [
            "C __",
            "Db __",
            "D __",
            "Eb __",
            "E __",
            "F __",
            "Gb __",
            "G __",
            "Ab __",
            "A __",
            "Bb __",
            "B __",
        ]
        notes_list.extend(notes_list)
        index = notes_list.index(self.key + " __")
        scale = []
        transpose_list = [0, 2, 3, 5, 7, 8, 10]
        # print("chordsssssssssssss",self.chords)
        if self.chords:
            transpose_list = [0, 5, -5]

        if len(glob(join(self.base_sample_folder, "*"))) > 2:

            for x, i in enumerate([x + key_shift for x in transpose_list]):
                scale.append(notes_list[index + i])
                # if i==0 or 'Horn' in self.root_filepath or 'Trombone' in self.root_filepath:
                if i == 0:
                    self.sample_filepath_dic[x + 1] = self.root_filepath
                else:

                    if i == 8:
                        self.sample_filepath_dic[-2] = (
                            self.root_filepath[:-5]
                            + notes_list[index + i]
                            + self.root_filepath[-5:]
                        )
                    if i == 10:
                        self.sample_filepath_dic[-1] = (
                            self.root_filepath[:-5]
                            + notes_list[index + i]
                            + self.root_filepath[-5:]
                        )
                    self.sample_filepath_dic[x + 1] = (
                        self.root_filepath[:-5]
                        + notes_list[index + i]
                        + self.root_filepath[-5:]
                    )
        else:
            y, sr = librosa.load(self.root_filepath, sr=96000)
            # y=librosa.to_mono(y)
            # print("pitch shift ran")
            for x, i in enumerate([x + key_shift for x in transpose_list]):
                scale.append(notes_list[index + i])
                if (
                    i == 0
                    or "Horn" in self.root_filepath
                    or "Trombone" in self.root_filepath
                ):
                    self.sample_filepath_dic[x + 1] = self.root_filepath
                else:
                    y_shifted2 = librosa.effects.pitch_shift(y, sr, n_steps=i)
                    # print('sssssssss',self.root_filepath[:-5]+notes_list[index+i]+self.root_filepath[-5:],)
                    sf.write(
                        self.root_filepath[:-5]
                        + notes_list[index + i]
                        + self.root_filepath[-5:],
                        y_shifted2,
                        sr,
                    )
                    self.sample_filepath_dic[x + 1] = (
                        self.root_filepath[:-5]
                        + notes_list[index + i]
                        + self.root_filepath[-5:]
                    )

    def random_melody(self):

        notes_with_rhythms = []
        rhythm_list = [1, 2, 2, 1, 1, 2]
        note_list = [1, 3, 5]
        note = 0
        length_int = 1
        if self.chords:
            length_int = 1
            # rhythm_list=[0.5*x for x in rhythm_list]
            if (
                len(AudioSegment.from_file(self.sample_filepath_dic[1]))
                > 4 * self.ms_per_beat
            ):
                print("thisssssssssssssssssssssssssssssssssss")
                length_int = 2
            else:
                length_int = 1
            note_list = [1, 1, 2, 3]
        previous_note = 0
        beginning_phrase = []
        for i in range(8):
            if i == 4 and not self.chords:
                notes_with_rhythms.extend(beginning_phrase)
                continue
            if i == 5 and not self.chords:
                continue
            if i == 2:
                beginning_phrase = [
                    [x[0] + 4 * self.ms_per_beat, x[1], x[2]]
                    for x in notes_with_rhythms
                ]

            sec = 60 / self.tempo
            rhythm = choice(rhythm_list)
            print("iiiiiiiiiiii", i)
            for j in range(rhythm):
                if rhythm in [4, 2] and randint(1, 5) == 1 and not self.chords:
                    print("continueed")
                    continue
                if i > 0 and not self.chords:
                    for k in range(2):

                        try:
                            note_list.remove(note_list[note_list.index(note - 1)])
                            note_list.remove(note_list[note_list.index(note + 1)])
                        except:
                            continue

                note = choice(note_list)
                while abs(note - previous_note) > 4:
                    note = choice(note_list)
                # print("noteeee",note)

                # make one note jumps more likely
                if not self.chords:
                    if note > 1:
                        note_list.extend([note - 1, note - 1])
                    if note < 7 and note != -1:
                        note_list.extend([note + 1, note + 1])
                # make repeated hords less likely
                elif previous_note == note:
                    note = choice(note_list)
                previous_note = note
                notes_with_rhythms.append(
                    [length_int * 1000 * (i * sec + j * (sec / rhythm)), note, rhythm]
                )
            if i == 0 and not self.chords:
                note_list.extend([2, 4, 1, 3, 5, -2, -1])
            if i == 2 and not self.chords:
                rhythm_list.extend([4, 1, 2, 1, 2, 1, 1, 2, 2])
        print(self.fixed, self.chords, "jj")
        self.melody_layout = [
            [x[0] * 2 * length_int, x[1], x[2]] for x in notes_with_rhythms
        ]
        return notes_with_rhythms

    def create_melody(self, notes=None, sample_locations=None):
        note_list = [1, 2, 3, 4, 5, -2, -1]
        length_int = 1
        loop_bool = True
        if self.base_sample_folder == "":
            self.get_sample_folder()
        if self.loop:
            loop = (
                AudioSegment.silent(duration=16 * self.ms_per_beat)
                .overlay(AudioSegment.from_file(self.loop_filepath), position=0)
                .apply_gain(-10.0)
            )
            if randint(0, 4) == 2:
                loop = loop.reverse()
            loop = AudioSegment.silent(duration=16 * self.ms_per_beat).overlay(
                loop, position=0, loop=True
            )
            return [loop, self.key, self.tempo]
        if notes == None:
            self.create_notes()
            notes = self.melody_layout
        if sample_locations == None:
            sample_locations = self.random_melody()
            print("notes", sample_locations)
        if self.chords:
            note_list = [1, 2, 3]
            length_int = 2
            loop_bool = False
        length_int = 2
        samples = {}
        note_sil = AudioSegment.silent(duration=length_int * 8 * self.ms_per_beat)
        for i in note_list:

            samples[i] = AudioSegment.from_file(self.sample_filepath_dic[i]).apply_gain(
                -5.0
            )
            # print(self.ms_per_beat,'FADEETESE')
            if (
                len(samples[i]) >= int(round(0.9 * self.ms_per_beat))
                and not self.chords
            ):
                samples[i] = samples[
                    i
                ]  # .fade(to_gain=-100, start=int(round(0.9*self.ms_per_beat)), end=self.ms_per_beat)
            # else: samples[i]=samples[i].fade_in(int(round(0.5*self.ms_per_beat))).fade_out(int(round(0.5*self.ms_per_beat))).apply_gain(3.0)
            if self.chords:
                norm = -33
            else:
                norm = -36
            loudness_fix = norm - int(round(samples[i].dBFS))

            samples[i] = samples[i].apply_gain(loudness_fix)
            # print(len(samples[i]))
            # print(samples[i].dBFS)
        for i, item in enumerate(self.melody_layout):

            start_fade = int(round(length_int * 8 * self.ms_per_beat)) - 5

            if i != len(self.melody_layout) - 1:
                end_fade = int(round(self.melody_layout[i + 1][0]))
                start_fade = int(round(self.melody_layout[i + 1][0] - 5))
            # print("index",item,"start_fade",start_fade,"end fade",end_fade)
            sou = samples[item[1]]

            note_sil = note_sil.overlay(sou, position=item[0]).fade(
                to_gain=-100, start=start_fade, duration=5
            )

        note_sil = AudioSegment.silent(duration=16 * self.ms_per_beat).overlay(
            AudioSegment.silent(duration=length_int * 8 * self.ms_per_beat).overlay(
                note_sil, position=0, loop=loop_bool
            ),
            loop=True,
        )
        return note_sil, self.key, self.tempo


class Drums(beatCreator):
    def __init__(self, key, tempo):
        super().__init__(key, tempo)
        self.sample_dic = {}
        self.filepath = ""
        self.kick8_loop = None
        self.snare_loop = None
        self.hat_loop = None
        self.ms_per_beat = int(round((60 / self.tempo) * 1000))
        self.sample_folder = "samps"

    def get_samples(self):

        list_subfolders_with_paths = [
            (f.path, f.name) for f in os.scandir("samps") if f.is_dir()
        ]

        for path in list_subfolders_with_paths:

            if path[1] == "hat" or path[1] == "perc":
                self.sample_dic[path[1]] = choice(glob(join(path[0], "*.wav")))
            elif path[1] != "lead" and path[1] != "sfx":
                # print(path[0]+sep+self.key)
                self.sample_dic[path[1]] = choice(
                    glob(join(path[0], self.key, "*.wav"))
                )

    def snareLoop(self, off_beat=0):
        four_second_silence = AudioSegment.silent(duration=8 * self.ms_per_beat)
        snare = AudioSegment.from_file(self.sample_dic["snare"], sample_width=4)
        # print('snare:',snare.max)
        snare = normalize(snare, -9)
        snare = four_second_silence.overlay(
            snare, position=2 * self.ms_per_beat
        ).overlay(snare, position=6 * self.ms_per_beat)
        reverb = randint(0, 2)
        if reverb:
            effects = Effects(snare, "reverb", reverb)

            effects = effects.add_effects()
            self.snare_loop = effects
        else:
            self.snare_loop = snare
        return self.snare_loop

    def kick808Loop(self, sample_dic=None):
        if sample_dic == None:
            sample_dic = self.sample_dic
        four_second_silence = AudioSegment.silent(duration=8 * self.ms_per_beat)
        eoe = (
            AudioSegment.silent(duration=3 * self.ms_per_beat)
            .overlay(AudioSegment.from_file(sample_dic["808"], sample_width=4))
            .apply_gain(-10.3)
            .fade(to_gain=-100, start=0, end=3 * self.ms_per_beat)
        )
        eoe = normalize(eoe, -13)
        kick = AudioSegment.from_file(sample_dic["kick"], sample_width=4)
        kick = normalize(kick, -9)
        # print('kick:',kick.max_dBFS)
        # print('808:',eoe.max_dBFS)
        """
        y, sr = librosa.load(sample_dic['808'], sr=44100)
        y_shifted7 = librosa.effects.pitch_shift(y, sr, n_steps=7)
        sev_str=sample_dic['808'][:-5]+'7'+sample_dic['808'][-5:]
        librosa.output.write_wav(sev_str, y_shifted7, sr, norm=False)
        eoe7=AudioSegment.silent(duration=0.5*self.ms_per_beat).overlay(AudioSegment.from_file(sev_str,sample_width=4)).apply_gain(-11.3)
        """
        four_second_silence = four_second_silence.overlay(kick, position=0).overlay(
            eoe, position=0
        )
        if choice([1, 2]) == 2:
            four_second_silence = four_second_silence.overlay(
                kick, position=5 * self.ms_per_beat
            ).overlay(eoe, position=5 * self.ms_per_beat)
        if choice([1, 2, 3]) == 2:
            four_second_silence = (
                four_second_silence.overlay(kick, position=1.5 * self.ms_per_beat)
                .overlay(eoe, position=1.5 * self.ms_per_beat)
                .apply_gain(-1.5)
            )
        if choice([1, 2]) == 2:
            if choice([1, 2]) == 2:
                print("bbbbbb")
            # four_second_silence=four_second_silence.overlay(eoe7,position=2.5*self.ms_per_beat)
            four_second_silence = (
                four_second_silence.overlay(kick, position=3 * self.ms_per_beat)
                .overlay(eoe, position=3 * self.ms_per_beat)
                .apply_gain(-1.5)
            )

        # os.remove(sample_dic['808'][:-5]+'7'+sample_dic['808'][-5:])

        self.kick8_loop = four_second_silence
        return self.kick8_loop

    def hatLoop(self, sample_dic=None):
        if sample_dic == None:
            sample_dic = self.sample_dic
        eight_second_silence = AudioSegment.silent(duration=8 * self.ms_per_beat)
        timeList = []
        LIST = [1, 2, 2, 1, 1, 2]

        for i in range(4):

            sec = 60 / self.tempo
            x = choice(LIST)
            # print(x)
            for j in range(x):

                timeList.append(1000 * (i * sec + j * (sec / x)))

            LIST.extend([3, 4])
        hat_sil = AudioSegment.silent(duration=4 * self.ms_per_beat)
        hat = (
            AudioSegment.silent(duration=0.25 * self.ms_per_beat)
            .overlay(AudioSegment.from_file(sample_dic["hat"], sample_width=4))
            .apply_gain(-8.0)
        )
        # print('hat:',hat.max_dBFS)
        hat = normalize(hat, -9)
        if choice([1, 2]) >= 1:
            perc = (
                AudioSegment.silent(duration=0.5 * self.ms_per_beat)
                .overlay(AudioSegment.from_file(sample_dic["perc"], sample_width=4))
                .apply_gain(-0.3)
            )
            # print('perc:',perc.max_dBFS)
            perc = normalize(perc, -11)
            eight_second_silence = eight_second_silence.overlay(
                perc, position=3.5 * self.ms_per_beat
            ).overlay(perc, position=4.5 * self.ms_per_beat)
        for item in timeList:
            pos = int(round(item))
            # print(pos)
            hat_sil = hat_sil.overlay(hat, position=pos)
        if choice([1, 2, 3]) >= 2:
            eight_second_silence = eight_second_silence.overlay(
                hat_sil, position=0, loop=True
            )
        self.hat_loop = eight_second_silence
        return self.hat_loop

    def perc_loop(self, sample_locations=None):
        perc_list = []
        if sample_locations == None:
            sample_locations = join(self.sample_folder, "perc")
        for i in range(choice([1, 2, 1, 2, 3])):
            sample = choice(glob(join(sample_locations, "*")))
            # print(sample,"sample")
            sample_audio = normalize(AudioSegment.from_file(sample), -18)
            print("perc", sample_audio.dBFS)
            perc_list.append(sample_audio)
        perc = AudioSegment.silent(duration=8 * self.ms_per_beat)
        timeList = []
        LIST = [1, 2, 2, 1, 1, 2]
        perc_count = 0
        for i in range(4):
            if perc_count > 4:
                return perc
            sec = 60 / self.tempo
            x = choice(LIST)
            # print(x)
            for j in range(x):
                if i in [2, 6] and j == 0:
                    pass  # no percussion on top of snares
                if choice([1, 2, 3]) > 1:
                    posit = int(round(2000 * (i * sec + j * (sec / x))))
                    perc = perc.overlay(choice(perc_list), position=posit)
                    perc_count += 1

            # LIST.extend([3])
        return perc

    def drumLoop(self, kick=None, hat=None, snare=None):
        if self.sample_dic == {}:
            self.get_samples()
        if kick == None:
            self.kick808Loop()
            kick = self.kick8_loop
        if hat == None:
            self.hatLoop()
            # hat=self.hat_loop
            hat = self.perc_loop()
        if snare == None:
            self.snareLoop()
            snare = self.snare_loop
        four_second_silence = AudioSegment.silent(duration=8 * self.ms_per_beat)
        drum_loop = (
            four_second_silence.overlay(hat, position=0)
            .overlay(kick, position=0)
            .overlay(snare, position=0)
        )
        snare = four_second_silence.overlay(snare, position=0)
        kick = four_second_silence.overlay(kick, position=0)
        hat = four_second_silence.overlay(hat, position=0)

        return {"drums": drum_loop, "kick": kick, "snare": snare, "hat": hat}
        # return drum_loop
