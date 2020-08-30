from pysndfx import AudioEffectsChain
from pydub import AudioSegment
import numpy as np
import io

class Effects:
    def __init__(self,audio_segment,effect,intensity):
        self.audio_segment=audio_segment
        self.effect=effect
        self.intensity=intensity
        self.samples_array=[]
        self.effect_map={
        "reverb":(
            AudioEffectsChain()

            .reverb(wet_gain=2*self.intensity)

        ),
        "distortion":    (
              AudioEffectsChain()
              .overdrive(gain=7*self.intensity)
              .limiter(gain=-7*self.intensity)
            )

        }
    def to_wav_as(self):
        '''

        converts modified audiosegment to wav formatted audiosegment

        '''
        buffer=io.BytesIO()
        self.audio_segment.export(buffer,format="WAV")
        buffer.seek(0)
        self.audio_segment=AudioSegment.from_wav(buffer)

    def as_to_array(self):
        '''

        converts pydub audiosegment to an array of samples of shape
        (length, channels)


        '''

        self.audio_segment.set_channels(2)
        samples = self.audio_segment.get_array_of_samples()
        samples = np.array(samples)
        samples = samples.reshape(self.audio_segment.channels, -1, order='F');
        samples=samples.transpose() # (<probably 2>, <len(song)
        return samples
 # (<probably 2>, <len(song)


    def array_to_as(self,left_array,right_array):
        '''

        converts arrays for left and right audio channels to a stereo pydub
        audiosegment.

        '''
        left = AudioSegment(
            left_array.tobytes(),

            frame_rate=self.audio_segment.frame_rate,
            sample_width=self.audio_segment.sample_width,
            channels=1
         )
        right=AudioSegment(
             right_array.tobytes(),

             frame_rate=self.audio_segment.frame_rate,
             sample_width=self.audio_segment.sample_width,
             channels=1
          )
        audio_segment=AudioSegment.from_mono_audiosegments(left, right)
        return audio_segment

    def add_effects(self):
        '''

        adds effects to pydub audio segment given type and intensity as
        integer values from request body

        '''
        self.to_wav_as()
        song_array=self.as_to_array()


        #Create effects chans using pysndfx





        print(song_array.shape)
        #add effects to each channel individually
        left_channel=self.effect_map[self.effect](song_array[:,0])
        right_channel=self.effect_map[self.effect](song_array[:,1])



        song_with_effects=self.array_to_as(left_channel,right_channel)






        return song_with_effects
