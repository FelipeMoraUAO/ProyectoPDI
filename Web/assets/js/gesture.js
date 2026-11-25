// Clasificador heurístico provisional. Sustituir por el modelo temporal entrenado
// desde training/train_model_colab.ipynb antes de presentar como reconocimiento final.
export class GestureEngine{
  constructor(){this.history=[];this.lastHit=0;this.cooldown=280;this.threshold=.12;}
  update(p,now){
    // MediaPipe Pose indices: 11/12 hombros, 13/14 codos, 15/16 muñecas, 23/24 caderas.
    if(!p||p.length<25)return null;
    const L=p[15],R=p[16],LS=p[11],RS=p[12],LH=p[23],RH=p[24];
    if([L,R,LS,RS,LH,RH].some(x=>!x||x.visibility<.45))return null;
    const pose={
      crash:R.x>RS.x+.16&&R.y<RS.y-.12,
      ride:L.x<LS.x-.16&&L.y<LS.y-.02,
      tom:R.x>RS.x+.12&&R.y>RS.y+.05&&R.y<LH.y+.08,
      hit_tom:L.x>LS.x-.12&&L.x<LS.x+.22&&L.y>LS.y-.02&&L.y<LH.y+.18
    };
    const active=Object.keys(pose).find(k=>pose[k]);
    this.history.push({t:now,active});if(this.history.length>8)this.history.shift();
    if(!active||now-this.lastHit<this.cooldown)return null;
    // Requiere entrada reciente desde estado sin gesto para evitar sonido sostenido.
    const previous=this.history.slice(0,-2);
    if(previous.some(x=>x.active===active))return null;
    this.lastHit=now;return active;
  }
}
