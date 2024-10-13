import ffmpeg

def combine(video_file,audio_file,output_file)
	input_video = ffmpeg.input(video_file)

	input_audio = ffmpeg.input(audio_file)

	ffmpeg.concat(input_video, input_audio, v=1, a=1).output(output_file).run()
