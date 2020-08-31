from flask import Flask, render_template, url_for,flash,make_response,request,redirect,jsonify,Response,send_file,send_from_directory,after_this_request,session
import urllib.request
import zipfile
import os
import zipfile
from generators import Drums,MelodyGenerator
from effects import Effects
from werkzeug.wsgi import wrap_file
from werkzeug.utils import secure_filename
from pysndfx import AudioEffectsChain
import random,librosa
import soundfile as sf
import glob
import tempfile
import shutil
import numpy as np
from flask_cors import CORS,cross_origin

import io
import datetime

from pydub import AudioSegment
app = Flask(__name__)
CORS(app,expose_headers=['key','tempo'])

UPLOAD_FOLDER = './uploads'

app.permanent_session_lifetime=datetime.timedelta(minutes=2)






def drum_obj(obj,track):
    possible_tracks=["drums","snare","kick","hat"]
    if track=="drums":
        return obj.drumLoop()
    elif track=="snare":
        return obj.snareLoop()
    elif track=="kick":
        return obj.kick808Loop()
    elif track=="hat":
        return obj.hatLoop()

@app.route("/get_one_track",methods=["GET"])
def get_one_track():
    
    key=request.args["key"]
    tempo=int(request.args["tempo"])
    track= request.args["track"]
    print(key,tempo)
    w=Drums(key,tempo)
    w.get_samples()
    response=None
    ms_per_beat=int(round((60/tempo)*1000))
    audio_segment=drum_obj(w,track)
    
    
    
    silence=AudioSegment.silent(duration=64*ms_per_beat)
    drums=silence.overlay(audio_segment,position=32*ms_per_beat,loop=True)
    
    item=io.BytesIO()
    drums.export(item,format="wav")
    item.seek(0)
    response = make_response(send_file(item,mimetype="audio/wav"))
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.cache_control.max_age = 5
    response.headers["key"]=key
    response.headers["tempo"]=tempo
    return response
@app.route('/get_drum_tracks',methods=["GET"])
def get_drum_tracks():
    
    tempo=int(request.args['tempo'])
    ms_per_beat=int(round((60/tempo)*1000))

    print(ms_per_beat,tempo)
    track_key=request.args["key"]
    print("tempo",tempo,"Key",track_key)
    drums=Drums(track_key,tempo)
    audioDict=drums.drumLoop()
    outputdict={}
 


    zippy=io.BytesIO()
    for key  in audioDict:
            silence=AudioSegment.silent(duration=64*ms_per_beat)
            drums=silence.overlay(audioDict[key],position=32*ms_per_beat,loop=True)
           
            item=io.BytesIO()
            drums.export(item,format="wav")
            item.seek(0)
            outputdict[key]=item
    with zipfile.ZipFile(zippy,"w") as zip:
        for key in outputdict:
            with zip.open(key+".wav","w")as file:
                file.write(outputdict[key].read())
        
    zippy.seek(0)
    response =make_response(send_file(zippy,mimetype="application/zip"))
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.cache_control.max_age = 5
    response.headers["key"]=track_key
    response.headers["tempo"]=tempo
    return response








@app.route('/')
def index():

    	# ... do stuff with dirpath

    return render_template('index.html')

@app.route('/save-record', methods=['POST'])
def save_record():
    melody=AudioSegment.from_file(request.files['file'])
    y=AudioSegment.from_file(request.files['files'])
    z=melody.overlay(y,position=0)
    beat=io.BytesIO()
    z.export(beat, format="wav")
    beat.seek(0)
    response =make_response(send_file(beat,mimetype="audio/wav"))
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.cache_control.max_age = 5
    return response


@app.route('/combine_drums',methods=["POST"])
def combine_drums():
    print("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",request.form)
    tempo=int(request.form["tempo"])
    ms_per_beat=int(round((60/tempo)*1000))
    silence=AudioSegment.silent(duration=64*ms_per_beat)
    for file in request.files:
        print(file)
        silence=silence.overlay(AudioSegment.from_file(request.files[file]))
    temp=io.BytesIO()
    silence.export(temp,format="wav")
    temp.seek(0)
    response= make_response(send_file(temp,mimetype="audio/wav"))
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.cache_control.max_age = 5
    return response
    
@app.route('/getDrums',methods=["GET"])

def getDrums():
    print(request)




    tempo=int(request.args['tempo'])
    ms_per_beat=int(round((60/tempo)*1000))
    print(ms_per_beat,tempo)
    key=request.args['key']
    w=Drums(key,tempo)
    drums=w.drumLoop()["drums"]
    silence=AudioSegment.silent(duration=64*ms_per_beat)
    drums=silence.overlay(drums,position=32*ms_per_beat,loop=True)
    print("sample_width",drums.sample_width,"frame_width",drums.frame_width,"frame_rate",drums.frame_rate,"channels",drums.channels)




    drums_np=io.BytesIO(drums.raw_data)
    data,sr=sf.read(drums_np,samplerate=drums.frame_rate,channels=drums.channels, format="RAW",subtype="PCM_32")
    tempy=io.BytesIO()


    #melody_np = melody_np.reshape(melody.channels, -1, order='F')
    #melody_np=np.transpose(melody_np)
    #print(melody_np.shape) # (<probably 2>, <len(song) in samples>)
    fx = (
        AudioEffectsChain()

        .reverb(wet_gain=1)
      #  .overdrive(gain=99)
       # .delay(gain_out=1.0)
       # .phaser(gain_out=1,speed=1.2)

    )
    fx(data)
    #melody=AudioSegment.from_file('C:\\Users\\Brandon\\Desktop\\soundGen\\mel ody1.wav')
    tempy=io.BytesIO()



    sf.write(tempy,data,sr,format="WAV")
    tempy.seek(0)
    print('wwww',len(drums),len(drums.raw_data))
   # indStr=str(random.randint(1,1000))
    #dfilename='drums'+indStr+'.wav'
    #drums.export(session["dirpath"]+'\\drums\\'+dfilename, format="wav")
    #return send_file(session["dirpath"]+'\\drums\\'+dfilename)
    return send_file(tempy,mimetype="audio/wav")


def sfx(tempo):
    loop_bool=False
    ms_per_beat=int(round((60/tempo)*1000))
    sfx=random.choice(glob.glob("samps\\sfx\\*"))
    sfx_audio=AudioSegment.from_file(sfx).apply_gain(-10.0).fade_in(duration=int(round(0.25*ms_per_beat))).fade_out(duration=int(round(0.25*ms_per_beat)))
    print(sfx_audio.dBFS)
    loudness_fix=-46-int(round(sfx_audio.dBFS))
    sfx_audio=sfx_audio.apply_gain(loudness_fix)
    if len(sfx_audio)<14*ms_per_beat:
        loop_bool=True
        sfx_audio=AudioSegment.silent(duration=16*ms_per_beat).overlay(sfx_audio)
    return AudioSegment.silent(duration=32*ms_per_beat).overlay(sfx_audio,loop=loop_bool)
@app.route('/audioOptions',  methods=['GET'])
@cross_origin()
def audio_options():

    Melody=''
    print(request)

    tempo=random.randint(int(request.args['tempoMin']),int(request.args['tempoMax']))


    if int(request.args['fixed'])==1:

        Melody=MelodyGenerator(request.args['key'],tempo,fixed=True)

    else:
        Melody=MelodyGenerator('C',tempo)





    melody,key,tempo=Melody.create_melody()

   
    print(key)
    ms_per_beat=int(round((60/tempo)*1000))
    sfx_S=sfx(tempo)
    
    silence=AudioSegment.silent(duration=64*ms_per_beat)
    melody=silence.overlay(melody,position=0,loop=True).overlay(sfx_S,position=0).fade_in(duration=8*ms_per_beat)


    effects=Effects(melody,"reverb",3)
    effects=effects.add_effects()
    file_buffer=io.BytesIO()

    effects.export(file_buffer,format="WAV")
    file_buffer.seek(0)
    response = make_response(send_file(file_buffer,mimetype="audio/wav"))

    response.headers.add('Access-Control-Expose-Headers','key')
    response.headers.add('Access-Control-Expose-Headers','tempo')
    response.headers.add("key",key) 
    response.headers['tempo']=tempo
    #response.headers['Access-Control-Allow-Origin']= '*'
    
    response.cache_control.max_age = 5
    response.headers["dic"]={"kick":[1,2,3,4],"snare":[1,3,5]}
    print (response.headers)
    return response










if __name__=="__main__":
    app.run(debug=True)
