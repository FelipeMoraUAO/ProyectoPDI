export class DrumAudio{
  async unlock(){if(!this.ctx)this.ctx=new (window.AudioContext||window.webkitAudioContext)();if(this.ctx.state==="suspended")await this.ctx.resume();}
  play(name){
    if(!this.ctx)return;const c=this.ctx,t=c.currentTime;
    const gain=c.createGain();gain.connect(c.destination);
    if(name==="crash"||name==="ride"){
      const length= c.sampleRate*.65, buffer=c.createBuffer(1,length,c.sampleRate),data=buffer.getChannelData(0);
      for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length)**(name==="crash"?1.6:3);
      const src=c.createBufferSource();src.buffer=buffer;const hp=c.createBiquadFilter();hp.type="highpass";hp.frequency.value=name==="crash"?4500:6500;src.connect(hp);hp.connect(gain);gain.gain.setValueAtTime(name==="crash"?.38:.22,t);gain.gain.exponentialRampToValueAtTime(.001,t+.65);src.start(t);
    }else{
      const osc=c.createOscillator();osc.type=name==="tom"?"sine":"triangle";osc.frequency.setValueAtTime(name==="tom"?150:190,t);osc.frequency.exponentialRampToValueAtTime(name==="tom"?65:70,t+.16);
      gain.gain.setValueAtTime(name==="tom"?.8:.55,t);gain.gain.exponentialRampToValueAtTime(.001,t+.22);osc.connect(gain);osc.start(t);osc.stop(t+.24);
      if(name==="hit_tom"){const len=c.sampleRate*.18,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);const s=c.createBufferSource();s.buffer=b;s.connect(gain);s.start(t);}
    }
  }
}
