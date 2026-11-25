import { PoseEngine } from "./pose.js";
import { DrumAudio } from "./audio.js";
import { GestureEngine } from "./gesture.js";

const video=document.querySelector("#camera"), canvas=document.querySelector("#overlay"), ctx=canvas.getContext("2d");
const startBtn=document.querySelector("#startCamera"), stopBtn=document.querySelector("#stopCamera");
const placeholder=document.querySelector("#placeholder"), statusEl=document.querySelector("#status");
const poseState=document.querySelector("#poseState"), fpsEl=document.querySelector("#fps");
const audio=new DrumAudio(); let stream=null, pose=null, gesture=null, running=false, hits=0, lastFrame=0, frameN=0, fpsTime=0;

function logHit(name){
  hits++; document.querySelector("#hitCount").textContent=hits;
  document.querySelector("#lastHit").textContent=name.toUpperCase();
  const list=document.querySelector("#eventList");
  if(list.querySelector(".empty")) list.innerHTML="";
  const row=document.createElement("div"); row.className="event";
  row.innerHTML=`<span>${new Date().toLocaleTimeString()}</span><span>${name.toUpperCase()}</span>`;
  list.prepend(row);
}
function drawLandmarks(points){
  const w=canvas.width=video.videoWidth, h=canvas.height=video.videoHeight; ctx.clearRect(0,0,w,h);
  if(!points) return;
  const links=[[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[25,27],[24,26],[26,28]];
  ctx.lineWidth=3;ctx.strokeStyle="#c084fc";ctx.fillStyle="#f0abfc";
  for(const [a,b] of links){if(points[a]&&points[b]&&points[a].visibility>.35&&points[b].visibility>.35){ctx.beginPath();ctx.moveTo(points[a].x*w,points[a].y*h);ctx.lineTo(points[b].x*w,points[b].y*h);ctx.stroke();}}
  points.forEach(p=>{if(p&&p.visibility>.35){ctx.beginPath();ctx.arc(p.x*w,p.y*h,4,0,Math.PI*2);ctx.fill();}});
}
async function loop(){
  if(!running)return;
  if(video.readyState>=2){
    const result=await pose.detect(video);
    const points=result?.landmarks?.[0];
    drawLandmarks(points);
    if(points){poseState.textContent="CUERPO DETECTADO"; const event=gesture.update(points,performance.now()); if(event){audio.play(event);logHit(event);}}
    else poseState.textContent="BUSCANDO CUERPO";
    frameN++; const now=performance.now(); if(now-fpsTime>1000){fpsEl.textContent=`${frameN} FPS`;frameN=0;fpsTime=now;}
  }
  requestAnimationFrame(loop);
}
startBtn.addEventListener("click",async()=>{
  try{
    await audio.unlock();
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:1280},height:{ideal:720}},audio:false});
    video.srcObject=stream; await video.play();
    pose=new PoseEngine(); await pose.init();
    gesture=new GestureEngine();
    running=true;placeholder.hidden=true;startBtn.disabled=true;stopBtn.disabled=false;
    statusEl.textContent="Sistema activo";poseState.textContent="INICIANDO";loop();
  }catch(err){console.error(err);alert("No se pudo iniciar la cámara o el detector. Verifica los permisos y tu conexión a internet. Detalle: "+err.message);stopCamera();}
});
function stopCamera(){
  running=false;if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;video.srcObject=null;
  ctx.clearRect(0,0,canvas.width,canvas.height);placeholder.hidden=false;
  startBtn.disabled=false;stopBtn.disabled=true;statusEl.textContent="Cámara desactivada";poseState.textContent="ESPERANDO CÁMARA";fpsEl.textContent="— FPS";
}
stopBtn.addEventListener("click",stopCamera);
document.querySelectorAll(".drum").forEach(btn=>btn.addEventListener("click",async()=>{await audio.unlock();audio.play(btn.dataset.sound);btn.classList.add("active");logHit(btn.dataset.sound.replace("_"," "));setTimeout(()=>btn.classList.remove("active"),180);}));
document.addEventListener("keydown",async e=>{if(["INPUT","TEXTAREA"].includes(document.activeElement?.tagName))return;if(["1","2","3","4"].includes(e.key)){const names={1:"crash",2:"ride",3:"tom",4:"hit_tom"};await audio.unlock();audio.play(names[e.key]);logHit(names[e.key].replace("_"," "));const pad=document.querySelector(`[data-sound="${names[e.key]}"]`);if(pad){pad.classList.add("active");setTimeout(()=>pad.classList.remove("active"),180);}}});
document.querySelector("#clearLog").addEventListener("click",()=>{hits=0;document.querySelector("#hitCount").textContent="0";document.querySelector("#lastHit").textContent="—";document.querySelector("#eventList").innerHTML='<div class="empty">Todavía no hay golpes.<br><small>Activa la cámara y empieza a moverte.</small></div>';});
window.addEventListener("beforeunload",stopCamera);
