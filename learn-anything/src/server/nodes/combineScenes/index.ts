import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { GraphStateType } from "src/server/state/index";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

// Set the ffmpeg binary path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Define output directory for combined videos
const videoOutputDirectory = path.resolve("./generated_videos");

// Ensure the video output directory exists
if (!fs.existsSync(videoOutputDirectory)) {
  fs.mkdirSync(videoOutputDirectory, { recursive: true });
}

async function composeScene(scene: { imagePath: string, audioPath: string, index: number }): Promise<string> {
  const { imagePath, audioPath, index } = scene;

  // Define the output path for the scene video
  const outputVideoPath = path.join(videoOutputDirectory, `scene_${index}.mp4`);

  return new Promise((resolve, reject) => {
    // Get the duration of the audio file
    ffmpeg.ffprobe(audioPath, (err, metadata) => {
      if (err) {
        console.error(`Error getting audio metadata for scene ${index}:`, err);
        return reject(err);
      }

      const audioDuration = metadata.format.duration; // Duration of the audio in seconds

      ffmpeg()
        .input(imagePath) // Input image
        .loop(audioDuration)  // Loop the image for the duration of the audio
        .input(audioPath)     // Input audio
        .outputOptions("-c:v libx264")  // Encode to h264 for video
        .outputOptions("-preset veryfast") // Set encoding speed
        .outputOptions("-movflags faststart")                // Optimize for streaming
        .outputOptions("-movflags frag_keyframe+empty_moov") // Optimize for streaming
        .outputOptions("-level:v 4.0")     // Set video level for compatibility with most devices
        .outputOptions("-profile:v main")  // Set video profile for compatibility with most devices
        .outputOptions("-pix_fmt yuv420p") // Ensure compatibility for most video players
        .outputOptions("-c:a aac")  // Encode to AAC for audio
        .outputOptions(`-t ${audioDuration}`)  // Set the duration of the video to match the audio
        .on("end", () => {
          console.log(`Video created for scene ${index}`);
          resolve(outputVideoPath);
        })
        .on("error", (err) => {
          console.error(`Error creating video for scene ${index}:`, err);
          reject(err);
        })
        .save(outputVideoPath);  // Save the resulting video
    });
  });
}


export async function combineScenes(state: GraphStateType): Promise<Partial<GraphStateType>> {
  const { scenes } = state;
  const videoPaths: string[] = [];

  // Iterate over each scene and create a video for it
  for (const [index, scene] of scenes.entries()) {
    const { imagePath, audioPath } = scene;
    if (imagePath && audioPath) {
      try {
        const videoPath = await composeScene({ imagePath, audioPath, index });
        videoPaths.push(videoPath);
      } catch (error) {
        console.error(`Failed to combine scene ${index}:`, error);
      }
    }
  }

  // Step 1: Concatenate videos
  const concatenatedVideoPath = path.join(videoOutputDirectory, "concatenated_video.mp4");
  await concatenateVideos(videoPaths, concatenatedVideoPath);

  // Step 2: Speed up the concatenated video
  const finalVideoPath = path.join(videoOutputDirectory, "final_video.mp4");
  await speedUpVideo(concatenatedVideoPath, finalVideoPath, 1.2);

  return { finalVideoPath };
}

async function concatenateVideos(videoPaths: string[], outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpegCommand = ffmpeg();

    // Create a list file for concatenation
    const listFilePath = path.join(videoOutputDirectory, 'video_list.txt');
    const fileContent = videoPaths.map(path => `file '${path}'`).join('\n');
    fs.writeFileSync(listFilePath, fileContent);

    ffmpegCommand
      .input(listFilePath)
      .inputOptions(['-f', 'concat', '-safe', '0'])
      .outputOptions('-c copy')
      .on("end", () => {
        console.log("Videos concatenated successfully.");
        fs.unlinkSync(listFilePath);  // Clean up the list file
        resolve();
      })
      .on("error", (err) => {
        console.error("Error while concatenating videos:", err);
        fs.unlinkSync(listFilePath);  // Clean up the list file
        reject(err);
      })
      .save(outputPath);
  });
}

async function speedUpVideo(inputPath: string, outputPath: string, speedFactor: number): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilters(`setpts=${1/speedFactor}*PTS`)
      .audioFilters(`atempo=${speedFactor}`)
      .on("end", () => {
        console.log("Video speed adjusted successfully.");
        resolve();
      })
      .on("error", (err) => {
        console.error("Error while adjusting video speed:", err);
        reject(err);
      })
      .save(outputPath);
  });
}


// (async () => {
//   const state: GraphStateType = {
//     scenes: [
//       { imagePath: './generated_images/scene_1.png', audioPath: './generated_audio/scene_1.mp3' },
//       { imagePath: './generated_images/scene_2.png', audioPath: './generated_audio/scene_2.mp3' }
//     ]
//   };

//   try {
//     const result = await combineScenes(state);
//     console.log("Final video path:", result.finalVideoPath);
//   } catch (error) {
//     console.error("Error combining scenes:", error);
//   }
// })();
