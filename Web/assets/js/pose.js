import { PoseLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
export class PoseEngine{
  async init(){
    const vision=await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm");
    this.detector=await PoseLandmarker.createFromOptions(vision,{
      baseOptions:{modelAssetPath:"https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",delegate:"GPU"},
      runningMode:"VIDEO",numPoses:1
    });
  }
  async detect(video){return this.detector.detectForVideo(video,performance.now());}
}
