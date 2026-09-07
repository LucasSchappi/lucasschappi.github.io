(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=function(e){return e[e.Ocean=0]=`Ocean`,e[e.Coast=1]=`Coast`,e[e.Ice=2]=`Ice`,e[e.Tundra=3]=`Tundra`,e[e.Taiga=4]=`Taiga`,e[e.Grassland=5]=`Grassland`,e[e.Forest=6]=`Forest`,e[e.Rainforest=7]=`Rainforest`,e[e.Savanna=8]=`Savanna`,e[e.Desert=9]=`Desert`,e[e.Mountain=10]=`Mountain`,e[e.Snowcap=11]=`Snowcap`,e[e.Marsh=12]=`Marsh`,e[e.Lake=13]=`Lake`,e}({}),t=[{name:`Ocean`,color:[26,56,94],carrying:.15,travel:8,arable:0,wood:0,herds:0},{name:`Coastal Water`,color:[46,96,138],carrying:.3,travel:6,arable:0,wood:0,herds:.18},{name:`Ice Shelf`,color:[222,232,240],carrying:0,travel:2.4,arable:0,wood:0,herds:.12},{name:`Tundra`,color:[148,152,130],carrying:.3,travel:1.5,arable:.08,wood:.12,herds:.62},{name:`Taiga`,color:[72,100,74],carrying:.62,travel:1.6,arable:.3,wood:.95,herds:.72},{name:`Grassland`,color:[128,148,78],carrying:.82,travel:1,arable:.95,wood:.32,herds:.95},{name:`Forest`,color:[70,108,60],carrying:.95,travel:1.3,arable:.55,wood:1,herds:.78},{name:`Rainforest`,color:[44,96,52],carrying:1.2,travel:1.6,arable:.4,wood:1,herds:.45},{name:`Savanna`,color:[162,156,88],carrying:.68,travel:1,arable:.5,wood:.48,herds:1},{name:`Desert`,color:[196,176,124],carrying:.12,travel:1.3,arable:.05,wood:.05,herds:.14},{name:`Mountain`,color:[126,122,118],carrying:.28,travel:2.2,arable:.05,wood:.38,herds:.34},{name:`Snowcap`,color:[238,242,246],carrying:0,travel:2.6,arable:0,wood:0,herds:.05},{name:`Marsh`,color:[92,116,92],carrying:.9,travel:1.5,arable:.35,wood:.58,herds:.66},{name:`Lake`,color:[58,108,150],carrying:.4,travel:6,arable:0,wood:0,herds:.2}];function n(e){return e===0||e===1||e===13}var r=768/320,i=294912,a=i/131072,o=.455,s=.055,c=.0035,l=.02,u=2.6,d=.22,f=.07,p=.22,m=.03,h=class{w=768;h=384;elevation=new Float32Array(i);filled=new Float32Array(i);flow=new Float32Array(i);lake=new Float32Array(i);waterLevel=new Float32Array(i);runoff=new Float32Array(i);runoffDelta=new Float32Array(i);wetCells=new Int32Array(i);wetCount=0;storm=new Float32Array(i);waterDist=new Uint16Array(i);waterSrc=new Int32Array(i);bfsQueue=new Int32Array(i);temp=new Float32Array(i);tempMean=new Float32Array(i);rain=new Float32Array(i);moisture=new Float32Array(i);fertility=new Float32Array(i);vegetation=new Float32Array(i);trees=new Float32Array(i);game=new Float32Array(i);stone=new Float32Array(i);ore=new Float32Array(i);biome=new Uint8Array(i);blessing=new Float32Array(i);rainMod=new Float32Array(i);tempMod=new Float32Array(i);scorch=new Float32Array(i);sacred=new Float32Array(i);settlementAt=new Int32Array(i).fill(-1);terrainDirty=!0;drainOrder=new Int32Array;idx(e,t){return t*768+e}wrapX(e){return(e%768+768)%768}inBounds(e){return e>=0&&e<384}neighbor(e,t){let n=e%768,r=(e/768|0)+y[t];return r<0||r>=384?-1:r*768+this.wrapX(n+v[t])}isLand(e){return(this.sterile||this.elevation[e]>=.455)&&this.waterLevel[e]<=.001}isWaterCell(e){return!this.isLand(e)}latitude(e){return e/383*2-1}dx(e,t){let n=t-e;return n>768/2?n-=768:n<-768/2&&(n+=768),n}dist(e,t,n,r){let i=this.dx(e,n),a=r-t;return Math.sqrt(i*i+a*a)}starWarmth=0;starPulse=0;sterile=!1;updateTemperature(e,t=1){let n=e/360*Math.PI*2,r=Math.sin(n),i=1-.98**t;for(let e=0;e<384;e++){let t=this.latitude(e),n=34+this.starWarmth+this.starPulse-50*Math.abs(t)**1.6,a=r*t*22,s=e*768;for(let e=0;e<768;e++){let t=s+e,r=this.elevation[t],c=r>.455?(r-o)*78:0,l=this.isWaterCell(t)?.35:1,u=n+a*l-c+this.tempMod[t];u+=this.rainMod[t]<0?-this.rainMod[t]*12:0,this.temp[t]=u,this.tempMean[t]+=(u-a*l-this.tempMean[t])*i}}}settleClimate(){let e=[0,90,180,270],t=new Float32Array(i),n=new Float32Array(i);for(let r of e){this.updateTemperature(r),this.updateMoisture();for(let e=0;e<i;e++)t[e]+=this.temp[e],n[e]+=this.rain[e]}for(let r=0;r<i;r++)this.tempMean[r]=t[r]/e.length,this.moisture[r]=n[r]/e.length}updateMoisture(){for(let e=0;e<384;e++){let t=Math.abs(this.latitude(e)),n=t<.33||t>.66?-1:1,i=Math.max(.02,Math.cos(this.latitude(e)*(Math.PI/2))),a=e*768,o=.5,s=n>0?0:767;for(let e=0;e<2;e++){let t=this.elevation[a+this.wrapX(s-n)];for(let c=0;c<768;c++){let l=a+this.wrapX(s+n*c),u=this.elevation[l];if(this.isWaterCell(l)){let e=Math.max(0,Math.min(1,(this.temp[l]+8)/42))*(.42/r)*i;o=Math.min(1.8,o+e)}else{let n=Math.max(0,u-t)*14*r,a=o*Math.min(.85,.052/r*i+n);o-=a,e===1&&(this.rain[l]=a)}e===1&&this.isWaterCell(l)&&(this.rain[l]=.35),o*=.9988**(i/r),t=u}}for(let e=0;e<768;e++){let t=a+e,n=this.rain[t]/Math.max(.15,i)*20*r+this.rainMod[t];n=Math.max(0,Math.min(1,n)),n**=.5,this.rain[t]=n,this.moisture[t]+=(n-this.moisture[t])*.03}}}effectiveMoisture(e){return Math.max(0,Math.min(1,this.moisture[e]+this.rainMod[e]*.8))}treeCapacity(e){if(this.sterile||this.isWaterCell(e))return 0;let n=Math.max(0,Math.min(1,(this.tempMean[e]+8)/14));return t[this.biome[e]].wood*(.3+.7*this.effectiveMoisture(e))*(.4+.6*this.fertility[e])*n*Math.max(0,1-this.scorch[e])}gameCapacity(e){if(this.sterile||this.isWaterCell(e))return 0;let n=Math.max(.45,Math.min(1,(this.tempMean[e]+30)/34)),r=.35+.65*Math.min(1,this.vegetation[e]*1.4);return t[this.biome[e]].herds*r*n*Math.max(.15,1-this.scorch[e])}updateVegetation(e){for(let n=0;n<i;n++){if(this.isWaterCell(n)){this.vegetation[n]=t[this.biome[n]].carrying,this.trees[n]=0,this.game[n]=0;continue}let r=this.treeCapacity(n),i=this.trees[n],a=.022*i*(1-i/Math.max(.02,r));this.trees[n]=Math.max(0,Math.min(r,i+(a+4e-4*r)*e));let o=this.gameCapacity(n),s=this.game[n],c=.09*s*(1-s/Math.max(.02,o));this.game[n]=Math.max(0,Math.min(o,s+(c+.0022*o)*e));let l=this.sterile?0:t[this.biome[n]].carrying*(.45+.55*this.effectiveMoisture(n))*(.5+.5*this.fertility[n])*(1+this.blessing[n])*Math.max(0,1-this.scorch[n]),u=Math.max(0,Math.min(1,(this.temp[n]+5)/17)),d=this.vegetation[n],f=.45*u*d*(1-d/Math.max(.02,l));this.vegetation[n]=Math.max(0,Math.min(l,d+(f+.006*u*l)*e)),this.blessing[n]*=.9985,this.rainMod[n]*=.985,this.tempMod[n]*=.985;let p=Math.max(0,-this.rainMod[n]),m=this.scorch[n];this.scorch[n]=m<p?Math.min(1,m+(p-m)*.09*e):Math.max(0,m-Math.max(.004,(m-p)*.06)*e),this.sacred[n]*=.99995}}recomputeHydrology(e){let{elevation:t,filled:n,flow:r,lake:a}=this;n.set(t);let o=new Uint8Array(i);e.clear();for(let n=0;n<i;n++){let r=n/768|0;(t[n]<.455||r===0||r===383)&&(o[n]=1,e.push(t[n],n))}for(;e.size>0;){let r=e.peekKey(),i=e.pop();n[i]=r;for(let n=0;n<8;n++){let a=this.neighbor(i,n);if(a<0||o[a])continue;o[a]=1;let s=Math.max(t[a],r+1e-5);e.push(s,a)}}for(let e=0;e<i;e++)a[e]=t[e]>=.455?Math.max(0,n[e]-t[e]):0;let s=0;for(let e=0;e<i;e++)t[e]>=.455&&s++;this.drainOrder.length!==s&&(this.drainOrder=new Int32Array(s));let c=0;for(let e=0;e<i;e++)t[e]>=.455&&(this.drainOrder[c++]=e);let l=this.drainOrder,u=n,d=Array.from(l);d.sort((e,t)=>u[t]-u[e]),l.set(d),r.fill(0);for(let e=0;e<l.length;e++){let t=l[e];r[t]+=.25+this.moisture[t];let n=-1,i=u[t];for(let e=0;e<8;e++){let r=this.neighbor(t,e);r<0||u[r]<i&&(i=u[r],n=r)}n>=0&&(r[n]+=r[t])}this.buildWaterField()}boilDry(e){this.sterile=!0,this.recomputeHydrology(e),this.lake.fill(0),this.runoff.fill(0),this.settleWater(),this.settleClimate(),this.vegetation.fill(0),this.trees.fill(0),this.game.fill(0),this.classifyBiomes(),this.terrainDirty=!0}refillOceans(e){this.sterile=!1,this.recomputeHydrology(e),this.settleWater(),this.settleClimate(),this.classifyBiomes();for(let e=0;e<i;e++)this.isWaterCell(e)||(this.vegetation[e]=this.gameCapacity(e)>0?.04:0,this.trees[e]=this.treeCapacity(e)*.02,this.game[e]=this.gameCapacity(e)*.05);this.scorch.fill(0),this.terrainDirty=!0}settleWater(){this.waterLevel.set(this.lake)}updateWater(e){let{lake:t,waterLevel:n,runoff:r,storm:a,rainMod:u,elevation:d}=this,h=!1;this.wetCount=0;for(let n=0;n<i;n++){let i=a[n];if(i>.02){a[n]=Math.max(0,i-p*e);let t=Math.max(0,Math.min(1,(d[n]-o)*5.5)),c=(.3+Math.max(0,Math.min(1,(this.filled[n]-d[n])*24))*1.5)*(1.25-t*1.1);r[n]=Math.min(f,r[n]+i*s*e*c),h=!0}else u[n]<-.05&&t[n]>.001&&(r[n]=Math.max(-t[n],r[n]+u[n]*m*e),h=!0);if(r[n]>0){let i=1+Math.max(0,Math.min(1,(d[n]-o)*5.5))*1.6;r[n]=Math.max(0,r[n]-c*i*(t[n]>.001?.25:1)*e),r[n]>.0015&&(this.wetCells[this.wetCount++]=n),h=!0}else r[n]<0&&u[n]>=-.05&&(r[n]=Math.min(0,r[n]+l*e),h=!0)}this.flowRunoff(e);for(let a=0;a<i;a++){let i=Math.max(0,t[a]+r[a]),o=n[a],s=i-o;s>1e-5?(n[a]=Math.min(i,o+s*Math.min(1,9*e)),h=!0):s<-1e-5&&(n[a]=Math.max(i,o+s*Math.min(1,22*e)),h=!0)}h&&(this.terrainDirty=!0)}flowRunoff(e){let{runoff:t,runoffDelta:n,elevation:r,wetCells:i}=this;if(this.wetCount===0)return;let a=this.wetCount,o=Math.min(.42,u*e);for(let e=0;e<a;e++)n[i[e]]=0;for(let e=0;e<a;e++){let a=i[e],s=t[a];if(s<=.0015)continue;let c=a%768,l=a/768|0,u=r[a]+s,d=0,f=0,p=this.flowScratch;for(let e=0;e<4;e++){let n=e===0?c-1:e===1?c+1:c,i=e===2?l-1:e===3?l+1:l;if(i<0||i>=384){p[e]=-1;continue}let a=i*768+(n%768+768)%768,o=u-(r[a]+t[a]);if(o<=1e-5){p[e]=-1;continue}p[e]=a,this.flowDrop[e]=o,f+=o}if(!(f<=0)){d=Math.min(s*.5,f*.5*o);for(let e=0;e<4;e++){let o=p[e];if(o<0)continue;t[o]<=.0015&&this.wetCount<294912&&(n[o]=0,i[this.wetCount++]=o);let s=d*(this.flowDrop[e]/f);n[a]-=s,r[o]>=.455&&(n[o]+=s)}}}for(let e=0;e<this.wetCount;e++){let r=i[e];t[r]=Math.max(0,Math.min(d,t[r]+n[r]))}}flowScratch=new Int32Array(4);flowDrop=new Float32Array(4);buildWaterField(){let{waterDist:e,waterSrc:t}=this,n=this.bfsQueue,r=0,a=0;e.fill(65535),t.fill(-1);for(let r=0;r<i;r++)(this.waterLevel[r]>.002||this.elevation[r]<.455||this.isRiver(r))&&(e[r]=0,t[r]=r,n[a++]=r);for(;r<a;){let i=n[r++],o=e[i];if(!(o>=_))for(let r=0;r<8;r++){let s=this.neighbor(i,r);s<0||e[s]!==65535||(e[s]=o+1,t[s]=t[i],n[a++]=s)}}}riverFlow(e){if(this.sterile||this.elevation[e]<.455||this.flow[e]<=403.2)return 0;let t=Math.min(1,.25+Math.log2(this.flow[e]/g)*.3),n=1-Math.min(.92,this.scorch[e]*1.7)+Math.min(.5,this.storm[e]*.3);return Math.max(0,Math.min(1,t*n))}isRiver(e){return this.riverFlow(e)>.08}waterAvailability(e){let t=this.waterDist[e];if(t===0)return 1;let n=t<_?Math.max(0,1-t/(25*r)):0;return Math.max(n,Math.min(.85,this.effectiveMoisture(e)*.95))}meanLandTemp(){let e=0,t=0;for(let n=0;n<384;n++){let r=Math.max(.02,Math.cos(this.latitude(n)*(Math.PI/2))),i=n*768;for(let n=0;n<768;n++){let a=i+n;this.elevation[a]<.455&&!this.sterile||(e+=this.tempMean[a]*r,t+=r)}}return t>0?e/t:0}thawedLand(){let t=0,n=0;for(let r=0;r<384;r++){let i=Math.max(.02,Math.cos(this.latitude(r)*(Math.PI/2))),a=r*768;for(let r=0;r<768;r++){let o=a+r;this.elevation[o]<.455||(n+=i,this.biome[o]!==e.Ice&&this.biome[o]!==e.Snowcap&&(t+=i))}}return n>0?t/n:0}classifyBiomes(){for(let e=0;e<i;e++)this.biome[e]=this.classify(e)}classify(t){let n=this.elevation[t],r=this.tempMean[t],i=this.moisture[t];return n<.455&&!this.sterile?r<-10?e.Ice:n>.41000000000000003?e.Coast:e.Ocean:this.sterile?n>.66?e.Mountain:e.Desert:this.waterLevel[t]>.004?r<-10?e.Ice:e.Lake:r<-17?e.Ice:n>.78?r<-2?e.Snowcap:e.Mountain:n>.66?e.Mountain:r<-7?e.Tundra:this.flow[t]>403.2*.55&&i>.5&&n<.55?e.Marsh:r<2?i>.24?e.Taiga:e.Tundra:i<.06?e.Desert:r>26?i>.38?e.Rainforest:i>.09?e.Savanna:e.Desert:i>.34?e.Forest:e.Grassland}arability(e){if(this.isWaterCell(e))return 0;let n=t[this.biome[e]],r=this.waterAvailability(e),i=Math.max(0,Math.min(1,(this.tempMean[e]+7)/15));return n.arable*this.fertility[e]*r*i*(1+this.blessing[e]*.8)}travelCost(e){return t[this.biome[e]].travel}biomeName(e){return t[this.biome[e]].name}isOpenWater(e){return n(this.biome[e])}},g=70*r*r,_=Math.round(40*r),v=[0,1,1,1,0,-1,-1,-1],y=[-1,-1,0,1,1,1,0,-1],b=Math.PI*2,x=Math.PI/2-.015,S=.45,C=4.2,w=.0015,T=class{lon=0;lat=0;altitude=C;ground=!1;heading=0;pitch=0;groundLift=0;viewW=1;viewH=1;eye=new Float32Array(3);rayBasis=new Float32Array(9);rightAxis=new Float32Array(3);upAxis=new Float32Array(3);fwdAxis=new Float32Array(3);tanFov=S;targetDist=1;constructor(){this.update()}setViewport(e,t){this.viewW=e,this.viewH=t,this.update()}get systemBlend(){return O(C*1.1,16,this.altitude)}get tilt(){return this.ground?Math.max(.5,Math.min(1.45,1.14+this.pitch)):O(2.2,.07,this.altitude)*1.15}get pixelsPerTile(){return this.viewH/2/(this.tanFov*this.targetDist)*b/768}get reliefAmplitude(){return this.ground?.042:.02*O(2.5,.3,this.altitude)}update(){let e=E(this.lon,this.lat),t=ee(D([0,1,0],e)),n=D(e,t),r=this.tilt,i=this.altitude,a=i*Math.cos(r),o=i*Math.sin(r),s=this.ground?Math.cos(this.heading):-1,c=this.ground?Math.sin(this.heading):0,l=[t[0]*c-n[0]*s,t[1]*c-n[1]*s,t[2]*c-n[2]*s],u=1+(this.ground?this.groundLift:0),d=[e[0]*(u+a)-l[0]*o,e[1]*(u+a)-l[1]*o,e[2]*(u+a)-l[2]*o];this.eye[0]=d[0],this.eye[1]=d[1],this.eye[2]=d[2];let f=this.ground?this.groundLift+.0016:0,p=[e[0]*(1+f),e[1]*(1+f),e[2]*(1+f)],m=ee([p[0]-d[0],p[1]-d[1],p[2]-d[2]]);this.targetDist=Math.max(1e-4,Math.hypot(p[0]-d[0],p[1]-d[1],p[2]-d[2]));let h=ee(D(m,this.ground?e:n)),g=D(h,m);te(this.fwdAxis,m),te(this.rightAxis,h),te(this.upAxis,g);let _=this.viewW/Math.max(1,this.viewH),v=this.ground?S*1.35:S;this.tanFov=v;let y=this.rayBasis;y[0]=h[0]*v*_,y[1]=h[1]*v*_,y[2]=h[2]*v*_,y[3]=g[0]*v,y[4]=g[1]*v,y[5]=g[2]*v,y[6]=m[0],y[7]=m[1],y[8]=m[2]}rotate(e,t){let n=this.pixelsPerTile*768/b,r=-e/n;return this.lon+=r,this.lat+=t/n,this.lon>Math.PI?this.lon-=b:this.lon<-Math.PI&&(this.lon+=b),this.lat=Math.max(-x,Math.min(x,this.lat)),this.update(),r}zoomAt(e,t,n){let r=this.unproject(t,n);if(this.altitude=Math.max(w,Math.min(340,this.altitude/e)),this.update(),!r)return;let i=this.unproject(t,n);if(!i)return;let a=(r.x-i.x)/768*b;a>Math.PI?a-=b:a<-Math.PI&&(a+=b),this.lon+=a,this.lat=Math.max(-x,Math.min(x,this.lat+(r.y-i.y)/384*Math.PI)),this.update()}lookAt(e,t){this.lon=e/768*b,this.lat=Math.max(-x,Math.min(x,(t/384-.5)*Math.PI)),this.update()}faces(e,t){let n=E(e/768*b,(t/384-.5)*Math.PI);return n[0]*this.eye[0]+n[1]*this.eye[1]+n[2]*this.eye[2]>=1}project(e,t){let n=E(e/768*b,(t/384-.5)*Math.PI),r=n[0]-this.eye[0],i=n[1]-this.eye[1],a=n[2]-this.eye[2],o=r*this.fwdAxis[0]+i*this.fwdAxis[1]+a*this.fwdAxis[2],s=r*this.rightAxis[0]+i*this.rightAxis[1]+a*this.rightAxis[2],c=r*this.upAxis[0]+i*this.upAxis[1]+a*this.upAxis[2],l=this.viewW/Math.max(1,this.viewH),u=s/Math.max(1e-6,o*S*l),d=c/Math.max(1e-6,o*S);return{x:(u*.5+.5)*this.viewW,y:(.5-d*.5)*this.viewH,z:o}}unproject(e,t){let n=e/this.viewW*2-1,r=1-t/this.viewH*2,i=this.rayBasis,a=ee([i[0]*n+i[3]*r+i[6],i[1]*n+i[4]*r+i[7],i[2]*n+i[5]*r+i[8]]),o=this.eye,s=o[0]*a[0]+o[1]*a[1]+o[2]*a[2],c=o[0]*o[0]+o[1]*o[1]+o[2]*o[2]-1,l=s*s-c;if(l<0)return null;let u=-s-Math.sqrt(l);if(u<0)return null;let d=o[0]+a[0]*u,f=o[1]+a[1]*u,p=o[2]+a[2]*u,m=Math.asin(Math.max(-1,Math.min(1,f))),h=Math.atan2(d,p)/b*768;h=(h%768+768)%768;let g=Math.max(0,Math.min(383.999,(m/Math.PI+.5)*384));return{x:h,y:g}}};function E(e,t){let n=Math.cos(t);return[n*Math.sin(e),Math.sin(t),n*Math.cos(e)]}function D(e,t){return[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]]}function ee(e){let t=Math.hypot(e[0],e[1],e[2])||1;return[e[0]/t,e[1]/t,e[2]/t]}function te(e,t){e[0]=t[0],e[1]=t[1],e[2]=t[2]}function O(e,t,n){let r=Math.max(0,Math.min(1,(n-e)/(t-e)));return r*r*(3-2*r)}var k=9e3,A=function(e){return e[e.Idle=0]=`Idle`,e[e.Forage=1]=`Forage`,e[e.Drink=2]=`Drink`,e[e.Rest=3]=`Rest`,e[e.Socialize=4]=`Socialize`,e[e.Farm=5]=`Farm`,e[e.Worship=6]=`Worship`,e[e.Migrate=7]=`Migrate`,e[e.Court=8]=`Court`,e[e.Flee=9]=`Flee`,e[e.Build=10]=`Build`,e[e.Pilgrimage=11]=`Pilgrimage`,e[e.Raid=12]=`Raid`,e[e.Chop=13]=`Chop`,e[e.Mine=14]=`Mine`,e[e.Craft=15]=`Craft`,e[e.Settle=16]=`Settle`,e[e.Hunt=17]=`Hunt`,e[e.Trade=18]=`Trade`,e}({}),j=function(e){return e[e.None=0]=`None`,e[e.Axe=1]=`Axe`,e[e.Pick=2]=`Pick`,e[e.Hoe=3]=`Hoe`,e[e.Staff=4]=`Staff`,e[e.Spear=5]=`Spear`,e[e.Bow=6]=`Bow`,e[e.WarAxe=7]=`WarAxe`,e[e.Sword=8]=`Sword`,e}({}),ne=[`bare hands`,`an axe`,`a pick`,`a hoe`,`a staff`,`a spear`,`a bow`,`a war axe`,`a sword`],M=[1,1.15,1.1,1,1,2,1.7,2.4,3];function re(e){return e>=5}var ie=[`idle`,`foraging`,`drinking`,`resting`,`talking`,`farming`,`worshipping`,`migrating`,`courting`,`fleeing`,`building`,`on pilgrimage`,`raiding`,`felling timber`,`quarrying stone`,`at the workbench`,`claiming land`,`hunting`,`carrying goods to trade`],ae=class{alive=new Uint8Array(k);x=new Float32Array(k);y=new Float32Array(k);prevX=new Float32Array(k);prevY=new Float32Array(k);stepSpeed=new Float32Array(k);age=new Float32Array(k);sex=new Uint8Array(k);hunger=new Float32Array(k);thirst=new Float32Array(k);fatigue=new Float32Array(k);loneliness=new Float32Array(k);health=new Float32Array(k);carried=new Float32Array(k);carriedWood=new Float32Array(k);carriedStone=new Float32Array(k);carriedOre=new Float32Array(k);boat=new Uint8Array(k);coat=new Float32Array(k);hides=new Float32Array(k);tool=new Uint8Array(k);toolWear=new Float32Array(k);act=new Uint8Array(k);actTimer=new Float32Array(k);targetX=new Float32Array(k);targetY=new Float32Array(k);claimX=new Float32Array(k);claimY=new Float32Array(k);claimKingdom=new Int32Array(k);settlement=new Int32Array(k);religion=new Int32Array(k);fervor=new Float32Array(k);awe=new Float32Array(k);fear=new Float32Array(k);mother=new Int32Array(k);father=new Int32Array(k);partner=new Int32Array(k);pregnancy=new Float32Array(k);generation=new Uint16Array(k);born=new Float32Array(k);nameSeed=new Uint32Array(k);culture=new Uint8Array(k);lastMiracleDay=new Float32Array(k);lastMiracleKind=new Int8Array(k);witnessCount=new Uint16Array(k);dissent=new Float32Array(k);piety=new Float32Array(k);boldness=new Float32Array(k);sociability=new Float32Array(k);industry=new Float32Array(k);aggression=new Float32Array(k);count=0;high=0;free=[];spawn(e,t,n){let r;if(this.free.length)r=this.free.pop();else if(this.high<9e3)r=this.high++;else return-1;return this.alive[r]=1,this.count++,this.x[r]=t,this.y[r]=n,this.prevX[r]=t,this.prevY[r]=n,this.stepSpeed[r]=0,this.age[r]=0,this.sex[r]=+!!e.chance(.5),this.hunger[r]=e.range(.1,.4),this.thirst[r]=e.range(.1,.4),this.fatigue[r]=e.range(0,.3),this.loneliness[r]=e.range(0,.3),this.health[r]=1,this.carried[r]=0,this.carriedWood[r]=0,this.carriedStone[r]=0,this.carriedOre[r]=0,this.coat[r]=0,this.hides[r]=0,this.boat[r]=0,this.tool[r]=0,this.toolWear[r]=0,this.act[r]=0,this.actTimer[r]=0,this.targetX[r]=t,this.targetY[r]=n,this.claimX[r]=-1,this.claimY[r]=-1,this.claimKingdom[r]=-1,this.settlement[r]=-1,this.religion[r]=-1,this.fervor[r]=0,this.awe[r]=0,this.fear[r]=0,this.mother[r]=-1,this.father[r]=-1,this.partner[r]=-1,this.pregnancy[r]=-1,this.generation[r]=0,this.nameSeed[r]=e.nextU32(),this.lastMiracleDay[r]=-9999,this.lastMiracleKind[r]=-1,this.witnessCount[r]=0,this.dissent[r]=0,this.piety[r]=e.range(.2,.8),this.boldness[r]=e.range(.2,.8),this.sociability[r]=e.range(.2,.8),this.industry[r]=e.range(.2,.8),this.aggression[r]=e.range(.1,.6),r}kill(e){if(!this.alive[e])return;this.alive[e]=0,this.count--;let t=this.partner[e];t>=0&&this.alive[t]&&this.partner[t]===e&&(this.partner[t]=-1),this.free.push(e)}inherit(e,t,n,r){let i=i=>{let a=r.f(),o=i[t]*a+i[n]*(1-a)+r.normal(0,.07);i[e]=Math.max(0,Math.min(1,o))};i(this.piety),i(this.boldness),i(this.sociability),i(this.industry),i(this.aggression),this.mother[e]=t,this.father[e]=n,this.generation[e]=Math.max(this.generation[t],this.generation[n])+1,this.religion[e]=this.religion[t],this.fervor[e]=this.fervor[t]*.35*this.piety[e],this.settlement[e]=this.settlement[t],this.culture[e]=this.culture[t]}d2(e,t,n){let r=t-this.x[e];r>768/2?r-=768:r<-768/2&&(r+=768);let i=n-this.y[e];return r*r+i*i}},oe=4,se=Math.ceil(768/oe),ce=Math.ceil(384/oe),le=se*ce,ue=class{counts=new Int32Array(le);starts=new Int32Array(le+1);cursor=new Int32Array(le);items=new Int32Array(k);rebuild(e){this.counts.fill(0);for(let t=0;t<e.high;t++)e.alive[t]&&this.counts[this.bucketOf(e.x[t],e.y[t])]++;let t=0;for(let e=0;e<le;e++)this.starts[e]=t,this.cursor[e]=t,t+=this.counts[e];this.starts[le]=t;for(let t=0;t<e.high;t++){if(!e.alive[t])continue;let n=this.bucketOf(e.x[t],e.y[t]);this.items[this.cursor[n]++]=t}}bucketOf(e,t){let n=Math.min(se-1,Math.max(0,e/oe|0));return Math.min(ce-1,Math.max(0,t/oe|0))*se+n}query(e,t,n,r,i){let a=Math.ceil(n/oe),o=e/oe|0,s=t/oe|0,c=n*n;for(let n=-a;n<=a;n++){let l=s+n;if(!(l<0||l>=ce))for(let n=-a;n<=a;n++){let a=((o+n)%se+se)%se,s=l*se+a,u=this.starts[s],d=this.starts[s+1];for(let n=u;n<d;n++){let a=this.items[n];if(r.d2(a,e,t)<=c&&i(a)===!0)return}}}}countNear(e,t,n,r){let i=0;return this.query(e,t,n,r,()=>{i++}),i}},de=`b.d.g.h.k.l.m.n.p.r.s.t.v.z.th.sh.kh.br.dr.gr.kr.tr.vl.zh.ng.y.w.f.j.ch`.split(`.`),fe=[`a`,`e`,`i`,`o`,`u`,`ae`,`ei`,`ou`,`ia`,`au`,`y`,`oa`],pe=[``,``,``,`n`,`r`,`l`,`s`,`m`,`k`,`th`,`sh`,`rn`,`st`,`ld`],me=class e{onsets;nuclei;codas;constructor(e){this.onsets=he(e,de,7,11),this.nuclei=he(e,fe,4,7),this.codas=he(e,pe,4,8)}syllables(){return[this.onsets,this.nuclei,this.codas]}static from(t,n,r){let i=Object.create(e.prototype);return i.onsets=t,i.nuclei=n,i.codas=r,i}drift(t){let n=Object.create(e.prototype);return n.onsets=ge(t,this.onsets,de),n.nuclei=ge(t,this.nuclei,fe),n.codas=ge(t,this.codas,pe),n}word(e,t=2,n=3){let r=e.int(t,n+1),i=``;for(let t=0;t<r;t++)i+=e.pick(this.onsets)+e.pick(this.nuclei),(t===r-1||e.chance(.3))&&(i+=e.pick(this.codas));return i.charAt(0).toUpperCase()+i.slice(1)}personName(e){return this.word(e,2,e.chance(.25)?3:2)}placeName(e){let t=this.word(e,2,3);return e.chance(.3)?t+e.pick([`ford`,`holm`,`gard`,`vale`,`reach`,`mere`]):t}};function he(e,t,n,r){let i=e.int(n,r+1),a=t.slice(),o=[];for(let t=0;t<i&&a.length;t++)o.push(a.splice(e.int(0,a.length),1)[0]);return o}function ge(e,t,n){let r=t.slice(),i=e.int(1,3);for(let t=0;t<i;t++)if(r.length>3&&e.chance(.45))r.splice(e.int(0,r.length),1);else{let t=e.pick(n);r.includes(t)||r.push(t)}return r.length?r:t.slice()}var _e=[`the Watcher`,`the Unseen`,`the Storm-Father`,`the Deep One`,`the Kindling`,`the Merciful`,`the Wrathful`,`the Sleeper`,`the Many-Eyed`,`the Sunderer`,`the Green Hand`,`the Bright Mother`,`the Hollow King`,`the Last Voice`];function N(e,t){let n=e.f(),r=t.word(e,2,3);return n<.3?`Cult of ${r}`:n<.5?`${r}, ${e.pick(_e)}`:n<.7?`The ${r}${e.pick([`ites`,`ari`,`ken`,`faith`,`hold`])}`:n<.85?`Way of ${r}`:`${r} Orthodoxy`}var ve={keep:1,hall:3,pyramid:4},ye={hall:1,keep:2.6,pyramid:5.5},be=[{work:`keep`,wallers:!0,names:`locative`,placeSuffixes:[`ford`,`bury`,`cester`,`ton`,`mere`,`stead`],crownStyles:[e=>`Kingdom of ${e}`,e=>`Realm of ${e}`,e=>`${e} Crown`],weapon:j.Sword,blurb:`Wall-builders. They hold ground by making it expensive, and put a keep at the middle of every town worth keeping.`,demonyms:[`folk`,`shire`,`march`]},{work:`hall`,wallers:!1,names:`patronymic`,placeSuffixes:[`holm`,`vik`,`garth`,`ness`,`fell`,`by`],crownStyles:[e=>`${e} Jarldom`,e=>`Halls of ${e}`,e=>`${e}mark`],weapon:j.WarAxe,blurb:`Hall-builders and seafarers. They do not wall their towns — their answer to an enemy is the water, and the long ships on it.`,demonyms:[`men`,`kin`,`sons`]},{work:`pyramid`,wallers:!1,names:`compound`,placeSuffixes:[`at`,`kal`,`un`,`ixa`,`teo`],crownStyles:[e=>`${e} Dominion`,e=>`Sun-Throne of ${e}`,e=>`${e} Ascendancy`],weapon:j.Spear,blurb:`Pyramid-builders. They raise tombs that outlast everyone who cut them, and count their years in stone rather than in walls.`,demonyms:[`ixil`,`atl`,`ka`]},{work:`pyramid`,wallers:!0,names:`locative`,placeSuffixes:[`ur`,`kar`,`zin`,`apt`,`esh`],crownStyles:[e=>`${e} Empire`,e=>`Great House of ${e}`,e=>`${e} Throne`],weapon:j.Bow,blurb:`Builders in mud brick and stone. They wall their cities and raise stepped tombs above them, and keep the whole account in writing.`,demonyms:[`ites`,`ai`,`ur`]},{work:`hall`,wallers:!0,names:`plain`,placeSuffixes:[`dun`,`brae`,`loch`,`more`,`ach`],crownStyles:[e=>`${e} Confederation`,e=>`Clans of ${e}`,e=>`${e}land`],weapon:j.WarAxe,blurb:`Highland clans. A hall for the chief and a ring of stone around it, and a name that is one word and no more.`,demonyms:[`clans`,`folk`,`kith`]},{work:`keep`,wallers:!1,names:`compound`,placeSuffixes:[`pol`,`gard`,`ova`,`sk`,`grad`],crownStyles:[e=>`${e} Principality`,e=>`${e} Rus`,e=>`Grand ${e}`],weapon:j.Bow,blurb:`Riverfolk. A stone keep above the landing and open ground around it, because a wall is no use against people who arrive by water.`,demonyms:[`ovi`,`ians`,`ni`]}],xe=class{list=[];found(e,t){let n=be[t%be.length],r=new me(e),i=r.word(e,2,2),a={id:this.list.length,name:i+e.pick(n.demonyms),phonology:r,work:n.work,wallers:n.wallers,names:n.names,weapon:n.weapon,placeSuffixes:n.placeSuffixes,crownStyles:n.crownStyles,blurb:n.blurb};return this.list.push(a),a}get(e){return this.list[e]??null}restore(e,t){let n=be[e.archetype%be.length],r={id:e.id,name:e.name,phonology:t,work:e.work,wallers:e.wallers,names:e.names,weapon:e.weapon??n.weapon,placeSuffixes:e.placeSuffixes,crownStyles:n.crownStyles,blurb:e.blurb};return this.list[e.id]=r,r}archetypeOf(e){return be.findIndex(t=>t.blurb===e.blurb)}};function Se(e,t){let n=e.phonology.word(t,2,3);return e.placeSuffixes.length&&t.chance(.55)?n+t.pick(e.placeSuffixes):n}function Ce(e,t){return t.pick(e.crownStyles)(e.phonology.word(t,2,3))}function we(e,t,n,r,i){let a=e.phonology.word(t,2,t.chance(.25)?3:2);switch(e.names){case`patronymic`:return r?`${a} ${r}${n?`sdottir`:`sson`}`:a;case`locative`:return i?`${a} of ${i}`:a;case`compound`:return a+e.phonology.word(t,1,2).toLowerCase();default:return a}}var P=function(e){return e[e.World=0]=`World`,e[e.Life=1]=`Life`,e[e.Society=2]=`Society`,e[e.Faith=3]=`Faith`,e[e.Divine=4]=`Divine`,e[e.Death=5]=`Death`,e[e.War=6]=`War`,e}({}),Te=class{entries=[];cap=600;revision=0;all(){return this.entries}load(e){this.entries=e,this.revision++}add(e,t,n,r,i=-1,a=-1){this.entries.push({day:e,kind:t,weight:n,text:r,x:i,y:a}),this.entries.length>this.cap&&this.entries.splice(0,this.entries.length-this.cap),this.revision++}recent(e,t=0){let n=[];for(let r=this.entries.length-1;r>=0&&n.length<e;r--)this.entries[r].weight>=t&&n.push(this.entries[r]);return n}get length(){return this.entries.length}},F=function(e){return e[e.Reverence=0]=`Reverence`,e[e.Dread=1]=`Dread`,e[e.Sacrifice=2]=`Sacrifice`,e[e.Nature=3]=`Nature`,e[e.Conquest=4]=`Conquest`,e[e.Craft=5]=`Craft`,e}({}),Ee=[`Reverence`,`Dread`,`Sacrifice`,`Nature`,`Conquest`,`Craft`],De=class{list=[];found(e,t,n,r,i,a=-1){let o=new Float32Array(6);for(let e=0;e<6;e++)o[e]=Oe(i?i[e]+r.normal(0,.22):r.range(.1,.9));let s=r.f()*360,c={id:this.list.length,name:N(r,n),founded:e,founder:t,parent:a,phonology:n,tenets:o,color:ke(s,.82,.52),followers:0,meanFervor:0,sacredSites:[],alive:!0,peak:0};return this.list.push(c),c}get(e){return e>=0&&e<this.list.length?this.list[e]:null}addSacredSite(e,t){let n=this.get(e);!n||n.sacredSites.includes(t)||(n.sacredSites.push(t),n.sacredSites.length>24&&n.sacredSites.shift())}static distance(e,t){let n=0;for(let r=0;r<6;r++){let i=e.tenets[r]-t.tenets[r];n+=i*i}return Math.sqrt(n/6)}living(){return this.list.filter(e=>e.alive&&e.followers>0)}};function Oe(e){return e<0?0:e>1?1:e}function ke(e,t,n){let r=(1-Math.abs(2*n-1))*t,i=e/60,a=r*(1-Math.abs(i%2-1)),o=0,s=0,c=0;i<1?[o,s,c]=[r,a,0]:i<2?[o,s,c]=[a,r,0]:i<3?[o,s,c]=[0,r,a]:i<4?[o,s,c]=[0,a,r]:i<5?[o,s,c]=[a,0,r]:[o,s,c]=[r,0,a];let l=n-r/2;return[Math.round((o+l)*255),Math.round((s+l)*255),Math.round((c+l)*255)]}function Ae(e){return 24+e.pop*3}function je(e,t=!0,n=1){return 6+e.pop*1.2+(Pe(e)?10*n:0)+(t&&e.castle>=1&&e.walls<1?30:0)}function Me(e){return{stone:10*e,timber:12*e,ore:2*e}}function Ne(e){let t=1+Math.floor((e.pop-12)/26);return Math.max(1,Math.min(e.worksCap||1,t))}function Pe(e){return e.pop<12||e.tech<2||Be(e)<=.45?!1:e.castle<1||e.works<Ne(e)}function Fe(e){return Math.max(6,e.pop*5)}function Ie(e){return Math.min(6,1+Math.floor(e.pop/10))}function Le(e){let t=0;for(let n=1;n<9;n++)t+=e.toolRack[n];return t}function Re(e){let t=e.timber<e.pop*.8?1.2:.35,n=e.stone<e.pop*.4?1:.3,r=e.food<e.pop*2.5?1.1:.4,i=e.shrine>1?.5:.05,a=e.kingdom>=0&&e.atWar,o=a?2.2:e.hardship>.35?.9:.08,s=ze(e),c=e.tech>=2&&e.timber>8,l=e.ore>=1.5,u=e.ore>=4&&e.tech>=2,d=[j.Spear];c&&d.push(j.Bow),l&&d.push(j.WarAxe),u&&d.push(j.Sword);let f=d.includes(s)?s:d[d.length-1],p=e.toolRack,m=[0,t/(1+p[j.Axe]),n/(1+p[j.Pick]),r/(1+p[j.Hoe]),i/(1+p[j.Staff]),0,0,0,0];m[f]=o/(1+p[f]*(a?.25:1));let h=j.Axe;for(let e=2;e<9;e++)m[e]>m[h]&&(h=e);return h}function ze(e){return e.favouredWeapon||j.Spear}function Be(e){if(e.pop<=0)return 1;let t=Math.max(1,e.households);return Math.max(0,Math.min(1,e.houses/t))}var Ve=class{list=[];found(e,t,n,r,i,a,o){let s=n%e.w,c=n/e.w|0,l={id:this.list.length,name:o,x:s,y:c,cell:n,founded:t,alive:!0,pop:0,households:0,food:46,fields:[],shrine:0,timber:16,stone:14,ore:2,hides:3,boats:0,castle:0,works:0,extraWork:0,worksCap:1,walls:0,toolRack:new Int32Array(9),houses:0,houseProgress:0,craftProgress:0,tech:0,religion:i,kingdom:-1,phonology:r,culture:a,atWar:!1,favouredWeapon:0,ruinSize:0,ruinedOn:-1,hardship:0,headman:-1,grudge:new Map,siege:0,besiegedBy:-1,takenOn:-999,peakPop:0,founderReligion:i,lastFamineDay:-9999,lastFaithShift:-9999};return this.list.push(l),e.settlementAt[n]=l.id,l}get(e){return e>=0&&e<this.list.length?this.list[e]:null}abandon(e,t){t.alive=!1,t.ruinSize=Math.min(1,t.peakPop/60)*.55+Math.min(1,t.castle)*.3+Math.min(1,t.walls)*.15,e.settlementAt[t.cell]===t.id&&(e.settlementAt[t.cell]=-1);for(let n of t.fields)e.settlementAt[n]===t.id&&(e.settlementAt[n]=-1);t.fields.length=0}living(){return this.list.filter(e=>e.alive)}ruins(){return this.list.filter(e=>!e.alive&&e.ruinSize>.02)}updateFields(e,t,n){let i=Math.min(28,Math.floor(t.pop*.8)+(t.tech>0?2:0));if(t.fields.length>=i){for(;t.fields.length>i;){let n=t.fields.pop();e.settlementAt[n]===t.id&&(e.settlementAt[n]=-1)}return}let a=-1,o=.05;for(let i=0;i<10;i++){let i=Math.round(n.range(-5,5)*r),s=Math.round(n.range(-5,5)*r),c=e.wrapX(t.x+i),l=t.y+s;if(!e.inBounds(l))continue;let u=e.idx(c,l);if(e.settlementAt[u]!==-1||e.isWaterCell(u))continue;let d=e.arability(u)/(1+.06/r*(Math.abs(i)+Math.abs(s)));d>o&&(o=d,a=u)}a>=0&&(t.fields.push(a),e.settlementAt[a]=t.id)}},He=.05,Ue=He;function We(e){Ue=Math.max(He,Math.min(1,e))}function Ge(){return Ue}var Ke=288;function qe(e){Ke=Math.max(8,e)}function Je(){return Ke}function Ye(e,t,n,i,a){let o=e.dx(t,i),s=a-n,c=Math.max(4,Math.min(48,Math.ceil(Math.hypot(o,s)/r)));for(let r=1;r<c;r++){let i=r/c,a=e.wrapX(Math.round(t+o*i)),l=Math.round(n+s*i);if(!e.inBounds(l)||e.isWaterCell(e.idx(a,l)))return!0}return!1}var Xe=42*r,Ze=70*r,Qe=6,$e=3,et=2.6,tt=14,nt=110*r,rt=216,it=9*r,at=22*r,ot=11,st=16*r,ct=34,lt=2.4,ut=.004,dt=.32;function ft(e,t){return e===j.Axe&&t===A.Chop?2.4:e===j.Pick&&t===A.Mine?3:e===j.Hoe&&t===A.Farm?1.7:e===j.Axe&&t===A.Build?1.3:1}var pt=4/24,mt=360/6;function ht(e){return Pe(e)?10:0}function gt(e,t){let n=t/e.world.w-e.dayFraction;return n-Math.floor(n)}function _t(e,t){return Math.abs(gt(e,t)-.5)<pt}function vt(e,t){let n=e.agents,r=e.world,i=Ue;n.age[t]+=i/6;let a=n.age[t]<12?.45+n.age[t]/12*.55:1;n.hunger[t]=Math.min(1.6,n.hunger[t]+i*a/Qe),n.thirst[t]=Math.min(1.6,n.thirst[t]+i/$e),n.fatigue[t]=Math.min(1.4,n.fatigue[t]+i/et),n.loneliness[t]=Math.min(1.2,n.loneliness[t]+i/tt);let o=I(r,n.x[t],n.y[t]);if(i>=.4){let i=e.settlements.get(n.settlement[t]);if(i&&i.alive&&n.hunger[t]>.25&&i.food>.4){let e=Math.min(i.food,n.hunger[t]*Qe*.5);i.food-=e,Tt(n,t,e)}n.thirst[t]>.25&&r.waterAvailability(o)>.5&&(n.thirst[t]=Math.max(0,n.thirst[t]-.8))}let s=0;n.hunger[t]>.85&&(s+=(n.hunger[t]-.85)*1.6),n.thirst[t]>.9&&(s+=(n.thirst[t]-.9)*1.8);let c=e.settlements.get(n.settlement[t]),l=c&&r.dist(n.x[t],n.y[t],c.x,c.y)<6*2.4?Be(c):0,u=r.waterLevel[o];u>.004&&(s+=Math.min(1.4,(u-.004)*45));let d=r.temp[o];n.coat[t]=Math.max(0,n.coat[t]-ut*i);let f=n.coat[t],p=n.mother[t];n.age[t]<14&&p>=0&&n.alive[p]&&(f=Math.max(f,n.coat[p]*.85));let m=1-f*.6;d<-10&&(s+=(-10-d)*.011*(1-l*.85)*m);let h=Math.max(l*.9,Math.min(.55,r.trees[o]*1.4));return d>48&&(s+=(d-48)*.013*(1-h)),n.age[t]>45&&(s+=(n.age[t]-45)*.004),s>0?n.health[t]-=s*i:n.health[t]=Math.min(1,n.health[t]+.06*i),n.health[t]<=0?!1:(n.awe[t]*=1-.0012*i,n.fear[t]*=1-.006*i,n.fervor[t]*=1-.0012*i,!0)}function yt(e,t){let n=e.agents,r=n.act[t];return n.thirst[t]>.7&&r!==A.Drink||r!==A.Migrate&&e.world.tempMean[I(e.world,n.x[t],n.y[t])]<Lt(e,t)||n.hunger[t]>.85&&r!==A.Forage&&r!==A.Hunt&&r!==A.Migrate||n.fatigue[t]>1.05&&r!==A.Rest||n.fear[t]>.75&&r!==A.Flee||n.health[t]<.4&&r!==A.Rest&&r!==A.Drink&&r!==A.Forage&&r!==A.Hunt?!0:n.claimKingdom[t]>=0&&r===A.Settle?!1:!!(_t(e,n.x[t])&&(r===A.Farm||r===A.Chop||r===A.Build||r===A.Mine||r===A.Craft||r===A.Socialize||r===A.Worship||r===A.Forage&&n.hunger[t]<.55))}function bt(e,t){let n=e.agents,i=e.world,a=e.rng,o=n.x[t],s=n.y[t],c=I(i,o,s),l=e.religions.get(n.religion[t]),u=e.settlements.get(n.settlement[t]);if(n.age[t]<6){let e=n.mother[t],r=n.father[t],i=e>=0&&n.alive[e]?e:r>=0&&n.alive[r]?r:-1,a=n.age[t]>=2&&n.hunger[t]>.55;if(i>=0&&!a&&n.thirst[t]<.75&&n.fatigue[t]<1.1){n.act[t]=A.Migrate,n.targetX[t]=n.x[i],n.targetY[t]=n.y[i],n.actTimer[t]=.35;return}}if(n.claimKingdom[t]>=0&&n.claimX[t]>=0&&n.hunger[t]<.8&&n.thirst[t]<.75&&n.fatigue[t]<1.15){n.act[t]=A.Settle,n.targetX[t]=n.claimX[t],n.targetY[t]=n.claimY[t],n.actTimer[t]=1.5;return}let d=A.Idle,f=.02,p=o,m=s,h=Math.max(.04,1-Math.max(n.hunger[t]*1.15,n.thirst[t]*1.3,n.fatigue[t]*.75)),g=(e,t,n,r)=>{let i=t*(.9+a.f()*.2);i>f&&(f=i,d=e,p=n,m=r)};if(n.thirst[t]>.25){i.waterAvailability(c)>=dt&&g(A.Drink,Wt(n.thirst[t])*3.2,o,s);let r=kt(e,o,s);if(r>=0){let e=i.dist(o,s,r%i.w,r/i.w|0);g(A.Drink,Wt(n.thirst[t])*3.4/(1+e*.08),r%i.w,r/i.w|0)}}let _=_t(e,o);{let e=u?1.25:1;g(A.Rest,Wt(n.fatigue[t])*2.2*(_?1.8:.28)*e,o,s)}let v=_?.18:1,y=_&&n.hunger[t]<.55?.5:1,b=Math.max(.12,1-Math.max(0,n.hunger[t]-.4)*2),x=n.act[t]===A.Raid;if(_)if(u&&!x){let e=i.dist(o,s,u.x,u.y),t=(.55+Be(u)*.9)*b;e>5.28?g(A.Migrate,3.4*t,u.x,u.y):g(A.Rest,4.4*t,u.x,u.y)}else g(A.Rest,(x?1.9:2.4)*b,o,s);if(n.hunger[t]>.2){if(u&&u.food>.5&&i.dist(o,s,u.x,u.y)>6){let e=i.dist(o,s,u.x,u.y),r=Math.min(1,u.food/Math.max(1,u.pop*.5));g(A.Migrate,Ut(n.hunger[t])*3.2*r/(1+e*.05),u.x,u.y)}let r=Mt(e,o,s);if(r.cell>=0){let e=1-(l?l.tenets[F.Nature]:0)*.45*(1-n.hunger[t]);g(A.Forage,Wt(n.hunger[t])*3*r.score*e*y,r.cell%i.w,r.cell/i.w|0)}}{let r=Math.max(0,Math.min(1,(6-i.tempMean[c])/18))*(1-n.coat[t]);if(n.hunger[t]>.25||r>.15){let a=Nt(e,o,s);if(a.cell>=0){let e=1-(l?l.tenets[F.Nature]:0)*.35*(1-n.hunger[t]),o=Math.max(Wt(n.hunger[t])*2.6,r*3.2);g(A.Hunt,o*a.score*e*(.55+n.industry[t]*.7)*y,a.cell%i.w,a.cell/i.w|0)}}}if(u&&u.fields.length>0&&u.tech>0){let e=Math.max(0,1-u.food/Fe(u)),r=l?.6+l.tenets[F.Craft]*.8:.6,o=u.fields[a.int(0,u.fields.length)];g(A.Farm,e*n.industry[t]*1.9*r*v*(1-n.hunger[t]*.4),o%i.w,o/i.w|0)}if(u&&u.timber<Ae(u)){let r=At(e,o,s);if(r.cell>=0){let e=1-Be(u),a=1-u.timber/Math.max(1,Ae(u)),o=Math.max(.35,e,a,l?l.tenets[F.Craft]*.5:.3);g(A.Chop,o*(.4+n.industry[t])*2.8*r.score*h*v,r.cell%i.w,r.cell/i.w|0)}}if(u&&(u.stone<je(u)||u.ore<2)){let r=jt(e,o,s,u.ore<2&&Pe(u)?1.5:.5);if(r.cell>=0){let a=n.tool[t]===j.Pick?1.6:.7,o=Math.max(.3,1-u.stone/Math.max(1,je(u))),s=ye[e.cultures.get(u.culture)?.work??`keep`],c=Pe(u)&&u.stone<10*s?2.1:1;g(A.Mine,o*(.4+n.industry[t])*2.2*r.score*h*v*a*c,r.cell%i.w,r.cell/i.w|0)}}if(u&&u.timber>=2&&u.stone>=1+ht(u)&&Le(u)<u.pop){let e=1-Le(u)/Math.max(1,u.pop);g(A.Craft,e*(.35+n.industry[t])*2.4*h*v,u.x,u.y)}if(u){let r=1-Be(u),i=u.timber>=6,a=Pe(u)&&u.stone>=1,o=(e.cultures.get(u.culture)?.wallers??!0)&&u.castle>=1&&u.walls<1&&u.stone>=6;if(i&&r>.02&&g(A.Build,Math.sqrt(r)*(.5+n.industry[t])*3.4*h*v,u.x,u.y),a||o)g(A.Build,(.6+n.industry[t])*2.6*h*v,u.x,u.y);else{let e=n.piety[t]*(l?.5+l.tenets[F.Reverence]:.3),r=Math.max(0,1+u.pop*.06-u.shrine);g(A.Build,e*r*.9*n.industry[t]*h*v*(u.food>u.pop?1:.25),u.x,u.y)}}if(l){let e=Math.min(1.3,u?.4+u.shrine*.25:.2),r=Math.min(1.4,.3+i.sacred[c]*.4),d=n.fervor[t]*n.piety[t]*(.4+n.awe[t]*.8+n.fear[t]*l.tenets[F.Dread]),f=l.tenets[F.Sacrifice]*.22;if(g(A.Worship,d*e*r*1.8*(h+f),o,s),l.sacredSites.length&&n.fervor[t]>.55&&n.hunger[t]<.6){let e=l.sacredSites[a.int(0,l.sacredSites.length)],r=e%i.w,c=e/i.w|0,u=i.dist(o,s,r,c);u>3*2.4&&g(A.Pilgrimage,n.fervor[t]*n.piety[t]*1.5*h*Math.min(1.4,.35+i.sacred[e])*(1/(1+u*.03)),r,c)}}if(n.loneliness[t]>.3&&e.index.countNear(o,s,6*2.4,n)>1&&g(A.Socialize,Ut(n.loneliness[t])*n.sociability[t]*1.8*h,o,s),n.partner[t]<0&&n.age[t]>=16&&n.age[t]<45&&n.hunger[t]<.7){let r=zt(e,t);r>=0&&g(A.Court,2.6*(.4+n.sociability[t])*h,n.x[r],n.y[r])}if(n.fear[t]>.55){let e=a.f()*Math.PI*2,c=(6+n.fear[t]*14)*r;g(A.Flee,Wt(n.fear[t])*2.4*(1-n.boldness[t]*.7),i.wrapX(Math.round(o+Math.cos(e)*c)),Ht(i,s+Math.sin(e)*c))}if(u&&u.kingdom>=0&&n.age[t]>16&&n.age[t]<50){let r=e.kingdoms.get(u.kingdom)?.campaign??null;r&&i.dist(u.x,u.y,r.musterX,r.musterY)>Xe&&(r=null);let a=r?e.settlements.get(r.target):null,c=a&&a.alive?r.gathering?{x:r.musterX,y:r.musterY}:{x:a.x,y:a.y}:Bt(e,t,u.kingdom);if(c){let e=i.dist(o,s,c.x,c.y),r=.12+n.aggression[t]*n.aggression[t];g(A.Raid,r*8.5*h/(1+e*.012),c.x,c.y)}}if(l&&l.tenets[F.Conquest]>.5&&n.age[t]>16&&n.age[t]<50){let r=Vt(e,t);if(r){let e=u?u.grudge.get(r.religion)??0:0,a=i.dist(o,s,r.x,r.y);g(A.Raid,l.tenets[F.Conquest]*n.aggression[t]*(.5+e)*1.4*h/(1+a*.05),r.x,r.y)}}if(u&&u.tech>=1&&n.age[t]>16&&n.age[t]<55&&Pt(u)>0){let r=Ft(e,u);if(r){let e=i.dist(o,s,r.x,r.y),a=r.kingdom===u.kingdom?1:1.35;g(A.Trade,.9*a*(.4+n.sociability[t])*h*v/(1+e*.02),r.x,r.y)}}{let r=It(e,c),a;if(u){let e=Math.min(1,u.food/Math.max(1,u.pop*2.5));a=(1-r)*.9*(1-e)+Math.min(1,u.hardship)*.8}else a=(1-r)*.9+.25;if(i.tempMean[c]<Lt(e,t)&&(a=Math.max(a,1.4)),a>.25){let r=Rt(e,t);r>=0&&g(A.Migrate,a*(.45+n.boldness[t])*1.3,r%i.w,r/i.w|0)}}if(n.act[t]=d,n.targetX[t]=p,n.targetY[t]=m,n.actTimer[t]=.5+e.rng.f()*1,d===A.Idle)if(_)n.act[t]=A.Rest,n.targetX[t]=u?u.x:o,n.targetY[t]=u?u.y:s;else{let c=Mt(e,o,s);if(c.cell>=0&&c.score>.25)n.act[t]=A.Forage,n.targetX[t]=c.cell%i.w,n.targetY[t]=c.cell/i.w|0;else{let e=a.f()*Math.PI*2,c=(4+a.f()*12)*r,l=i.wrapX(Math.round(o+Math.cos(e)*c)),u=Math.round(s+Math.sin(e)*c);i.inBounds(u)&&!i.isWaterCell(i.idx(l,u))?(n.act[t]=A.Migrate,n.targetX[t]=l,n.targetY[t]=u):n.act[t]=A.Rest}}}function xt(e,t){let n=e.agents,i=e.world,a=Ue,o=Dt(e,t,a),s=I(i,n.x[t],n.y[t]);switch(n.act[t]){case A.Drink:(o||Ot(i,s)||i.waterAvailability(s)>=dt)&&(n.thirst[t]=Math.max(0,n.thirst[t]-4*a),n.thirst[t]<=.02&&(n.actTimer[t]=0));break;case A.Forage:if(o||i.vegetation[s]>.12){let e=Math.min(i.vegetation[s]*.35,.6*a);i.vegetation[s]-=e;let r=e*ot;Tt(n,t,r*.55),n.carried[t]=Math.min(5,n.carried[t]+r*.45),o&&i.vegetation[s]<.05&&(n.actTimer[t]=0)}break;case A.Hunt:if(o&&i.game[s]>.04){let r=Math.min(i.game[s]*.3,.2*a);i.game[s]-=r;let o=r*ct;Tt(n,t,o*.4),n.carried[t]=Math.min(6,n.carried[t]+o*.6),n.hides[t]=Math.min(4,n.hides[t]+r*lt),n.fatigue[t]=Math.min(1.4,n.fatigue[t]+.4*a);let c=e.settlements.get(n.settlement[t]),l=c&&i.dist(n.x[t],n.y[t],c.x,c.y)<19.2,u=Math.min(n.hides[t],(l?1.6:.7)*a);n.hides[t]-=u,n.coat[t]=Math.min(1,n.coat[t]+u*.55),e.rng.chance(.02*a*(1+i.game[s]))&&(n.health[t]=Math.max(.05,n.health[t]-.12)),(i.game[s]<.05||n.carried[t]>5)&&(n.actTimer[t]=0)}else o&&(n.actTimer[t]=0);break;case A.Trade:if(o){let a=e.settlements.get(n.settlement[t]),o=null,s=6*r;for(let r of e.settlements.list){if(!r.alive||r.id===n.settlement[t])continue;let e=i.dist(n.x[t],n.y[t],r.x,r.y);e<s&&(s=e,o=r)}if(o){let r=n.carried[t]+n.carriedWood[t]+n.carriedStone[t]+n.carriedOre[t];if(o.food+=n.carried[t],o.timber+=n.carriedWood[t],o.stone+=n.carriedStone[t],o.ore+=n.carriedOre[t],n.carried[t]=0,n.carriedWood[t]=0,n.carriedStone[t]=0,n.carriedOre[t]=0,r>.5&&(a&&e.noteTrade(a.id,o.id,r),o.hardship=Math.max(0,o.hardship-.25),a&&(a.hardship=Math.max(0,a.hardship-.1)),a&&e.rng.chance(.1))){let r=n.boat[t]>0;e.chronicle.add(e.day,P.Society,1,`${a.name} trades with ${o.name}${r?`, across the water`:``}.`,o.x,o.y)}}a?(n.act[t]=A.Migrate,n.targetX[t]=a.x,n.targetY[t]=a.y,n.actTimer[t]=3):n.actTimer[t]=0}break;case A.Rest:{let r=e.settlements.get(n.settlement[t]),o=r&&i.dist(n.x[t],n.y[t],r.x,r.y)<9.6?Be(r):0;n.fatigue[t]=Math.max(0,n.fatigue[t]-(3.4+o*2.2)*a),n.health[t]=Math.min(1,n.health[t]+(.04+o*.06)*a),n.fatigue[t]<=.05&&(n.actTimer[t]=0);break}case A.Farm:if(o){let r=e.settlements.get(n.settlement[t]);if(r){let e=i.arability(s)*27*ft(n.tool[t],A.Farm);Ct(n,t,j.Hoe,a),r.food+=e*a,i.fertility[s]=Math.max(.05,i.fertility[s]-.0015*a),n.fatigue[t]=Math.min(1.4,n.fatigue[t]+.25*a)}}break;case A.Chop:if(o||i.trees[s]>.25){let e=Math.min(i.trees[s]*.25,.22*a*ft(n.tool[t],A.Chop));i.trees[s]-=e,i.vegetation[s]=Math.min(1.4,i.vegetation[s]+e*.3),n.carriedWood[t]=Math.min(4,n.carriedWood[t]+e*14),n.fatigue[t]=Math.min(1.4,n.fatigue[t]+.3*a),Ct(n,t,j.Axe,a),(n.carriedWood[t]>=3.5||i.trees[s]<.05)&&(n.actTimer[t]=0)}break;case A.Mine:if(o||i.stone[s]>.3){let e=.16*ft(n.tool[t],A.Mine),r=Math.min(i.stone[s]*.2,e*a);if(i.stone[s]-=r,n.carriedStone[t]=Math.min(4,n.carriedStone[t]+r*16),i.ore[s]>.02){let r=Math.min(i.ore[s]*.18,e*a*.5);i.ore[s]-=r,n.carriedOre[t]=Math.min(3,n.carriedOre[t]+r*14)}n.fatigue[t]=Math.min(1.4,n.fatigue[t]+.34*a),Ct(n,t,j.Pick,a),(n.carriedStone[t]>=3.5||i.stone[s]<.04)&&(n.actTimer[t]=0)}break;case A.Craft:if(o){let r=e.settlements.get(n.settlement[t]);if(r&&r.timber>=2&&r.stone>=1+ht(r)&&(r.craftProgress+=2.5*a*(.5+n.industry[t]),n.fatigue[t]=Math.min(1.4,n.fatigue[t]+.25*a),r.craftProgress>=1)){--r.craftProgress,r.timber-=2,--r.stone;let i=Re(r);r.toolRack[i]++,e.onToolMade(r,i),n.actTimer[t]=0}}break;case A.Build:if(o){let r=e.settlements.get(n.settlement[t]);if(r){let i=1-Be(r),o=Pe(r)&&r.stone>.05&&r.timber>.05;if(!o&&r.timber>=6&&i>.02)r.houseProgress+=2.2*a*(.5+n.industry[t]),r.houseProgress>=1&&(--r.houseProgress,r.timber-=6,r.houses+=1,e.onHouseBuilt(r));else if(o){let i=ye[e.cultures.get(r.culture)?.work??`keep`],o=Me(i),s=.55/i*a*(.6+n.industry[t]),c=Math.min(s,r.stone/o.stone,r.timber/o.timber);if(r.stone-=c*o.stone,r.timber-=c*o.timber,r.ore=Math.max(0,r.ore-c*o.ore),r.castle<1){let t=r.castle;r.castle=Math.min(1,r.castle+c),t<1&&r.castle>=1&&(r.works=1,e.onCastleRaised(r))}else r.extraWork=Math.min(1,r.extraWork+c),r.extraWork>=1&&(r.extraWork=0,r.works+=1,e.onCastleRaised(r))}else if(r.castle>=1&&r.walls<1&&r.stone>.05){let i=.018*a*(.6+n.industry[t]),o=Math.min(i*.7,r.stone/30);r.stone-=o*30;let s=r.walls;r.walls=Math.min(1,r.walls+o),s<1&&r.walls>=1&&e.onWallsClosed(r)}else r.food>1&&(r.shrine+=.06*a*n.industry[t],r.food-=.15*a);n.fatigue[t]=Math.min(1.4,n.fatigue[t]+.3*a)}}break;case A.Worship:{let r=e.religions.get(n.religion[t]);if(r){let o=e.settlements.get(n.settlement[t]),c=.35+(o?o.shrine*.3:0)+i.sacred[s]*.5;if(n.fervor[t]=Math.min(1,n.fervor[t]+.5*c*n.piety[t]*a),i.sacred[s]=Math.min(3,i.sacred[s]+.02*c*a),e.faithHarvest+=n.fervor[t]*c*a*.9,o&&r.tenets[F.Sacrifice]>.55&&o.food>1){let t=r.tenets[F.Sacrifice]*.2*a;o.food-=t,e.faithHarvest+=t*1.6}n.loneliness[t]=Math.max(0,n.loneliness[t]-.25*a)}break}case A.Pilgrimage:o&&(n.fervor[t]=Math.min(1,n.fervor[t]+.6*a),n.awe[t]=Math.min(1,n.awe[t]+.15*a),i.sacred[s]=Math.min(3,i.sacred[s]+.05*a),n.actTimer[t]=0),Et(e,t,s,a),n.fatigue[t]=Math.min(1.4,n.fatigue[t]+.15*a);break;case A.Socialize:e.converse(t),n.loneliness[t]=Math.max(0,n.loneliness[t]-1.1*a);break;case A.Court:e.tryPairBond(t),n.loneliness[t]=Math.max(0,n.loneliness[t]-.8*a);break;case A.Raid:o&&e.resolveRaid(t,s);break;case A.Settle:Et(e,t,s,a),o&&(e.onClaimReached(t,s),n.actTimer[t]=0),n.fatigue[t]=Math.min(1.4,n.fatigue[t]+.12*a);break;case A.Migrate:case A.Flee:o&&(n.actTimer[t]=0,e.onArriveAt(t,s)),Et(e,t,s,a),n.fatigue[t]=Math.min(1.4,n.fatigue[t]+.1*a);break;case A.Idle:default:n.actTimer[t]=0}St(e,t);let c=e.settlements.get(n.settlement[t]);if(c&&i.dist(n.x[t],n.y[t],c.x,c.y)<(n.age[t]<13?5:2.5)*2.4){if(n.carried[t]>.1&&(c.food+=n.carried[t],n.carried[t]=0),n.carriedWood[t]>.05&&(c.timber+=n.carriedWood[t],n.carriedWood[t]=0),n.carriedStone[t]>.05&&(c.stone+=n.carriedStone[t],n.carriedStone[t]=0),n.carriedOre[t]>.05&&(c.ore+=n.carriedOre[t],n.carriedOre[t]=0),n.hides[t]>.02&&(c.hides+=n.hides[t],n.hides[t]=0),n.coat[t]<.75&&c.hides>.15){let e=Math.min(c.hides,(1-n.coat[t])*.6);c.hides-=e,n.coat[t]=Math.min(1,n.coat[t]+e*.6)}let r=n.act[t],a=(r===A.Trade||r===A.Raid||r===A.Migrate)&&Ye(i,n.x[t],n.y[t],n.targetX[t],n.targetY[t]);if(a&&n.boat[t]===0&&c.boats>=1?(--c.boats,n.boat[t]=1):!a&&n.boat[t]>0&&(c.boats+=1,n.boat[t]=0),r===A.Trade&&n.carried[t]<.5&&Pt(c)>0){let e=Math.max(0,c.food-Fe(c)*1.3),r=Math.max(0,c.timber-Ae(c)*1.2),i=Math.max(0,c.stone-je(c)*1.2),a=Math.min(e*.5,30),o=Math.min(r*.5,12),s=Math.min(i*.5,8);c.food-=a,c.timber-=o,c.stone-=s,n.carried[t]+=a,n.carriedWood[t]+=o,n.carriedStone[t]+=s}if(wt(e,t,c),n.hunger[t]>.3&&c.food>.4){let e=Math.min(c.food,n.hunger[t]*Qe*.6);c.food-=e,Tt(n,t,e)}}else n.carried[t]>.05&&n.hunger[t]>.5&&(Tt(n,t,n.carried[t]),n.carried[t]=0)}function St(e,t){let n=e.agents;if(!(n.carried[t]<.05||n.age[t]<14))for(let i=0;i<2;i++){if(n.carried[t]<.05)return;e.index.query(n.x[t],n.y[t],5*r,n,e=>{if(n.carried[t]<.05)return!0;if(!n.alive[e]||n.age[e]>13||n.hunger[e]<.3)return;let r=n.mother[e]===t||n.father[e]===t;if(i===0?!r:r||n.settlement[e]!==n.settlement[t])return;let a=Math.min(n.carried[t],n.hunger[e]*Qe*.6);n.carried[t]-=a,Tt(n,e,a)})}}function Ct(e,t,n,r){let i=e.tool[t];i!==j.None&&(e.toolWear[t]+=(i===n?.05:.012)*r,e.toolWear[t]>=1&&(e.tool[t]=j.None,e.toolWear[t]=0))}function wt(e,t,n){let r=e.agents;if(r.tool[t]!==j.None||r.age[t]<12||Le(n)===0)return;if(r.act[t]===A.Raid||n.atWar){let e=n.favouredWeapon,i=e&&n.toolRack[e]>0?e:j.None;if(i===j.None)for(let e=j.Spear;e<9;e++)n.toolRack[e]>0&&M[e]>M[i]&&(i=e);if(i!==j.None){n.toolRack[i]--,r.tool[t]=i,r.toolWear[t]=0;return}}if(n.toolRack[j.Staff]>0&&r.piety[t]>.6&&r.fervor[t]>.45){n.toolRack[j.Staff]--,r.tool[t]=j.Staff,r.toolWear[t]=0;return}let i=j.None,a=0;for(let e=1;e<9;e++){if(n.toolRack[e]<=0)continue;let o=n.toolRack[e];e===j.Axe&&(o*=.9+r.industry[t]),e===j.Pick&&(o*=.7+r.boldness[t]),e===j.Hoe&&(o*=.8+r.industry[t]),e===j.Staff&&(o*=.2+r.piety[t]),re(e)&&(o*=.15+r.aggression[t]*1.4),o>a&&(a=o,i=e)}i!==j.None&&(n.toolRack[i]--,r.tool[t]=i,r.toolWear[t]=0)}function Tt(e,t,n){e.hunger[t]=Math.max(0,e.hunger[t]-n/Qe)}function Et(e,t,n,r){let i=e.agents,a=e.world;if(i.hunger[t]<.35||a.vegetation[n]<.12)return;let o=Math.min(a.vegetation[n]*.2,.25*r);a.vegetation[n]-=o;let s=o*ot;Tt(i,t,s*.7),i.carried[t]=Math.min(5,i.carried[t]+s*.3)}function Dt(e,t,n){let r=e.agents,i=e.world,a=i.dx(r.x[t],r.targetX[t]),o=r.targetY[t]-r.y[t],s=Math.hypot(a,o);if(s<1.44)return!0;let c=I(i,r.x[t],r.y[t]),l=(.75+r.health[t]*.55)*(1-r.fatigue[t]*.2),u=r.age[t]<6?.95:r.age[t]<12?.8:r.age[t]>60?.6:1,d=Math.max(rt,nt*l*u/i.travelCost(c));r.stepSpeed[t]=d;let f=Math.min(d*n,s),p=Math.max(1,Math.min(64,Math.ceil(f))),m=f/p,h=t&1?-1:1;for(let e=0;e<p&&f>1e-4;e++){let e=i.dx(r.x[t],r.targetX[t]),n=r.targetY[t]-r.y[t],a=Math.hypot(e,n);if(a<1.44)return!0;let o=e/a*m,s=n/a*m,c=I(i,r.x[t],r.y[t]),l=i.wrapX(Math.round(r.x[t]+o)),u=Math.round(r.y[t]+s);if(i.inBounds(u)){let e=i.idx(l,u),n=r.boat[t]>0;if(i.isWaterCell(e)&&!n&&!i.isWaterCell(c)){let e=!1;for(let n of[h,-h]){let a=-s*n,c=o*n,l=i.wrapX(Math.round(r.x[t]+a)),u=Math.round(r.y[t]+c);if(i.inBounds(u)&&!i.isWaterCell(i.idx(l,u))){o=a,s=c,e=!0;break}}if(!e)return r.actTimer[t]=0,!1}}else s=0;r.x[t]=i.wrapX(r.x[t]+o),r.y[t]=Math.max(.5,Math.min(i.h-1.5,r.y[t]+s)),f-=m}return!1}function I(e,t,n){let r=e.wrapX(Math.round(t)),i=Math.max(0,Math.min(e.h-1,Math.round(n)));return e.idx(r,i)}function Ot(e,t){if(e.waterLevel[t]>.002||e.flow[t]>403.2)return!0;for(let n=0;n<8;n++){let r=e.neighbor(t,n);if(r>=0&&(e.isWaterCell(r)||e.flow[r]>403.2))return!0}return!1}function kt(e,t,n){let r=e.world,i=I(r,t,n);return r.waterDist[i]>at?-1:r.waterSrc[i]}function At(e,t,n){let i=e.world,a=e.rng,o=-1,s=0;for(let e=0;e<10;e++){let e=a.f()*Math.PI*2,c=a.f()*12*r,l=i.wrapX(Math.round(t+Math.cos(e)*c)),u=Math.round(n+Math.sin(e)*c);if(!i.inBounds(u))continue;let d=i.idx(l,u);if(i.isWaterCell(d)||i.trees[d]<.12)continue;let f=i.trees[d]/(1+c*.1);f>s&&(s=f,o=d)}return{cell:o,score:Math.min(1,s*1.5)}}function jt(e,t,n,i){let a=e.world,o=e.rng,s=-1,c=0;for(let e=0;e<10;e++){let e=o.f()*Math.PI*2,l=o.f()*14*r,u=a.wrapX(Math.round(t+Math.cos(e)*l)),d=Math.round(n+Math.sin(e)*l);if(!a.inBounds(d))continue;let f=a.idx(u,d);if(a.isWaterCell(f)||a.stone[f]<.05&&a.ore[f]<.05)continue;let p=(a.stone[f]+a.ore[f]*2.5*i)/(1+l*.09);p>c&&(c=p,s=f)}return{cell:s,score:Math.min(1,c*1.6)}}function Mt(e,t,n){let r=e.world,i=e.rng,a=-1,o=0;for(let e=0;e<14;e++){let e=i.f()*Math.PI*2,s=i.f()*it,c=r.wrapX(Math.round(t+Math.cos(e)*s)),l=Math.round(n+Math.sin(e)*s);if(!r.inBounds(l))continue;let u=r.idx(c,l);if(r.isWaterCell(u))continue;let d=r.vegetation[u]/(1+s*.045);d>o&&(o=d,a=u)}return{cell:a,score:Math.min(1,o*1.6)}}function Nt(e,t,n){let r=e.world,i=e.rng,a=-1,o=0;for(let e=0;e<12;e++){let e=i.f()*Math.PI*2,s=i.f()*st,c=r.wrapX(Math.round(t+Math.cos(e)*s)),l=Math.round(n+Math.sin(e)*s);if(!r.inBounds(l))continue;let u=r.idx(c,l);if(r.isWaterCell(u))continue;let d=r.game[u]/(1+s*.03);d>o&&(o=d,a=u)}return{cell:a,score:Math.min(1,o*1.5)}}function Pt(e){let t=Math.max(0,e.food-Fe(e)*1.3),n=Math.max(0,e.timber-Ae(e)*1.2),r=Math.max(0,e.stone-je(e)*1.2);return t*.5+n+r}function Ft(e,t){let n=e.world,r=e.settlements.living();if(r.length<2)return null;let i=null,a=.4;for(let o=0;o<6;o++){let o=r[e.rng.int(0,r.length)];if(o.id===t.id||o.pop<=0)continue;let s=n.dist(t.x,t.y,o.x,o.y);if(s>Ze||t.kingdom>=0&&o.kingdom>=0&&t.kingdom!==o.kingdom&&e.kingdoms.atWar(t.kingdom,o.kingdom)||Ye(n,t.x,t.y,o.x,o.y)&&t.boats<=0)continue;let c=(Math.max(0,1-o.food/Math.max(1,Fe(o)))+Math.max(0,1-o.timber/Math.max(1,Ae(o)))*.6+o.hardship)/(1+s*.01);c>a&&(a=c,i=o)}return i}function It(e,t){let n=e.world,r=0,i=0;for(let e=0;e<8;e++){let a=n.neighbor(t,e);a<0||n.isWaterCell(a)||(r+=n.vegetation[a],i++)}let a=i?r/i:0,o=n.waterAvailability(t);if(o<.25||n.tempMean[t]<-18)return 0;let s=Math.max(.08,Math.min(1,(n.tempMean[t]+14)/18));return Math.max(0,Math.min(1,a*1.5*(.3+o*.7)*s))}function Lt(e,t){return-10-e.agents.coat[t]*8}function Rt(e,t){let n=e.agents,i=e.world,a=e.rng,o=I(i,n.x[t],n.y[t]),s=Lt(e,t),c=i.tempMean[o]<s,l=n.hunger[t]>.75||c,u=It(e,o),d=-1,f=l?0:u*1.05,p=-1,m=i.tempMean[o];for(let l=0;l<10;l++){let l=a.f()*Math.PI*2,u=(6+a.f()*(12+n.boldness[t]*26))*r,h=i.wrapX(Math.round(n.x[t]+Math.cos(l)*u)),g=Math.round(n.y[t]+Math.sin(l)*u);if(!i.inBounds(g))continue;let _=i.idx(h,g);if(i.isWaterCell(_))continue;let v=i.tempMean[_];if(v>m&&(m=v,p=_),v<s)continue;let y=It(e,_)/(1+u*.02);c&&(y+=Math.max(0,v-i.tempMean[o])*.05),y>f&&(f=y,d=_)}return d>=0?d:c?p:-1}function zt(e,t){let n=e.agents,i=-1;return e.index.query(n.x[t],n.y[t],7*r,n,e=>{if(!(e===t||!n.alive[e])&&n.sex[e]!==n.sex[t]&&!(n.partner[e]>=0)&&!(n.age[e]<16||n.age[e]>48)&&!(n.mother[e]>=0&&n.mother[e]===n.mother[t]))return i=e,!0}),i}function Bt(e,t,n){let i=e.kingdoms.enemiesOf(n);if(i.length===0)return null;let a=e.agents,o=e.world,s=null,c=70*r;for(let n of e.settlements.list){if(!n.alive||n.kingdom<0||!i.includes(n.kingdom))continue;let e=o.dist(a.x[t],a.y[t],n.x,n.y);e<c&&(c=e,s=n)}return s}function Vt(e,t){let n=e.agents,i=e.world,a=null,o=42*r;for(let r of e.settlements.list){if(!r.alive||r.id===n.settlement[t]||r.religion===n.religion[t])continue;let e=i.dist(n.x[t],n.y[t],r.x,r.y);e<o&&(o=e,a=r)}return a}function Ht(e,t){return Math.max(1,Math.min(e.h-2,Math.round(t)))}function Ut(e){return e*e}function Wt(e){return e*e*e}var Gt=class{keys;vals;n=0;constructor(e){this.keys=new Float32Array(e),this.vals=new Int32Array(e)}get size(){return this.n}clear(){this.n=0}push(e,t){this.n===this.keys.length&&this.grow();let n=this.n++;for(this.keys[n]=e,this.vals[n]=t;n>0;){let e=n-1>>1;if(this.keys[e]<=this.keys[n])break;this.swap(n,e),n=e}}peekKey(){return this.n>0?this.keys[0]:1/0}pop(){if(this.n===0)return-1;let e=this.vals[0];if(this.n--,this.n>0){this.keys[0]=this.keys[this.n],this.vals[0]=this.vals[this.n];let e=0;for(;;){let t=2*e+1,n=t+1,r=e;if(t<this.n&&this.keys[t]<this.keys[r]&&(r=t),n<this.n&&this.keys[n]<this.keys[r]&&(r=n),r===e)break;this.swap(e,r),e=r}}return e}swap(e,t){let n=this.keys[e];this.keys[e]=this.keys[t],this.keys[t]=n;let r=this.vals[e];this.vals[e]=this.vals[t],this.vals[t]=r}grow(){let e=new Float32Array(this.keys.length*2);e.set(this.keys),this.keys=e;let t=new Int32Array(this.vals.length*2);t.set(this.vals),this.vals=t}},L=(1+Math.sqrt(5))/2,Kt=[[-1,L,0],[1,L,0],[-1,-L,0],[1,-L,0],[0,-1,L],[0,1,L],[0,-1,-L],[0,1,-L],[L,0,-1],[L,0,1],[-L,0,-1],[-L,0,1]],qt=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],Jt=qt.length;function Yt(e){let t=Math.hypot(e[0],e[1],e[2]);return[e[0]/t,e[1]/t,e[2]/t]}function Xt(e,t,n){let r=[t[1]*n[2]-t[2]*n[1],t[2]*n[0]-t[0]*n[2],t[0]*n[1]-t[1]*n[0]],i=[n[1]*e[2]-n[2]*e[1],n[2]*e[0]-n[0]*e[2],n[0]*e[1]-n[1]*e[0]],a=[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],o=1/(e[0]*r[0]+e[1]*r[1]+e[2]*r[2]);return[r[0]*o,i[0]*o,a[0]*o,r[1]*o,i[1]*o,a[1]*o,r[2]*o,i[2]*o,a[2]*o]}function Zt(){let e=Kt.map(Yt),t=new Float32Array(Jt*9),n=new Float32Array(Jt*9);return qt.forEach(([r,i,a],o)=>{let s=e[r],c=e[i],l=e[a],u=o*9;t.set([s[0],s[1],s[2],c[0],c[1],c[2],l[0],l[1],l[2]],u),n.set(Xt(s,c,l),u)}),{corners:t,inverses:n}}var Qt=[96,192,384,768,1536,3072,6144],$t=1.1071487;function en(e,t=13){let n=$t*e/t,r=Qt[0];for(let e of Qt)e<=n&&(r=e);return r}function R(){return{pos:[],nrm:[],col:[],idx:[]}}function z(e,t){let n=e.pos.length/3,r=new Float32Array(n*10);for(let t=0;t<n;t++){let n=t*10;r[n]=e.pos[t*3],r[n+1]=e.pos[t*3+1],r[n+2]=e.pos[t*3+2],r[n+3]=e.nrm[t*3],r[n+4]=e.nrm[t*3+1],r[n+5]=e.nrm[t*3+2],r[n+6]=e.col[t*4],r[n+7]=e.col[t*4+1],r[n+8]=e.col[t*4+2],r[n+9]=e.col[t*4+3]}return{vertices:r,indices:new Uint16Array(e.idx),height:t}}function B(e,t){let n=[t[0],t[1],t[2]];if(e?.scale&&(n=[n[0]*e.scale[0],n[1]*e.scale[1],n[2]*e.scale[2]]),e?.rot){let t=e.rot;n=[t[0]*n[0]+t[1]*n[1]+t[2]*n[2],t[3]*n[0]+t[4]*n[1]+t[5]*n[2],t[6]*n[0]+t[7]*n[1]+t[8]*n[2]]}return e?.at&&(n=[n[0]+e.at[0],n[1]+e.at[1],n[2]+e.at[2]]),n}function tn(e,t){let n=[t[0],t[1],t[2]];if(e?.rot){let t=e.rot;n=[t[0]*n[0]+t[1]*n[1]+t[2]*n[2],t[3]*n[0]+t[4]*n[1]+t[5]*n[2],t[6]*n[0]+t[7]*n[1]+t[8]*n[2]]}let r=Math.hypot(n[0],n[1],n[2])||1;return[n[0]/r,n[1]/r,n[2]/r]}function V(e,t,n,r,i=0){let a=e.pos.length/3;return e.pos.push(t[0],t[1],t[2]),e.nrm.push(n[0],n[1],n[2]),e.col.push(r[0],r[1],r[2],i),a}function H(e){return[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]}function nn(e){let t=rn(e),n=[0,1,0],r=n[0]*t[0]+n[1]*t[1]+n[2]*t[2];if(r>.9999)return[1,0,0,0,1,0,0,0,1];if(r<-.9999)return[1,0,0,0,-1,0,0,0,-1];let i=rn([n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]),a=r,o=Math.sqrt(1-a*a),s=1-a,[c,l,u]=i;return[s*c*c+a,s*c*l-o*u,s*c*u+o*l,s*c*l+o*u,s*l*l+a,s*l*u-o*c,s*c*u-o*l,s*l*u+o*c,s*u*u+a]}function rn(e){let t=Math.hypot(e[0],e[1],e[2])||1;return[e[0]/t,e[1]/t,e[2]/t]}function U(e,t,n,r,i,a,o,s=0){let c=[[],[]];for(let l=0;l<i;l++){let u=l/i*Math.PI*2,d=Math.cos(u),f=Math.sin(u),p=rn([d,(n-t)/Math.max(1e-5,r),f]);c[0].push(V(e,B(o,[d*n,0,f*n]),tn(o,p),a,s)),c[1].push(V(e,B(o,[d*t,r,f*t]),tn(o,p),a,s))}for(let t=0;t<i;t++){let n=(t+1)%i;e.idx.push(c[0][t],c[1][t],c[1][n],c[0][t],c[1][n],c[0][n])}let l=tn(o,[0,1,0]),u=V(e,B(o,[0,r,0]),l,a,s),d=[];for(let n=0;n<i;n++){let c=n/i*Math.PI*2;d.push(V(e,B(o,[Math.cos(c)*t,r,Math.sin(c)*t]),l,a,s))}for(let t=0;t<i;t++)e.idx.push(u,d[t],d[(t+1)%i])}function W(e,t,n,r,i,a,o=0){let s=t/2,c=n/2,l=r/2,u=[[[-s,-c,l],[s,-c,l],[s,c,l],[-s,c,l],[0,0,1]],[[s,-c,-l],[-s,-c,-l],[-s,c,-l],[s,c,-l],[0,0,-1]],[[s,-c,l],[s,-c,-l],[s,c,-l],[s,c,l],[1,0,0]],[[-s,-c,-l],[-s,-c,l],[-s,c,l],[-s,c,-l],[-1,0,0]],[[-s,c,l],[s,c,l],[s,c,-l],[-s,c,-l],[0,1,0]],[[-s,-c,-l],[s,-c,-l],[s,-c,l],[-s,-c,l],[0,-1,0]]];for(let[t,n,r,s,c]of u){let l=tn(a,c),u=V(e,B(a,t),l,i,o),d=V(e,B(a,n),l,i,o),f=V(e,B(a,r),l,i,o),p=V(e,B(a,s),l,i,o);e.idx.push(u,d,f,u,f,p)}}var G=(1+Math.sqrt(5))/2,an=[[-1,G,0],[1,G,0],[-1,-G,0],[1,-G,0],[0,-1,G],[0,1,G],[0,-1,-G],[0,1,-G],[G,0,-1],[G,0,1],[-G,0,-1],[-G,0,1]].map(e=>rn(e)),on=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];function sn(e,t,n,r,i=0){for(let[a,o,s]of on){let c=[an[a],an[o],an[s]].map(e=>[e[0]*t,e[1]*t,e[2]*t]),l=tn(r,rn([(c[0][0]+c[1][0]+c[2][0])/3,(c[0][1]+c[1][1]+c[2][1])/3,(c[0][2]+c[1][2]+c[2][2])/3])),u=V(e,B(r,c[0]),l,n,i),d=V(e,B(r,c[1]),l,n,i),f=V(e,B(r,c[2]),l,n,i);e.idx.push(u,d,f)}}var cn=H(5914664),ln=H(4156210),un=H(3101240);function dn(){let e=R(),t=[.3,.26,.22],n=[.055,.044,.034],r=[.044,.034,.025],i=[.4,2.1],a=[.16,.22],o=[0,1,0],s=[0,0,0];for(let c=0;c<3;c++)if(U(e,r[c],n[c],t[c],8,cn,{rot:nn(o),at:s}),s=[s[0]+o[0]*t[c],s[1]+o[1]*t[c],s[2]+o[2]*t[c]],c<2){let e=i[c];o=pn(o,[Math.cos(e),0,Math.sin(e)],a[c])}let c=s,l=[[.55,0,.35,.34],[.68,Math.PI*.5,.45,.32],[.78,Math.PI*1,.3,.35],[.88,Math.PI*1.4,.5,.27],[.95,Math.PI*1.75,.55,.22]];for(let[t,n,r,i]of l){let a=[c[0]*t,c[1]*t,c[2]*t];U(e,.01,.026,i,5,cn,{rot:nn([Math.cos(n)*Math.cos(r),Math.sin(r),Math.sin(n)*Math.cos(r)]),at:a})}sn(e,.45,ln,{at:[c[0],c[1]+.1,c[2]],scale:[1,.92,1]});for(let[t,n,r,i]of[[.32,0,.07,.27],[-.27,-.04,-.2,.24],[.05,.17,.24,.22]])sn(e,i,ln,{at:[c[0]+t,c[1]+n,c[2]+r]});return z(e,1.3)}function fn(){let e=R();U(e,.03,.055,1.06,7,cn);for(let[t,n,r]of[[.2,.325,.4],[.44,.27,.36],[.66,.205,.32],[.86,.13,.28]])U(e,.012,n,r,8,un,{at:[0,t,0]});return z(e,1.3)}function pn(e,t,n){let r=rn(t),i=Math.cos(n),a=Math.sin(n),o=r[0]*e[0]+r[1]*e[1]+r[2]*e[2],s=[r[1]*e[2]-r[2]*e[1],r[2]*e[0]-r[0]*e[2],r[0]*e[1]-r[1]*e[0]];return rn([e[0]*i+s[0]*a+r[0]*o*(1-i),e[1]*i+s[1]*a+r[1]*o*(1-i),e[2]*i+s[2]*a+r[2]*o*(1-i)])}var mn=H(15250589),hn=H(4487099),gn=[hn[0],hn[1],hn[2]],_n=H(3359846),vn=H(3351057),yn=H(3876103);function bn(){let e=R();return W(e,.115,.46,.115,_n,{at:[-.072,.25,0]},2),W(e,.115,.46,.115,_n,{at:[.072,.25,0]},2),W(e,.125,.055,.17,vn,{at:[-.072,.027,.022]},2),W(e,.125,.055,.17,vn,{at:[.072,.027,.022]},2),W(e,.255,.44,.135,hn,{at:[0,.7,0]},1),W(e,.265,.045,.145,vn,{at:[0,.5,0]},2),W(e,.085,.42,.095,hn,{at:[-.172,.7,0]},1),W(e,.085,.42,.095,hn,{at:[.172,.7,0]},1),W(e,.08,.085,.09,mn,{at:[-.172,.465,0]},2),W(e,.08,.085,.09,mn,{at:[.172,.465,0]},2),W(e,.09,.06,.09,mn,{at:[0,.945,0]},2),W(e,.235,.225,.215,mn,{at:[0,1.09,0]},2),W(e,.245,.075,.225,yn,{at:[0,1.185,0]},2),W(e,.245,.13,.045,yn,{at:[0,1.1,-.092]},2),z(e,1.23)}var xn=H(9069624),K=H(12831956),Sn=H(11049854),q=[.185,.5,.05];function Cn(e,t,n){return U(e,.032,.038,t,5,xn,{rot:[1,0,0,0,Math.cos(n),-Math.sin(n),0,Math.sin(n),Math.cos(n)],at:[q[0],q[1]-.18,q[2]]}),[q[0],q[1]-.18+Math.cos(n)*t,q[2]+Math.sin(n)*t]}function wn(){let e=R(),t=Cn(e,.62,.12);return W(e,.07,.19,.12,K,{at:[t[0],t[1]-.02,t[2]]}),W(e,.05,.13,.19,K,{at:[t[0],t[1]-.02,t[2]+.1]}),z(e,1.3)}function Tn(){let e=R(),t=Cn(e,.6,.1);return W(e,.06,.06,.4,K,{at:[t[0],t[1],t[2]]}),W(e,.05,.09,.06,K,{at:[t[0],t[1]-.03,t[2]+.15]}),W(e,.05,.09,.06,K,{at:[t[0],t[1]-.03,t[2]-.15]}),z(e,1.3)}function En(){let e=R(),t=Cn(e,.64,.3);return W(e,.19,.04,.16,K,{at:[t[0],t[1]-.04,t[2]+.05]}),z(e,1.3)}function Dn(){let e=R(),t=Cn(e,.86,.05);return sn(e,.075,Sn,{at:[t[0],t[1]+.03,t[2]]}),z(e,1.3)}var On=H(9071172),kn=H(6243888),An=H(12562064);function jn(){let e=R(),t=Cn(e,1.05,.05);return W(e,.055,.05,.055,H(7032880),{at:[t[0],t[1]-.03,t[2]]}),W(e,.07,.2,.02,K,{at:[t[0],t[1]+.09,t[2]]}),W(e,.03,.1,.02,K,{at:[t[0],t[1]+.22,t[2]]}),z(e,1.6)}function Mn(){let e=R(),t=H(8018483),n=H(14208942),r=q[0],i=q[1]-.1,a=q[2],o=[[0,0,0],[.06,.22,.02],[.09,.44,.05],[.07,.64,.04],[0,.82,0]];for(let n=0;n<o.length-1;n++){let s=o[n],c=o[n+1],l=[c[0]-s[0],c[1]-s[1],c[2]-s[2]],u=Math.hypot(l[0],l[1],l[2]);U(e,.022,.026,u,4,t,{rot:nn(l),at:[r+s[0],i+s[1]-.2,a+s[2]]}),U(e,.022,.026,u,4,t,{rot:nn([l[0],-l[1],l[2]]),at:[r+s[0],i-s[1]+.2,a+s[2]]})}return U(e,.008,.008,1.24,3,n,{at:[r,i-.82,a]}),z(e,1.3)}function Nn(){let e=R(),t=Cn(e,.78,.1);return W(e,.05,.09,.05,H(7032880),{at:[t[0],t[1]-.04,t[2]]}),W(e,.045,.26,.09,K,{at:[t[0],t[1]+.02,t[2]+.09]}),W(e,.04,.2,.07,K,{at:[t[0],t[1]+.02,t[2]+.16]}),W(e,.035,.12,.05,K,{at:[t[0],t[1]+.02,t[2]+.21]}),z(e,1.4)}function Pn(){let e=R(),t=H(4862752),n=q[0],r=q[1]-.18,i=q[2];return U(e,.026,.03,.16,5,t,{at:[n,r,i]}),W(e,.05,.05,.05,K,{at:[n,r-.03,i]}),W(e,.26,.035,.04,K,{at:[n,r+.17,i]}),W(e,.06,.52,.022,K,{at:[n,r+.45,i]}),W(e,.035,.12,.02,K,{at:[n,r+.76,i]}),z(e,1.5)}function Fn(){let e=R();W(e,.62,.3,.28,On,{at:[0,.46,0]}),W(e,.2,.26,.26,On,{at:[.3,.5,0]}),W(e,.22,.14,.14,On,{at:[.44,.56,0],rot:nn([.6,.8,0])}),W(e,.2,.13,.13,kn,{at:[.56,.63,0]}),W(e,.07,.06,.05,kn,{at:[.67,.6,0]}),W(e,.03,.09,.03,An,{at:[.52,.73,.05]}),W(e,.03,.09,.03,An,{at:[.52,.73,-.05]});for(let[t,n]of[[.22,.1],[.22,-.1],[-.22,.1],[-.22,-.1]])W(e,.07,.32,.07,kn,{at:[t,.16,n]});return W(e,.05,.16,.05,kn,{at:[-.32,.44,0]}),z(e,.8)}var In=H(16776688),Ln=H(12571903);function Rn(){let e=R(),t=(t,n,r,i)=>{for(let a=0;a<t.length-1;a++){let o=t[a],s=t[a+1],c=[s[0]-o[0],s[1]-o[1],s[2]-o[2]],l=Math.hypot(c[0],c[1],c[2]);if(l<1e-4)continue;let u=a/(t.length-1),d=(a+1)/(t.length-1);U(e,r+(n-r)*d,r+(n-r)*u,l,5,i,{rot:nn(c),at:o},2)}},n=[[0,0,0]],r=[.16,-.26,.21,-.31,.24,-.19,.29,-.23,.18,-.27,.22],i=[-.19,.24,-.14,.27,-.22,.31,-.17,.21,-.29,.16,-.24],a=0,o=0,s=0;for(let e=0;e<r.length;e++)o+=.52+e/r.length*.3,a+=r[e],s+=i[e],n.push([a,o,s]);t(n,.085,.012,In);let c=[3,5,8],l=[[-.55,-.42,.28],[.62,-.36,-.31],[-.48,-.3,-.52]];return c.forEach((e,r)=>{let i=n[e],a=l[r],o=[i],s=i[0],c=i[1],u=i[2];for(let e=0;e<3;e++){let t=.6-e*.12;s+=a[0]*t+(e%2?.09:-.11),c+=a[1]*t,u+=a[2]*t+(e%2?-.08:.1),o.push([s,c,u])}t(o,.045,.008,Ln)}),z(e,o)}var zn=H(7031340),Bn=H(4862750);function Vn(){let e=R();return W(e,1.05,.2,.42,zn,{at:[0,.1,0]},2),W(e,.26,.26,.34,zn,{at:[.52,.17,0]},2),W(e,.2,.22,.3,zn,{at:[-.5,.15,0]},2),W(e,1.05,.07,.06,Bn,{at:[0,.22,.2]},2),W(e,1.05,.07,.06,Bn,{at:[0,.22,-.2]},2),z(e,.4)}var Hn=H(6117714),Un=H(13134378);function Wn(){let e=R();return sn(e,.34,Hn,{at:[0,.22,0],scale:[1.2,.75,1]}),sn(e,.22,Hn,{at:[.26,.14,-.18],scale:[1,.7,1.1]}),sn(e,.17,Hn,{at:[-.24,.11,.16],scale:[1.1,.65,.9]}),sn(e,.13,Un,{at:[.04,.36,.06],scale:[1.4,.6,1]}),sn(e,.08,Un,{at:[-.16,.24,-.14]}),z(e,.5)}var Gn=H(10130828),Kn=H(7828074),qn=H(4871520);function Jn(e,t,n,r){let i=r*2;for(let a=0;a<4;a++){let o=+(a<2),s=a%2==0?1:-1;for(let a=-t+r;a<=t-r;a+=i){let i=o?a:s*t,c=o?s*t:a;W(e,r,r*1.6,r,Gn,{at:[i,n,c]})}}}function Yn(){let e=R();W(e,1.5,.16,1.5,Kn,{at:[0,.08,0]}),W(e,1.15,1.5,1.15,Gn,{at:[0,.9,0]}),Jn(e,.6,1.72,.13);for(let[t,n]of[[1,1],[1,-1],[-1,1],[-1,-1]]){let r=[t*.58,1.05,n*.58];U(e,.24,.27,2,8,Gn,{at:[r[0],.1,r[2]]}),sn(R(),.3,qn),W(e,.42,.16,.42,qn,{at:[r[0],2.16,r[2]]}),W(e,.26,.22,.26,qn,{at:[r[0],2.34,r[2]]})}return W(e,.34,.5,.1,H(7031340),{at:[0,.4,.6]}),z(e,2.5)}function Xn(){let e=R();W(e,1.05,.72,.26,Gn,{at:[0,.36,0]});for(let t=-.42;t<=.42;t+=.28)W(e,.12,.18,.3,Kn,{at:[t,.81,0]});return z(e,.9)}function Zn(){let e=R(),t=H(11044702),n=H(7031347);W(e,.9,.55,.75,t,{at:[0,.275,0]});let r=.62;return W(e,1,.07,.62,n,{rot:[1,0,0,0,Math.cos(r),-Math.sin(r),0,Math.sin(r),Math.cos(r)],at:[0,.72,.19]}),W(e,1,.07,.62,n,{rot:[1,0,0,0,Math.cos(-.62),-Math.sin(-.62),0,Math.sin(-.62),Math.cos(-.62)],at:[0,.72,-.19]}),z(e,.95)}function Qn(){let e=R(),t=H(9077624),n=H(7301728);return W(e,1,.26,.24,n,{at:[0,.13,0]}),W(e,.62,.2,.22,t,{at:[-.14,.34,0]}),W(e,.22,.14,.2,t,{at:[.3,.31,0]}),W(e,.2,.09,.16,n,{at:[.44,.045,.22]}),W(e,.14,.07,.13,n,{at:[-.42,.035,-.2]}),z(e,.55)}function $n(){let e=R(),t=H(9077624),n=H(7301728),r=H(6122314);return W(e,1.5,.22,1.5,n,{at:[0,.11,0]}),W(e,1.05,.3,1.05,t,{at:[.05,.34,-.03]}),W(e,.36,1.15,.36,t,{at:[-.42,.75,.42]}),W(e,.3,.16,.3,n,{at:[-.42,1.38,.42]}),W(e,.28,.55,.28,n,{at:[.48,.5,-.44]}),W(e,.26,.12,.22,n,{at:[.3,.29,.55]}),W(e,.2,.1,.18,r,{at:[-.2,.27,-.58]}),z(e,1.5)}function er(){let e=R(),t=(t,n,r,i,a,o)=>{let s=Math.PI/4*t;W(e,i,.05,r,n,{rot:[Math.cos(s),0,Math.sin(s),0,1,0,-Math.sin(s),0,Math.cos(s)],at:[t*r*.354,.05+a,.5-r*.354]},o)};return t(-1,[.06,.05,.05],1.06,.44,0,2),t(1,[.06,.05,.05],1.06,.44,0,2),t(-1,[1,1,1],1,.3,.03,1),t(1,[1,1,1],1,.3,.03,1),z(e,.13)}function tr(){let e=R(),t=H(12559484),n=H(5914662),r=H(9071162),i=H(6967337);W(e,1.5,.62,3.4,t,{at:[0,.31,0]});for(let t of[-1.6,-.8,0,.8,1.6])W(e,.12,.66,.12,n,{at:[-.76,.33,t]}),W(e,.12,.66,.12,n,{at:[.76,.33,t]});let a=.72;for(let t of[1,-1])W(e,.06,1.25,3.7,r,{rot:[Math.cos(t*a),-Math.sin(t*a),0,Math.sin(t*a),Math.cos(t*a),0,0,0,1],at:[t*.42,1.05,0]});W(e,.22,.14,3.8,i,{at:[0,1.62,0]});for(let t of[1.9,-1.9])for(let r of[.5,-.5])W(e,.09,.85,.09,n,{rot:[Math.cos(r),-Math.sin(r),0,Math.sin(r),Math.cos(r),0,0,0,1],at:[0,1.55,t]});return z(e,2)}function nr(){let e=R(),t=H(12166790),n=H(9337950),r=H(11027759),i=0;for(let r=0;r<4;r++){let a=2.5-r/4*1.55,o=.42;W(e,a,o,a,r%2?n:t,{at:[0,i+o/2,0]}),i+=o}for(let t=0;t<12;t++){let r=t/12;W(e,.5,.06,.16,n,{at:[0,.06+r*(i-.1),1.28-r*.78]})}return W(e,.62,.44,.62,r,{at:[0,i+.22,0]}),W(e,.72,.08,.72,n,{at:[0,i+.48,0]}),z(e,i+.52)}var rr=`#version 300 es
precision highp float;
void main() {
  // Fullscreen triangle — no vertex buffer needed.
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,ir=`#version 300 es
precision highp float;

uniform sampler2D uAlbedo;   // rgb surface colour, a elevation
uniform sampler2D uData;
uniform sampler2D uRealm;   // rgb: whose ground this is. a: how hard to paint it     // r river, g sacred, b lake depth, a settlement
uniform mat3 uRayBasis;      // columns: right*tanFov*aspect, up*tanFov, forward
uniform vec3 uEye;           // eye position, planet radii
uniform vec2 uRes;           // framebuffer size
uniform vec2 uWorld;         // world size in tiles
uniform float uTime;
uniform float uDayFrac;
uniform float uYearFrac;     // where the world is in its orbit, 0-1
uniform float uSeasonTilt;   // how much of the axial tilt to show, 0-1
uniform float uPxPerTile;
uniform float uNight;
uniform float uRelief;       // height exaggeration, planet radii
uniform vec3 uSky;           // colour of the light the atmosphere scatters
uniform vec2 uSkyMix;        // x: how far water takes it, y: how far all else does
uniform vec3 uSun;           // colour of the direct light, scaled by its brightness
uniform vec3 uSunDir;        // where the star is, in the world's own frame
uniform float uSunGlow;      // how fiercely the disc itself burns
uniform float uStarSpike;    // 1 for a star that is a point of light, not a disc
uniform float uSunDark;      // 1 for a black hole: a hole, not a light
uniform float uSystemFade;   // 1 once the system is the subject rather than the world
// The rest of the system, as real bodies in the same space as the planet.
// Index 0 is the star itself and is emissive; the world is at the origin and is
// not in this list, because it is the sphere the raymarch already draws.
uniform vec4 uBody[14];      // xyz centre in planet radii, w radius
uniform vec3 uBodyCol[14];
uniform int uBodyCount;
uniform float uSeaLevel;
uniform float uMolten;       // 1 on a world whose seas have boiled away
uniform float uGround;       // 1 when standing on the world rather than above it
uniform vec2 uRings;         // inner and outer radius in planet radii. x<=0: none
uniform vec4 uStar2;         // companion: xyz centre, w radius. w<=0 for none
uniform vec3 uStar2Col;      // its light
uniform vec3 uSunDir2;       // and where it stands in the sky
uniform float uStar2Glow;    // how fiercely its own disc burns
uniform float uStar2Spike;   // 1 if it is a point of light rather than a disc
uniform float uNear;
uniform float uFar;
uniform mat3 uIcoCorners[20];
uniform mat3 uIcoInv[20];
uniform float uHexFreq;

out vec4 frag;

const float PI = 3.14159265359;
const float TAU = 6.28318530718;

float hash21(vec2 p) {
  // Hoskins hash. A naive fract(dot(...)) hash lays the stars out on a visible
  // lattice, which looks exactly as wrong as it sounds.
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

/**
 * Break up eight-bit banding.
 *
 * The star's haze falls off so gently that neighbouring pixels want values a
 * fraction of one 255th apart. The framebuffer cannot hold that, so the
 * gradient staircases and the eye reads the steps as concentric rings across
 * the glow — dark arcs that look like shadows lying on the star. Offsetting
 * each pixel by well under one level spreads every step over several pixels
 * and the rings go.
 *
 * An ordered matrix rather than a hash. A hash keyed on the pixel coordinate
 * looks like the obvious choice and fails at exactly the wrong moment: the
 * usual fract-of-a-product hashes lose precision at the large coordinates a
 * retina framebuffer reaches, so the noise stops being independent per pixel
 * and clumps into patches — which is worse than the banding, because the
 * patches read as dirt lying on the star. Four by four Bayer is exact
 * integer arithmetic and cannot degrade anywhere.
 */
const float BAYER[16] = float[16](
   0.0,  8.0,  2.0, 10.0,
  12.0,  4.0, 14.0,  6.0,
   3.0, 11.0,  1.0,  9.0,
  15.0,  7.0, 13.0,  5.0);

vec3 dither(vec3 col, vec2 pix) {
  ivec2 c = ivec2(mod(pix, 4.0));
  float t = BAYER[c.y * 4 + c.x] / 16.0;
  return col + (t - 0.5) * (1.0 / 255.0);
}

float hash31(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

/**
 * Value noise on the sphere itself. Sampling in 3D rather than in map space is
 * what keeps the added detail free of a seam at the wrap longitude and free of
 * pinching at the poles — the two places a 2D texture-space noise always fails.
 */
float vnoise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash31(i);
  float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash31(i + vec3(1.0, 1.0, 1.0));
  return mix(
    mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
    mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
    f.z);
}

float fbm3(vec3 p) {
  float s = 0.5 * vnoise3(p);
  s += 0.25 * vnoise3(p * 2.07 + 11.3);
  s += 0.125 * vnoise3(p * 4.13 + 27.9);
  return s / 0.875;
}

/**
 * Texel-snapped sampling: nearest-neighbour with a one-pixel antialiased edge
 * when magnified, ordinary bilinear when minified. Keeps tiles crisp close up
 * without the whole planet turning into a staircase when zoomed out.
 *
 * The footprint is the texel size of one screen pixel. It is passed in rather
 * than taken from fwidth(uv), because uv is discontinuous where longitude
 * wraps and fwidth there reports the width of the entire map — which paints a
 * conspicuous seam straight down the globe.
 */
/**
 * Snap a direction to the centre of its Goldberg cell.
 *
 * Finds the icosahedral face the direction lies in (exactly one gives all
 * non-negative barycentric coordinates), rounds those coordinates to the
 * geodesic lattice at the chosen frequency, and rebuilds the direction from the
 * lattice point. The result is a tiling of near-uniform hexagons — twelve
 * pentagons at the icosahedral vertices — with no pole singularity anywhere.
 */
vec3 goldbergCentre(vec3 dir) {
  // Pick the face whose barycentric coordinates are "most inside". Testing for
  // all-non-negative and bailing out otherwise looks equivalent, but rounding
  // can leave a direction fractionally outside every face — and the fallback
  // then returns it unsnapped, which shows up as a starburst at the poles where
  // the grid it falls back to is at its worst.
  int best = 0;
  float bestScore = -1e9;
  vec3 bestBc = vec3(0.0);
  for (int f = 0; f < 20; f++) {
    vec3 bc = uIcoInv[f] * dir;
    float score = min(bc.x, min(bc.y, bc.z));
    if (score > bestScore) {
      bestScore = score;
      best = f;
      bestBc = bc;
    }
  }

  vec3 bc = bestBc / max(1e-6, bestBc.x + bestBc.y + bestBc.z);
  vec3 g = bc * uHexFreq;
  vec3 r = floor(g + 0.5);
  // Rounding all three independently can break the sum; correct the coordinate
  // that moved furthest, which is the standard cube-rounding fix.
  float diff = uHexFreq - (r.x + r.y + r.z);
  vec3 d = abs(r - g);
  if (abs(diff) > 0.25) {
    if (d.x > d.y && d.x > d.z) r.x += diff;
    else if (d.y > d.z) r.y += diff;
    else r.z += diff;
  }

  mat3 c;
  for (int f = 0; f < 20; f++) {
    if (f == best) c = uIcoCorners[f];
  }
  vec3 p = c[0] * r.x + c[1] * r.y + c[2] * r.z;
  return length(p) > 1e-6 ? normalize(p) : dir;
}

const vec3 LUMA = vec3(0.30, 0.59, 0.11);

/** The sky's colour, rescaled to a given brightness. */
vec3 skyHue(float lum) {
  return uSky * (lum / max(1e-4, dot(uSky, LUMA)));
}

/**
 * Pull a colour toward the sky's hue without changing how bright it is.
 *
 * Mixing straight to the sky colour would also mix to the sky's brightness, so
 * a dark sky would flatten the sea to a silhouette and a bright one would blow
 * it out. Rescaling the sky to the colour's own luminance first keeps the
 * shading — coastline, depth, ripples — and changes only what colour it is.
 */
vec3 towardSky(vec3 col, float amount) {
  return mix(col, skyHue(dot(col, LUMA)), clamp(amount, 0.0, 1.0));
}

vec2 texelSnap(vec2 uv, vec2 res, vec2 footprint) {
  vec2 p = uv * res;
  vec2 f = fract(p);
  vec2 w = max(footprint, vec2(1e-5));
  vec2 s = clamp((f - 0.5) / w + 0.5, 0.0, 1.0);
  return (floor(p) + s) / res;
}

/**
 * Surface height in a given direction.
 *
 * Snapped to a Goldberg cell first, exactly as the colour is. The hillshade
 * takes four taps a fixed *angle* apart, so near a pole two geometric
 * neighbours sit many columns apart in longitude and, read against the raw
 * grid, land on unrelated slivers. Multiplied by the relief gain that
 * incoherence becomes a fan of shading spokes across the ice cap — the last
 * thing left of the polar singularity once the colour is uniform. Reading the
 * cell instead makes a tap mean the same thing everywhere on the sphere.
 */
float heightAt(vec3 dir) {
  vec3 c = goldbergCentre(dir);
  float la = asin(clamp(c.y, -1.0, 1.0));
  float lo = atan(c.x, c.z);
  return textureLod(uAlbedo, vec2(lo / TAU, la / PI + 0.5), 0.0).a;
}

/** Radius of the displaced surface in a given direction. Water stays at datum. */
float terrainRadius(vec3 dir) {
  float la = asin(clamp(dir.y, -1.0, 1.0));
  float lo = atan(dir.x, dir.z);
  // Same polar averaging as the shading uses. Point-sampling the height field
  // near a pole displaces each crammed column differently, which raises the
  // spokes you can see radiating from the ice cap.
  float cosLat = max(0.05, sqrt(max(0.0, 1.0 - dir.y * dir.y)));
  float h = textureLod(uAlbedo, vec2(lo / TAU, la / PI + 0.5), max(0.0, log2(1.0 / cosLat))).a;
  // Sea level is where the surface flattens out, because on a world with an
  // ocean that is exactly what you see. With the ocean boiled off there is
  // nothing holding the datum, so the seabed drops away as the basin it is.
  float d = uMolten > 0.5 ? h - uSeaLevel : max(0.0, h - uSeaLevel);
  return 1.0 + d * uRelief;
}

/**
 * A ring system, in the plane of the world's equator.
 *
 * Rings are flat, thin enough to vanish edge-on, and made of loose ice rather
 * than rock — so this is a ray against a plane, an annulus test, and a density
 * that varies with radius. No geometry: a ring drawn as a mesh needs thousands
 * of triangles to stop being a polygon, and all of this costs one divide.
 *
 * The gaps are the character. A ring of even density reads as a disc of card;
 * the divisions — swept clean by moons in resonance with the particles — are
 * what make it read as billions of separate things in orbit.
 *
 * Returns colour in rgb and coverage in alpha, both zero where there is no ring
 * along this ray or where the world is in front of it.
 */
vec4 ringAlong(vec3 eye, vec3 dir, float tMax, vec3 sunDir) {
  if (uRings.x <= 0.0) return vec4(0.0);
  // The equatorial plane is y = 0 in this frame, because the poles are ±y.
  if (abs(dir.y) < 1e-5) return vec4(0.0);
  float t = -eye.y / dir.y;
  if (t <= 0.0 || t >= tMax) return vec4(0.0);
  vec3 p = eye + dir * t;
  float r = length(p.xz);
  if (r < uRings.x || r > uRings.y) return vec4(0.0);

  // Where in the system this is: 0 at the inner edge, 1 at the outer.
  float u = (r - uRings.x) / max(1e-4, uRings.y - uRings.x);
  // Bands at three scales, so it does not read as a repeating pattern, and one
  // hard division about two thirds out, which every ringed world has a version
  // of.
  float band = 0.55
    + 0.30 * sin(u * 46.0)
    + 0.16 * sin(u * 113.0 + 1.7)
    + 0.10 * sin(u * 269.0 + 0.4);
  band *= smoothstep(0.0, 0.06, u) * (1.0 - smoothstep(0.88, 1.0, u));
  float division = smoothstep(0.0, 0.018, abs(u - 0.63));
  float density = clamp(band * division, 0.0, 1.0);
  if (density < 0.004) return vec4(0.0);

  // Edge-on a ring is a line and nearly transparent; face-on you look through
  // its whole thickness. Same cosine either way, and getting it wrong is what
  // makes a ring look like a decal painted on the sky.
  float faceOn = abs(dir.y);
  float cover = clamp(density * (0.30 + faceOn * 0.85), 0.0, 0.95);

  // The world's shadow falls across them: anything on the far side of the
  // planet from the star and within a radius of the sun line is in it. A
  // cylinder rather than a cone, which at this distance is the same picture.
  float alongSun = dot(p, sunDir);
  float offAxis = length(p - sunDir * alongSun);
  float shadow = (alongSun < 0.0 && offAxis < 1.0)
    ? smoothstep(1.0, 0.86, offAxis) : 0.0;

  vec3 ice = mix(vec3(0.78, 0.74, 0.66), vec3(0.94, 0.92, 0.88), band);
  return vec4(ice * uSun * (1.0 - shadow * 0.92), cover);
}

void main() {
  vec2 ndc = (gl_FragCoord.xy / uRes) * 2.0 - 1.0;
  vec3 dir = normalize(uRayBasis * vec3(ndc, 1.0));

  float sunAngle = uDayFrac * TAU;
  float yearAngle = uYearFrac * TAU;
  // Handed in rather than worked out here, so that the light and the star's own
  // sphere cannot disagree about where the star is. It is a point on one rigid
  // orbital plane, tilted off the equator and turned about the poles by the
  // hour of the day — which is why the star climbs and sinks with the season
  // and why it crosses the sky along a slanted track rather than straight
  // overhead. See skyFrame() in system.ts.
  vec3 sunDir = uSunDir;

  float b = dot(uEye, dir);
  float rMax = 1.0 + uRelief * (1.0 - uSeaLevel);
  // The floor of the march. Normally the datum sphere, since nothing is drawn
  // below sea level; on a boiled world the dry basins go under it, and marching
  // only to the datum would drop the seabed through the bottom of the world.
  float rMin = uMolten > 0.5 ? 1.0 - uRelief * uSeaLevel : 1.0;
  float discOuter = b * b - (dot(uEye, uEye) - rMax * rMax);
  float discDatum = b * b - (dot(uEye, uEye) - rMin * rMin);

  bool hit = false;
  vec3 N = vec3(0.0, 0.0, 1.0);
  vec3 hitPos = vec3(0.0);

  if (discOuter >= 0.0) {
    float tEnter = max(0.0, -b - sqrt(discOuter));
    if (uRelief < 0.0005) {
      // No displacement worth marching: the analytic sphere hit is exact.
      if (discDatum >= 0.0) {
        float t = -b - sqrt(discDatum);
        if (t >= 0.0) {
          hitPos = uEye + dir * t;
          N = normalize(hitPos);
          hit = true;
        }
      }
    } else {
      // March the shell between the highest possible peak and the datum
      // sphere. Bounding the march this tightly is what keeps a fixed step
      // count precise enough to resolve individual hills.
      float tExit = discDatum >= 0.0 ? (-b - sqrt(discDatum)) : (-b + sqrt(discOuter));
      tExit = max(tExit, tEnter);
      // Standing on the ground, a ray toward the horizon never meets the datum
      // sphere at all, so that chord runs most of the way round the world — and
      // fifty-six steps spread over it are a step every few hundred tiles,
      // which strides straight over every hill in between. The result is a
      // horizon that boils as you turn and a marcher doing its most expensive
      // work on ground that is beyond seeing anyway. Cut it at the distance the
      // haze has already faded to nothing: past there the answer is the sky.
      // Far enough to have a landscape and a horizon in it — some forty tiles,
      // which is where the haze has thickened to nothing anyway — and no
      // further. Left unbounded the chord runs most of the way round the world
      // and the fifty-six steps land a few hundred tiles apart.
      if (uGround > 0.5) tExit = min(tExit, tEnter + 0.35);
      float span = tExit - tEnter;
      float tPrev = tEnter;
      for (int i = 1; i <= 56; i++) {
        float t = tEnter + span * (float(i) / 56.0);
        vec3 p = uEye + dir * t;
        if (length(p) <= terrainRadius(normalize(p))) {
          // Bisect to place the surface crossing precisely.
          float lo = tPrev;
          float hi = t;
          for (int k = 0; k < 6; k++) {
            float mid = (lo + hi) * 0.5;
            vec3 pm = uEye + dir * mid;
            if (length(pm) <= terrainRadius(normalize(pm))) hi = mid; else lo = mid;
          }
          hitPos = uEye + dir * hi;
          N = normalize(hitPos);
          hit = true;
          break;
        }
        tPrev = t;
      }
    }

    // Sea level is a hard floor: any ray that reaches the datum sphere has hit
    // the world. Without this the march can step exactly onto radius 1.0 and
    // have the comparison fall the wrong side of a float epsilon, which makes
    // the ocean go transparent and show the starfield through it.
    if (!hit && discDatum >= 0.0) {
      float t = -b - sqrt(discDatum);
      if (t >= 0.0) {
        hitPos = uEye + dir * t;
        N = normalize(hitPos);
        hit = true;
      }
    }
  }

  // ---- the star, shaded the way it always was ------------------------------
  //
  // This is the original star shading, moved onto the sphere. It used to work
  // from a fixed angular radius and the sun's direction; it now works from the
  // sphere's *actual* angular radius as seen from the eye, which is the same
  // arithmetic fed by geometry instead of by a constant. That is what makes it
  // identical close up and far away without anything being told to match.
  //
  // The face keeps the star's hue and is lifted just past white; the fierceness
  // lives in the corona hugging the limb and the haze beyond it. Driving the
  // face itself by the intensity is what clipped a red star to orange.
  vec3 starGlow = vec3(0.0);
  float starGlare = 0.0;
  float starAngR = 0.0;
  if (uBodyCount > 0) {
    vec3 toStar = uBody[0].xyz - uEye;
    float dist = max(1e-3, length(toStar));
    starAngR = asin(clamp(uBody[0].w / dist, 0.0, 0.999));
    float ang = acos(clamp(dot(dir, toStar / dist), -1.0, 1.0));
    float past = max(0.0, ang - starAngR);

    if (uSunDark > 0.5) {
      // A hole gives no corona: the light is the ring of matter falling in.
      float ring = exp(-abs(ang - starAngR * 1.26) / max(1e-5, starAngR * 0.20));
      starGlare = ring;
      starGlow = uSun * uSunGlow * ring * 0.8;
    } else {
      float peak = max(uSun.r, max(uSun.g, uSun.b));
      vec3 hue = uSun / max(1e-4, peak);
      // A point-sized star has only its glare to be known by, so it is allowed
      // to blow out; anything large enough to read as a colour is held just
      // *below* white so it keeps that colour — above it, the brightest channel
      // pins at one while the others keep rising and a red star drifts orange.
      float small = clamp(0.02 / max(1e-4, starAngR), 0.0, 1.0);
      float face = mix(0.92, uSunGlow * 0.9, small);

      // One curve, from the centre all the way out.
      //
      // It used to be built in two pieces — a smoothstep for the face and an
      // exponential corona beyond the limb. They met at the same value, so it
      // looked safe, but their *slopes* did not: a smoothstep flattens as it
      // finishes while an exponential starts falling at once. That left the
      // brightness on a plateau right at the limb and then dropping away, and a
      // plateau followed by a drop is a ring. Two expressions can always
      // disagree like that at the join; one cannot.
      float x = ang / max(1e-5, starAngR);
      float body = 1.0 / (1.0 + x * x * x * x);
      float halo = 0.16 / (1.0 + pow(x, 1.6));

      // A glare, for the things that are points of light rather than discs.
      //
      // A neutron star is the size of a city: it has no disc to speak of and no
      // shape the eye can resolve, only an unbearable brightness. So none of
      // this is the star. The star is the small round core in the middle of it;
      // everything radiating out is light coming off that core — through air,
      // through an eye, through whatever you are looking with — and it is drawn
      // soft and additive for that reason, so it reads as brightness spilling
      // rather than as a spiky object.
      //
      // Eight rays, four long and four short between them, which is what a
      // fierce point of light actually throws. Struck across the star's own
      // frame rather than the screen's, so the glare belongs to the star and
      // holds still as you look around instead of sliding over the sky.
      float spikes = 0.0;
      if (uStarSpike > 0.01) {
        vec3 sd = toStar / dist;
        vec3 sUp = abs(sd.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
        vec3 sX = normalize(cross(sUp, sd));
        vec3 sY = cross(sd, sX);
        vec2 off = vec2(dot(dir, sX), dot(dir, sY));
        float th = atan(off.y, off.x);
        // |cos(2th)| peaks four times round the circle; the same again turned
        // an eighth of a turn puts four more between them.
        float c1 = abs(cos(th * 2.0));
        float c2 = abs(cos(th * 2.0 + 0.7853982));
        // Each ray is a narrow bright line inside a broader faint smear. A
        // single power curve looks drawn on; the pair gives it an edge to fade
        // into, which is most of what makes it read as light rather than shape.
        float longArm = pow(c1, 40.0) + 0.30 * pow(c1, 6.0);
        float shortArm = pow(c2, 52.0) + 0.22 * pow(c2, 8.0);
        // Fixed lengths, not lengths scaled off the disc: the glare is a
        // brightness in the eye, so it stays the same whatever the star.
        float reachLong = exp(-ang / 0.0076);
        float reachShort = exp(-ang / 0.0042);
        // The star itself: small, round and white-hot. Everything above is what
        // comes off it. Without this there is nothing but rays, and rays with
        // no source are a shape rather than a light.
        float core = exp(-ang / 0.0013);
        float bloom = exp(-ang / 0.0040) * 0.30;
        spikes = (core * 1.2 + bloom
                + longArm * reachLong * 0.70
                + shortArm * reachShort * 0.80) * uStarSpike;
      }

      starGlare = body + halo + spikes;
      starGlow = hue * face * (body + halo + spikes);
    }
  }

  // ---- the companion ------------------------------------------------------
  //
  // Half of all the stars you can see are two stars. The second one is drawn
  // with the same soft profile as the first rather than as a hard sphere, for
  // the same reason: a disc with a cut edge and a corona round it reads as two
  // objects. It is smaller and cooler here — the junior partner of the pair —
  // and it keeps its own place in the sky, so the two rise and set apart and
  // there are stretches of the year with one sun up and stretches with both.
  vec3 star2Glow = vec3(0.0);
  if (uStar2.w > 0.0) {
    vec3 to2 = uStar2.xyz - uEye;
    float d2 = max(1e-3, length(to2));
    float angR2 = asin(clamp(uStar2.w / d2, 0.0, 0.999));
    float ang2 = acos(clamp(dot(dir, to2 / d2), -1.0, 1.0));

    // Everything the primary gets, and for the same reasons.
    //
    // It was drawn with a shortened version of this: no hue normalisation, a
    // flat brightness instead of the star's own fierceness, a slightly
    // different halo and no rays. All of those were solved once for the first
    // star — the colour drifting toward orange as the brightest channel pins at
    // one, the ring at the limb where two curves met with different slopes, the
    // point-sized stars that are all glare and no disc — and a second sun that
    // does not get them is a second sun that looks worse than the first for
    // reasons the first stopped having.
    float peak2 = max(uStar2Col.r, max(uStar2Col.g, uStar2Col.b));
    vec3 hue2 = uStar2Col / max(1e-4, peak2);
    float small2 = clamp(0.02 / max(1e-5, angR2), 0.0, 1.0);
    float face2 = mix(0.92, uStar2Glow * 0.9, small2);

    float x2 = ang2 / max(1e-5, angR2);
    float body2 = 1.0 / (1.0 + x2 * x2 * x2 * x2);
    float halo2 = 0.16 / (1.0 + pow(x2, 1.6));

    float spikes2 = 0.0;
    if (uStar2Spike > 0.01) {
      vec3 sd = to2 / d2;
      vec3 sUp = abs(sd.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
      vec3 sX = normalize(cross(sUp, sd));
      vec3 sY = cross(sd, sX);
      vec2 off = vec2(dot(dir, sX), dot(dir, sY));
      float th = atan(off.y, off.x);
      float c1 = abs(cos(th * 2.0));
      float c2 = abs(cos(th * 2.0 + 0.7853982));
      float longArm = pow(c1, 40.0) + 0.30 * pow(c1, 6.0);
      float shortArm = pow(c2, 52.0) + 0.22 * pow(c2, 8.0);
      float core = exp(-ang2 / 0.0013);
      float bloom = exp(-ang2 / 0.0040) * 0.30;
      spikes2 = (core * 1.2 + bloom
               + longArm * exp(-ang2 / 0.0076) * 0.70
               + shortArm * exp(-ang2 / 0.0042) * 0.80) * uStar2Spike;
    }

    starGlare = max(starGlare, body2 + halo2 + spikes2);
    star2Glow = hue2 * face2 * (body2 + halo2 + spikes2);
  }

  // ---- the rest of the system --------------------------------------------
  // Plain ray-sphere against a handful of bodies, nearest wins, compared
  // against the planet's own hit so a world can pass in front of another. Only
  // worth doing once the camera is far enough out for any of it to be on
  // screen, which is also when the planet stops being the subject.
  // The star is index 0 and is deliberately skipped here. Drawn as a hard
  // ray-sphere it has a cut edge where its corona begins, and the two together
  // read as two objects; worse, this whole pass used to be gated on the zoom,
  // so the disc *appeared* the moment the other planets did — the star visibly
  // brightening and hardening at one point in the zoom. It is drawn instead as
  // a single soft profile below, from the same geometry, at every distance.
  int bodyHit = -1;
  float bodyT = 1e9;
  vec3 bodyN = vec3(0.0);
  {
    for (int i = 1; i < 14; i++) {
      if (i >= uBodyCount) break;
      vec3 oc = uEye - uBody[i].xyz;
      float rr = uBody[i].w;
      float bq = dot(oc, dir);
      float cq = dot(oc, oc) - rr * rr;
      float disc = bq * bq - cq;
      if (disc < 0.0) continue;
      float t = -bq - sqrt(disc);
      if (t <= 0.0 || t >= bodyT) continue;
      bodyT = t;
      bodyHit = i;
      bodyN = normalize(uEye + dir * t - uBody[i].xyz);
    }
  }

  // A body in front of the world, or the world not there at all, is what we see.
  if (bodyHit >= 0 && (!hit || bodyT < length(hitPos - uEye))) {
    vec3 c = uBodyCol[bodyHit];
    {
      vec3 toStar = normalize(uBody[0].xyz - (uEye + dir * bodyT));
      c *= 0.05 + 0.95 * max(0.0, dot(bodyN, toStar));
    }
    frag = vec4(dither(c, gl_FragCoord.xy), 1.0);
    gl_FragDepth = 1.0;
    return;
  }

  // Corona around the star out here, added to whatever else the ray finds.
  // Without it the star is a hard-edged disc pasted on black; with it there is
  // something burning at the middle of the system.
  // ---- space, stars and the atmospheric limb ------------------------------
  if (!hit) {
    vec3 closest = uEye + dir * max(0.0, -b);
    float d = max(0.0, length(closest) - 1.0);
    // The shell thins on screen as the camera descends, so scale it by altitude
    // — but capped. Unbounded it grows with distance until it is a wash of sky
    // colour over the whole frame, which is why it used to be faded out at
    // range; and fading it out is what made the star change colour as you
    // pulled back, since the wash was tinting it on the way in.
    float scale = clamp((length(uEye) - 1.0) * 0.07, 0.004, 0.30);
    float lit = uNight > 0.5 ? clamp(dot(normalize(closest), sunDir), 0.0, 1.0) : 1.0;

    vec3 col = vec3(0.020, 0.024, 0.038);

    // Distant stars, keyed to the ray direction *in the sun's frame*.
    //
    // The terrain is fixed in world space and day and night come from swinging
    // the sun around it, which is a fine way to light a planet and a poor way
    // to describe one: against a fixed backdrop of stars it reads as a sun
    // orbiting the world rather than a world turning under its sun. Rotating
    // the starfield with the sun makes the whole sky sweep together, which is
    // what rotation looks like from the ground.
    // ...and the world is also going *round* the star, which is why the sun
    // drifts backwards through the constellations over a year and the winter
    // night sky is not the summer one. The stars turn once more per year than
    // the sun does — a sidereal day against a solar one — so the whole orbit
    // is carried in this one extra term.
    float skyCos = cos(sunAngle + yearAngle);
    float skySin = sin(sunAngle + yearAngle);
    vec3 skyDir = vec3(
      dir.x * skyCos - dir.z * skySin,
      dir.y,
      dir.x * skySin + dir.z * skyCos);
    vec3 sd = floor(skyDir * 420.0);
    if (hash31(sd) > 0.9986) {
      // Drowned near the star, which is also why you cannot see stars beside
      // the sun. Anything actually behind its sphere was already resolved by
      // the body pass, which returns before reaching here.
      col += vec3(0.55, 0.60, 0.75) * (0.35 + hash31(sd + 3.7))
           * (1.0 - clamp(starGlare * 2.2, 0.0, 1.0));
    }

    // Faded out at system range, where its distance scaling turns it into a
    // haze over the entire sky rather than a rim on a planet.
    col += uSky * exp(-d / scale) * (0.12 + lit * 0.88);
    col += starGlow + star2Glow;

    // ---- sky, from underneath it -----------------------------------------
    //
    // From orbit the thing above the world is space, and that is what is drawn
    // above: black with stars in it and a rim of air on the limb. Standing on
    // the ground the same direction is *sky* — you are inside the air rather
    // than looking at it edge-on, and there are several kilometres of it
    // between you and the black. A world whose daytime sky is space is the one
    // thing that would give away that this is a map you have zoomed into.
    //
    // Cheap Rayleigh, not the real integral: deep overhead, pale and warm at
    // the horizon where the line of sight runs through far more air, and lit by
    // how high the sun stands rather than by the time on a clock.
    if (uGround > 0.5) {
      float up = clamp(dot(normalize(uEye), dir), -1.0, 1.0);
      float horizon = pow(1.0 - clamp(abs(up), 0.0, 1.0), 3.0);
      float sunUp = clamp(dot(normalize(uEye), sunDir), -1.0, 1.0);
      // Day, dusk and night, from the sun's own height. Nothing else needs to
      // know the hour: this is the hour.
      float day = smoothstep(-0.18, 0.22, sunUp);
      vec3 zenith = mix(vec3(0.012, 0.020, 0.052), uSky * 0.85 + vec3(0.05, 0.13, 0.34), day);
      vec3 rim = mix(vec3(0.030, 0.036, 0.070), uSky * 0.55 + vec3(0.62, 0.66, 0.72), day);
      // The warm band low in the sky at either end of the day, in the direction
      // the sun actually is rather than all the way round the compass.
      float toward = clamp(dot(dir, sunDir), 0.0, 1.0);
      float dusk = (1.0 - abs(sunUp * 4.0)) * horizon * toward;
      vec3 sky = mix(zenith, rim, horizon);
      sky += vec3(0.55, 0.22, 0.06) * max(0.0, dusk) * 1.4;
      // A glow around the sun itself, which is what air does with a light in it.
      sky += uSun * pow(toward, 22.0) * 0.5 * day;
      // Over the top of the starfield rather than instead of it: the stars are
      // still there at night and go out as the sky brightens.
      col = mix(col, sky, clamp(day * 0.94 + 0.06, 0.0, 1.0));
    }
    // Rings, over the sky — from orbit and from the ground alike, where they
    // arch overhead. Nothing is in front of them along a ray that missed the
    // world.
    vec4 ring = ringAlong(uEye, dir, 1e9, sunDir);
    col = mix(col, ring.rgb, ring.a);
    frag = vec4(dither(col, gl_FragCoord.xy), 1.0);
    gl_FragDepth = 1.0;
    return;
  }

  // Depth of the surface hit, matching the projection the meshes use, so trees
  // and people occlude against the terrain instead of floating over it.
  {
    float zView = dot(hitPos - uEye, uRayBasis[2]);
    float ndcZ = (uFar + uNear) / (uFar - uNear)
               - (2.0 * uFar * uNear) / ((uFar - uNear) * max(1e-6, zView));
    gl_FragDepth = clamp(ndcZ * 0.5 + 0.5, 0.0, 1.0);
  }

  float lat = asin(clamp(N.y, -1.0, 1.0));
  float lon = atan(N.x, N.z);
  vec2 uv = vec2(lon / TAU, lat / PI + 0.5);
  vec2 world = vec2(fract(uv.x) * uWorld.x, uv.y * uWorld.y);

  // Texel footprint, derived from the derivatives of the sphere normal (which
  // is continuous everywhere) rather than of uv (which is not).
  vec3 dNx = dFdx(N);
  vec3 dNy = dFdy(N);
  float horiz = max(1e-6, N.x * N.x + N.z * N.z);
  float dLonX = (N.z * dNx.x - N.x * dNx.z) / horiz;
  float dLonY = (N.z * dNy.x - N.x * dNy.z) / horiz;
  float coLat = max(1e-4, sqrt(max(0.0, 1.0 - N.y * N.y)));
  float dLatX = dNx.y / coLat;
  float dLatY = dNy.y / coLat;
  vec2 footprint = vec2(
    (abs(dLonX) + abs(dLonY)) / TAU * uWorld.x,
    (abs(dLatX) + abs(dLatY)) / PI * uWorld.y
  );


  // Tangent frame. The reference axis has to be chosen away from the normal:
  // using the world up unconditionally makes the cross product collapse to zero
  // at the poles, and the resulting basis is numerical noise that rotates with
  // azimuth — which draws a fan of shading spokes across the ice cap.
  vec3 ref = abs(N.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 east = normalize(cross(ref, N));
  vec3 north = cross(N, east);

  // ---- surface sample -----------------------------------------------------
  // Deliberately unadorned. Earlier versions warped the sampling with noise and
  // mottled the albedo to invent sub-tile detail; the result was a world you
  // could not read. What a map needs is clean cells and honest edges.
  // ---- uniform cells all the way to the poles -----------------------------
  // Sampling is snapped to Goldberg cells rather than to grid cells, so a cell
  // is the same size and shape at the pole as it is at the equator, and the
  // equirectangular singularity simply is not there to see.
  vec3 hex = goldbergCentre(N);
  float hexLat = asin(clamp(hex.y, -1.0, 1.0));
  float hexLon = atan(hex.x, hex.z);
  vec2 huv = vec2(hexLon / TAU, hexLat / PI + 0.5);

  // Mip level from the *latitude* footprint alone. Longitudinal aliasing is
  // already handled by snapping to Goldberg cells, and the longitude derivative
  // near a pole is huge — feeding it to the sampler asks for a near-global
  // average and paints a fan of blotches over the ice cap.
  float lod = max(0.0, log2(max(1.0, footprint.y)));
  vec4 alb = textureLod(uAlbedo, huv, lod);
  vec4 dat = textureLod(uData, huv, lod);
  vec3 col = alb.rgb;

  // ---- relief, sampled on the sphere --------------------------------------
  // The height taps step along the local east and north directions by a fixed
  // *angle*, not by a fixed offset in uv. Stepping in uv means stepping a
  // vanishing physical distance in longitude near the poles, which is what was
  // still smearing the shading up there after the colour had been fixed.
  float step = TAU / uWorld.x * 1.5;
  float hL = heightAt(normalize(N - east * step));
  float hR = heightAt(normalize(N + east * step));
  float hD = heightAt(normalize(N - north * step));
  float hU = heightAt(normalize(N + north * step));
  vec3 n = normalize(N - east * (hR - hL) * 9.0 - north * (hU - hD) * 9.0);

  float lam = clamp(dot(n, sunDir), 0.0, 1.0);
  float flat_ = clamp(dot(N, sunDir), -1.0, 1.0);
  // Shading from the terrain itself is always present, so relief reads even at
  // local noon and even when the day/night cycle is switched off.
  float relief = 0.74 + 0.5 * clamp(dot(n, normalize(N * 2.0 + sunDir)), 0.0, 1.0);
  col *= mix(relief, 0.62 + 0.7 * lam, uNight > 0.5 ? 1.0 : 0.0);
  // The star's own light, falling on the ground. Applied after the shading so
  // it colours what is lit rather than washing out the shadows with it.
  col *= mix(vec3(1.0), uSun, 0.75);
  // A second sun adds its own light from its own quarter of the sky. This is
  // the whole difference a binary makes on the ground: two lots of daylight
  // arriving from two directions, so a slope lit by one is shadowed from the
  // other and the terminator is a soft double edge rather than a line.
  if (uStar2.w > 0.0) {
    float lam2 = clamp(dot(N, uSunDir2), 0.0, 1.0);
    col += col * uStar2Col * lam2 * 0.55;
  }

  // ---- molten ground ------------------------------------------------------
  //
  // What a world looks like when it orbits close enough to lose its oceans: not
  // a hot desert but the aftermath of a collision — black chilled crust broken
  // into plates, with the melt still showing in the seams between them and
  // pooled in the deep basins where the sea used to be. The crust is written
  // into the colour here; the melt is held back as an emissive term, added
  // after the day/night pass, because lava is a light source with no business
  // going dark just because the sun has set on it. That is the half of this
  // that sells it — the night side of a molten world is the good side.
  vec3 magma = vec3(0.0);
  if (uMolten > 0.5) {
    vec3 p = N * 3.4;
    float plates = fbm3(p * 2.6);
    float grain = fbm3(p * 11.0);
    // Seams: the thin places in a value-noise field, which read as the cracks
    // between slabs of cooled crust.
    float seam = 1.0 - smoothstep(0.0, 0.10, abs(plates - 0.5));
    float fine = 1.0 - smoothstep(0.0, 0.055, abs(fbm3(p * 6.2) - 0.5));
    // Depth below the old shoreline: the drowned basins are where the melt
    // gathers, so the dead sea floors glow and the highlands are cold rock.
    float deep = smoothstep(uSeaLevel + 0.04, uSeaLevel - 0.16, alb.a);
    float heat = clamp(max(seam, fine * 0.7) * (0.35 + 0.9 * deep) + deep * deep * 0.55, 0.0, 1.0);
    // Slow, because rock is heavy. Fast flicker looks like fire, and this is
    // not fire — it is stone that has not finished cooling.
    heat *= 0.75 + 0.25 * sin(uTime * 0.5 + plates * 21.0);

    vec3 crust = mix(vec3(0.085, 0.062, 0.058), vec3(0.20, 0.155, 0.145), grain);
    crust = mix(crust, vec3(0.34, 0.20, 0.13), deep * 0.35);
    col = crust;
    // Orange at the edges of a crack, white-yellow down the middle of it.
    magma = mix(vec3(1.10, 0.26, 0.03), vec3(1.60, 1.15, 0.45), smoothstep(0.55, 1.0, heat))
          * pow(heat, 2.2) * 1.5;
  }

  // ---- water --------------------------------------------------------------
  float river = dat.r;
  float lake = dat.b;
  // Inland water is written in the sky's colour, not in blue. Painting it blue
  // and tinting afterwards leaves every river and lake obstinately blue under a
  // red or green sky, because a partial mix of a saturated blue still reads as
  // blue however far it is pushed.
  if (river > 0.01) {
    float ripple = sin(N.x * 90.0 + N.z * 70.0 + N.y * 50.0 - uTime * 1.6) * 0.5 + 0.5;
    vec3 riverCol = mix(skyHue(0.38), skyHue(0.62), ripple * 0.6);
    col = mix(col, riverCol, clamp(river, 0.0, 1.0));
  }
  if (lake > 0.01) {
    float shimmer = sin(N.x * 60.0 - uTime * 0.7) * cos(N.z * 70.0 + uTime * 0.5);
    col = mix(col, skyHue(0.36 + shimmer * 0.03), clamp(lake * 3.0, 0.0, 0.85));
  }

  // ---- the sky, reflected -------------------------------------------------
  // Open sea, rivers and lakes all mirror the sky, so they take its colour
  // hardest; everything else takes a trace of it, which is what keeps the land
  // and the sea looking like they are standing under the same air.
  float ocean = uMolten > 0.5 ? 0.0
    : 1.0 - smoothstep(uSeaLevel - 0.01, uSeaLevel, alb.a);
  float wet = clamp(max(ocean, max(river, lake * 3.0)), 0.0, 1.0);
  col = towardSky(col, uSkyMix.y + wet * uSkyMix.x);

  // ---- sanctity -----------------------------------------------------------
  float sacred = dat.g;
  if (sacred > 0.01) {
    float pulse = 0.6 + 0.4 * sin(uTime * 1.1 + N.x * 14.0 + N.y * 11.0);
    col += vec3(0.20, 0.15, 0.05) * sacred * pulse;
  }

  // ---- day / night --------------------------------------------------------
  // Night is moonlight, not blackout: the player still has to read the world.
  float dayness = 1.0;
  if (uNight > 0.5) {
    dayness = smoothstep(-0.16, 0.30, flat_);
    // Night is only night when both suns are down.
    if (uStar2.w > 0.0) {
      dayness = max(dayness, smoothstep(-0.16, 0.30, dot(N, uSunDir2)));
    }
    float grey = dot(col, vec3(0.30, 0.59, 0.11));
    // The night wash carried a fixed blue, which put blue back into water the
    // sky had just taken it out of. Half of it now follows the sky.
    vec3 moon = mix(vec3(0.60, 0.70, 1.0), skyHue(0.77), 0.5);
    // How far back the camera is: 1 with the whole world in frame, 0 standing
    // on it. Night is meant to be dark from the ground — that is most of what
    // makes standing on the surface feel like standing somewhere — but from
    // orbit a black hemisphere is not atmosphere, it is a missing half of the
    // planet. So the dark side lifts as you pull away, and the eye gets what
    // an eye actually gets out there: continents in starlight.
    float far_ = 1.0 - smoothstep(3.0, 26.0, uPxPerTile);
    vec3 nightCol = mix(col, vec3(grey), 0.28) * moon * (0.62 + 0.30 * far_)
                  + moon * 0.028 * far_;
    col = mix(nightCol, col, dayness);
    col += vec3(0.30, 0.13, 0.03) * (1.0 - abs(flat_)) * 0.35 * dayness;

    // ---- fires on the dark side -----------------------------------------
    //
    // Pulled back far enough to see the whole world, the night hemisphere had
    // nothing on it at all: the houses and people stop being drawn long before
    // that distance, so the only thing left was dim ground, and half the planet
    // read as empty. This is the one thing that is visible from orbit at night
    // and it is the thing worth seeing — where the people are.
    //
    // The alpha of the data texture is already 1 wherever a settlement holds
    // the cell. Mipped down it stops being a flag and becomes a density, which
    // is exactly right: a town covering more ground burns brighter, and a
    // whole region of them glows the way a country does from space.
    float night = 1.0 - dayness;
    float hearth = dat.a;
    if (hearth > 0.002 && night > 0.001) {
      float flicker = 0.86 + 0.14 * sin(uTime * 2.1 + N.x * 33.0 + N.z * 27.0);
      // Brighter the further out you are, for the same reason: at arm's length
      // a town is a smear of roofs you can already see, and from orbit it is a
      // spark against the dark or it is nothing.
      // ...and gone entirely up close, where it was the wrong thing twice over:
      // the flag is per *cell*, so at close range it lights whole square tiles
      // of ground rather than points of light — a settled field glowed as
      // brightly as the village in it — and it is redundant anyway, because at
      // that distance the houses themselves are drawn and you can see them.
      col += vec3(1.00, 0.70, 0.32) * sqrt(hearth) * night * flicker * 2.6 * far_;
    }
  }

  // The melt, added after nightfall has been applied to everything else: it is
  // emitting rather than reflecting, so the dark side of a molten world is lit
  // by its own cracks.
  col += magma;

  // ---- whose ground this is -----------------------------------------------
  //
  // Applied after the day/night pass, and that is the whole point of it being
  // here rather than mixed into the ground colour further up. A border is not
  // a property of the land — the land does not know who holds it — it is
  // something drawn over the world for somebody who wants to know. Baked into
  // the albedo it went out with the sun, so at night the one thing on the map
  // you might be watching a war on simply stopped being visible.
  //
  // Sampled with the same mip bias as everything else, so a border seen from
  // orbit is the average of the ground under it rather than one lucky texel.
  vec4 realm = textureLod(uRealm, huv, lod);
  if (realm.a > 0.002) {
    col = mix(col, realm.rgb, realm.a);
  }

  // ---- close ground -------------------------------------------------------
  //
  // The albedo is one colour per tile, and a tile at walking distance is four
  // hundred pixels across: the ground in front of you is a single flat wash
  // several screens wide, which is the greyish nothing that fills the bottom of
  // the frame the moment you stand up in this world. There is no more data to
  // draw — the simulation genuinely does not know anything finer than a tile —
  // so this invents it, which is the honest thing to do as long as it invents
  // *texture* and not information: two octaves of noise on the sphere, moving
  // the brightness a little and the hue almost not at all. It says "grass" and
  // "rock" without claiming there is a particular tuft anywhere.
  if (uGround > 0.5) {
    float grain = fbm3(N * 900.0) - 0.5;
    float coarse = fbm3(N * 190.0) - 0.5;
    col *= 1.0 + grain * 0.28 + coarse * 0.16;
    // A touch greener where it is already green, so the variation reads as
    // vegetation on soil rather than as static over a photograph.
    col.g *= 1.0 + coarse * 0.05;
  }

  // ---- the air in between -------------------------------------------------
  //
  // Standing on the ground, everything more than a few hundred paces off is
  // seen through a great deal of air, and it goes pale and blue with it. This
  // is the cheapest and by far the largest thing that makes a landscape read as
  // a landscape rather than as a painted backdrop: without it the far hills are
  // exactly as crisp and exactly as dark as the grass at your feet, and the eye
  // reads the whole thing as flat.
  //
  // Only from the ground. From orbit there is no "in between" worth speaking
  // of — you are outside the air, not inside it.
  if (uGround > 0.5) {
    float away = length(hitPos - uEye);
    // Tuned in planet radii: the horizon from head height is a few hundredths
    // of one, so this reaches its full strength across roughly that distance.
    float haze = 1.0 - exp(-away * 9.0);
    float sunUp = clamp(dot(normalize(uEye), sunDir), -1.0, 1.0);
    float day = smoothstep(-0.18, 0.22, sunUp);
    vec3 air = mix(vec3(0.030, 0.038, 0.075), uSky * 0.55 + vec3(0.55, 0.62, 0.72), day);
    col = mix(col, air, clamp(haze, 0.0, 0.92));
  }

  // ---- limb: darkening plus a thin shell of atmosphere --------------------
  float vdot = clamp(dot(N, -dir), 0.0, 1.0);
  col *= 0.68 + 0.32 * smoothstep(0.0, 0.35, vdot);
  col += uSky * 0.74 * pow(1.0 - vdot, 5.0) * dayness * 0.5;
  // Deliberately no starGlow here. Adding the corona to the planet's own
  // surface let the star show faintly straight through the world, which is
  // exactly what a glow drawn over solid ground looks like.

  // The near arc of a ring passes in front of the world. Tested against the
  // distance to the ground, so the far arc is correctly hidden behind it.
  {
    vec4 ring = ringAlong(uEye, dir, length(hitPos - uEye), sunDir);
    col = mix(col, ring.rgb, ring.a);
  }

  frag = vec4(dither(col, gl_FragCoord.xy), 1.0);
}`,ar=`#version 300 es
precision highp float;

layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec3 aPos;    // world tile x, tile y, height above ground
layout(location = 2) in float aSize;  // radius in px at the focus distance
layout(location = 3) in vec4 aColor;
layout(location = 4) in float aShape;

uniform vec3 uEye;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uFwd;
uniform float uTanFov;
uniform float uAspect;
uniform vec2 uRes;
uniform vec2 uWorld;
uniform float uFocusDist;
uniform float uRelief;
uniform float uSeaLevel;
uniform sampler2D uAlbedo;

out vec2 vCorner;
out vec4 vColor;
out float vShape;

const float PI = 3.14159265359;
const float TAU = 6.28318530718;

void main() {
  float lon = (aPos.x / uWorld.x) * TAU;
  float lat = (aPos.y / uWorld.y - 0.5) * PI;
  float cl = cos(lat);
  vec3 p = vec3(cl * sin(lon), sin(lat), cl * cos(lon));

  // Sit on the displaced surface, so people and trees stand on the hills
  // rather than sinking into them once relief is exaggerated.
  float h = textureLod(uAlbedo, vec2(lon / TAU, lat / PI + 0.5), 0.0).a;
  float ground = 1.0 + max(0.0, h - uSeaLevel) * uRelief;
  p *= ground + aPos.z;

  vCorner = aCorner;
  vShape = aShape;

  vec3 rel = p - uEye;
  float zv = dot(rel, uFwd);
  // Hidden behind the planet, or behind the camera.
  float horizon = dot(p, uEye);
  if (zv <= 1e-5 || horizon < 0.999) {
    vColor = aColor;
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0); // clipped
    return;
  }

  // Fade in over the last stretch before the horizon instead of popping.
  vColor = vec4(aColor.rgb, aColor.a * smoothstep(0.999, 1.004, horizon));

  float xv = dot(rel, uRight);
  float yv = dot(rel, uUp);
  // Perspective size: things further away are smaller, as they should be.
  float sizePx = aSize * (uFocusDist / zv);
  vec2 ndc = vec2(xv / (zv * uTanFov * uAspect), yv / (zv * uTanFov));
  ndc += aCorner * sizePx * 2.0 / uRes;
  gl_Position = vec4(ndc, 0.0, 1.0);
}`,or=`#version 300 es
precision highp float;

in vec2 vCorner;
in vec4 vColor;
in float vShape;
out vec4 frag;

void main() {
  float r = length(vCorner);
  float alpha = vColor.a;

  if (vShape < 0.5) {
    // People: soft dot with a darker rim so crowds stay legible.
    if (r > 1.0) discard;
    float edge = smoothstep(1.0, 0.72, r);
    vec3 c = mix(vColor.rgb * 0.45, vColor.rgb, edge);
    frag = vec4(c, alpha * smoothstep(1.0, 0.86, r));
  } else if (vShape < 1.5) {
    // Settlements: a filled diamond.
    float d = abs(vCorner.x) + abs(vCorner.y);
    if (d > 1.0) discard;
    float edge = smoothstep(1.0, 0.6, d);
    frag = vec4(mix(vColor.rgb * 0.55, vColor.rgb, edge), alpha);
  } else if (vShape < 2.5) {
    // Selection / miracle ring.
    if (r > 1.0) discard;
    float ring = smoothstep(0.80, 0.92, r) * (1.0 - smoothstep(0.97, 1.0, r));
    if (ring < 0.02) discard;
    frag = vec4(vColor.rgb, alpha * ring);
  } else if (vShape < 3.5) {
    // A tree: canopy above a trunk.
    float trunk = step(abs(vCorner.x), 0.16) * step(vCorner.y, -0.15);
    float canopy = step(abs(vCorner.x), 0.92 - 0.75 * (vCorner.y + 0.2));
    canopy *= step(-0.2, vCorner.y);
    if (trunk + canopy < 0.5) discard;
    vec3 c = trunk > 0.5 ? vColor.rgb * 0.42 : vColor.rgb * (0.78 + 0.35 * (vCorner.y + 0.4));
    frag = vec4(c, alpha);
  } else if (vShape < 4.5) {
    // A dwelling: walls with a pitched roof.
    float walls = step(abs(vCorner.x), 0.72) * step(abs(vCorner.y + 0.45), 0.5);
    float roof = step(abs(vCorner.x), 0.92 - 0.9 * max(0.0, vCorner.y)) * step(0.03, vCorner.y);
    if (walls + roof < 0.5) discard;
    vec3 c = roof > 0.5 ? vColor.rgb * 0.62 : vColor.rgb;
    frag = vec4(c, alpha);
  } else if (vShape < 5.5) {
    // A host under arms: crossed blades. Deliberately not a dot or a diamond —
    // those already mean people and towns, and an army on the road has to be
    // tellable from both at a glance, at whatever zoom the war is watched from.
    float blade = min(abs(vCorner.x + vCorner.y), abs(vCorner.x - vCorner.y));
    float arm = 1.0 - smoothstep(0.16, 0.30, blade);
    float within = 1.0 - smoothstep(0.86, 1.0, r);
    float mark = arm * within;
    if (mark < 0.06) discard;
    // Dark at the edges so it holds up over pale ground and bright over dark.
    vec3 c = mix(vColor.rgb * 0.45, vColor.rgb, 1.0 - smoothstep(0.1, 0.9, r));
    frag = vec4(c, alpha * mark);
  } else if (vShape < 6.5) {
    // A ship: hull, mast and a sail. Drawn only when the camera is too far out
    // for the boat's own model to be drawn, so it is never seen next to the
    // thing it stands for — at that range a real hull is a pixel and a half,
    // and a crossing that takes a week of world time should not be invisible
    // for the whole of it.
    float hull = step(abs(vCorner.x), 0.78 - 0.5 * max(0.0, -0.25 - vCorner.y))
               * step(-0.62, vCorner.y) * step(vCorner.y, -0.16);
    float mast = step(abs(vCorner.x + 0.02), 0.07) * step(-0.16, vCorner.y);
    float sail = step(0.09, vCorner.x)
               * step(vCorner.x, 0.09 + 0.62 * (0.86 - vCorner.y) / 1.0)
               * step(-0.12, vCorner.y) * step(vCorner.y, 0.86);
    float mark = max(hull, max(mast, sail));
    if (mark < 0.5) discard;
    // The hull darker than the canvas, so the shape holds together.
    vec3 c = hull > 0.5 ? vColor.rgb * 0.55 : vColor.rgb;
    frag = vec4(c, alpha);
  } else {
    // A lightning strike: a bolt down the middle with a flash around it. The
    // power already scorched the ground and killed whatever was standing
    // there; what it never did was *happen* anywhere you could see, so calling
    // it down read as nothing at all until you noticed the black grass.
    // Only the glow around the strike. The bolt itself is real geometry now —
    // a column standing on the ground — and drawing a flat one over the top of
    // it would be the sticker-on-the-lens the mesh was built to avoid.
    float flash = 1.0 - smoothstep(0.0, 1.0, r);
    flash *= flash;
    if (flash < 0.02) discard;
    frag = vec4(vColor.rgb, alpha * flash * 0.75);
  }
}`,sr=`#version 300 es
precision highp float;

layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec4 aColor;   // rgb, a = 1 where the wearer's dye applies
layout(location = 3) in vec2 aTile;
layout(location = 4) in float aScale;
layout(location = 5) in float aYaw;
layout(location = 6) in vec3 aTint;
layout(location = 7) in vec2 aGait;  // x: stride phase, radians. y: how fast, 0-1

uniform vec3 uEye;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uFwd;
uniform float uTanFov;
uniform float uAspect;
uniform float uNear;
uniform float uFar;
uniform vec2 uWorld;
uniform float uRelief;
uniform float uSeaLevel;
uniform sampler2D uAlbedo;

out vec3 vNormal;
out vec3 vColor;
out float vDepth;

const float PI = 3.14159265359;
const float TAU = 6.28318530718;

void main() {
  float lon = (aTile.x / uWorld.x) * TAU;
  float lat = (aTile.y / uWorld.y - 0.5) * PI;
  float cl = cos(lat);
  vec3 up = vec3(cl * sin(lon), sin(lat), cl * cos(lon));
  vec3 east = normalize(cross(vec3(0.0, 1.0, 0.0), up));
  vec3 north = cross(up, east);

  float h = textureLod(uAlbedo, vec2(lon / TAU, lat / PI + 0.5), 0.0).a;
  float ground = 1.0 + max(0.0, h - uSeaLevel) * uRelief;

  float cy = cos(aYaw);
  float sy = sin(aYaw);
  vec3 ex = east * cy + north * sy;
  vec3 nz = north * cy - east * sy;

  // ---- the walk -----------------------------------------------------------
  //
  // No bones and no skinning: this is a low-poly figure a dozen boxes big, and
  // a rig for it would be more machinery than model. What it has instead is its
  // own geometry to work from — legs are the parts below the waist, arms are
  // the parts out to either side, and which of the pair is which is the sign of
  // their x. That is enough to swing them, and swinging them is most of what
  // walking looks like.
  //
  // Everything is driven off one phase per person so the two legs and the two
  // arms cannot drift apart, and the amplitude is scaled by how fast they are
  // actually going, so a standing figure stands still rather than marching on
  // the spot.
  vec3 p = aPos;
  float gait = aGait.y;
  if (gait > 0.001) {
    float ph = aGait.x;
    float swing = sin(ph) * gait;
    float other = sin(ph + 3.14159265) * gait;
    // Legs: pivot about the hip, so the foot travels and the hip does not.
    if (p.y < 0.48) {
      float side = p.x < 0.0 ? swing : other;
      float lever = (0.48 - p.y);
      p.z += side * lever * 0.95;
      // And rise a little at the top of the swing, or the foot ploughs a furrow.
      p.y += max(0.0, side) * lever * 0.18;
    } else if (abs(p.x) > 0.13 && p.y < 0.95) {
      // Arms: opposite to the leg on the same side, which is what people do and
      // what looks wrong the moment it is not done. The threshold is the torso's
      // half-width — anything further out than that is a sleeve or a hand, and
      // it has to move with the figure when the figure gets thinner.
      float side = p.x < 0.0 ? other : swing;
      float lever = (0.95 - p.y);
      p.z += side * lever * 0.75;
    }
    // The whole body rises and falls twice a stride, and leans into the walk.
    p.y += abs(sin(ph)) * 0.035 * gait;
    p.z += 0.05 * gait;
  }

  vec3 local = p * aScale;
  vec3 world = up * ground + ex * local.x + up * local.y + nz * local.z;
  vNormal = normalize(ex * aNormal.x + up * aNormal.y + nz * aNormal.z);
  // Three ways of answering the tint, chosen per vertex. 0 shifts the vertex's
  // own colour by it, which is how a forest takes its star's light; 1 is dyed
  // cloth and takes the tint outright, because a crown's colour multiplied into
  // a blue shirt only comes out a darker blue; 2 ignores it, which is skin.
  vColor = aColor.a > 1.5 ? aColor.rgb
         : aColor.a > 0.5 ? aTint
         : aColor.rgb * aTint;

  vec3 rel = world - uEye;
  float zv = dot(rel, uFwd);
  float xv = dot(rel, uRight);
  float yv = dot(rel, uUp);
  vDepth = zv;
  gl_Position = vec4(
    xv / (uTanFov * uAspect),
    yv / uTanFov,
    (uFar + uNear) / (uFar - uNear) * zv - (2.0 * uFar * uNear) / (uFar - uNear),
    zv);
}`,cr=`#version 300 es
precision highp float;

in vec3 vNormal;
in vec3 vColor;
in float vDepth;
out vec4 frag;

uniform float uDayFrac;
uniform float uYearFrac;
uniform float uSeasonTilt;
uniform float uNight;
uniform vec3 uSky;
uniform float uSkyAmbient;
uniform vec3 uSun;
uniform vec3 uEye;
uniform float uGround;   // 1 when standing on the world
uniform vec3 uSunDir;

const float TAU = 6.28318530718;

void main() {
  // The same sun as the terrain's, season and all, or a house would be lit from
  // somewhere the ground it stands on is not.
  vec3 sunDir = uSunDir;
  vec3 n = normalize(vNormal);
  float lam = clamp(dot(n, sunDir), 0.0, 1.0);
  vec3 col = vColor * (0.42 + 0.75 * lam) * mix(vec3(1.0), uSun, 0.75);
  // The trace of sky the ground gets, so models do not read as lit by a
  // different world than the one they stand on.
  {
    const vec3 LUMA = vec3(0.30, 0.59, 0.11);
    float lum = dot(col, LUMA);
    col = mix(col, uSky * (lum / max(1e-4, dot(uSky, LUMA))), clamp(uSkyAmbient, 0.0, 1.0));
  }
  if (uNight > 0.5) {
    // Same moonlight treatment as the ground, so models sit in the same light.
    float dayness = smoothstep(-0.16, 0.30, dot(n, sunDir) * 0.5 + 0.5);
    float grey = dot(col, vec3(0.30, 0.59, 0.11));
    vec3 nightCol = mix(col, vec3(grey), 0.28) * vec3(0.60, 0.70, 1.0) * 0.62;
    col = mix(nightCol, col, dayness);
  }
  // And the same air in front of them as the ground behind them. Without this
  // the far trees stay crisp against hills that have gone pale, and the whole
  // treeline lifts off the landscape and floats.
  if (uGround > 0.5) {
    float haze = 1.0 - exp(-max(0.0, vDepth) * 9.0);
    float sunUp = clamp(dot(normalize(uEye), sunDir), -1.0, 1.0);
    float day = smoothstep(-0.18, 0.22, sunUp);
    vec3 air = mix(vec3(0.030, 0.038, 0.075), uSky * 0.55 + vec3(0.55, 0.62, 0.72), day);
    col = mix(col, air, clamp(haze, 0.0, 0.92));
  }
  frag = vec4(col, 1.0);
}`,lr=[{id:`azure`,name:`Sky blue`,light:[.24,.44,.86],water:.62,ambient:.06,swatch:`#5b8de0`},{id:`deep`,name:`Dark blue`,light:[.07,.15,.52],water:.72,ambient:.1,swatch:`#1b2a72`},{id:`ember`,name:`Red`,light:[.88,.24,.16],water:.9,ambient:.09,swatch:`#d4402c`},{id:`verdant`,name:`Green`,light:[.26,.8,.34],water:.92,ambient:.07,swatch:`#3fc555`}],ur=`azure`;function dr(e){return lr.find(t=>t.id===e)??lr.find(e=>e.id===`azure`)}var fr={remnant:`Remnant`,main:`Main sequence`,giant:`Giant`,supergiant:`Supergiant`},pr=2.9;function J(e){return Math.PI/360*e*pr}var mr=[{id:`browndwarf`,name:`Brown dwarf`,kind:`main`,blurb:`Barely a star at all — a failed one, glowing dull red from its own collapse. A dim world of ice, with a thin band round its middle that people can hold.`,light:[.66,.34,.24],brightness:.34,size:J(2.2),intensity:1,warmth:-7,tree:`pine`,flora:[.5,.2,.42],swatch:`#8a4a2e`},{id:`reddwarf`,name:`Red dwarf`,kind:`main`,blurb:`Small, faint and red. A liveable world orbits almost on top of it, so it looms larger than a sun. Most of the planet is ice.`,light:[1,.55,.42],brightness:.72,size:J(2.6),intensity:1.7,warmth:-6,tree:`pine`,flora:[.6,.26,.86],swatch:`#e8563c`},{id:`orange`,name:`Orange dwarf`,kind:`main`,blurb:`Dimmer and older than a sun, and far longer-lived. A cool world with its warm ground in the tropics.`,light:[1,.82,.62],brightness:.88,size:J(.75),intensity:2.3,warmth:-3,tree:`oak`,flora:[1.02,.8,.7],swatch:`#ffb066`},{id:`yellow`,name:`Yellow dwarf`,kind:`main`,blurb:`The sun’s own sort, half a degree across. Temperate middles, ice at the poles.`,light:[1,.97,.9],brightness:1,size:J(.53),intensity:2.6,warmth:0,tree:`oak`,flora:[1,1,1],swatch:`#ffe9a8`},{id:`yellowwhite`,name:`Yellow-white`,kind:`main`,blurb:`Hotter than a sun and burning through its life faster. Broad temperate country.`,light:[1,1,.93],brightness:1.08,size:J(.64),intensity:2.9,warmth:1.5,tree:`oak`,flora:[1.02,1,.9],swatch:`#fff8e0`},{id:`white`,name:`White`,kind:`main`,blurb:`A clean white star of about the sun’s apparent size, and a good deal fiercer.`,light:[.96,.97,1],brightness:1.14,size:J(.8),intensity:3.2,warmth:2.5,tree:`oak`,flora:[1.03,1,.88],swatch:`#f2f6ff`},{id:`bluewhite`,name:`Blue-white`,kind:`main`,blurb:`White with a blue cast, and bright enough that the world sits well back from it — slightly smaller than a sun in the sky.`,light:[.84,.9,1],brightness:1.2,size:J(1),intensity:3.5,warmth:3.5,tree:`oak`,flora:[1.04,1.01,.82],swatch:`#dce8ff`},{id:`blue`,name:`Blue`,kind:`main`,blurb:`Fierce, short-lived and blue. A distant bead of light, smaller than a sun, that still scorches the tropics.`,light:[.7,.81,1],brightness:1.3,size:J(1.3),intensity:4.2,warmth:4.5,tree:`oak`,flora:[1.06,1.02,.7],swatch:`#9dbcff`},{id:`orangegiant`,name:`Orange giant`,kind:`giant`,blurb:`A star past its prime, swollen and cooling. Three times a sun across — the coolest of the giants, and still a warm world unless you hold well back from it.`,light:[1,.7,.42],brightness:1.05,size:J(2.9),intensity:1.6,warmth:5.5,reach:.4,tree:`oak`,flora:[.98,.58,.46],swatch:`#ff9040`},{id:`redgiant`,name:`Red giant`,kind:`giant`,blurb:`A swollen old star some seven times a sun across. Cool-surfaced, but so vast that the tropics bake.`,light:[1,.26,.12],brightness:1.14,size:J(3.5),intensity:1.35,warmth:4,reach:.52,tree:`oak`,flora:[.92,.3,.3],swatch:`#d9310f`},{id:`bluewhitegiant`,name:`Blue-white giant`,kind:`giant`,blurb:`Huge and hard-white, three times a sun across and far hotter than anything on the main sequence.`,light:[.86,.92,1],brightness:1.2,size:J(2.4),intensity:2.5,warmth:7,reach:.32,tree:`oak`,flora:[1.04,1,.8],swatch:`#cfe0ff`},{id:`bluegiant`,name:`Blue giant`,kind:`giant`,blurb:`Vast, fierce and blue, four times a sun across. The tropics bake and the poles are merely cold.`,light:[.72,.83,1],brightness:1.24,size:J(2.1),intensity:2.3,warmth:8.5,reach:.28,tree:`oak`,flora:[1.05,1.02,.72],swatch:`#a8ccff`},{id:`bluesupergiant`,name:`Blue supergiant`,kind:`supergiant`,blurb:`Immense and blue-white, a dozen times a sun across, burning itself out in a few million years.`,light:[.68,.8,1],brightness:1.34,size:J(7),intensity:2,warmth:12,reach:.95,tree:`oak`,flora:[1.06,1.02,.66],swatch:`#8fb4ff`},{id:`redsupergiant`,name:`Red supergiant`,kind:`supergiant`,blurb:`The largest thing a star becomes — twenty-five times a sun across, a dull red wall filling the sky.`,light:[1,.22,.09],brightness:1.18,size:J(13),intensity:1.15,warmth:8,reach:1.2,tree:`oak`,flora:[.9,.26,.28],swatch:`#b8280a`},{id:`cepheid`,name:`Cepheid variable`,kind:`supergiant`,blurb:`A yellow supergiant that cannot settle. It swells and brightens and falls back on a clock you could set a calendar by, and the world beneath it warms and cools with it.`,light:[1,.95,.78],brightness:1.2,size:J(4.4),intensity:3.2,warmth:8.5,reach:.55,pulse:1,tree:`oak`,flora:[1,.96,.82],swatch:`#ffe9a8`},{id:`whitedwarf`,name:`White dwarf`,kind:`remnant`,blurb:`A dead star’s cinder — searing, but no bigger than a planet, and half a sun’s width in the sky. A frozen world.`,light:[.9,.94,1],brightness:.62,size:J(.5),intensity:11,warmth:-6,tree:`pine`,flora:[.86,.92,1.05],swatch:`#e8f0ff`},{id:`neutron`,name:`Neutron star`,kind:`remnant`,blurb:`A city-sized corpse of a star. Too small to show a disc at all — an unbearably bright point in a dark sky.`,light:[.86,.91,1],brightness:.5,size:J(.012),spike:1,intensity:18,warmth:-3,tree:`pine`,flora:[.88,.9,1.02],swatch:`#dfe9ff`},{id:`blackhole`,name:`Black hole`,kind:`remnant`,blurb:`Nothing to see but the ring of matter falling in, and a hole where the stars should be. The light comes from the dying.`,light:[1,.68,.36],brightness:.78,size:J(1.2),intensity:3.4,warmth:2,tree:`oak`,flora:[1,.66,.5],dark:!0,swatch:`#241a12`}],hr=[{id:`warmingdwarf`,name:`Warming red dwarf`,kind:`main`,blurb:`A red dwarf a long way into its life, burning hotter than it was born and turned orange with it.`,light:[1,.74,.46],brightness:.72,size:J(2.65),intensity:.85,warmth:-4.5,tree:`pine`,flora:[1,.62,.5],swatch:`#ffb066`},{id:`yellowingdwarf`,name:`Yellowing red dwarf`,kind:`main`,blurb:`Hotter again, and yellow now. The best years this world will ever have, and they last a while.`,light:[1,.92,.7],brightness:.92,size:J(2.7),intensity:1.1,warmth:-2.5,tree:`oak`,flora:[1,.88,.7],swatch:`#ffe9a8`},{id:`whitedwarfstar`,name:`White-burning red dwarf`,kind:`main`,blurb:`White-hot and still the same small star, still burning the last of a hydrogen supply it has spent an age on.`,light:[.99,.99,.98],brightness:1.1,size:J(2.75),intensity:1.6,warmth:-.5,tree:`oak`,flora:[1,1,.95],swatch:`#fffdf6`},{id:`bluewhitedwarfstar`,name:`Blue-white red dwarf`,kind:`main`,blurb:`Fiercer than a sun, from a star a fraction of its mass. The end of the burning is close.`,light:[.88,.93,1],brightness:1.2,size:J(2.8),intensity:2.2,warmth:1,tree:`pine`,flora:[.9,.95,1.05],swatch:`#dfeaff`},{id:`bluedwarf`,name:`Blue dwarf`,kind:`main`,blurb:`The last thing a red dwarf becomes before it stops: hot, blue and slightly swollen. The universe is not old enough to hold one of these yet.`,light:[.74,.84,1],brightness:1.26,size:J(3.1),intensity:3,warmth:2.5,tree:`pine`,flora:[.78,.9,1.1],swatch:`#bcd4ff`},{id:`brownfading`,name:`Fading brown dwarf`,kind:`main`,blurb:`Dimmer than it was, and it was never bright. The heat of its own making, going out of it.`,light:[.6,.28,.2],brightness:.26,size:J(2.18),intensity:.7,warmth:-10,tree:`pine`,flora:[.46,.18,.4],swatch:`#743c25`},{id:`browndeep`,name:`Deep red brown dwarf`,kind:`main`,blurb:`A wide dull ember filling a quarter of the sky and warming almost nothing.`,light:[.52,.21,.17],brightness:.19,size:J(2.16),intensity:.46,warmth:-14,tree:`pine`,flora:[.42,.15,.38],swatch:`#5e2e1d`},{id:`browndull`,name:`Dull brown dwarf`,kind:`main`,blurb:`Cool enough now that its own clouds have closed over it. What comes through is the colour of a dying coal.`,light:[.42,.16,.18],brightness:.13,size:J(2.14),intensity:.28,warmth:-19,tree:`pine`,flora:[.38,.13,.36],swatch:`#4a2119`},{id:`brownember`,name:`Brown dwarf ember`,kind:`main`,blurb:`You can look straight at it. A great cold disc with the last of a glow across one face.`,light:[.3,.11,.13],brightness:.08,size:J(2.12),intensity:.15,warmth:-26,tree:`pine`,flora:[.32,.11,.32],swatch:`#361612`},{id:`browncold`,name:`Cold brown dwarf`,kind:`main`,blurb:`Colder than boiling water and still the size of a giant planet. It gives light the way a warm stone does.`,light:[.19,.07,.08],brightness:.04,size:J(2.1),intensity:.07,warmth:-36,tree:`pine`,flora:[.28,.1,.3],swatch:`#230e0c`},{id:`browndark`,name:`Dark brown dwarf`,kind:`main`,blurb:`Out. A world-sized shape across the stars, and a world going round it that has not been lit for a very long time.`,light:[.09,.05,.05],brightness:.02,size:J(2.1),intensity:.02,warmth:-50,tree:`pine`,flora:[.24,.1,.26],swatch:`#130a09`},{id:`yellowcinder`,name:`Yellow white dwarf`,kind:`remnant`,blurb:`The cinder, cooled off its first searing white. Still far too small to warm a world.`,light:[1,.95,.76],brightness:.5,size:J(.5),intensity:7,warmth:-10,tree:`pine`,flora:[1,.92,.76],swatch:`#fff0bd`},{id:`orangecinder`,name:`Orange white dwarf`,kind:`remnant`,blurb:`Cooler again. A hard orange point in a sky that has been dark for a very long time.`,light:[1,.78,.48],brightness:.4,size:J(.5),intensity:4.5,warmth:-17,tree:`pine`,flora:[1,.74,.5],swatch:`#ffc180`},{id:`redcinder`,name:`Red white dwarf`,kind:`remnant`,blurb:`Down to a dull red. What heat reaches the ground is not enough to melt anything.`,light:[1,.52,.3],brightness:.3,size:J(.5),intensity:2.6,warmth:-26,tree:`pine`,flora:[1,.5,.42],swatch:`#ff7a45`},{id:`fadingcinder`,name:`Fading cinder`,kind:`remnant`,blurb:`Barely lit. You could look straight at it, if there were anyone left with eyes.`,light:[.72,.3,.2],brightness:.2,size:J(.5),intensity:1.2,warmth:-36,tree:`pine`,flora:[.8,.36,.3],swatch:`#8f3a24`},{id:`blackdwarf`,name:`Black dwarf`,kind:`remnant`,blurb:`A star that has finished. It gives out nothing at all, and the world under it keeps going round.`,light:[.16,.13,.13],brightness:.06,size:J(.5),intensity:.12,warmth:-50,tree:`pine`,flora:[.4,.4,.44],swatch:`#191414`}],gr=1620,_r=.5;function vr(e,t=gr){let n=Math.max(1,t),r=(e%n+n)/n%1,i=.32,a=r<i?r/i*.5:.5+(r-i)/.6799999999999999*.5;return-Math.cos(a*Math.PI*2)}function yr(e){return e.brightness*4.5}var br={browndwarf:{to:`brownfading`,change:`cool`,story:`the failed star dims. It never burned anything, and what light it has is leaking away`},brownfading:{to:`browndeep`,change:`cool`,story:`it dims again, to a deep red that barely reaches the ground`},browndeep:{to:`browndull`,change:`cool`,story:`its own clouds close over it, and the light comes through the colour of a dying coal`},browndull:{to:`brownember`,change:`cool`,story:`it dims to an ember. You could look straight at it now`},brownember:{to:`browncold`,change:`cool`,story:`it goes cold — colder than boiling water, and still the size of a giant planet`},browncold:{to:`browndark`,change:`cool`,story:`the last of it goes. What is up there is a shape across the stars and nothing else`},reddwarf:{to:`warmingdwarf`,change:`swell`,story:`the red dwarf burns hotter than it was born, and its light turns orange`},warmingdwarf:{to:`yellowingdwarf`,change:`swell`,story:`the small star goes on heating, and the light on the ground turns yellow`},yellowingdwarf:{to:`whitedwarfstar`,change:`swell`,story:`the star burns white now, hotter than the sun it never was`},whitedwarfstar:{to:`bluewhitedwarfstar`,change:`swell`,story:`the light turns blue-white and hard, and shadows go sharp`},bluewhitedwarfstar:{to:`bluedwarf`,change:`swell`,story:`the star swells the little it ever will and burns blue: a blue dwarf, and the last of the burning`},bluedwarf:{to:`whitedwarf`,change:`collapse`,story:`the fuel is gone. The star falls in on itself and is suddenly tiny — a white dwarf, no bigger than a world`},whitedwarf:{to:`yellowcinder`,change:`cool`,story:`the cinder cools off its white, and the sky yellows`},yellowcinder:{to:`orangecinder`,change:`cool`,story:`the cinder cools further, to orange`},orangecinder:{to:`redcinder`,change:`cool`,story:`the cinder is down to a dull red, and gives almost nothing`},redcinder:{to:`fadingcinder`,change:`cool`,story:`the last red goes out of it`},fadingcinder:{to:`blackdwarf`,change:`cool`,story:`the star finishes. It is a black dwarf now, and the world goes round it in the dark`},orange:{to:`redgiant`,change:`swell`,story:`the star leaves off burning hydrogen, cools, and swells into a red giant`},yellow:{to:`redgiant`,change:`swell`,story:`the sun leaves off burning hydrogen, cools, and swells into a red giant`},yellowwhite:{to:`orangegiant`,change:`swell`,story:`the star swells and reddens, its surface spread thin across a vast new size`},white:{to:`orangegiant`,change:`swell`,story:`the star swells and reddens, its surface spread thin across a vast new size`},redgiant:{to:`whitedwarf`,change:`collapse`,story:`the giant lets go of its outer layers, and what is left is a white-hot cinder the size of a world`},orangegiant:{to:`whitedwarf`,change:`collapse`,story:`the giant lets go of its outer layers, and what is left is a white-hot cinder the size of a world`},bluewhite:{to:`bluewhitegiant`,change:`swell`,story:`the star swells, and stays fierce doing it — there is that much of it to spend`},blue:{to:`bluegiant`,change:`swell`,story:`the star swells, and stays fierce doing it — there is that much of it to spend`},bluewhitegiant:{to:`redsupergiant`,change:`swell`,story:`the giant swells again, vast and cooling, into a red supergiant`},bluegiant:{to:`bluesupergiant`,change:`swell`,story:`the giant swells again into a blue supergiant, the brightest thing the sky will ever hold`},redsupergiant:{to:`neutron`,change:`supernova`,story:`the supergiant collapses on itself and detonates. What is left is a neutron star: a city of iron, spinning`},bluesupergiant:{to:`blackhole`,change:`supernova`,story:`the supergiant collapses on itself and detonates, and nothing is left that light can climb out of`}};function xr(e){return br[e]??null}var Sr={id:`whitedwarf`,name:`Supernova`,kind:`remnant`,blurb:`A star coming apart.`,light:[1,.97,.9],brightness:3.4,size:J(52),intensity:40,warmth:0,tree:`pine`,flora:[1,.98,.95],swatch:`#ffffff`},Cr=`yellow`;function wr(e){return mr.find(t=>t.id===e)??hr.find(t=>t.id===e)??mr.find(e=>e.id===`yellow`)}var Tr=[{id:`inner`,name:`Inner edge`,warmth:9,sizeScale:1.4,blurb:`As close as liquid water allows. The star fills more sky and the tropics are barely liveable.`},{id:`warm`,name:`Close`,warmth:4.5,sizeScale:1.16,blurb:`Inside the comfortable band. Long growing seasons, small ice caps.`},{id:`middle`,name:`Middle`,warmth:0,sizeScale:1,blurb:`The middle of the habitable zone, where this star is at its kindest.`},{id:`cool`,name:`Far`,warmth:-4.5,sizeScale:.87,blurb:`Out toward the cold edge. Shorter seasons, ice reaching further down.`},{id:`outer`,name:`Outer edge`,warmth:-9,sizeScale:.76,blurb:`As far as liquid water survives. A smaller star in the sky and a world of ice and tundra.`}],Er=`middle`;function Dr(e){let t=(Math.max(0,Math.min(1,e))-.5)*2;return Or(-10/2-Math.sign(t)*Math.abs(t)**2.1*120/2)}function Or(e){return{id:`middle`,name:e>26?`Almost touching it`:e>12?`Very close`:e>4?`Close`:e>-4?`Middle`:e>-12?`Far`:e>-26?`Very far`:`Out in the dark`,warmth:e,sizeScale:Math.max(.35,Math.min(3.2,1-e*-.055)),blurb:``}}function kr(e){let t=Math.max(-1,Math.min(1,(-5-e)/60));return Math.sign(t)*Math.abs(t)**(1/2.1)/2+.5}function Ar(e){return e>=40}function jr(e){return e>=-6&&e<=32}function Mr(e){return Tr.find(t=>t.id===e)??Tr.find(e=>e.id===`middle`)}function Nr(e,t){return 15+e+t}function Pr(e){return e>60?`the rock itself is glowing; there is no water anywhere on it`:e>=40?`bare rock — the seas have boiled away and nothing lives here`:e>33?`lethal: the tropics are bare rock and the poles are desert`:e<-40?`frozen to the core, with an atmosphere lying on it as snow`:e<-20?`a ball of ice from pole to pole; nothing has ever grown here`:e<-2?`an ice world, its people gathered in the tropics`:e<5?`cold, with ice reaching well down from the poles`:e<10?`cool — long winters, short growing seasons`:e<18?`temperate`:e<23?`warm, with wide deserts`:`hot — the tropics will be hard on anyone living there`}var Fr=class e{s0;s1;s2;s3;constructor(e){let t=e>>>0,n=()=>{t=t+2654435769>>>0;let e=t;return e=Math.imul(e^e>>>16,569420461),e=Math.imul(e^e>>>15,1935289751),(e^e>>>15)>>>0};this.s0=n(),this.s1=n(),this.s2=n(),this.s3=n()}state(){return[this.s0,this.s1,this.s2,this.s3]}setState(e){this.s0=e[0]>>>0,this.s1=e[1]>>>0,this.s2=e[2]>>>0,this.s3=e[3]>>>0}nextU32(){let e=Math.imul(this.s1,5)>>>0,t=Math.imul(e<<7|e>>>25,9)>>>0,n=this.s1<<9>>>0;return this.s2^=this.s0,this.s3^=this.s1,this.s1^=this.s2,this.s0^=this.s3,this.s2^=n,this.s3=(this.s3<<11|this.s3>>>21)>>>0,t}f(){return this.nextU32()/4294967296}range(e,t){return e+this.f()*(t-e)}int(e,t){return e+Math.floor(this.f()*(t-e))}chance(e){return this.f()<e}pick(e){return e[Math.floor(this.f()*e.length)]}normal(e=0,t=1){return e+(this.f()+this.f()+this.f()+this.f()+this.f()+this.f()-3)*.7071*t}fork(t){return new e((this.nextU32()^Math.imul(t,2654435769))>>>0)}},Ir=[`#8a7a6a`,`#9d7f63`,`#6f6f78`,`#a08a72`,`#7b6653`],Lr=[`#c9a678`,`#a8b6c8`,`#d0b48c`,`#8fa8bd`,`#c08a6a`],Rr=[`#a9c4d4`,`#c2d6e0`,`#93b0c4`],zr=[`first`,`second`,`third`,`fourth`,`fifth`,`sixth`,`seventh`,`eighth`,`ninth`,`tenth`,`eleventh`,`twelfth`];function Br(e,t){let n=e.planets[t];return n.given?n.given:t===e.homeIndex?`your world`:`the ${zr[t]??`${t+1}th`} world out`}function Vr(e,t){let n=new Fr(e^328007),r=[.72,1.34],i=Math.max(0,Math.min(1,(9-t.warmth)/18)),a=r[0]+(r[1]-r[0])*i,o=[],s=1+n.int(0,3);for(let e=0;e<s;e++){let t=.16+(r[0]-.22)*((e+.6)/s);o.push({radius:t,scale:.5+n.f()*.6,colour:n.pick(Ir),phase:n.f()*Math.PI*2,period:t**1.5*9,kind:`a burnt rock`})}let c={radius:a,scale:1,colour:`#4d8fd6`,phase:n.f()*Math.PI*2,period:a**1.5*9,kind:`your world`};if(o.push(c),n.chance(.45)){let e=n.chance(.5)?r[0]+(a-r[0])*.45:a+(r[1]-a)*.6;Math.abs(e-a)>.12&&o.push({radius:e,scale:.7+n.f()*.5,colour:n.pick(Ir),phase:n.f()*Math.PI*2,period:e**1.5*9,kind:`barren, but it could have been the one`})}let l=2+n.int(0,4),u=r[1]+.5;for(let e=0;e<l;e++){let t=e<2;o.push({radius:u,scale:t?2.6+n.f()*1.8:1.2+n.f()*.9,colour:t?n.pick(Lr):n.pick(Rr),phase:n.f()*Math.PI*2,period:u**1.5*9,kind:t?`a gas giant`:`ice and silence`}),u*=1.55+n.f()*.45}return o.sort((e,t)=>e.radius-t.radius),{planets:o,homeIndex:o.indexOf(c),habitable:r}}var Hr=1.15;function Ur(e,t){let n=Math.max(.4,t.scale*Hr);return Math.min(n,Math.max(.5,e*.34))}var Wr=Math.PI*2,Gr=.3576;function Kr(e,t,n=1){let r=e*Wr,i=t*Wr,a=Gr*n,o=Math.cos(r),s=Math.sin(r),c=Math.cos(a),l=Math.sin(a),u=[s,0,o],d=[-c*o,l,c*s],f=Math.cos(i),p=Math.sin(i);return{sun:[f*u[0]+p*d[0],f*u[1]+p*d[1],f*u[2]+p*d[2]],perp:[-p*u[0]+f*d[0],-p*u[1]+f*d[1],-p*u[2]+f*d[2]],eq1:u,eq2:[o,0,-s]}}var qr=380,Jr=.78;function Yr(e,t,n=400){let r=e.planets;if(r.length<3)return null;let i=e=>{let t=e/360,n=[];for(let e of r){let r=(e.phase+t/e.period*Math.PI*2)%(Math.PI*2);r<0&&(r+=Math.PI*2),n.push(r)}n.sort((e,t)=>e-t);let i=n[0]+Math.PI*2-n[n.length-1];for(let e=1;e<n.length;e++)i=Math.max(i,n[e]-n[e-1]);return Math.PI*2-i},a=n*360,o=0,s=1/0;for(let e=0;e<=a;e+=10){let n=i(t+e);n<s&&(s=n,o=e)}let c=Math.max(0,o-10),l=Math.min(a,o+10);for(let e=0;e<30;e++){let e=c+(l-c)/3,n=l-(l-c)/3;i(t+e)<i(t+n)?l=n:c=e}let u=(c+l)/2,d=i(t+u);return{inDays:u,spreadDeg:d*180/Math.PI,tight:d*180/Math.PI<=40}}function Xr(e,t,n,r,i=1,a=[],o=null,s=0){let c=e.planets[e.homeIndex],l=e=>qr*(e/c.radius)**+Jr,u=r.sun,d=r.perp,f=l(c.radius)/i,p=u[0]*f,m=u[1]*f,h=u[2]*f,g=new Float32Array(56),_=new Float32Array(42),v=[],y=(e,t,n,r,i,a)=>{g[e*4]=t,g[e*4+1]=n,g[e*4+2]=r,g[e*4+3]=i,_[e*3]=parseInt(a.slice(1,3),16)/255,_[e*3+1]=parseInt(a.slice(3,5),16)/255,_[e*3+2]=parseInt(a.slice(5,7),16)/255},b=(e,t,n,r,i,a)=>{g[e*4]=t,g[e*4+1]=n,g[e*4+2]=r,g[e*4+3]=i,_[e*3]=a[0],_[e*3+1]=a[1],_[e*3+2]=a[2]},x=l(c.radius)*Math.tan(t.size)*(1+s*.3);b(0,p,m,h,x,t.dark?[.03,.03,.03]:t.light);let S=1;if(o&&S<14){let e=o.distance;y(S,0,e*.34,e*.94,o.radius,o.colour),S++}for(let e of a){if(S>=14)break;let t=e.phase+n/e.period*Wr,i=Math.cos(t)*e.distance,a=Math.sin(t)*e.distance,o=Math.cos(e.tilt),s=Math.sin(e.tilt);y(S,r.eq1[0]*i+r.eq2[0]*a*o,a*s,r.eq1[2]*i+r.eq2[2]*a*o,e.radius,e.colour),S++}let C=S,w=n/360,T=c.phase+w/c.period*Math.PI*2;for(let t=0;t<e.planets.length&&S<14;t++){if(t===e.homeIndex)continue;let n=e.planets[t],r=l(n.radius),i=n.phase+w/n.period*Math.PI*2-T,a=Math.cos(i)*r,o=Math.sin(i)*r,s=Ur(x,n),c=p-(u[0]*a+d[0]*o),f=m-(u[1]*a+d[1]*o),g=h-(u[2]*a+d[2]*o);y(S,c,f,g,s,n.colour);let _=Zr(c,f,g,s,n);_&&v.push(_),S++}return{spheres:g,colours:_,count:S,skyCount:C,impacts:v}}function Zr(e,t,n,r,i){let a=Math.hypot(e,t,n);if(a>=1+r)return null;let o=(1+a*a-r*r)/Math.max(1e-6,2*a),s=o<=-1||a+r<=1||a+1<=r?Math.PI:Math.acos(Math.min(1,o)),c=Math.min(s,.75),l=a>1e-6?1/a:0,u=l>0?[e*l,t*l,n*l]:[0,1,0];return{lon:Math.atan2(u[0],u[2]),lat:Math.asin(Math.max(-1,Math.min(1,u[1]))),angle:c,depth:Math.max(0,Math.min(1,(1+r-a)/Math.max(1e-6,2*r))),name:i.given??i.kind}}var Qr=[],$r=[{id:`terrain`,label:`World`},{id:`faith`,label:`Faiths`},{id:`realms`,label:`Realms`},{id:`vegetation`,label:`Life`},{id:`herds`,label:`Herds`},{id:`fertility`,label:`Soil`},{id:`moisture`,label:`Water`},{id:`temperature`,label:`Heat`},{id:`minerals`,label:`Ore`},{id:`sanctity`,label:`Sanctity`}],ei={fertility:[[46,34,26],[214,196,96],[70,150,62]],moisture:[[140,116,70],[110,160,150],[40,90,190]],temperature:[[40,70,170],[200,205,190],[190,60,40]],vegetation:[[50,44,38],[120,130,60],[40,160,70]],herds:[[44,40,36],[140,110,62],[222,176,96]],minerals:[[38,36,34],[104,100,96],[168,164,158]],sanctity:[[22,22,30],[120,96,40],[255,214,120]]},ti={temperature:{low:`-25°C and under`,mid:`${10/2}°C`,high:`35°C and over`,note:`Yearly average of the ground, not today’s weather.`},fertility:{low:`barren`,mid:`workable`,high:`rich`,note:`What the soil will bear.`},moisture:{low:`parched`,mid:`damp`,high:`drowned`,note:`Standing water and rainfall together.`},vegetation:{low:`bare`,mid:`scrub`,high:`forest`,note:`How much is growing.`},herds:{low:`empty`,mid:`scattered`,high:`thick`,note:`Game to hunt. Cold barely thins it — tundra keeps its herds where the gathering fails.`},minerals:{low:`no stone`,mid:`rubble`,high:`quarry`,note:`Ore burns orange through the stone.`},sanctity:{low:`unhallowed`,mid:`touched`,high:`holy`,note:`Where your work has been felt.`}},ni=16,ri=k+4096,ii=9,ai=24e3,Y=Math.PI*2/768;function oi(e,t){let n=e.latitude(Math.max(0,Math.min(383,t)))*(Math.PI/2);return 1/Math.max(.06,Math.cos(n))}var si=Math.PI*(3-Math.sqrt(5));function ci(e){return Math.max(1.8,Math.sqrt(Math.max(1,e.houses))*1.45)}var li=1,ui=1.1;function di(e,t){let n=new Float64Array(e.length);for(let r of e){if(!r.alive)continue;let i=1/0;for(let n of e){if(n===r||!n.alive)continue;let e=t(r.x,r.y,n.x,n.y);e<i&&(i=e)}let a=ci(r),o=i/2-ui-li/2;n[r.id]=Math.max(.9,Math.min(a,o))}return n}function fi(e,t,n){let r=Math.round(n);if(r<0||r>=384)return!1;let i=(Math.round(t)%768+768)%768,a=r*768+i;return e.isLand(a)&&!(e.elevation[a]>=.455&&e.flow[a]>2419.2)}function pi(e,t){let n=Math.max(0,Math.min(383,Math.round(t))),r=(Math.round(e)%768+768)%768;return n*768+r}function mi(e,t,n){return hi(e,t,n)&&hi(e,t+1,n)&&hi(e,t-1,n)&&hi(e,t,n+1)&&hi(e,t,n-1)}function hi(e,t,n){let r=Math.round(n);if(r<0||r>=384)return!1;let i=(Math.round(t)%768+768)%768;return e.isLand(r*768+i)}var gi=9,_i=class{canvas;sim;camera=new T;overlay=`terrain`;showNight=!0;dayDays=0;showPeople=!0;showRoutes=!0;borderStrength=1;sky=dr(ur);star=wr(Cr);orbit=Mr(Er);rings=[0,0];companion=null;companionPeriod=3960;impacts=Qr;system=null;moons=[];parent=null;worldRadius=1;get sizeInTiles(){return 1/this.worldRadius}buildSystem(e){this.system=Vr(e,this.orbit)}dayPhase=0;tickAlpha=0;seasonTilt=1;get yearPhase(){let e=this.dayDays/360;return e-Math.floor(e)}gl;terrainProg;spriteProg;albedoTex;dataTex;realmTex;albedo=new Uint8Array(i*4);data=new Uint8Array(i*4);realm=new Uint8Array(i*4);instanceBuf;instances=new Float32Array(ri*gi);spriteVao;terrainVao;tUniforms={};sUniforms={};lastBuildAt=-999;lastOverlay=null;lastWash=-1;territoryWash(){let e=this.camera.pixelsPerTile,t=Math.max(0,Math.min(1,(e-6)/12));return Math.min(.94,.34*this.borderStrength)*(1-t*t*(3-2*t))}dpr=1;timeSec=0;goldberg=Zt();meshProg;mUniforms={};oaks;pines;folk;huts;keeps;halls;pyramids;rocks;beasts;boats;bolts;warChevrons;ruinWalls;ruinKeeps;walls;tools=[];strikes=[];flash(e,t){this.strikes.push({x:e,y:t,at:this.timeSec}),this.strikes.length>24&&this.strikes.shift()}markers=[];constructor(e,t){this.canvas=e,this.sim=t;let n=e.getContext(`webgl2`,{antialias:!0,alpha:!1});if(!n)throw Error(`WebGL2 is required and is not available in this browser.`);this.gl=n,this.terrainProg=Ei(n,rr,ir),this.spriteProg=Ei(n,ar,or),this.meshProg=Ei(n,sr,cr);for(let e of[`uEye`,`uRight`,`uUp`,`uFwd`,`uTanFov`,`uAspect`,`uNear`,`uFar`,`uWorld`,`uRelief`,`uSeaLevel`,`uAlbedo`,`uDayFrac`,`uYearFrac`,`uSeasonTilt`,`uNight`,`uSky`,`uSkyAmbient`,`uSun`,`uSunDir`,`uGround`])this.mUniforms[e]=n.getUniformLocation(this.meshProg,e);for(let e of`uAlbedo.uData.uRealm.uRayBasis.uEye.uRes.uWorld.uTime.uDayFrac.uYearFrac.uSeasonTilt.uPxPerTile.uNight.uRelief.uSeaLevel.uMolten.uGround.uRings.uStar2.uStar2Col.uSunDir2.uStar2Glow.uStar2Spike.uNear.uFar.uSky.uSkyMix.uSun.uSunDir.uSunGlow.uStarSpike.uSunDark.uSystemFade.uBodyCount.uIcoCorners.uIcoInv.uHexFreq`.split(`.`))this.tUniforms[e]=n.getUniformLocation(this.terrainProg,e);for(let e of[`uBody`,`uBodyCol`])this.tUniforms[e]=n.getUniformLocation(this.terrainProg,`${e}[0]`);this.goldberg=Zt();for(let e of[`uEye`,`uRight`,`uUp`,`uFwd`,`uTanFov`,`uAspect`,`uRes`,`uWorld`,`uFocusDist`,`uRelief`,`uSeaLevel`,`uAlbedo`])this.sUniforms[e]=n.getUniformLocation(this.spriteProg,e);this.albedoTex=Ti(n,768,384,n.REPEAT,n.CLAMP_TO_EDGE),this.dataTex=Ti(n,768,384,n.REPEAT,n.CLAMP_TO_EDGE),this.realmTex=Ti(n,768,384,n.REPEAT,n.CLAMP_TO_EDGE),this.terrainVao=n.createVertexArray(),this.spriteVao=n.createVertexArray(),n.bindVertexArray(this.spriteVao);let r=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,r),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0),this.instanceBuf=n.createBuffer(),n.bindBuffer(n.ARRAY_BUFFER,this.instanceBuf),n.bufferData(n.ARRAY_BUFFER,this.instances.byteLength,n.DYNAMIC_DRAW);for(let[e,t,r]of[[1,3,0],[2,1,12],[3,4,16],[4,1,32]])n.enableVertexAttribArray(e),n.vertexAttribPointer(e,t,n.FLOAT,!1,36,r),n.vertexAttribDivisor(e,1);n.bindVertexArray(null),this.oaks=this.makeBatch(dn()),this.pines=this.makeBatch(fn()),this.folk=this.makeBatch(bn()),this.huts=this.makeBatch(Zn()),this.keeps=this.makeBatch(Yn()),this.halls=this.makeBatch(tr()),this.pyramids=this.makeBatch(nr()),this.rocks=this.makeBatch(Wn()),this.beasts=this.makeBatch(Fn()),this.boats=this.makeBatch(Vn()),this.bolts=this.makeBatch(Rn()),this.warChevrons=this.makeBatch(er()),this.ruinWalls=this.makeBatch(Qn()),this.ruinKeeps=this.makeBatch($n()),this.walls=this.makeBatch(Xn()),this.tools=[null,this.makeBatch(wn()),this.makeBatch(Tn()),this.makeBatch(En()),this.makeBatch(Dn()),this.makeBatch(jn()),this.makeBatch(Mn()),this.makeBatch(Nn()),this.makeBatch(Pn())],n.enable(n.BLEND),n.blendFunc(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA),n.enable(n.DEPTH_TEST),n.depthFunc(n.LEQUAL),this.resize()}resize(){let e=Math.min(window.devicePixelRatio||1,2);this.dpr=e;let t=Math.max(1,Math.floor(this.canvas.clientWidth*e)),n=Math.max(1,Math.floor(this.canvas.clientHeight*e));(this.canvas.width!==t||this.canvas.height!==n)&&(this.canvas.width=t,this.canvas.height=n),this.camera.setViewport(this.canvas.clientWidth,this.canvas.clientHeight),this.gl.viewport(0,0,t,n)}markTerrainDirty(){this.lastBuildAt=-999}render(e){this.frames++;let t=this.gl,n=this.sim;this.timeSec=e,(e-this.lastBuildAt>.3||this.overlay!==this.lastOverlay||n.world.terrainDirty||Math.abs(this.territoryWash()-this.lastWash)>.015)&&(this.buildTextures(),this.lastBuildAt=e,this.lastOverlay=this.overlay,n.world.terrainDirty=!1),t.clearColor(.03,.04,.06,1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);let r=this.camera,i=this.canvas.width,a=this.canvas.height,s=r.reliefAmplitude;t.useProgram(this.terrainProg),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.albedoTex),t.uniform1i(this.tUniforms.uAlbedo,0),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,this.dataTex),t.uniform1i(this.tUniforms.uData,1),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,this.realmTex),t.uniform1i(this.tUniforms.uRealm,2),t.uniformMatrix3fv(this.tUniforms.uRayBasis,!1,r.rayBasis),t.uniform3fv(this.tUniforms.uEye,r.eye),t.uniform2f(this.tUniforms.uRes,i,a),t.uniform2f(this.tUniforms.uWorld,768,384),t.uniform1f(this.tUniforms.uTime,e),t.uniform1f(this.tUniforms.uDayFrac,this.dayPhase),t.uniform1f(this.tUniforms.uYearFrac,this.yearPhase),t.uniform1f(this.tUniforms.uSeasonTilt,this.seasonTilt);let c=Kr(this.dayPhase,this.yearPhase,this.seasonTilt);t.uniform3fv(this.tUniforms.uSunDir,c.sun),t.uniform1f(this.tUniforms.uPxPerTile,r.pixelsPerTile);let l=this.overlay!==`terrain`;t.uniform1f(this.tUniforms.uNight,this.showNight&&!l?1:0),t.uniform1f(this.tUniforms.uRelief,s),t.uniform1f(this.tUniforms.uSeaLevel,o),t.uniform1f(this.tUniforms.uMolten,+!!n.world.sterile),t.uniform1f(this.tUniforms.uGround,+!!r.ground),t.uniform2f(this.tUniforms.uRings,this.rings[0],this.rings[1]),t.uniform3fv(this.tUniforms.uSky,this.sky.light),t.uniform2f(this.tUniforms.uSkyMix,this.sky.water,this.sky.ambient);let u=this.pulseNow,d=1+u*.85;if(t.uniform3f(this.tUniforms.uSun,this.star.light[0]*this.star.brightness*d,this.star.light[1]*this.star.brightness*d*(1-u*.05),this.star.light[2]*this.star.brightness*d*(1-u*.16)),t.uniform1f(this.tUniforms.uStarSpike,this.star.spike??0),t.uniform1f(this.tUniforms.uSunGlow,this.star.intensity*(1+u*.9)),t.uniform1f(this.tUniforms.uSunDark,+!!this.star.dark),t.uniform1f(this.tUniforms.uSystemFade,r.systemBlend),this.system){let e=Xr(this.system,this.star,this.dayDays,c,this.orbit.sizeScale,this.moons,this.parent,u);if(this.companion){let n=this.dayDays/this.companionPeriod*Math.PI*2,r=[c.eq1[0]*Math.cos(n)*26+c.perp[0]*Math.sin(n)*26*.7,c.eq1[1]*Math.cos(n)*26+c.perp[1]*Math.sin(n)*26*.7+5.72,c.eq1[2]*Math.cos(n)*26+c.perp[2]*Math.sin(n)*26*.7],i=Math.hypot(r[0],r[1],r[2])||1,a=e.spheres[3]*(Math.tan(this.companion.size)/Math.tan(this.star.size));t.uniform4f(this.tUniforms.uStar2,r[0],r[1],r[2],a),t.uniform3f(this.tUniforms.uStar2Col,this.companion.light[0]*this.companion.brightness,this.companion.light[1]*this.companion.brightness,this.companion.light[2]*this.companion.brightness),t.uniform1f(this.tUniforms.uStar2Glow,this.companion.intensity),t.uniform1f(this.tUniforms.uStar2Spike,this.companion.spike??0),t.uniform3f(this.tUniforms.uSunDir2,r[0]/i,r[1]/i,r[2]/i)}else t.uniform4f(this.tUniforms.uStar2,0,0,0,0),t.uniform3f(this.tUniforms.uStar2Col,0,0,0),t.uniform1f(this.tUniforms.uStar2Glow,0),t.uniform1f(this.tUniforms.uStar2Spike,0),t.uniform3f(this.tUniforms.uSunDir2,0,1,0);this.starDrawn={radius:e.spheres[3],distance:Math.hypot(e.spheres[0],e.spheres[1],e.spheres[2])},t.uniform4fv(this.tUniforms.uBody,e.spheres),t.uniform3fv(this.tUniforms.uBodyCol,e.colours),t.uniform1i(this.tUniforms.uBodyCount,r.systemBlend>.002?e.count:e.skyCount),this.impacts=e.impacts}else t.uniform1i(this.tUniforms.uBodyCount,0),this.impacts=Qr;t.uniformMatrix3fv(this.tUniforms.uIcoCorners,!1,this.goldberg.corners),t.uniformMatrix3fv(this.tUniforms.uIcoInv,!1,this.goldberg.inverses);let f=r.pixelsPerTile*768/(Math.PI*2)*this.dpr;t.uniform1f(this.tUniforms.uHexFreq,en(f));let p=Math.max(6e-4,r.altitude*.02),m=Math.max(5,r.altitude*4);t.uniform1f(this.tUniforms.uNear,p),t.uniform1f(this.tUniforms.uFar,m),t.depthMask(!0),t.bindVertexArray(this.terrainVao),t.drawArrays(t.TRIANGLES,0,3),this.drawModels(p,m);let h=this.buildSprites();h>0&&(t.depthMask(!1),t.disable(t.DEPTH_TEST),t.useProgram(this.spriteProg),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.albedoTex),t.uniform1i(this.sUniforms.uAlbedo,0),t.uniform3fv(this.sUniforms.uEye,r.eye),t.uniform3fv(this.sUniforms.uRight,r.rightAxis),t.uniform3fv(this.sUniforms.uUp,r.upAxis),t.uniform3fv(this.sUniforms.uFwd,r.fwdAxis),t.uniform1f(this.sUniforms.uTanFov,r.tanFov),t.uniform1f(this.sUniforms.uAspect,this.canvas.clientWidth/Math.max(1,this.canvas.clientHeight)),t.uniform2f(this.sUniforms.uRes,i,a),t.uniform2f(this.sUniforms.uWorld,768,384),t.uniform1f(this.sUniforms.uFocusDist,r.targetDist),t.uniform1f(this.sUniforms.uRelief,s),t.uniform1f(this.sUniforms.uSeaLevel,o),t.bindVertexArray(this.spriteVao),t.bindBuffer(t.ARRAY_BUFFER,this.instanceBuf),t.bufferSubData(t.ARRAY_BUFFER,0,this.instances,0,h*gi),t.drawArraysInstanced(t.TRIANGLES,0,6,h),t.enable(t.DEPTH_TEST),t.depthMask(!0)),t.bindVertexArray(null)}agentScreenX(e){return this.lerpX(e)}agentScreenY(e){return this.lerpY(e)}travelFraction(e){let t=this.sim.agents,n=vi(t.x[e]-t.prevX[e]),r=t.y[e]-t.prevY[e],i=Math.hypot(n,r);if(i<1e-5)return 1;let a=t.stepSpeed[e];if(a<=0)return this.tickAlpha;let o=a*Ge()*this.tickAlpha;return Math.min(1,o/i)}idleDrift(e,t){let n=this.sim.agents;if(Math.hypot(vi(n.x[e]-n.prevX[e]),n.y[e]-n.prevY[e])>.3)return 0;let r=X(e,t*31+7)*Math.PI*2,i=.5+X(e,t*31+8)*.5;return Math.sin(this.timeSec*i+r)*.22}gait=new Float32Array(k);gaitPhase(e,t){if(t<=.001)return this.gait[e];let n=this.sim.agents,r=vi(n.x[e]-n.prevX[e]),i=n.y[e]-n.prevY[e],a=Math.PI/.66*Math.hypot(r,i);return this.gait[e]=(this.gait[e]+Math.min(1.2,a))%(Math.PI*2),this.gait[e]}lerpX(e){let t=this.sim.agents;if(this.sim.isAvatar(e))return(t.x[e]%768+768)%768;let n=t.prevX[e];return((n+vi(t.x[e]-n)*this.travelFraction(e)+this.idleDrift(e,0))%768+768)%768}lerpY(e){let t=this.sim.agents;return this.sim.isAvatar(e)?t.y[e]:t.prevY[e]+(t.y[e]-t.prevY[e])*this.travelFraction(e)+this.idleDrift(e,1)}makeBatch(e){let t=this.gl,n=t.createVertexArray();t.bindVertexArray(n);let r=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,r),t.bufferData(t.ARRAY_BUFFER,e.vertices,t.STATIC_DRAW);for(let[e,n,r]of[[0,3,0],[1,3,12],[2,4,24]])t.enableVertexAttribArray(e),t.vertexAttribPointer(e,n,t.FLOAT,!1,40,r);let i=t.createBuffer();t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,i),t.bufferData(t.ELEMENT_ARRAY_BUFFER,e.indices,t.STATIC_DRAW);let a=new Float32Array(ai*ii),o=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,o),t.bufferData(t.ARRAY_BUFFER,a.byteLength,t.DYNAMIC_DRAW);for(let[e,n,r]of[[3,2,0],[4,1,8],[5,1,12],[6,3,16],[7,2,28]])t.enableVertexAttribArray(e),t.vertexAttribPointer(e,n,t.FLOAT,!1,36,r),t.vertexAttribDivisor(e,1);return t.bindVertexArray(null),{mesh:e,vao:n,instanceBuf:o,data:a,count:0}}starDrawn={radius:0,distance:1};get starApparentDeg(){return 2*Math.atan(this.starDrawn.radius/Math.max(1e-6,this.starDrawn.distance))*180/Math.PI}get boltCount(){return this.bolts.count}get pulseNow(){return this.star.pulse?vr(this.sim.day,this.sim.pulseDays)*this.star.pulse*this.sim.pulseStrength:0}modelCount=0;frames=0;get warChevronCount(){return this.warChevrons.count}get beastCount(){return this.beasts.count}get modelsVisible(){return this.camera.pixelsPerTile>13}drawModels(e,t){let n=this.gl,r=this.camera;this.oaks.count=0,this.pines.count=0,this.folk.count=0,this.huts.count=0,this.keeps.count=0,this.halls.count=0,this.pyramids.count=0,this.walls.count=0,this.rocks.count=0,this.beasts.count=0,this.boats.count=0,this.bolts.count=0,this.warChevrons.count=0,this.ruinWalls.count=0,this.ruinKeeps.count=0;for(let e of this.tools)e&&(e.count=0);this.populateBolts(),this.populateWarArrows(),this.modelsVisible&&this.populateModels();let i=this.oaks.count+this.pines.count+this.folk.count+this.huts.count+this.keeps.count+this.halls.count+this.pyramids.count+this.walls.count+this.rocks.count+this.beasts.count+this.boats.count+this.bolts.count+this.warChevrons.count+this.ruinWalls.count+this.ruinKeeps.count;for(let e of this.tools)e&&(i+=e.count);if(this.modelCount=i,i===0)return;n.useProgram(this.meshProg),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.albedoTex),n.uniform1i(this.mUniforms.uAlbedo,0),n.uniform3fv(this.mUniforms.uEye,r.eye),n.uniform3fv(this.mUniforms.uRight,r.rightAxis),n.uniform3fv(this.mUniforms.uUp,r.upAxis),n.uniform3fv(this.mUniforms.uFwd,r.fwdAxis),n.uniform1f(this.mUniforms.uTanFov,r.tanFov),n.uniform1f(this.mUniforms.uAspect,this.canvas.clientWidth/Math.max(1,this.canvas.clientHeight)),n.uniform1f(this.mUniforms.uNear,e),n.uniform1f(this.mUniforms.uFar,t),n.uniform2f(this.mUniforms.uWorld,768,384),n.uniform1f(this.mUniforms.uRelief,r.reliefAmplitude),n.uniform1f(this.mUniforms.uSeaLevel,o),n.uniform3fv(this.mUniforms.uSky,this.sky.light),n.uniform1f(this.mUniforms.uSkyAmbient,this.sky.ambient),n.uniform3f(this.mUniforms.uSun,this.star.light[0]*this.star.brightness,this.star.light[1]*this.star.brightness,this.star.light[2]*this.star.brightness),n.uniform1f(this.mUniforms.uDayFrac,this.dayPhase),n.uniform1f(this.mUniforms.uYearFrac,this.yearPhase),n.uniform1f(this.mUniforms.uSeasonTilt,this.seasonTilt),n.uniform3fv(this.mUniforms.uSunDir,Kr(this.dayPhase,this.yearPhase,this.seasonTilt).sun),n.uniform1f(this.mUniforms.uNight,+!!this.showNight),n.uniform1f(this.mUniforms.uGround,+!!r.ground);let a=[this.oaks,this.pines,this.rocks,this.beasts,this.huts,this.keeps,this.halls,this.pyramids,this.walls,this.boats,this.folk,this.bolts,this.warChevrons,this.ruinWalls,this.ruinKeeps];for(let e of this.tools)e&&a.push(e);for(let e of a)e.count!==0&&(n.bindVertexArray(e.vao),n.bindBuffer(n.ARRAY_BUFFER,e.instanceBuf),n.bufferSubData(n.ARRAY_BUFFER,0,e.data,0,e.count*ii),n.drawElementsInstanced(n.TRIANGLES,e.mesh.indices.length,n.UNSIGNED_SHORT,0,e.count));n.bindVertexArray(null)}get mapFurniture(){return!this.camera.ground}populateWarArrows(){if(!this.mapFurniture)return;let e=this.camera.pixelsPerTile;if(e>15)return;let t=1-Math.max(0,Math.min(1,(e-9)/6)),n=this.sim,r=n.world,i=this.camera.eye,a=(e,t)=>{let n=e/768*Math.PI*2,r=(t/384-.5)*Math.PI,a=Math.cos(r);return a*Math.sin(n)*i[0]+Math.sin(r)*i[1]+a*Math.cos(n)*i[2]>=1},o=13*Y*this.sizeInTiles,s=new Set;for(let e of n.kingdoms.list){if(!e.alive)continue;let i=n.settlements.get(e.capital);if(!i||!i.alive||i.kingdom!==e.id)continue;let c=[];for(let t of n.kingdoms.enemiesOf(e.id)){let e=n.kingdoms.get(t),r=e&&e.alive?n.settlements.get(e.capital):null;r&&r.alive&&r.kingdom===t&&c.push({x:r.x,y:r.y,id:r.id})}let l=[e.color[0]/255*t,e.color[1]/255*t,e.color[2]/255*t];for(let e of c){let t=i.id<e.id?i.id*1e5+e.id:e.id*1e5+i.id;if(s.has(t))continue;s.add(t);let n=r.dx(i.x,e.x),c=e.y-i.y,u=Math.hypot(n,c);if(u<25.5)continue;let d=Math.min(70,Math.floor(u/17)),f=Math.max(0,u-16),p=Math.atan2(n,-c);for(let e=0;e<d;e++){let t=(8+f*e/Math.max(1,d-1))/u,s=r.wrapX(i.x+n*t),m=i.y+c*t;if(m<1||m>382||!a(s,m))continue;let h=this.warChevrons;if(h.count>=ai)continue;let g=h.count*ii;h.data[g]=s,h.data[g+1]=m,h.data[g+2]=o*(.7+.5*(e/Math.max(1,d-1))),h.data[g+3]=p,h.data[g+4]=l[0],h.data[g+5]=l[1],h.data[g+6]=l[2],h.count++}}}}populateBolts(){let e=this.camera.eye,t=(t,n)=>{let r=t/768*Math.PI*2,i=(n/384-.5)*Math.PI,a=Math.cos(i);return a*Math.sin(r)*e[0]+Math.sin(i)*e[1]+a*Math.cos(r)*e[2]>=1},n=2.6*Y*this.sizeInTiles/this.bolts.mesh.height;for(let e of this.strikes){let r=(this.timeSec-e.at)/.55;if(r<0||r>=1||!t(e.x,e.y))continue;let i=1-r*r*.35,a=(e.x*12.9898+e.y*78.233)%(Math.PI*2),o=this.bolts;if(o.count>=ai)continue;let s=o.count*ii;o.data[s]=e.x,o.data[s+1]=e.y,o.data[s+2]=n*i,o.data[s+3]=a,o.data[s+4]=1,o.data[s+5]=1,o.data[s+6]=1,o.count++}}populateModels(){let e=this.sim,t=e.world,n=e.agents,i=this.camera,a=i.eye,o=(e,t,n,r,i,a,o,s,c=0,l=0)=>{if(e.count>=ai)return;let u=e.count*ii;e.data[u]=t,e.data[u+1]=n,e.data[u+2]=r,e.data[u+3]=i,e.data[u+4]=a,e.data[u+5]=o,e.data[u+6]=s,e.data[u+7]=c,e.data[u+8]=l,e.count++},s=(e,t)=>{let n=e/768*Math.PI*2,r=(t/384-.5)*Math.PI,i=Math.cos(r);return i*Math.sin(n)*a[0]+Math.sin(r)*a[1]+i*Math.cos(n)*a[2]>=1},c=i.pixelsPerTile,l=Math.min(90,Math.ceil(Math.max(i.viewW,i.viewH)/c*1.1)),u=Math.round(i.lon/(Math.PI*2)*768),d=Math.round((i.lat/Math.PI+.5)*384),f=this.star.flora,p=this.star.tree===`pine`?this.pines:this.oaks,m=.52*Y*this.sizeInTiles/p.mesh.height;for(let e=-l;e<=l;e++){let n=d+e;if(!(n<0||n>=384))for(let e=-l;e<=l;e++){let r=((u+e)%768+768)%768,i=n*768+r,a=t.trees[i];if(a<.06||!s(r+.5,n+.5)||t.isWaterCell(i))continue;let c=Math.min(5,Math.round(a*5));for(let e=0;e<c;e++){let a=X(i,e*3+1),s=X(i,e*3+2),c=X(i,e*3+3);if(!hi(t,r+a,n+s))continue;let l=.82+c*.36;o(p,r+a,n+s,m*(.75+c*.5),a*Math.PI*2,l*f[0],l*(.94+s*.14)*f[1],l*.92*f[2])}}}let h=.13*Y*this.sizeInTiles/this.beasts.mesh.height;if(i.pixelsPerTile>22)for(let e=-l;e<=l;e++){let n=d+e;if(!(n<0||n>=384))for(let e=-l;e<=l;e++){let r=((u+e)%768+768)%768,i=n*768+r,a=t.game[i];if(a<.5||!s(r+.5,n+.5)||t.isWaterCell(i)||X(i,907)>.022+a*.03)continue;let c=Math.min(4,1+Math.round(a*2.2)),l=this.timeSec*.05,d=X(i,919)*6.283,f=r+X(i,911)+Math.sin(l+d)*.55,p=n+X(i,913)+Math.cos(l*.83+d)*.55;for(let e=0;e<c;e++){let n=X(i,e*7+101),r=X(i,e*7+103),a=X(i,e*7+107),s=this.timeSec*(.09+a*.11)+n*6.283,c=f+(n-.5)*3.4+Math.cos(s)*.42,l=p+(r-.5)*3.4+Math.sin(s)*.42;if(!mi(t,c,l))continue;let u=s+Math.PI*.5,d=.82+a*.34;o(this.beasts,c,l,h*(.8+n*.45),u,d,d*.97,d*.94)}}}let g=.16*Y*this.sizeInTiles/this.rocks.mesh.height;for(let e=-l;e<=l;e++){let n=d+e;if(!(n<0||n>=384))for(let e=-l;e<=l;e++){let r=((u+e)%768+768)%768,i=n*768+r,a=t.ore[i];if(a<.08||!s(r+.5,n+.5))continue;let c=Math.min(3,1+Math.round(a*2.5));for(let e=0;e<c;e++){let t=X(i,e*5+41),s=X(i,e*5+42),c=X(i,e*5+43),l=.75+Math.min(1,a)*.6;o(this.rocks,r+t,n+s,g*(.75+c*.6),t*Math.PI*2,l,l*.92,l*.85)}}}let _=di(e.settlements.list,(e,n,r,i)=>t.dist(e,n,r,i)),v=.42*Y*this.sizeInTiles/this.huts.mesh.height;for(let n of e.settlements.list){if(!n.alive||n.houses<=0||!s(n.x,n.y))continue;let e=Math.min(n.houses,120),r=_[n.id],i=X(n.id,1)*Math.PI*2;for(let a=0;a<e;a++){let s=n.id*7919+a,c=i+a*si,l=r*Math.sqrt((a+.5)/e)+(X(s,2)-.5)*.35,u=0,d=0,f=!1,p=oi(t,n.y);for(let e=0;e<5&&!f;e++){let r=l*(1-e*.22);u=n.x+Math.cos(c)*r*p,d=n.y+Math.sin(c)*r,f=fi(t,u,d)}if(!f)continue;let m=.85+X(s,3)*.3;o(this.huts,u,d,v,X(s,4)*Math.PI*2,m,m*.97,m*.92)}}let y=2.1*Y/this.keeps.mesh.height,b=2.4*Y/this.halls.mesh.height,x=2.9*Y/this.pyramids.mesh.height,S=1*Y/this.walls.mesh.height;for(let n of e.settlements.list)if(!(!n.alive||!s(n.x,n.y))){if(n.castle>.02){let r=e.cultures.get(n.culture),i=r?r.work:`keep`,a=i===`hall`?this.halls:i===`pyramid`?this.pyramids:this.keeps,s=i===`hall`?b:i===`pyramid`?x:y,c=Math.max(1,n.works)+ +(n.castle>=1&&n.extraWork>.02),l=c>1?1.5+c*.55:0,u=X(n.id,11)*Math.PI*2,d=oi(t,n.y);for(let e=0;e<c;e++){let r=e===c-1&&(n.castle<1||n.extraWork>.02)?n.castle<1?n.castle:n.extraWork:1;if(r<=.02)continue;let i=u+e/Math.max(1,c)*Math.PI*2,f=c>1?n.x+Math.cos(i)*l*d:n.x,p=c>1?n.y+Math.sin(i)*l:n.y;c>1&&!fi(t,f,p)||o(a,f,p,s*(.35+r*.65),X(n.id*31+e,11)*Math.PI*2,1,1,1)}}if(n.walls>.02){let e=_[n.id]+ui,r=Math.max(8,Math.round(Math.PI*2*e/1)),i=Math.round(r*n.walls),a=oi(t,n.y);for(let s=0;s<i;s++){let i=s/r*Math.PI*2,c=n.x+Math.cos(i)*e*a,l=n.y+Math.sin(i)*e;fi(t,c,l)&&o(this.walls,c,l,S,i+Math.PI/2,1,1,1)}}}let C=1*Y/this.ruinWalls.mesh.height,w=1.6*Y/this.ruinKeeps.mesh.height;for(let n of e.settlements.ruins()){if(!s(n.x,n.y))continue;let r=Math.max(0,(e.day-n.ruinedOn)/360),i=Math.max(0,1-r/400),a=n.ruinSize*i;if(a<.03)continue;n.castle>.5&&o(this.ruinKeeps,n.x,n.y,w*(.5+a*.7),X(n.id,11)*Math.PI*2,1,1,1);let c=Math.max(1.8,Math.sqrt(Math.max(1,n.peakPop))*.9),l=Math.max(8,Math.round(Math.PI*2*c/1)),u=oi(t,n.y);for(let e=0;e<l;e++){if(X(n.id*131+e,7)>.3+a*.6)continue;let r=e/l*Math.PI*2,i=n.x+Math.cos(r)*c*u,s=n.y+Math.sin(r)*c;fi(t,i,s)&&o(this.ruinWalls,i,s,C*(.6+a*.5),r+Math.PI/2,1,1,1)}}if(this.showPeople){let i=.2*Y*this.sizeInTiles/this.folk.mesh.height;for(let a=0;a<n.high;a++){if(!n.alive[a])continue;let c=this.lerpX(a),f=this.lerpY(a);if(Math.abs(vi(c-u))>l||Math.abs(f-d)>l||!s(c,f))continue;let p=e.settlements.get(n.settlement[a]),m=p&&p.kingdom>=0?e.kingdoms.get(p.kingdom):null,h=gn[0],g=gn[1],_=gn[2];m&&(h=m.color[0]/255*.88+.1,g=m.color[1]/255*.88+.1,_=m.color[2]/255*.88+.1);let v=i*(n.age[a]<14?.62+n.age[a]/14*.38:1),y=vi(n.x[a]-n.prevX[a]),b=n.y[a]-n.prevY[a],x=X(a,5)*Math.PI*2;Math.abs(y)+Math.abs(b)>1e-4&&(x=Math.atan2(y,b)+Math.PI);let S=Math.min(1,n.stepSpeed[a]/(60*r)),C=this.gaitPhase(a,S);e.isAvatar(a)?(v=i*1.08,o(this.folk,c,f,v,e.avatarFacing+Math.PI,1.25,1.12,.82,C,S)):o(this.folk,c,f,v,x,h,g,_,C,S),n.boat[a]>0&&t.isWaterCell(pi(c,f))&&o(this.boats,c,f,v*1.5,x,1,1,1);let w=n.tool[a];if(w!==j.None&&w<9){let e=this.tools[w];e&&o(e,c,f,v,x,1,1,1)}}}}buildTextures(){let e=this.sim.world,n=this.albedo,r=this.data;this.overlay===`temperature`&&this.measureHeat();let a=this.overlay===`faith`?this.influenceField(e=>{let t=this.sim.religions.get(e.religion);return t?t.color:[130,130,140]}):this.overlay===`realms`?this.influenceField(e=>{let t=this.sim.kingdoms.get(e.kingdom);return t?t.color:[96,96,104]}):null,s=this.borderStrength>.001&&this.overlay===`terrain`&&this.mapFurniture?this.realmField():null,c=this.territoryWash();this.lastWash=c;for(let l=0;l<i;l++){let i=l*4,u,d,f;if(this.overlay===`terrain`||a&&e.isWaterCell(l)){let n=t[e.biome[l]].color,r=e.elevation[l];if(r<.455){let e=Math.min(1,(o-r)/.32);u=n[0]*(1-e*.38),d=n[1]*(1-e*.3),f=n[2]*(1-e*.12)}else{let t=Math.min(1,e.vegetation[l]),r=.62+t*.5;u=n[0]*r*(1-e.scorch[l]*.7),d=n[1]*(.6+t*.75)*(1-e.scorch[l]*.6),f=n[2]*(.72+t*.3)*(1-e.scorch[l]*.7);let i=this.star.flora;if(t>.01&&(i[0]!==1||i[1]!==1||i[2]!==1)){let e=Math.min(1,t*1.3);u=u*(1-e)+u*i[0]*e,d=d*(1-e)+d*i[1]*e,f=f*(1-e)+f*i[2]*e}let a=e.rainMod[l];if(a>.01){let e=Math.min(1,a);u*=1-e*.26,d*=1-e*.14,f*=1-e*.02}else if(a<-.01){let e=Math.min(1,-a);u=u*(1-e*.1)+46*e,d=d*(1-e*.16)+38*e,f=f*(1-e*.3)+22*e}if(e.blessing[l]>.01){let t=Math.min(1,e.blessing[l]);u+=20*t,d+=46*t,f+=12*t}let o=e.tempMean[l];if(o>90){let e=Math.min(1,(o-90)/160),t=Math.min(1,Math.max(0,(o-240)/420));u=u*(1-e)+42*e+210*t,d=d*(1-e)+34*e+74*t,f=f*(1-e)+32*e+18*t}}}else a?(u=a[l*3],d=a[l*3+1],f=a[l*3+2]):[u,d,f]=this.overlayColor(l);let p=0,m=0,h=0,g=0;if(s){let t=s[l];if(t>=0&&e.isLand(l)){let e=this.sim.kingdoms.get(t);if(e){let n=l%768,r=l/768|0,i=[s[r*768+(n+1)%768],s[r*768+(n-1+768)%768],r+1<384?s[(r+1)*768+n]:t,r>0?s[(r-1)*768+n]:t].some(e=>e!==t),a=Math.min(.97,i?.85*this.borderStrength:c);p=e.color[0],m=e.color[1],h=e.color[2],g=Math.round(a*255)}}}this.realm[i]=p,this.realm[i+1]=m,this.realm[i+2]=h,this.realm[i+3]=g,n[i]=wi(u),n[i+1]=wi(d),n[i+2]=wi(f),n[i+3]=Math.round(Math.max(0,Math.min(1,e.elevation[l]))*255);let _=e.riverFlow(l);r[i]=Math.round(_*255),r[i+1]=Math.round(Math.min(1,e.sacred[l]*.35)*255),r[i+2]=Math.round(Math.min(1,e.waterLevel[l]*40)*255),r[i+3]=e.settlementAt[l]>=0?255:0}let l=this.gl;l.bindTexture(l.TEXTURE_2D,this.albedoTex),l.texSubImage2D(l.TEXTURE_2D,0,0,0,768,384,l.RGBA,l.UNSIGNED_BYTE,n),l.generateMipmap(l.TEXTURE_2D),l.bindTexture(l.TEXTURE_2D,this.dataTex),l.texSubImage2D(l.TEXTURE_2D,0,0,0,768,384,l.RGBA,l.UNSIGNED_BYTE,r),l.generateMipmap(l.TEXTURE_2D),this.mapFurniture&&(l.bindTexture(l.TEXTURE_2D,this.realmTex),l.texSubImage2D(l.TEXTURE_2D,0,0,0,768,384,l.RGBA,l.UNSIGNED_BYTE,this.realm),l.generateMipmap(l.TEXTURE_2D))}heat={low:0,mean:0,high:0,land:0};measureHeat(){let e=this.sim.world,t=1/0,n=-1/0,r=0,a=0,o=0;for(let s=0;s<i;s++){if(!e.isLand(s))continue;let i=e.tempMean[s];i<t&&(t=i),i>n&&(n=i);let c=Math.cos(((s/768|0)/384-.5)*Math.PI);r+=i*c,a+=c,o++}this.heat.land=o,!(!o||a<=0)&&(this.heat.low=t,this.heat.high=n,this.heat.mean=r/a)}overlayColor(e){let t=this.sim.world;switch(this.overlay){case`fertility`:return bi(`fertility`,t.fertility[e]);case`moisture`:return bi(`moisture`,t.moisture[e]);case`temperature`:return bi(`temperature`,(t.tempMean[e]- -25)/60);case`vegetation`:return bi(`vegetation`,Math.min(1,t.vegetation[e]));case`herds`:return bi(`herds`,Math.min(1,t.game[e]*1.2));case`minerals`:{let n=Math.min(1,t.ore[e]*1.6),r=bi(`minerals`,Math.min(1,t.stone[e]));return[r[0]+n*150,r[1]+n*40,r[2]-n*20]}case`sanctity`:return bi(`sanctity`,Math.min(1,t.sacred[e]*.6));default:return[80,80,80]}}faithBuf=new Float32Array(i*3);faithWeight=new Float32Array(i);realmBuf=new Int32Array(i);realmCost=new Float32Array(i);realmHeap=new Gt(65536);realmField(){let e=this.sim.world,t=this.realmBuf,n=this.realmCost,i=this.realmHeap;t.fill(-1),n.fill(1/0),i.clear();for(let a of this.sim.settlements.list){if(!a.alive||a.pop===0||a.kingdom<0)continue;let o=e.idx(Math.round(a.x),Math.round(a.y)),s=-Math.min(ni,6+Math.sqrt(a.pop)*2.2)*r;s<n[o]&&(n[o]=s,t[o]=a.kingdom,i.push(s,o))}for(;i.size>0;){let r=i.peekKey(),a=i.pop();if(a<0||r>n[a]||r>=0)continue;let o=t[a],s=e.elevation[a];for(let c=0;c<8;c++){let l=e.neighbor(a,c);if(l<0||e.isWaterCell(l))continue;let u=c<4?1:1.414,d=Math.abs(e.elevation[l]-s);u+=d*260,e.flow[l]>403.2&&(u+=14),u*=e.travelCost(l)>1.4?1.5:1;let f=r+u;f<n[l]&&(n[l]=f,t[l]=o,i.push(f,l))}}return t}influenceField(e){let t=this.sim.world,n=this.faithBuf,a=this.faithWeight;n.fill(0),a.fill(0);for(let i of this.sim.settlements.list){if(!i.alive||i.pop===0)continue;let o=e(i),s=Math.round(Math.min(30,6+Math.sqrt(i.pop)*4)*r),c=s*s;for(let e=-s;e<=s;e++){let r=i.y+e;if(t.inBounds(r))for(let l=-s;l<=s;l++){let u=l*l+e*e;if(u>c)continue;let d=t.idx(t.wrapX(i.x+l),r),f=(1-Math.sqrt(u)/s)*(.4+Math.min(1,i.pop/30));n[d*3]+=o[0]*f,n[d*3+1]+=o[1]*f,n[d*3+2]+=o[2]*f,a[d]+=f}}}for(let e=0;e<i;e++){let r=a[e],i=t.isWaterCell(e)?26:40+this.sim.world.elevation[e]*30;r>.001?(n[e*3]=n[e*3]/r,n[e*3+1]=n[e*3+1]/r,n[e*3+2]=n[e*3+2]/r):(n[e*3]=i,n[e*3+1]=i,n[e*3+2]=i*1.15)}return n}buildSprites(){let e=this.sim,t=e.agents,n=this.camera,i=this.instances,a=0,o=(e,t,n,r,o,s,c,l,u)=>{if(a>=ri)return;let d=a*gi;i[d]=e,i[d+1]=t,i[d+2]=n,i[d+3]=r,i[d+4]=o/255,i[d+5]=s/255,i[d+6]=c/255,i[d+7]=l,i[d+8]=u,a++},s=n.pixelsPerTile*this.dpr,c=n.eye,l=(e,t)=>{let n=e/768*Math.PI*2,r=(t/384-.5)*Math.PI,i=Math.cos(r);return i*Math.sin(n)*c[0]+Math.sin(r)*c[1]+i*Math.cos(n)*c[2]>=1};if(this.showRoutes&&this.mapFurniture)for(let t of e.tradeRoutes.values()){let n=e.settlements.get(t.a),i=e.settlements.get(t.b);if(!n||!i||!n.alive||!i.alive)continue;let a=(e.day-t.day)/90,c=Math.max(0,1-a*a);if(c<.05)continue;let u=vi(i.x-n.x),d=i.y-n.y,f=Math.max(3,Math.min(40,Math.round(Math.hypot(u,d)/(2.2*r)))),p=Math.min(1,t.goods/45);for(let e=1;e<f;e++){let t=e/f,r=n.x+u*t,i=n.y+d*t;if(!l(r,i))continue;let a=this.sim.world.isWaterCell(pi(r,i));o(r,i,.0012,Ci(s*(a?.16:.13),.9*this.dpr,3.4*this.dpr),a?150:226,a?196:190,a?236:120,(.3+p*.5)*c,0)}}for(let e=this.strikes.length-1;e>=0;e--){let t=this.strikes[e],n=(this.timeSec-t.at)/.55;if(n>=1||n<0){n>=1&&this.strikes.splice(e,1);continue}if(!l(t.x,t.y))continue;let r=(1-n)*(n<.25?1:.55+.45*Math.sin(n*40)),i=Ci(s*3.2,26*this.dpr,150*this.dpr);o(t.x,t.y,.02,i,255,250,210,Math.max(0,r),7)}if(!this.modelsVisible){let n=Ci(s*2.4,9*this.dpr,26*this.dpr);for(let r=0;r<t.high;r++){if(!t.alive[r]||t.boat[r]===0)continue;let i=this.lerpX(r),a=this.lerpY(r);if(!this.sim.world.isWaterCell(pi(i,a))||!l(i,a))continue;let s=e.settlements.get(t.settlement[r]),c=s&&s.kingdom>=0?e.kingdoms.get(s.kingdom):null,u=c?c.color:[226,220,206];o(i,a,.0035,n*1.15,12,14,20,.5,0),o(i,a,.004,n,u[0],u[1],u[2],1,6)}}{let n=new Map;for(let r=0;r<t.high;r++){if(!t.alive[r]||t.act[r]!==A.Raid)continue;let i=e.settlements.get(t.settlement[r]);if(!i||i.kingdom<0)continue;let a=n.get(i.kingdom);a||(a={x:0,dx:0,y:0,n:0},n.set(i.kingdom,a)),a.n===0&&(a.x=this.lerpX(r)),a.dx+=vi(this.lerpX(r)-a.x),a.y+=this.lerpY(r),a.n++}for(let[r,i]of n){if(i.n<2)continue;let n=e.kingdoms.get(r);if(!n)continue;let a=n.campaign?.leader??-1,c=a>=0&&t.alive[a]&&t.act[a]===A.Raid,u=c?this.lerpX(a):i.x+i.dx/i.n,d=c?this.lerpY(a):i.y/i.n;if(!l(u,d))continue;let f=n.color,p=Ci(s*(.6+Math.min(1,i.n/14)*.9),7*this.dpr,30*this.dpr);o(u,d,.006,p*1.7,16,12,10,.45,2),o(u,d,.0065,p*1.25,f[0],f[1],f[2],1,5);let m=n.campaign;m&&m.gathering&&l(m.musterX,m.musterY)&&o(m.musterX,m.musterY,.004,Ci(s*1.1,9*this.dpr,34*this.dpr),f[0],f[1],f[2],.5,2)}}if(!this.modelsVisible&&this.mapFurniture)for(let t of e.settlements.ruins()){if(!l(t.x,t.y))continue;let n=Math.max(0,(e.day-t.ruinedOn)/360),r=t.ruinSize*Math.max(0,1-n/400);if(r<.03)continue;let i=Ci((.7+Math.sqrt(Math.max(1,t.peakPop))*.3)*s,3*this.dpr,14*this.dpr);o(t.x,t.y,.0014,i,150,144,132,.25+r*.4,2)}for(let t of e.settlements.list){if(!t.alive||!l(t.x,t.y))continue;let n=e.kingdoms.get(t.kingdom),r=e.religions.get(t.religion),i=n?n.color:r?r.color:[170,165,150];if(this.modelsVisible)t.shrine>.9&&this.mapFurniture&&o(t.x,t.y,.003,s*.55,i[0],i[1],i[2],.9,1);else{let e=Ci((.9+Math.sqrt(t.pop)*.42)*s,4*this.dpr,22*this.dpr);o(t.x,t.y,.0015,e,i[0]*.85,i[1]*.85,i[2]*.85,.95,1),t.shrine>.9&&o(t.x,t.y,.0015,e*1.6,255,226,150,.3+Math.min(.4,t.shrine*.06),2)}}if(this.showPeople&&!this.modelsVisible){let r=Ci(s*.5,1*this.dpr,10*this.dpr),i=.001+n.reliefAmplitude*.004;for(let n=0;n<t.high;n++){if(!t.alive[n])continue;let a=this.lerpX(n),s=this.lerpY(n);if(!l(a,s))continue;let c=e.settlements.get(t.settlement[n]),u=c&&c.kingdom>=0?e.kingdoms.get(c.kingdom):null,d=e.religions.get(t.religion[n]),f,p,m;if(u)f=u.color[0],p=u.color[1],m=u.color[2];else if(d){let e=.45+t.fervor[n]*.55;f=d.color[0]*e,p=d.color[1]*e,m=d.color[2]*e}else f=206,p=200,m=186;if(e.isAvatar(n)){let e=.85+.15*Math.sin(this.timeSec*2.4);o(a,s,i,r*2.2*e,255,226,150,.8,2),o(a,s,i,r,255,244,214,1,0);continue}let h=Math.max(.25,Math.min(1,t.health[n]));o(a,s,i,r*(t.age[n]<14?.68:1),f,p,m,.55+h*.45,0)}}for(let e of this.markers)l(e.x,e.y)&&o(e.x,e.y,.002,Math.max(6*this.dpr,e.r*s),e.color[0],e.color[1],e.color[2],e.a,2);return a}};function vi(e){return e>768/2?e-768:e<-768/2?e+768:e}function X(e,t){let n=Math.imul(e^2654435769,2246822507)^Math.imul(t+374761393,3266489909);return n=Math.imul(n^n>>>13,668265263),((n^n>>>15)>>>0)/4294967296}function yi(e,t,n,r){let i=Math.max(0,Math.min(1,e));if(i<.5){let e=i*2;return[Si(t[0],n[0],e),Si(t[1],n[1],e),Si(t[2],n[2],e)]}let a=(i-.5)*2;return[Si(n[0],r[0],a),Si(n[1],r[1],a),Si(n[2],r[2],a)]}function bi(e,t){let[n,r,i]=ei[e];return yi(t,n,r,i)}function xi(e,t){let n=ei[e];if(!n)return`#808080`;let r=yi(t,n[0],n[1],n[2]);return`rgb(${Math.round(r[0])},${Math.round(r[1])},${Math.round(r[2])})`}function Si(e,t,n){return e+(t-e)*n}function Ci(e,t,n){return e<t?t:e>n?n:e}function wi(e){return e<0?0:e>255?255:Math.round(e)}function Ti(e,t,n,r,i){let a=e.getExtension(`EXT_texture_filter_anisotropic`)??e.getExtension(`WEBKIT_EXT_texture_filter_anisotropic`),o=e.createTexture();if(e.bindTexture(e.TEXTURE_2D,o),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,t,n,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,i),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),a){let t=e.getParameter(a.MAX_TEXTURE_MAX_ANISOTROPY_EXT);e.texParameterf(e.TEXTURE_2D,a.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(16,t))}return o}function Ei(e,t,n){let r=Di(e,e.VERTEX_SHADER,t),i=Di(e,e.FRAGMENT_SHADER,n),a=e.createProgram();if(e.attachShader(a,r),e.attachShader(a,i),e.linkProgram(a),!e.getProgramParameter(a,e.LINK_STATUS))throw Error(`Shader link failed: `+e.getProgramInfoLog(a));return e.deleteShader(r),e.deleteShader(i),a}function Di(e,t,n){let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw Error(`Shader compile failed: `+e.getShaderInfoLog(r)+`
`+n);return r}var Oi=function(e){return e[e.Rain=0]=`Rain`,e[e.Drought=1]=`Drought`,e[e.Bloom=2]=`Bloom`,e[e.Lightning=3]=`Lightning`,e[e.Raise=4]=`Raise`,e[e.Lower=5]=`Lower`,e[e.Whisper=6]=`Whisper`,e[e.Pestilence=7]=`Pestilence`,e[e.Succour=8]=`Succour`,e[e.Smooth=9]=`Smooth`,e[e.Flat=10]=`Flat`,e[e.Warm=11]=`Warm`,e[e.Chill=12]=`Chill`,e}({}),ki=[0,1,11,12,2,3,6,7,8],Ai=[{kind:0,name:`Rain`,glyph:`☂`,cost:14,radius:14,awe:.22,dread:.02,hint:`Soak the land. Ends droughts, greens deserts slowly.`},{kind:1,name:`Drought`,glyph:`☀`,cost:16,radius:14,awe:.05,dread:.28,hint:`Withhold the rain. Crops fail, rivers thin.`},{kind:2,name:`Bloom`,glyph:`❀`,cost:26,radius:9,awe:.4,dread:0,hint:`Enrich soil and force growth. The clearest sign of favour.`},{kind:3,name:`Lightning`,glyph:`⚡`,cost:20,radius:3,awe:.1,dread:.75,hint:`Strike. Kills, scorches, and is never forgotten.`},{kind:4,name:`Raise Land`,glyph:`▲`,cost:44,radius:8,awe:.3,dread:.25,brushOnly:!0,hint:`Lift the earth. Builds mountains, dams rivers, makes land from sea.`},{kind:5,name:`Sink Land`,glyph:`▼`,cost:44,radius:8,awe:.15,dread:.45,brushOnly:!0,hint:`Sink the earth. Carves valleys and drowns what stood there.`},{kind:6,name:`Whisper`,glyph:`☍`,cost:10,radius:12,awe:.28,dread:.05,hint:`Speak into minds. Kindles faith and calls people toward you.`},{kind:7,name:`Pestilence`,glyph:`☣`,cost:30,radius:10,awe:.02,dread:.7,hint:`Sicken the living. Slow, cruel, and remembered as punishment.`},{kind:8,name:`Succour`,glyph:`✚`,cost:18,radius:10,awe:.45,dread:-.2,hint:`Heal the sick and calm the terrified.`},{kind:9,name:`Smooth`,glyph:`≈`,cost:18,radius:8,awe:.12,dread:.08,brushOnly:!0,hint:`Settle the ground toward its own average. Smooths what raising and sinking left ragged.`},{kind:10,name:`Set`,glyph:`═`,cost:22,radius:8,awe:.2,dread:.15,brushOnly:!0,hint:`Drive the ground to exactly the height set below — lifting what is under it, cutting what is over it.`},{kind:11,name:`Warmth`,glyph:`☼`,cost:24,radius:13,awe:.3,dread:.12,hint:`Pour heat into a region. Thaws ice, lengthens the growing season, and pushes a hot land past what anyone can stand.`},{kind:12,name:`Chill`,glyph:`❄`,cost:24,radius:13,awe:.18,dread:.35,hint:`Draw the heat out. Freezes the ground, kills the harvest, and makes a scorched country liveable.`}];Ai.forEach((e,t)=>{if(e.kind!==t)throw Error(`MIRACLES[${t}] holds kind ${e.kind}`)});var ji=class{unlimited=!0;mana=70;manaMax=120;totalAwe=0;totalDread=0;miraclesCast=0;used=new Int32Array(Ai.length);canAfford(e){return this.unlimited||this.mana>=e.cost}get temperament(){let e=this.totalAwe+this.totalDread;return e<1?0:(this.totalAwe-this.totalDread)/e}temperamentName(){let e=this.temperament;return this.miraclesCast<3?`Unknown`:e>.55?`Beloved`:e>.2?`Benevolent`:e>-.2?`Inscrutable`:e>-.55?`Feared`:`Terrible`}},Mi=.06,Ni=.09,Pi=8;function Fi(e,t,n,i,a=1,o,s,c=0,l=1){let u=Ai[t],d=e.divinity;if(!d.canAfford(u))return!1;let f=e.world;if(!f.inBounds(i))return!1;d.unlimited||(d.mana-=u.cost*a),d.miraclesCast++,d.used[t]++,d.totalAwe+=u.awe*a,d.totalDread+=Math.max(0,u.dread)*a;let p=Math.max(1,Math.round((o??u.radius)*r)),m=p*p,h=Ii(f,n,i),g=p/f.w*Math.PI*2,_=Math.max(.02,Math.cos((i/f.h-.5)*Math.PI)),v=Math.min(Math.floor(f.w/2),Math.ceil(p/_)+2),y=0;if(t===9){let e=0,t=0;for(let r=-p;r<=p;r++){let a=i+r;if(f.inBounds(a))for(let r=-v;r<=v;r++){let i=f.wrapX(n+r),o=Ii(f,i,a),s=Math.max(-1,Math.min(1,o[0]*h[0]+o[1]*h[1]+o[2]*h[2]));Math.acos(s)>g||(e+=f.elevation[f.idx(i,a)],t++)}}y=t>0?e/t:0}for(let e=-p;e<=p;e++){let r=i+e;if(f.inBounds(r))for(let e=-v;e<=v;e++){let i=f.idx(f.wrapX(n+e),r),o=Ii(f,f.wrapX(n+e),r),d=Math.max(-1,Math.min(1,o[0]*h[0]+o[1]*h[1]+o[2]*h[2])),p=Math.acos(d);if(p>g)continue;let _=1-p/g,v=s===void 0?_:_*_*(3-2*_),b=p/g*(p/g)*m;switch(t){case 0:{let e=c*(Math.min(l,Pi)/Je()),t=Math.max(0,Math.min(1,(e-Mi)/Ni));f.storm[i]=Math.min(1.6,f.storm[i]+1.1*v*a*t),f.rainMod[i]=Math.min(1,f.rainMod[i]+.75*v*a),f.moisture[i]=Math.min(1,f.moisture[i]+.22*v*a),f.scorch[i]*=1-.5*v;break}case 1:f.storm[i]=Math.max(0,f.storm[i]-1.2*v*a),f.rainMod[i]=Math.max(-1,f.rainMod[i]-.7*v*a),f.moisture[i]=Math.max(0,f.moisture[i]-.2*v*a);break;case 2:f.blessing[i]=Math.min(1.5,f.blessing[i]+.9*v*a),f.fertility[i]=Math.min(1,f.fertility[i]+.28*v*a),f.vegetation[i]=Math.min(1.4,f.vegetation[i]+.35*v*a);break;case 3:f.scorch[i]=Math.min(1,f.scorch[i]+v*a),f.vegetation[i]*=1-.9*v;break;case 4:if(s!==void 0){if(f.elevation[i]<s){let e=f.elevation[i]+(s-f.elevation[i])*Math.min(1,2.6*v*a);f.elevation[i]=s-e<.0015?s:e}}else f.elevation[i]=Math.min(1,f.elevation[i]+.22*v*v*a);break;case 11:{let e=f.tempMod[i];f.tempMod[i]=Math.min(30,e+22*v*a);let t=f.tempMod[i]-e;f.temp[i]+=t,f.tempMean[i]+=t;break}case 12:{let e=f.tempMod[i];f.tempMod[i]=Math.max(-34,e-22*v*a);let t=f.tempMod[i]-e;f.temp[i]+=t,f.tempMean[i]+=t;break}case 5:if(s!==void 0){if(f.elevation[i]>s){let e=f.elevation[i]-(f.elevation[i]-s)*Math.min(1,2.6*v*a);f.elevation[i]=e-s<.0015?s:e}}else f.elevation[i]=Math.max(0,f.elevation[i]-.22*v*v*a);break;case 9:f.elevation[i]+=(y-f.elevation[i])*Math.min(1,.9*v*a);break;case 10:{if(s===void 0)break;let e=f.elevation[i],t=e+(s-e)*Math.min(1,2.6*v*a);f.elevation[i]=Math.abs(s-t)<.0015?s:t;break}}b<9*2.4*2.4&&(f.sacred[i]=Math.min(3,f.sacred[i]+(u.awe+u.dread*.5)*a))}}f.terrainDirty=!0,(t===4||t===5||t===9||t===10)&&(e.needsHydrology=!0);let b=Math.max(p,10*r),x=0,S=0,C=e.agents;if(e.index.query(n,i,b,C,r=>{if(!C.alive[r])return;let o=Math.sqrt(C.d2(r,n,i)),s=o<=p,c=Math.max(0,1-o/b);if(S++,s)switch(t){case 3:C.health[r]-=1.6*a*(1-o/Math.max(1,p));break;case 7:C.health[r]-=.45*a*(1-o/Math.max(1,p));break;case 8:C.health[r]=Math.min(1,C.health[r]+.6*a),C.fear[r]*=.45;break;case 6:C.fervor[r]=Math.min(1,C.fervor[r]+.3*C.piety[r]+.08),C.targetX[r]=n,C.targetY[r]=i,C.actTimer[r]=3;break;case 5:f.elevation[Li(e,r)]<.455&&(C.health[r]-=1.2)}C.awe[r]=Math.min(1,C.awe[r]+u.awe*c*a),C.fear[r]=Math.max(0,Math.min(1,C.fear[r]+u.dread*c*a)),C.fervor[r]=Math.min(1,C.fervor[r]+(u.awe+Math.max(0,u.dread)*.6)*c*C.piety[r]),e.witnessed(r,n,i,u),C.health[r]<=0&&x++}),a<.9)return!0;let w=`${Math.round(n)},${Math.round(i)}`,T=`${u.name} at ${w}`;return T+=S===0?` — unwitnessed`:x>0?` — ${x} dead, ${S} saw it`:` — ${S} witnesses`,e.chronicle.add(e.day,P.Divine,x>0?2:1,T,n,i),!0}function Ii(e,t,n){let r=t/e.w*Math.PI*2,i=(n/e.h-.5)*Math.PI,a=Math.cos(i);return[a*Math.sin(r),Math.sin(i),a*Math.cos(r)]}function Li(e,t){let n=e.world,r=e.agents;return n.idx(n.wrapX(Math.round(r.x[t])),Math.max(0,Math.min(n.h-1,Math.round(r.y[t]))))}var Ri=`godsim`,zi=1;function Bi(e){let t=new Uint8Array(e.buffer,e.byteOffset,e.byteLength),n=``,r=32768;for(let e=0;e<t.length;e+=r)n+=String.fromCharCode(...t.subarray(e,e+r));return btoa(n)}function Vi(e){let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);return n}function Hi(e){let t={};for(let n of Object.keys(e)){let r=e[n];ArrayBuffer.isView(r)&&!(r instanceof DataView)&&(t[n]=Bi(r))}return t}function Ui(e,t){let n=0;for(let[r,i]of Object.entries(t)){let t=e[r];if(!ArrayBuffer.isView(t)||t instanceof DataView)continue;let a=Vi(i);a.byteLength===t.byteLength&&(new Uint8Array(t.buffer,t.byteOffset,t.byteLength).set(a),n++)}return n}function Wi(e){let t={};for(let n of Object.keys(e)){let r=e[n];(typeof r==`number`||typeof r==`boolean`)&&(t[n]=r)}return t}function Gi(e,t){for(let[n,r]of Object.entries(t))typeof e[n]==typeof r&&(e[n]=r)}function Ki(e){return e.syllables()}function qi(e){return me.from(e[0],e[1],e[2])}function Ji(e,t){let n=e.divinity;return{magic:Ri,version:zi,savedAt:new Date().toISOString(),seed:e.seed,star:t.star,sky:t.sky,size:t.size,kind:t.kind,moons:t.moons,orbit:t.orbit,planetNames:t.planetNames,world:{arrays:Hi(e.world),scalars:Wi(e.world)},agents:{arrays:Hi(e.agents),scalars:Wi(e.agents)},sim:Wi(e),stats:{...e.stats},rng:e.rng.state(),divinity:{scalars:Wi(n),used:Bi(n.used)},settlements:e.settlements.list.map(e=>({...e,toolRack:Bi(e.toolRack),grudge:[...e.grudge],phonology:Ki(e.phonology)})),religions:e.religions.list.map(e=>({...e,tenets:Bi(e.tenets),phonology:Ki(e.phonology)})),kingdoms:e.kingdoms.list.map(e=>({...e,wars:[...e.wars],phonology:Ki(e.phonology)})),cultures:e.cultures.list.map(t=>({id:t.id,name:t.name,work:t.work,wallers:t.wallers,names:t.names,weapon:t.weapon,placeSuffixes:t.placeSuffixes,blurb:t.blurb,archetype:e.cultures.archetypeOf(t),phonology:Ki(t.phonology)})),chronicle:e.chronicle.all(),history:e.history}}function Yi(e,t){if(t.magic!==Ri)throw Error(`not a God Sim save`);if(t.version>zi)throw Error(`save is from a newer version (${t.version})`);let n=Object.keys(t.world.arrays).length,r=Ui(e.world,t.world.arrays);if(n>0&&r===0)throw Error(`this save was made on a different sized world and cannot be loaded`);Gi(e.world,t.world.scalars);let i=Ui(e.agents,t.agents.arrays);Gi(e.agents,t.agents.scalars),Gi(e,t.sim),Object.assign(e.stats,t.stats),e.rng.setState(t.rng),Gi(e.divinity,t.divinity.scalars),Ui(e.divinity,{used:t.divinity.used}),e.cultures.list.length=0;for(let n of t.cultures??[])e.cultures.restore(n,qi(n.phonology));let a=e.settlements.list;a.length=0;for(let e of t.settlements){let t={...e};typeof t.works!=`number`&&(t.works=+(t.castle>=1)),typeof t.extraWork!=`number`&&(t.extraWork=0),typeof t.worksCap!=`number`&&(t.worksCap=1),t.toolRack=new Int32Array(Vi(e.toolRack).buffer),t.grudge=new Map(e.grudge),t.phonology=qi(e.phonology),a.push(t)}let o=e.religions.list;o.length=0;for(let e of t.religions){let t={...e};t.tenets=new Float32Array(Vi(e.tenets).buffer),t.phonology=qi(e.phonology),o.push(t)}let s=e.kingdoms.list;s.length=0;for(let e of t.kingdoms){let t={...e};t.wars=new Map(e.wars),t.phonology=qi(e.phonology),s.push(t)}return e.chronicle.load(t.chronicle),e.history.length=0,e.history.push(...t.history),e.index.rebuild(e.agents),e.world.terrainDirty=!0,{worldFields:r,agentFields:i,day:e.day,population:e.stats.population}}async function Xi(e){let t=JSON.stringify(e);if(typeof CompressionStream>`u`)return new Blob([t],{type:`application/json`});let n=new Blob([t]).stream().pipeThrough(new CompressionStream(`gzip`));return new Response(n).blob()}async function Zi(e){let t=new Uint8Array(await e.slice(0,2).arrayBuffer());if(t[0]!==31||t[1]!==139)return JSON.parse(await e.text());let n=e.stream().pipeThrough(new DecompressionStream(`gzip`));return JSON.parse(await new Response(n).text())}function Qi(e){let t=e.savedAt.slice(0,16).replace(/[:T]/g,`-`);return`godsim-${e.seed}-day${Math.floor(e.sim.day)}-${t}.godsim`}var $i=class e{perm=new Uint8Array(512);permMod12=new Uint8Array(512);static GRAD3=new Int8Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,1,0,-1,0,0,1,0,-1,0,1,0,-1]);constructor(e){let t=new Uint8Array(256);for(let e=0;e<256;e++)t[e]=e;for(let n=255;n>0;n--){let r=e.int(0,n+1),i=t[n];t[n]=t[r],t[r]=i}for(let e=0;e<512;e++)this.perm[e]=t[e&255],this.permMod12[e]=this.perm[e]%12}static F2=.5*(Math.sqrt(3)-1);static G2=(3-Math.sqrt(3))/6;sample(t,n){let{F2:r,G2:i}=e,a=(t+n)*r,o=Math.floor(t+a),s=Math.floor(n+a),c=(o+s)*i,l=t-(o-c),u=n-(s-c),d=+(l>u),f=l>u?0:1,p=l-d+i,m=u-f+i,h=l-1+2*i,g=u-1+2*i,_=o&255,v=s&255,y=0,b=.5-l*l-u*u;if(b>0){let t=this.permMod12[_+this.perm[v]]*2;b*=b,y+=b*b*(e.GRAD3[t]*l+e.GRAD3[t+1]*u)}let x=.5-p*p-m*m;if(x>0){let t=this.permMod12[_+d+this.perm[v+f]]*2;x*=x,y+=x*x*(e.GRAD3[t]*p+e.GRAD3[t+1]*m)}let S=.5-h*h-g*g;if(S>0){let t=this.permMod12[_+1+this.perm[v+1]]*2;S*=S,y+=S*S*(e.GRAD3[t]*h+e.GRAD3[t+1]*g)}return 70*y}fbm(e,t,n,r=2,i=.5){let a=1,o=1,s=0,c=0;for(let l=0;l<n;l++)s+=a*this.sample(e*o,t*o),c+=a,a*=i,o*=r;return s/c}static GRAD3D=new Int8Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]);sample3(t,n,r){let i=Math.floor(t)&255,a=Math.floor(n)&255,o=Math.floor(r)&255,s=t-Math.floor(t),c=n-Math.floor(n),l=r-Math.floor(r),u=ea(s),d=ea(c),f=ea(l),p=this.perm,m=p[i]+a&255,h=p[i+1]+a&255,g=p[m]+o&255,_=p[m+1]+o&255,v=p[h]+o&255,y=p[h+1]+o&255,b=(t,n,r,i)=>{let a=t%12*3;return e.GRAD3D[a]*n+e.GRAD3D[a+1]*r+e.GRAD3D[a+2]*i};return ta(ta(ta(b(p[g],s,c,l),b(p[v],s-1,c,l),u),ta(b(p[_],s,c-1,l),b(p[y],s-1,c-1,l),u),d),ta(ta(b(p[g+1],s,c,l-1),b(p[v+1],s-1,c,l-1),u),ta(b(p[_+1],s,c-1,l-1),b(p[y+1],s-1,c-1,l-1),u),d),f)}fbm3(e,t,n,r,i=.5){let a=1,o=1,s=0,c=0;for(let l=0;l<r;l++)s+=a*this.sample3(e*o,t*o,n*o),c+=a,a*=i,o*=2;return s/c}ridged(e,t,n,r=2,i=.5){let a=1,o=1,s=0,c=0;for(let l=0;l<n;l++){let n=1-Math.abs(this.sample(e*o,t*o));s+=a*n*n,c+=a,a*=i,o*=r}return s/c}};function ea(e){return e*e*e*(e*(e*6-15)+10)}function ta(e,t,n){return e+(t-e)*n}var na=13;function ra(e){let t=new Fr(e),n=new $i(t.fork(1)),r=new $i(t.fork(2)),a=new h,o=new Gt(i+64);return sa(a,oa(t),n,r,t),ca(a,4),ua(a),a.recomputeHydrology(o),la(a),ca(a,1),ia(a,a.elevation),ua(a),a.recomputeHydrology(o),da(a,r),fa(a,r),ia(a,a.fertility),ia(a,a.stone),ia(a,a.ore),a.settleWater(),a.classifyBiomes(),pa(a),a.terrainDirty=!0,{world:a,heap:o}}function ia(e,t){let n=new Float32Array(768);for(let r=0;r<384;r++){let i=((r+.5)/384-.5)*Math.PI,a=Math.min(384,Math.round(1.5/Math.max(.001,Math.cos(i))));if(a<1)continue;let o=r*768,s=0;for(let n=-a;n<=a;n++)s+=t[o+e.wrapX(n)];let c=a*2+1;for(let r=0;r<768;r++)n[r]=s/c,s-=t[o+e.wrapX(r-a)],s+=t[o+e.wrapX(r+a+1)];for(let e=0;e<768;e++)t[o+e]=n[e]}}function aa(e,t){let n=e/768*Math.PI*2,r=(t/384-.5)*Math.PI,i=Math.cos(r);return[i*Math.sin(n),Math.sin(r),i*Math.cos(n)]}function oa(e){let t=[],n=Math.ceil(na/5);for(let r=0;r<na;r++){let i=r%5,a=Math.floor(r/5),o=e.f()*Math.PI*2;t.push({x:(i+e.range(.15,.85))/5*768,y:23.04+(a+e.range(.15,.85))/n*384*.88,vx:Math.cos(o),vy:Math.sin(o),dir:[0,0,0],continental:!1})}let r=Math.round(na*.45),i=t.map((e,t)=>t<r);for(let t=i.length-1;t>0;t--){let n=e.int(0,t+1),r=i[t];i[t]=i[n],i[n]=r}return t.forEach((e,t)=>{e.continental=i[t],e.dir=aa(e.x,e.y)}),t}function sa(e,t,n,r,i){let{elevation:a}=e,o=i.f()*1e3;for(let i=0;i<384;i++)for(let s=0;s<768;s++){let c=i*768+s,l=aa(s,i),u=-1,d=-1,f=1/0,p=1/0;for(let e=0;e<t.length;e++){let n=t[e],r=Math.max(-1,Math.min(1,l[0]*n.dir[0]+l[1]*n.dir[1]+l[2]*n.dir[2])),i=Math.acos(r)*(768/(Math.PI*2));i<f?(p=f,d=u,f=i,u=e):i<p&&(p=i,d=e)}let m=t[u],h=t[d],g=(p-f)*.5,_=m.continental?.48:.38,v=h.continental?.48:.38,y=Math.min(1,g/13),b=v+(_-v)*(.5+.5*y);if(d>=0){let t=e.dx(m.x,h.x),r=h.y-m.y,a=Math.hypot(t,r)||1,c=((m.vx-h.vx)*t+(m.vy-h.vy)*r)/a,l=Math.exp(-g/9);if(c>0){let e=n.ridged(s*.035+o,i*.035,4),t=m.continental&&h.continental;b+=l*c*(t?.42:.3)*(.45+.55*e)}else b-=l*-c*.2}let x=s/768*Math.PI*2,S=768/(Math.PI*2),C=Math.cos(x)*S,w=Math.sin(x)*S,T=i,E=.016,D=r.fbm3(C*E+31,T*E,w*E,3)*26,ee=r.fbm3(C*E+91,T*E+17,w*E,3)*26,te=C+D,O=T+ee,k=w+D*.6;b+=.27*n.fbm3(te*.011,O*.011,k*.011,5),b+=.06*n.fbm3(te*.032,O*.032,k*.032,4),b+=.022*r.fbm3(C*.085,T*.085,w*.085,3);let A=Math.abs(e.latitude(i));A>.93&&(b-=(A-.93)*2.2),a[c]=Math.max(0,Math.min(1,b))}}function ca(e,t){let{elevation:n}=e,r=new Float32Array(i);for(let a=0;a<t;a++){r.fill(0);for(let t=0;t<i;t++){let i=n[t];if(i<.405)continue;let a=0,o=-1,s=0;for(let r=0;r<8;r++){let c=e.neighbor(t,r);if(c<0)continue;let l=i-n[c];l>.014&&(a+=l,l>s&&(s=l,o=c))}if(o>=0&&a>0){let e=Math.min(s*.5,.02);r[t]-=e,r[o]+=e}}for(let e=0;e<i;e++)n[e]=Math.max(0,Math.min(1,n[e]+r[e]))}}function la(e){let{elevation:t,flow:n}=e;for(let e=0;e<i;e++){if(t[e]<.455)continue;let r=Math.min(.03,Math.log2(1+n[e])*.0022);t[e]=Math.max(o-.005,t[e]-r)}}function ua(e){e.settleClimate()}function da(e,t){let{fertility:n,elevation:r,flow:i,moisture:a}=e;for(let e=0;e<384;e++)for(let o=0;o<768;o++){let s=e*768+o;if(r[s]<.455){n[s]=0;continue}let c=.42+.25*t.fbm(o*.05+300,e*.05+300,4);c+=Math.min(.35,Math.log2(1+i[s])*.022),c-=Math.max(0,r[s]-.62)*1.4,c*=.55+.45*Math.min(1,a[s]*2.2),n[s]=Math.max(.02,Math.min(1,c))}}function fa(e,t){for(let n=0;n<384;n++)for(let r=0;r<768;r++){let i=n*768+r;if(e.elevation[i]<.455){e.stone[i]=0;continue}let a=Math.max(0,Math.min(1,(e.elevation[i]-o)*2)),s=Math.max(0,t.fbm(r*.07+900,n*.07+900,3)),c=Math.max(0,.55-e.fertility[i])*.5;e.stone[i]=Math.max(0,Math.min(1,.13+a*.55+s*.5+c));let l=t.fbm(r*.045+4100,n*.045+4100,3);e.ore[i]=Math.max(0,Math.min(1,(l-.2)*2.4*(.28+a*1.1)))}}function pa(e){for(let t=0;t<i;t++)e.vegetation[t]=0,e.trees[t]=e.treeCapacity(t)*.9,e.game[t]=e.gameCapacity(t)*.6;for(let t=0;t<240;t++)e.updateVegetation(3)}var ma=class{list=[];found(e,t,n,r,i){let a={id:this.list.length,name:i,culture:r,founded:e,capital:t,king:-1,phonology:n,color:ha((this.list.length*137.508+25)%360,.68,.44),towns:0,subjects:0,alive:!0,peakTowns:0,wars:new Map,campaign:null,conquests:0,losses:0};return this.list.push(a),a}get(e){return e>=0&&e<this.list.length?this.list[e]:null}living(){return this.list.filter(e=>e.alive&&e.towns>0)}atWar(e,t){let n=this.get(e);return!!n&&n.wars.has(t)}declareWar(e,t,n){this.get(e)?.wars.set(t,n),this.get(t)?.wars.set(e,n)}makePeace(e,t){this.get(e)?.wars.delete(t),this.get(t)?.wars.delete(e)}enemiesOf(e){let t=this.get(e);return t?[...t.wars.keys()]:[]}};function ha(e,t,n){let r=(1-Math.abs(2*n-1))*t,i=e/60,a=r*(1-Math.abs(i%2-1)),o=0,s=0,c=0;i<1?[o,s,c]=[r,a,0]:i<2?[o,s,c]=[a,r,0]:i<3?[o,s,c]=[0,r,a]:i<4?[o,s,c]=[0,a,r]:i<5?[o,s,c]=[a,0,r]:[o,s,c]=[r,0,a];let l=n-r/2;return[Math.round((o+l)*255),Math.round((s+l)*255),Math.round((c+l)*255)]}function ga(e){let t=Math.hypot(e[0],e[1],e[2])||1;return[e[0]/t,e[1]/t,e[2]/t]}function _a(e,t,n){let r=t/e.w*Math.PI*2,i=(n/e.h-.5)*Math.PI,a=Math.cos(i);return[a*Math.sin(r),Math.sin(i),a*Math.cos(r)]}var va=Math.max(3,Math.round(3*a)),ya=Math.max(1,Math.round(a)),ba=Math.max(5,Math.round(5*a)),xa=class{world;heap;agents=new ae;index=new ue;settlements=new Ve;religions=new De;kingdoms=new ma;divinity=new ji;chronicle=new Te;rng;seed;day=0;dayFraction=0;faithHarvest=0;needsHydrology=!1;climateTimer=0;tickCount=0;priming=!1;baseTongue;cultures=new xe;pulseStrength=1;pulseDays=gr;starPulseNow(){let e=this.star;return!e||!e.pulse?0:vr(this.day,this.pulseDays)*e.pulse*this.pulseStrength*32}star=null;slainThisTick=new Set;pendingDeaths=[];stats={year:0,population:0,settlements:0,faiths:0,births:0,deaths:0,starved:0,meanFervor:0,meanAwe:0,meanFear:0};history=[];births=0;deaths=0;starved=0;constructor(e,t=0){this.seed=e,this.rng=new Fr(e^24301);let n=ra(e);this.world=n.world,this.heap=n.heap,t!==0&&(this.world.starWarmth=t,this.world.settleClimate(),this.world.classifyBiomes());let r=40<=15+t;r&&this.world.boilDry(this.heap),this.baseTongue=new me(this.rng.fork(77)),r||this.seedPeople(),this.chronicle.add(0,P.World,2,r?`The world is made — bare rock under a star too close to bear. Its seas boiled away before there was anyone to see them go.`:`The world is made. The first people open their eyes.`),this.priming=!0;for(let e=0;e<2;e++)this.tick();this.priming=!1}reseed(){let e=this.agents,t=this.agents.count,n=e.alive.slice();this.seedPeople();let r=Math.max(0,Math.min(1,(12-this.world.meanLandTemp())/20));for(let t=0;t<e.alive.length;t++)!e.alive[t]||n[t]||(e.hunger[t]=0,e.thirst[t]=0,e.coat[t]=r);return this.agents.count-t}seedPeople(){let e=this.world,t=[];for(let n=0;n<i;n+=7){if(e.isWaterCell(n)||e.waterAvailability(n)<.45)continue;let r=It(this,n)*(.4+e.waterAvailability(n));r>.3&&t.push({cell:n,score:r})}if(t.sort((e,t)=>t.score-e.score),t.length===0)for(let n=0;n<i;n+=3)e.isWaterCell(n)||t.push({cell:n,score:0});let n=[];for(let r of t){if(n.length>=9)break;n.every(t=>e.dist(t%e.w,t/e.w|0,r.cell%e.w,r.cell/e.w|0)>108)&&n.push(r.cell)}for(;n.length===0&&t.length;)n.push(t[0].cell);for(let t of n){let n=this.cultures.found(this.rng.fork(99+this.cultures.list.length),this.cultures.list.length),i=t%e.w,a=t/e.w|0,o=this.rng.int(20,32);for(let t=0;t<o;t++){let t=e.wrapX(i+Math.round(this.rng.range(-3,3)*r)),o=Math.max(1,Math.min(e.h-2,a+Math.round(this.rng.range(-3,3)*r)));if(e.isWaterCell(e.idx(t,o)))continue;let s=this.agents.spawn(this.rng,t,o);if(s<0)break;this.agents.culture[s]=n.id,this.agents.age[s]=this.rng.range(2,44),this.agents.born[s]=-this.agents.age[s]*6}}}tick(){let e=this.agents,t=this.world,n=Ge();this.dayFraction+=n;let r=this.dayFraction>=1;r&&(this.dayFraction%=1,this.day++),r&&(this.climateTimer++,this.climateTimer%va===0&&(t.updateTemperature(this.day%360,va),t.updateMoisture()),this.climateTimer%ya===0&&(t.updateVegetation(ya),this.recoverSoil(ya)),this.climateTimer%ba===0&&t.classifyBiomes()),this.needsHydrology&&this.recomputeHydrologyNow(),t.updateWater(n),e.prevX.set(e.x),e.prevY.set(e.y),this.index.rebuild(e),this.pendingDeaths.length=0,this.slainThisTick.clear();for(let t=0;t<e.high;t++)if(e.alive[t]){if(t===this.avatar){e.hunger[t]=0,e.thirst[t]=0,e.fatigue[t]=0,e.health[t]=1;continue}if(!vt(this,t)){this.pendingDeaths.push(t);continue}e.actTimer[t]-=n,(e.actTimer[t]<=0||yt(this,t))&&bt(this,t),xt(this,t),r&&this.tickLife(t)}for(let e of this.pendingDeaths)this.die(e);this.tickCount++,this.tickCount%2==0&&this.societyPass(),this.priming||this.foundingPass(),r&&(this.star&&this.star.pulse&&(this.world.starPulse=this.starPulseNow()),this.avatarPass(),this.societyPass(),this.day%4==0&&this.settlementPass(),this.techPass(),this.crownPass(),this.warPass(),this.day%7==0&&this.culturePass(),this.day%360==0&&this.yearPass());let i=this.divinity;i.manaMax=120+Math.min(900,this.stats.population*1.6+this.stats.meanFervor*260);let a=Math.min(6,.4+this.stats.population*.012)*Ge();i.mana=Math.min(i.manaMax,i.mana+this.faithHarvest*.55+a),this.faithHarvest=0}recomputeHydrologyNow(){this.world.recomputeHydrology(this.heap),this.world.classifyBiomes(),this.world.terrainDirty=!0,this.needsHydrology=!1}tickLife(e){let t=this.agents;if(t.age[e]>48){let n=((t.age[e]-48)/34)**3*.012*mt;if(this.rng.chance(n)){this.pendingDeaths.push(e);return}}if(t.pregnancy[e]>0){--t.pregnancy[e],t.hunger[e]>1.1||t.health[e]<.3?t.pregnancy[e]=-1:t.pregnancy[e]<=0&&this.giveBirth(e);return}if(t.sex[e]===0&&t.age[e]>=16&&t.age[e]<=42&&t.partner[e]>=0&&t.alive[t.partner[e]]&&t.health[e]>.55&&t.hunger[e]<.65&&this.agents.count<8960){let n=this.settlements.get(t.settlement[e]),r=n?Math.min(1,n.food/Math.max(6,n.pop*2.5)):Math.max(.35,It(this,I(this.world,t.x[e],t.y[e]))),i=1/(1+(n?n.pop:12)/55),a=.055*r**1.2*i*(1-t.hunger[e]*.6);this.rng.chance(a)&&(t.pregnancy[e]=Ca)}}giveBirth(e){let t=this.agents;t.pregnancy[e]=-1;let n=t.partner[e],r=t.spawn(this.rng,t.x[e],t.y[e]);r<0||(t.inherit(r,e,n>=0?n:e,this.rng),t.born[r]=this.day,t.health[r]=.85,this.births++,this.rng.chance(.03)&&(t.health[e]-=.7,t.health[e]<=0&&this.pendingDeaths.push(e)))}tradeRoutes=new Map;warSpoils=new Map;lastPeace=new Map;noteTrade(e,t,n){let r=e<t?`${e}:${t}`:`${t}:${e}`,i=this.tradeRoutes.get(r);i?(i.day=this.day,i.goods=Math.min(120,i.goods*.7+n)):this.tradeRoutes.set(r,{a:e,b:t,day:this.day,goods:n})}deathCauses={starvation:0,thirst:0,cold:0,heat:0,age:0,violence:0,other:0,infancy:0};impact(e,t,n,r,i,a=!0){let s=this.world,c=(e/(Math.PI*2)*s.w+s.w)%s.w,l=(t/Math.PI+.5)*s.h,u=_a(s,c,l),d=Math.min(Math.PI,n*1.35),f=Math.ceil(d/(Math.PI*2)*s.w)+2,p=Math.max(.02,Math.cos((l/s.h-.5)*Math.PI)),m=Math.min(Math.floor(s.w/2),Math.ceil(f/p)+2),h=ga([u[2]*0-0*u[1],0*u[0]-1*u[2],1*u[1]-u[0]*0]),g=[u[1]*h[2]-u[2]*h[1],u[2]*h[0]-u[0]*h[2],u[0]*h[1]-u[1]*h[0]],_=0,v=1/0,y=0,b=0;for(let e=0;e<24;e++){let t=e/24*Math.PI*2,n=Math.cos(t),r=Math.sin(t),i=Math.cos(d),a=Math.sin(d),o=[u[0]*i+(h[0]*n+g[0]*r)*a,u[1]*i+(h[1]*n+g[1]*r)*a,u[2]*i+(h[2]*n+g[2]*r)*a],c=s.wrapX(Math.round((Math.atan2(o[0],o[2])/(Math.PI*2)*s.w+s.w)%s.w)),l=Math.round((Math.asin(Math.max(-1,Math.min(1,o[1])))/Math.PI+.5)*s.h);if(!s.inBounds(l))continue;let f=s.elevation[s.idx(c,l)];y+=f,b++,f<v&&(v=f,_=t)}let x=b>0?y/b:o+.06;Number.isFinite(v)||(v=x);let S=[h[0]*Math.cos(_)+g[0]*Math.sin(_),h[1]*Math.cos(_)+g[1]*Math.sin(_),h[2]*Math.cos(_)+g[2]*Math.sin(_)],C=.22*(.4+.6*r),w=Math.max(o+.002,Math.min(o+.014,v-.004)),T=w+.03,E=0;for(let e=-f;e<=f;e++){let t=Math.round(l)+e;if(s.inBounds(t))for(let e=-m;e<=m;e++){let i=s.wrapX(Math.round(c)+e),a=_a(s,i,t),l=Math.max(-1,Math.min(1,a[0]*u[0]+a[1]*u[1]+a[2]*u[2])),f=Math.acos(l);if(f>d)continue;let p=s.idx(i,t),m=1-f/d,h=(180+780*m)*(.55+.45*r);s.tempMod[p]<h&&(s.tempMod[p]=h);let g=Math.max(s.temp[p],h);s.temp[p]=g,s.tempMean[p]<g&&(s.tempMean[p]=g),s.vegetation[p]=0,s.fertility[p]=Math.min(s.fertility[p],.02*(1-m)),s.scorch[p]=1,s.moisture[p]=Math.min(s.moisture[p],.05*(1-m)),s.blessing[p]=0;let _=f/n,v=Math.exp(-(((_-1)/.16)**2)),y=a[0]-u[0]*l,b=a[1]-u[1]*l,D=a[2]-u[2]*l,ee=Math.hypot(y,b,D)||1,te=(y*S[0]+b*S[1]+D*S[2])/ee,O=s.elevation[p];_<1&&(O=T+Math.max(.01,x-T)*_*_),O+=C*v*Math.max(0,-te);let k=Math.max(0,(te-.72)/.28);if(k>0){let e=T-(T-w)*Math.min(1,_/1.35);O=O*(1-k)+Math.min(O,e)*k}s.elevation[p]=Math.max(o+.002,Math.min(1,O)),s.waterLevel[p]=0,s.lake[p]=0,s.runoff[p]=0,s.storm[p]=0,s.flow[p]=0,E++}}let D=this.agents,ee=0;for(let e=0;e<D.high;e++){if(!D.alive[e])continue;let t=_a(s,D.x[e],D.y[e]),n=Math.max(-1,Math.min(1,t[0]*u[0]+t[1]*u[1]+t[2]*u[2]));Math.acos(n)>d||(D.health[e]=0,this.die(e),ee++)}a&&this.chronicle.add(this.day,P.World,3,ee>0?`${i} strikes the world. ${ee} die where it lands, and the ground there is left burning.`:`${i} strikes the world. Where it lands nothing will grow again.`,Math.round(c),Math.round(l)),E>0&&(this.needsHydrology=!0,s.terrainDirty=!0)}die(e){let t=this.agents;if(t.alive[e]){if(t.hunger[e]>.9&&this.starved++,this.deaths++,this.deathCauses[this.causeOfDeath(e)]++,t.fervor[e]>.6){let n=I(this.world,t.x[e],t.y[e]);this.world.sacred[n]=Math.min(3,this.world.sacred[n]+.06)}t.age[e]>4&&(this.index.query(t.x[e],t.y[e],4*r,t,n=>{n===e||!t.alive[n]||(t.mother[n]===e||t.father[n]===e||t.partner[n]===e)&&(t.loneliness[n]=Math.min(1.2,t.loneliness[n]+.5),t.fear[n]>t.awe[n]&&(t.fervor[n]*=.75))}),this.rehomeOrphans(e)),t.kill(e)}}rehomeOrphans(e){let t=this.agents;this.index.query(t.x[e],t.y[e],8*r,t,n=>{if(!t.alive[n]||t.age[n]>12)return;let i=t.mother[n]===e,a=t.father[n]===e;if(!i&&!a)return;let o=i?t.father[n]:t.mother[n];if(o>=0&&t.alive[o]){i?t.mother[n]=o:t.father[n]=o;return}let s=-1,c=-1;this.index.query(t.x[n],t.y[n],10*r,t,r=>{if(!t.alive[r]||r===e||t.age[r]<16||t.age[r]>60)return;let i=t.sociability[r];t.settlement[r]>=0&&t.settlement[r]===t.settlement[n]&&(i+=1),t.partner[r]===e&&(i+=2),i>c&&(c=i,s=r)}),s>=0&&(i?t.mother[n]=s:t.father[n]=s,t.settlement[n]=t.settlement[s])})}starveActs=new Int32Array(16);starveHomeless=0;starveSettled=0;causeOfDeath(e){let t=this.agents;if(this.slainThisTick.has(e))return`violence`;let n=I(this.world,t.x[e],t.y[e]),r=this.world.temp[n];return t.age[e]<6?`infancy`:t.hunger[e]>.9?(this.starveActs[t.act[e]]++,t.settlement[e]>=0?this.starveSettled++:this.starveHomeless++,`starvation`):t.thirst[e]>.95?`thirst`:r<-10?`cold`:r>48?`heat`:t.age[e]>48?`age`:`other`}societyPass(){let e=this.agents,t=this.settlements.list,n=this.religions.list;for(let e of t)e.pop=0,e.households=0;for(let e of n)e.followers=0,e.meanFervor=0;let r=new Map,i=0,a=0,o=0,s=0;for(let t=0;t<e.high;t++){if(!e.alive[t])continue;s++,i+=e.fervor[t],a+=e.awe[t],o+=e.fear[t];let n=e.settlement[t],c=this.settlements.get(n);if(c&&c.alive){if(c.pop++,e.age[t]>=16){let n=e.partner[t]>=0&&e.alive[e.partner[t]];c.households+=n?.5:1}let i=e.religion[t];if(i>=0){let a=r.get(n);a||(a=new Map,r.set(n,a)),a.set(i,(a.get(i)??0)+1+e.fervor[t])}}else c&&!c.alive&&(e.settlement[t]=-1);let l=this.religions.get(e.religion[t]);l&&(l.followers++,l.meanFervor+=e.fervor[t],this.updateDissent(t,l.tenets))}for(let e of n)e.followers>0?(e.meanFervor/=e.followers,e.peak=Math.max(e.peak,e.followers)):e.alive&&e.peak>0&&(e.alive=!1,this.chronicle.add(this.day,P.Faith,2,`${e.name} dies out; its last believer is gone.`));for(let e of t)e.alive&&(e.households=Math.max(e.households,Math.ceil(e.pop/2.5)));for(let[e,t]of r){let n=this.settlements.get(e);if(!n)continue;let r=n.religion,i=-1;for(let[e,n]of t)n>i&&(i=n,r=e);let a=t.get(n.religion)??0,o=i>a*1.35+.5,s=this.day-n.lastFaithShift>120;if(r!==n.religion&&o&&s){n.lastFaithShift=this.day;let e=this.religions.get(n.religion),t=this.religions.get(r);t&&n.pop>5&&this.chronicle.add(this.day,P.Faith,2,e?`${n.name} turns from ${e.name} to ${t.name}.`:`${n.name} embraces ${t.name}.`,n.x,n.y),n.religion=r}}this.stats.population=s,this.stats.meanFervor=s?i/s:0,this.stats.meanAwe=s?a/s:0,this.stats.meanFear=s?o/s:0,this.stats.settlements=this.settlements.living().length,this.stats.faiths=this.religions.living().length,this.stats.year=Math.floor(this.day/360),this.stats.births=this.births,this.stats.deaths=this.deaths,this.stats.starved=this.starved}settlementPass(){let e=this.world,t=new Map;{let e=this.agents;for(let n=0;n<e.high;n++){if(!e.alive[n]||e.age[n]<18)continue;let r=e.settlement[n];if(r<0)continue;let i=t.get(r);(i===void 0||e.age[n]>e.age[i])&&t.set(r,n)}for(let n of this.settlements.list){if(!n.alive)continue;let r=t.get(n.id)??-1;(n.headman<0||!e.alive[n.headman]||e.settlement[n.headman]!==n.id)&&(n.headman=r)}for(let t of this.kingdoms.living()){let n=this.settlements.get(t.capital),r=n&&n.alive?n.headman:-1;if(!(t.king>=0&&e.alive[t.king]&&r===t.king)&&r!==t.king){let i=t.king;t.king=r,r>=0&&n&&this.chronicle.add(this.day,P.Society,2,i>=0&&!e.alive[i]?`${this.agentName(i)} is dead. ${this.agentName(r)} takes the ${t.name}.`:`${this.agentName(r)} rules the ${t.name} from ${n.name}.`,n.x,n.y)}}}for(let[e,t]of this.tradeRoutes){let n=this.settlements.get(t.a),r=this.settlements.get(t.b);(this.day-t.day>ja||!n?.alive||!r?.alive)&&this.tradeRoutes.delete(e)}for(let t of this.settlements.list){if(!t.alive)continue;t.peakPop=Math.max(t.peakPop,t.pop),t.food*=t.tech>1?.995:.985,t.food=Math.max(0,t.food-t.pop*.02);let n=Math.max(1,t.pop*2.5);if(t.food<n*.4?t.hardship=Math.min(1.5,t.hardship+.09):t.hardship*=.9,this.settlements.updateFields(e,t,this.rng),t.tech>=1&&t.boats<Ie(t)&&t.timber>=9){let n=e.idx(Math.round(t.x),Math.round(t.y));e.waterDist[n]<=9.6&&this.rng.chance(.1)&&(t.timber-=5,t.boats+=1,t.boats===1&&this.chronicle.add(this.day,P.Society,1,`${t.name} puts a boat in the water.`,t.x,t.y))}t.pop===0?(this.settlements.abandon(e,t),t.ruinedOn=this.day,t.peakPop>6&&this.chronicle.add(this.day,P.Society,2,t.ruinSize>.25?`${t.name} stands empty. ${t.peakPop} once lived there, and the walls are still up.`:`${t.name} stands empty. ${t.peakPop} once lived there.`,t.x,t.y)):t.pop>3&&t.hardship>1.2&&(this.day-t.lastFamineDay>900&&(t.lastFamineDay=this.day,this.chronicle.add(this.day,P.Society,1,`Famine grips ${t.name}; ${t.pop} go hungry.`,t.x,t.y)),t.hardship=.8)}}recoverSoil(e=1){let t=this.world;for(let n=0;n<Math.round(3e3*r*r);n++){let n=this.rng.int(0,i);if(t.isWaterCell(n)||t.settlementAt[n]>=0)continue;let r=.35+.5*t.moisture[n];t.fertility[n]<r&&(t.fertility[n]=Math.min(r,t.fertility[n]+.004*e))}}yearPass(){this.history.push({year:this.stats.year,pop:this.stats.population,faiths:this.stats.faiths,mana:this.divinity.mana}),this.history.length>400&&this.history.shift()}culturePass(){let e=this.agents;for(let t=0;t<e.high;t++)if(!(!e.alive[t]||e.age[t]<12)){if(e.religion[t]<0&&e.awe[t]>.5&&e.piety[t]>.45){let n=I(this.world,e.x[t],e.y[t]);(this.world.sacred[n]>.3&&this.rng.chance(.4)||this.rng.chance(.05))&&this.foundReligion(t)}if(e.religion[t]>=0&&e.fear[t]>.7&&e.awe[t]<.25&&this.rng.chance(.03)){let n=this.religions.get(e.religion[t]);e.religion[t]=-1,e.fervor[t]=0,e.dissent[t]=0,n&&n.followers<4&&n.peak>12&&this.chronicle.add(this.day,P.Faith,1,`Apostasy spreads; ${n.name} is abandoned by another.`,e.x[t],e.y[t])}if(e.dissent[t]>.8&&e.fervor[t]>.45){let n=this.religions.get(e.religion[t]);n&&n.followers>18&&this.rng.chance(.1)&&this.schism(t,n.id)}}}updateDissent(e,t){let n=this.agents,r=[Math.min(1,n.piety[e]*.6+n.awe[e]*.6),Math.min(1,n.fear[e]),n.piety[e]*.85,1-n.industry[e],n.aggression[e],n.industry[e]],i=0;for(let e=0;e<6;e++)i+=Math.abs(t[e]-r[e]);i/=6,n.dissent[e]=Math.max(0,Math.min(1,n.dissent[e]+(i-.33)*.06))}foundReligion(e){let t=this.agents,n=this.settlements.get(t.settlement[e]),i=n?n.phonology:this.baseTongue.drift(this.rng),a=this.religions.found(this.day,e,i,this.rng,null);a.tenets[F.Reverence]=Ba(.35+t.awe[e]*.6),a.tenets[F.Dread]=Ba(t.fear[e]*.9),a.tenets[F.Sacrifice]=Ba(t.piety[e]*.8),a.tenets[F.Conquest]=Ba(t.aggression[e]),a.tenets[F.Craft]=Ba(t.industry[e]),t.religion[e]=a.id,t.fervor[e]=Math.min(1,.6+t.piety[e]*.4),t.dissent[e]=0;let o=I(this.world,t.x[e],t.y[e]);this.religions.addSacredSite(a.id,o),this.world.sacred[o]=Math.min(3,this.world.sacred[o]+.4),this.index.query(t.x[e],t.y[e],7*r,t,n=>{n===e||!t.alive[n]||t.religion[n]>=0||this.rng.chance(.35+t.piety[n]*.4)&&(t.religion[n]=a.id,t.fervor[n]=Math.min(1,.25+t.piety[n]*.5))}),this.chronicle.add(this.day,P.Faith,2,`${this.agentName(e)} proclaims ${a.name}${n?` at ${n.name}`:``}.`,t.x[e],t.y[e])}schism(e,t){let n=this.agents,i=this.religions.get(t);if(!i)return;let a=i.phonology.drift(this.rng),o=this.religions.found(this.day,e,a,this.rng,i.tenets,t);o.tenets[F.Dread]=Ba(o.tenets[F.Dread]+(n.fear[e]-.4)*.5),o.tenets[F.Conquest]=Ba(o.tenets[F.Conquest]+(n.aggression[e]-.4)*.5),n.religion[e]=o.id,n.dissent[e]=0;let s=0;this.index.query(n.x[e],n.y[e],12*r,n,r=>{r===e||!n.alive[r]||n.religion[r]!==t||n.dissent[r]>.45&&this.rng.chance(.4+n.dissent[r]*.4)&&(n.religion[r]=o.id,n.dissent[r]=0,s++)});for(let e of i.sacredSites)this.religions.addSacredSite(o.id,e);this.chronicle.add(this.day,P.Faith,2,`Schism: ${this.agentName(e)} breaks from ${i.name} and founds ${o.name}, taking ${s+1}.`,n.x[e],n.y[e])}converse(e){let t=this.agents,n=-1;if(this.index.query(t.x[e],t.y[e],4*r,t,r=>{if(r!==e&&t.alive[r]&&t.age[r]>8)return n=r,!0}),n<0)return;let i=n;t.loneliness[i]=Math.max(0,t.loneliness[i]-.3);let a=t.religion[e];if(a===t.religion[i]){if(a>=0){let n=.02*(t.fervor[e]+t.fervor[i]);t.fervor[e]=Math.min(1,t.fervor[e]+n),t.fervor[i]=Math.min(1,t.fervor[i]+n)}return}let o=t.fervor[e]>=t.fervor[i]?e:i,s=o===e?i:e,c=this.religions.get(t.religion[o]);if(!c)return;let l=t.fervor[o]-t.fervor[s],u=.25+t.piety[s]*.5-t.dissent[s]*.2;l>.05&&this.rng.chance(l*u*.5)&&(t.religion[s]=c.id,t.fervor[s]=Math.min(1,t.fervor[o]*.55),t.dissent[s]=0);let d=t.piety[o]*.004;c.tenets[F.Reverence]=za(c.tenets[F.Reverence],t.awe[o],d),c.tenets[F.Dread]=za(c.tenets[F.Dread],t.fear[o],d),c.tenets[F.Conquest]=za(c.tenets[F.Conquest],t.aggression[o],d),c.tenets[F.Craft]=za(c.tenets[F.Craft],t.industry[o],d),c.tenets[F.Nature]=za(c.tenets[F.Nature],1-t.industry[o],d*.6)}tryPairBond(e){let t=this.agents;if(t.partner[e]>=0)return;let n=-1;if(this.index.query(t.x[e],t.y[e],3*r,t,r=>{if(!(r===e||!t.alive[r])&&!(t.partner[r]>=0||t.sex[r]===t.sex[e])&&!(t.age[r]<16||t.age[r]>48||t.age[e]<16)&&!(t.mother[r]>=0&&t.mother[r]===t.mother[e]))return n=r,!0}),n<0)return;let i=.45+t.sociability[e]*.35;if(t.religion[e]!==t.religion[n]&&(i*=.55),!this.rng.chance(i))return;t.partner[e]=n,t.partner[n]=e,t.loneliness[e]=0,t.loneliness[n]=0;let a=this.settlements.get(t.settlement[e]),o=this.settlements.get(t.settlement[n]);a&&(!o||a.food>o.food)?t.settlement[n]=a.id:o&&(t.settlement[e]=o.id)}resolveRaid(e,t){let n=this.agents,i=this.world,a=null,o=4*r;for(let r of this.settlements.list){if(!r.alive||r.id===n.settlement[e])continue;let s=i.dist(t%i.w,t/i.w|0,r.x,r.y);s<o&&(o=s,a=r)}if(!a)return;let s=n.tool[e],c=re(s),l=M[s]??1,u=s===j.Bow?-.02:(l-1)*.09,d=Math.min(.9,a.castle*.35+a.walls*.5-u);if(this.rng.chance(d*.7)){n.act[e]=A.Flee,n.fear[e]=Math.min(1,n.fear[e]+.2),n.actTimer[e]=0;return}let f=Math.min(a.food*.3,4)*(1-d);a.food-=f,n.carried[e]=Math.min(6,n.carried[e]+f),c&&(n.toolWear[e]=Math.min(1,n.toolWear[e]+.14/l),n.toolWear[e]>=1&&(n.tool[e]=j.None,n.toolWear[e]=0)),a.hardship=Math.min(1.5,a.hardship+.15),a.grudge.set(n.religion[e],(a.grudge.get(n.religion[e])??0)+.35);let p=this.settlements.get(n.settlement[e]),m=p?p.kingdom:-1;m>=0&&a.kingdom!==m&&this.kingdoms.atWar(m,a.kingdom)&&this.day-a.takenOn>=Sa&&(a.besiegedBy!==m&&a.siege<.25&&(a.besiegedBy=m),a.besiegedBy===m&&(a.siege+=(.16+(c?l*.03:0))*(1-d*.6),a.siege>=1&&this.takeSettlement(a,m)));let h=0;if(this.index.query(a.x,a.y,3*r,n,t=>{if(!n.alive[t]||n.settlement[t]!==a.id)return;n.fear[t]=Math.min(1,n.fear[t]+.2);let r=.06*l*(s===j.Bow?1.35:1);this.rng.chance(r*n.aggression[e]*(1-d))&&(n.health[t]-=1.5,n.health[t]<=0&&(this.pendingDeaths.push(t),this.slainThisTick.add(t),h++))}),h>0||f>1.5){let t=this.religions.get(n.religion[e]);this.chronicle.add(this.day,P.War,h>0?2:1,`${a.name} is raided${t?` by followers of ${t.name}`:``}${h?` — ${h} slain`:``}.`,a.x,a.y)}n.act[e]=A.Idle,n.actTimer[e]=0}foundingPass(){let e=this.agents,t=this.world,n=this.settlements.living();for(let r=0;r<e.high;r++){if(!e.alive[r]||e.settlement[r]>=0||e.age[r]<16)continue;let i=I(t,e.x[r],e.y[r]);if(t.isWaterCell(i)||t.waterAvailability(i)<.3)continue;let a=!0;for(let i of n)if(t.dist(e.x[r],e.y[r],i.x,i.y)<Ia){a=!1;break}if(!a)continue;let o=0;if(this.index.query(e.x[r],e.y[r],La,e,t=>{e.alive[t]&&e.settlement[t]<0&&e.age[t]>12&&o++}),o<Ra)continue;let s=this.cultureOf(r),c=s?s.phonology:this.baseTongue.drift(this.rng),l=this.settlements.found(t,this.day,i,c,e.religion[r],s?s.id:0,s?Se(s,this.rng):c.placeName(this.rng));s&&(l.favouredWeapon=s.weapon,l.worksCap=ve[s.work]),this.index.query(e.x[r],e.y[r],La,e,t=>{e.alive[t]&&e.settlement[t]<0&&(e.settlement[t]=l.id)}),this.chronicle.add(this.day,P.Society,1,`${l.name} is founded, far from anywhere.`,l.x,l.y),n.push(l)}}techPass(){for(let e of this.settlements.living()){let t=this.day-e.founded;e.tech<1&&e.pop>=5&&t>=1?(e.tech=1,this.onSettlementTech(e)):e.tech===1&&e.pop>=12&&t>=2&&(e.tech=2,this.onSettlementTech(e))}}warPass(){let e=this.world,t=this.kingdoms.living();for(let e of t)for(let[t,n]of[...e.wars]){let r=this.kingdoms.get(t);if(!r||!r.alive||r.towns===0||e.towns===0){this.kingdoms.makePeace(e.id,t);continue}let i=this.day-n;if(i<18)continue;let a=this.warSpoils.get(Aa(e.id,t))??0,o=i>=ka;if(!o&&a===0)continue;let s=o?1:.015+(a-1)*.05;if(this.rng.chance(s)){this.kingdoms.makePeace(e.id,t),this.warSpoils.delete(Aa(e.id,t)),this.lastPeace.set(Aa(e.id,t),this.day);let n=this.settlements.get(e.capital),s=(i/360).toFixed(1);this.chronicle.add(this.day,P.Society,3,o&&a===0?`After ${s} years and nothing to show for it, the ${e.name} and the ${r.name} lay down arms.`:`The ${e.name} and the ${r.name} make peace after ${s} years. ${a} ${a===1?`town`:`towns`} changed hands.`,n?n.x:-1,n?n.y:-1)}}for(let n of t){if(n.wars.size>=2)continue;let r=this.settlements.get(n.capital);if(r)for(let i of t){if(i.id===n.id||this.kingdoms.atWar(n.id,i.id))continue;let t=this.lastPeace.get(Aa(n.id,i.id));if(t!==void 0&&this.day-t<Oa)continue;let a=this.settlements.get(i.capital);if(!a||e.dist(r.x,r.y,a.x,a.y)>216||Ye(e,r.x,r.y,a.x,a.y)&&!this.settlements.living().some(e=>e.kingdom===n.id&&e.boats>0))continue;let o=n.towns*3+n.subjects,s=Math.max(1,i.towns*3+i.subjects),c=Math.max(0,Math.min(1.6,o/s-.9)),l=(.012+Math.min(1,r.grudge.get(a.religion)??0)*.025)*(.35+c);if(this.rng.chance(l)){this.kingdoms.declareWar(n.id,i.id,this.day),this.chronicle.add(this.day,P.Society,3,`The ${n.name} declares war on the ${i.name}.`,r.x,r.y);break}}}for(let n of t){let t=n.campaign;if(t){let r=this.settlements.get(t.target);if(!r||!r.alive||r.kingdom===n.id||!this.kingdoms.atWar(n.id,r.kingdom))n.campaign=null;else if(t.gathering){let i=0,a=-1,o=-1;this.index.query(t.musterX,t.musterY,wa,this.agents,e=>{let t=this.agents;if(t.alive[e]&&t.act[e]===A.Raid){let r=this.settlements.get(t.settlement[e]);if(r&&r.kingdom===n.id){i++;let n=t.aggression[e]+t.boldness[e]+t.age[e]*.004;n>o&&(o=n,a=e)}}}),t.strength=i,a>=0&&(t.leader=a);let s=this.day-t.called;i>=Ta?(t.gathering=!1,this.chronicle.add(this.day,P.Society,2,(()=>{let a=Ye(e,t.musterX,t.musterY,r.x,r.y),o=t.leader>=0?`${this.agentName(t.leader)} leads the host of the ${n.name}`:`The host of the ${n.name} moves`;return a?`${o} against ${r.name}, over the water. ${i} under arms.`:`${o} against ${r.name}. ${i} under arms.`})(),t.musterX,t.musterY)):s>Da&&(i>=Ea?(t.gathering=!1,this.chronicle.add(this.day,P.Society,2,`The ${n.name} moves on ${r.name} with the ${i} who answered.`,t.musterX,t.musterY)):n.campaign=null)}}if(n.campaign&&n.campaign.leader>=0){let e=this.agents,t=n.campaign.leader;if(!e.alive[t]||e.act[t]!==A.Raid){let r=-1,i=-1;for(let t=0;t<e.high;t++){if(!e.alive[t]||e.act[t]!==A.Raid)continue;let a=this.settlements.get(e.settlement[t]);if(!a||a.kingdom!==n.id)continue;let o=e.aggression[t]+e.boldness[t];o>i&&(i=o,r=t)}if(r>=0&&e.alive[t]===0){let i=this.settlements.get(n.campaign.target);this.chronicle.add(this.day,P.Society,2,`${this.agentName(t)} falls; ${this.agentName(r)} takes the host${i?` before ${i.name}`:``}.`,e.x[r],e.y[r])}n.campaign.leader=r}}if(n.campaign||n.wars.size===0)continue;let r=this.settlements.living().filter(e=>e.kingdom===n.id);if(r.length===0)continue;let i=null,a=null,o=1/0;for(let t of this.settlements.living())if(!(t.kingdom<0||!this.kingdoms.atWar(n.id,t.kingdom)))for(let n of r){let r=e.dist(n.x,n.y,t.x,t.y);r>=o||Ye(e,n.x,n.y,t.x,t.y)&&n.boats<=0||(o=r,i=t,a=n)}!i||!a||(n.campaign={target:i.id,musterX:a.x,musterY:a.y,gathering:!0,called:this.day,strength:0,leader:-1})}for(let e of this.settlements.living())e.siege<=0||(e.besiegedBy>=0&&this.kingdoms.atWar(e.besiegedBy,e.kingdom)?e.siege=Math.max(0,e.siege-.03):(e.siege=Math.max(0,e.siege-.12),e.siege===0&&(e.besiegedBy=-1)))}takeSettlement(e,t){let n=this.kingdoms.get(t),r=this.kingdoms.get(e.kingdom);if(n){if(e.kingdom=t,e.siege=0,e.besiegedBy=-1,e.takenOn=this.day,e.hardship=Math.min(1.5,e.hardship+.4),n.conquests++,r){r.losses++;let e=Aa(t,r.id);this.warSpoils.set(e,(this.warSpoils.get(e)??0)+1)}this.chronicle.add(this.day,P.Society,3,r?`${e.name} falls to the ${n.name}, taken from the ${r.name}.`:`${e.name} falls to the ${n.name}.`,e.x,e.y)}}crownPass(){let e=this.world,t=this.settlements.living();for(let e of t){let t=e.kingdom>=0?this.kingdoms.get(e.kingdom):null;e.atWar=!!t&&t.wars.size>0}for(let e of t){if(e.kingdom>=0||e.pop<14)continue;let t=this.cultures.get(e.culture),n=this.kingdoms.found(this.day,e.id,e.phonology,e.culture,t?Ce(t,this.rng):`Kingdom of ${e.phonology.word(this.rng,2,3)}`);e.kingdom=n.id,this.chronicle.add(this.day,P.Society,2,`${e.name} raises a crown. The ${n.name} is proclaimed.`,e.x,e.y)}for(let n of t){if(n.kingdom>=0||n.pop>=14||this.day-n.founded<360)continue;let t=-1,i=20*r;for(let r of this.kingdoms.living()){let a=this.settlements.get(r.capital);if(!a||!a.alive)continue;let o=e.dist(n.x,n.y,a.x,a.y);o<i&&(i=o,t=r.id)}if(t>=0&&this.rng.chance(.25)){n.kingdom=t;let e=this.kingdoms.get(t);this.chronicle.add(this.day,P.Society,1,`${n.name} swears to the ${e.name}.`,n.x,n.y)}}for(let e of this.kingdoms.list)e.towns=0,e.subjects=0;for(let e of t){let t=this.kingdoms.get(e.kingdom);t&&(t.towns++,t.subjects+=e.pop)}for(let e of this.kingdoms.list){if(!e.alive)continue;e.peakTowns=Math.max(e.peakTowns,e.towns);let n=this.settlements.get(e.capital),r=!!n&&n.alive&&n.kingdom!==e.id;if(!n||!n.alive||r){let i=null;for(let n of t)n.kingdom===e.id&&(!i||n.pop>i.pop)&&(i=n);i?(e.capital=i.id,this.chronicle.add(this.day,P.Society,2,r?`${n.name} is lost. The seat of the ${e.name} passes to ${i.name}.`:`The seat of the ${e.name} passes to ${i.name}.`,i.x,i.y)):(e.alive=!1,this.chronicle.add(this.day,P.Society,2,`The ${e.name} is no more.`))}}this.colonisePass(t)}colonisePass(e){let t=this.agents,n=this.world;for(let i of e){if(i.pop<Ma)continue;let a=Math.min(Fa,i.pop-Pa);if(a<Na||i.food<Fe(i)*.3||!this.rng.chance(.3))continue;let o=this.scoutClaim(i,e);if(o<0)continue;let s=o%n.w,c=o/n.w|0,l=Ye(n,i.x,i.y,s,c);if(l&&i.boats<=0)continue;let u=l?Math.min(a,Math.floor(i.boats)):a;if(u<Na)continue;let d=0;if(this.index.query(i.x,i.y,12*r,t,e=>{if(d>=u)return!0;!t.alive[e]||t.settlement[e]!==i.id||t.age[e]<16||t.age[e]>45||t.hunger[e]>.5||t.boldness[e]<.35||(t.settlement[e]=-1,l&&(t.boat[e]=1,--i.boats),t.claimX[e]=o%n.w,t.claimY[e]=o/n.w|0,t.claimKingdom[e]=i.kingdom,t.act[e]=A.Settle,t.targetX[e]=t.claimX[e],t.targetY[e]=t.claimY[e],t.actTimer[e]=6,d++)}),d>=3){let e=this.kingdoms.get(i.kingdom);this.chronicle.add(this.day,P.Society,1,`${d} set out from ${i.name} to claim land for the ${e?e.name:`crown`}.`,i.x,i.y)}}}scoutClaim(e,t){let n=this.world,i=-1,a=.18,o=e.boats>0;for(let s=0;s<24;s++){let s=this.rng.f()*Math.PI*2,c=(18+this.rng.f()*40)*r,l=n.wrapX(Math.round(e.x+Math.cos(s)*c)),u=Math.round(e.y+Math.sin(s)*c);if(!n.inBounds(u))continue;let d=n.idx(l,u);if(n.isWaterCell(d)||n.waterAvailability(d)<.4)continue;let f=!0;for(let e of t)if(n.dist(l,u,e.x,e.y)<Ia){f=!1;break}if(!f)continue;let p=Ye(n,e.x,e.y,l,u);if(p&&!o)continue;let m=It(this,d)*(p?1.35:1);m>a&&(a=m,i=d)}return i}onClaimReached(e,t){let n=this.agents,r=this.world,i=n.claimKingdom[e],a=e=>{n.claimKingdom[e]=-1,n.claimX[e]=-1,n.claimY[e]=-1},o=null,s=Ia;for(let t of this.settlements.list){if(!t.alive)continue;let i=r.dist(n.x[e],n.y[e],t.x,t.y);i<s&&(s=i,o=t)}if(o){n.settlement[e]=o.id,a(e);return}if(r.isWaterCell(t)){a(e);return}let c=0;if(this.index.query(n.x[e],n.y[e],La,n,e=>{n.alive[e]&&(n.claimKingdom[e]===i||n.settlement[e]<0)&&c++}),c<Na){this.rng.chance(.03)&&a(e);return}let l=this.kingdoms.get(i),u=this.cultureOf(e),d=u?u.phonology:l?l.phonology:this.baseTongue.drift(this.rng),f=this.settlements.found(r,this.day,t,d,n.religion[e],u?u.id:0,u?Se(u,this.rng):d.placeName(this.rng));u&&(f.favouredWeapon=u.weapon,f.worksCap=ve[u.work]),f.food=10+c*7,f.timber=3+c*2,f.tech=1;let p=0;this.index.query(n.x[e],n.y[e],La,n,e=>{n.alive[e]&&(n.claimKingdom[e]===i||n.settlement[e]<0)&&(n.settlement[e]=f.id,a(e),p++)}),a(e),n.settlement[e]=f.id,this.index.query(n.x[e],n.y[e],La,n,e=>{n.alive[e]&&n.boat[e]>0&&n.settlement[e]===f.id&&(n.boat[e]=0,f.boats+=1)}),this.chronicle.add(this.day,P.Society,2,l?`${f.name} is founded for the ${l.name} by ${p} settlers.`:`${f.name} is founded by settlers.`,f.x,f.y)}onArriveAt(e,t){let n=this.agents,i=this.world,a=null,o=9*r;for(let t of this.settlements.list){if(!t.alive)continue;let r=i.dist(n.x[e],n.y[e],t.x,t.y);r<o&&(o=r,a=t)}if(a){n.settlement[e]!==a.id&&(n.settlement[e]<0||o<9.6)&&(n.settlement[e]=a.id);return}if(n.settlement[e]>=0||i.isWaterCell(t)||It(this,t)<.3||i.waterAvailability(t)<.45)return;let s=0;if(this.index.query(n.x[e],n.y[e],6*r,n,e=>{n.alive[e]&&n.settlement[e]<0&&n.age[e]>12&&s++}),s<4)return;let c=this.cultureOf(e),l=c?c.phonology:this.baseTongue.drift(this.rng),u=this.settlements.found(i,this.day,t,l,n.religion[e],c?c.id:0,c?Se(c,this.rng):l.placeName(this.rng));c&&(u.favouredWeapon=c.weapon,u.worksCap=ve[c.work]),this.index.query(n.x[e],n.y[e],6*r,n,e=>{n.alive[e]&&n.settlement[e]<0&&(n.settlement[e]=u.id)}),this.chronicle.add(this.day,P.Society,1,`${u.name} is founded.`,u.x,u.y)}onToolMade(e,t){e.toolRack.reduce((e,t)=>e+t,0)===1&&this.chronicle.add(this.day,P.Society,1,`${e.name} works its first ${ne[t].replace(/^an? /,``)}.`,e.x,e.y)}onCastleRaised(e){let t=this.cultures.get(e.culture),n=e.works,r=n>1?t?.work===`hall`?`A ${n===2?`second`:n===3?`third`:`fourth`} hall rises at ${e.name}. The old one could not hold them all.`:t?.work===`pyramid`?`A ${n===2?`second`:n===3?`third`:`fourth`} pyramid stands at ${e.name}. Whoever it was raised for is not remembered by anyone living.`:`${e.name} raises a ${n===2?`second`:n===3?`third`:`fourth`} keep. One was no longer enough to hold what they hold.`:t?.work===`hall`?`The great hall of ${e.name} is finished. The whole town can drink under one roof.`:t?.work===`pyramid`?`The pyramid at ${e.name} is finished. It will be standing long after everyone who cut it.`:`The keep of ${e.name} is finished; it stands over the valley.`;this.chronicle.add(this.day,P.Society,2,r,e.x,e.y)}onWallsClosed(e){this.chronicle.add(this.day,P.Society,2,`${e.name} closes its walls.`,e.x,e.y)}onHouseBuilt(e){this.clearGround(e),e.houses===1?this.chronicle.add(this.day,P.Society,1,`The first house stands at ${e.name}.`,e.x,e.y):(e.houses===10||e.houses===25||e.houses===50)&&this.chronicle.add(this.day,P.Society,1,`${e.name} grows to ${e.houses} houses.`,e.x,e.y)}clearGround(e){let t=this.world,n=Math.max(2,Math.sqrt(Math.max(1,e.houses))*1.45+1),r=n*n,i=Math.ceil(n);for(let a=-i;a<=i;a++){let o=Math.round(e.y)+a;if(t.inBounds(o))for(let s=-i;s<=i;s++){let i=s*s+a*a;if(i>r)continue;let c=t.idx(t.wrapX(Math.round(e.x)+s),o),l=Math.min(1,Math.sqrt(i)/n*1.15);t.trees[c]=Math.min(t.trees[c],t.trees[c]*l)}}t.terrainDirty=!0}onSettlementTech(e){let t=e.tech===1?`breaks ground for fields`:`raises granaries and walls`;this.chronicle.add(this.day,P.Society,1,`${e.name} ${t}.`,e.x,e.y)}witnessed(e,t,n,r){let i=this.agents;i.lastMiracleDay[e]=this.day,i.lastMiracleKind[e]=r.kind,i.witnessCount[e]=Math.min(65535,i.witnessCount[e]+1);let a=this.religions.get(i.religion[e]);if(a){r.dread>.4&&(a.tenets[F.Dread]=za(a.tenets[F.Dread],1,.02)),r.awe>.3&&(a.tenets[F.Reverence]=za(a.tenets[F.Reverence],1,.02)),(r.kind===Oi.Bloom||r.kind===Oi.Rain)&&(a.tenets[F.Nature]=za(a.tenets[F.Nature],1,.015));let t=I(this.world,i.x[e],i.y[e]);this.world.sacred[t]>.5&&this.religions.addSacredSite(a.id,t)}}avatar=-1;descend(e,t){let n=this.world,r=n.wrapX(Math.round(e)),i=Math.max(1,Math.min(n.h-2,Math.round(t)));if(this.avatar>=0&&this.agents.alive[this.avatar])return this.agents.x[this.avatar]=r,this.agents.y[this.avatar]=i,this.agents.prevX[this.avatar]=r,this.agents.prevY[this.avatar]=i,this.avatar;let a=this.agents.spawn(this.rng,r,i);if(a<0)return-1;let o=this.agents;return o.age[a]=30,o.born[a]=this.day-180,o.health[a]=1,o.hunger[a]=0,o.thirst[a]=0,o.fatigue[a]=0,o.settlement[a]=-1,o.religion[a]=-1,o.act[a]=A.Idle,o.actTimer[a]=1e9,this.avatar=a,this.avatarVX=0,this.avatarVY=0,this.avatarFacing=0,this.chronicle.add(this.day,P.Divine,2,`You take a body, and stand on the ground you made.`,r,i),a}ascend(){if(this.avatar<0)return;let{x:e,y:t}={x:this.agents.x[this.avatar],y:this.agents.y[this.avatar]};this.agents.kill(this.avatar),this.avatar=-1,this.chronicle.add(this.day,P.Divine,2,`You put the body down. Whoever was watching has nothing to tell anyone.`,e,t)}walkAvatar(e,t,n){let i=this.avatar;if(i<0||!this.agents.alive[i])return;let a=this.agents,o=this.world,s=Math.min(.1,Math.max(0,n)),c=Math.hypot(e,t),l=o.idx(o.wrapX(Math.round(a.x[i])),Math.max(1,Math.min(o.h-2,Math.round(a.y[i])))),u=7.5*r/o.travelCost(l),d=c>1e-4?e/c*u:0,f=c>1e-4?t/c*u:0,p=1-1e-4**(s/.2);this.avatarVX+=(d-this.avatarVX)*p,this.avatarVY+=(f-this.avatarVY)*p;let m=Math.hypot(this.avatarVX,this.avatarVY);if(m<.001){this.avatarVX=0,this.avatarVY=0,a.stepSpeed[i]=0;return}let h=this.avatarVX*s,g=this.avatarVY*s,_=(e,t)=>t<1||t>o.h-2?!1:!o.isWaterCell(o.idx(o.wrapX(Math.round(e)),Math.round(t)));h!==0&&_(a.x[i]+h,a.y[i])?a.x[i]=o.wrapX(a.x[i]+h):this.avatarVX=0,g!==0&&_(a.x[i],a.y[i]+g)?a.y[i]+=g:this.avatarVY=0,a.stepSpeed[i]=m,a.prevX[i]=a.x[i],a.prevY[i]=a.y[i],a.targetX[i]=a.x[i],a.targetY[i]=a.y[i]}avatarVX=0;avatarVY=0;avatarFacing=0;turnAvatar(e){for(this.avatarFacing+=e;this.avatarFacing>Math.PI;)this.avatarFacing-=Math.PI*2;for(;this.avatarFacing<-Math.PI;)this.avatarFacing+=Math.PI*2}isAvatar(e){return e>=0&&e===this.avatar}avatarPass(){if(this.avatar<0||!this.agents.alive[this.avatar])return;let e=this.agents,t=e.x[this.avatar],n=e.y[this.avatar];this.index.query(t,n,7*r,e,i=>{if(i===this.avatar||!e.alive[i])return;let a=this.world.dist(t,n,e.x[i],e.y[i]),o=Math.max(0,1-a/(7*r));e.awe[i]=Math.min(1,e.awe[i]+.05*o),e.fervor[i]=Math.min(1,e.fervor[i]+.03*o*e.piety[i])})}cultureOf(e){return this.cultures.get(this.agents.culture[e])}agentName(e){let t=this.agents,n=this.cultureOf(e);if(!n){let n=this.settlements.get(t.settlement[e]);return(n?n.phonology:this.baseTongue).personName(new Fr(t.nameSeed[e]))}let r=new Fr(t.nameSeed[e]),i=t.mother[e],a=t.father[e],o=n.names===`patronymic`?this.givenNameOf(a>=0?a:i):``,s=this.settlements.get(t.settlement[e]);return we(n,r,t.sex[e]===1,o,s?s.name:``)}givenNameOf(e){if(e<0||!this.agents.alive[e])return``;let t=this.cultureOf(e);if(!t)return``;let n=new Fr(this.agents.nameSeed[e]);return t.phonology.word(n,2,n.chance(.25)?3:2)}},Sa=20,Ca=5,wa=9*r,Ta=8,Ea=4,Da=5,Oa=720,ka=1080;function Aa(e,t){return e<t?`${e}:${t}`:`${t}:${e}`}var ja=90,Ma=34,Na=3,Pa=24,Fa=8,Ia=16*r,La=8*r,Ra=2;function za(e,t,n){return Ba(e+(t-e)*n)}function Ba(e){return e<0?0:e>1?1:e}var Va=[`set`,`raise`,`lower`,`smooth`];function Ha(e){let t=e-o;if(Math.abs(t)<.005)return`sea level`;let n=Math.round(t/(t>0?1-o:o)*100);return`${n>0?`+`:``}${n}% ${t>0?`above`:`below`} sea`}var Ua=class{game;skyButtons=[];brushButtons=[];brushSize=null;brushLevel=null;powerButtons=[];speedButtons=[];skipBtns=[];walkBtn;speedSlider;speedLabel;overlayButtons=[];legend;legendFor=null;legendHeat=``;log;inspector;hint;manaFill;manaLabel;stats={};toastEl;lastRevision=-1;toastTimer=0;root;constructor(e,t){this.game=t,this.root=e,e.innerHTML=Ya,this.legend=$(e,`#legend`),this.log=$(e,`#log`),this.inspector=$(e,`#inspector`),this.hint=$(e,`#power-hint`),this.manaFill=$(e,`#mana-fill`),this.manaLabel=$(e,`#mana-label`),this.toastEl=$(e,`#toast`);for(let t of[`time`,`day`,`pop`,`towns`,`faiths`,`mana`,`mood`])this.stats[t]=$(e,`#stat-${t}`);this.buildPowers($(e,`#power-list`)),this.buildSpeeds($(e,`#speed-grp`)),this.buildOverlays($(e,`#overlay-grp`)),this.buildBrush($(e,`#brush`)),this.buildToggles($(e,`#toggle-grp`)),this.inspector.classList.add(`on`)}buildPowers(e){ki.map(e=>Ai[e]).forEach((t,n)=>{let r=document.createElement(`button`);r.className=`power`,r.innerHTML=`<span class="glyph">${t.glyph}</span><span class="nm">${t.name}</span><span class="cost">${t.cost}</span><span class="key">${n+1}</span>`,r.addEventListener(`click`,()=>{this.game.selectMiracle(this.game.selectedMiracle===t.kind?null:t.kind)}),r.addEventListener(`mouseenter`,()=>{this.hint.textContent=t.hint}),r.addEventListener(`mouseleave`,()=>this.refreshHint()),e.appendChild(r),this.powerButtons.push(r)}),this.refreshHint()}buildSpeeds(e){let t=document.createElement(`button`);t.className=`btn mono`,t.textContent=`❚❚`,t.title=`Pause (space)`,t.addEventListener(`click`,()=>this.game.togglePause()),e.appendChild(t),this.speedButtons.push(t);let n=document.createElement(`label`);n.className=`clock`,n.title=`How fast time runs  −  +`,this.speedSlider=document.createElement(`input`),this.speedSlider.type=`range`,this.speedSlider.min=`0`,this.speedSlider.max=String(go.length-1),this.speedSlider.step=`1`,this.speedSlider.value=`0`,this.speedSlider.addEventListener(`input`,()=>{this.game.setSpeed(go[Number(this.speedSlider.value)].value)}),this.speedLabel=document.createElement(`b`),this.speedLabel.className=`clock-read`,n.append(this.speedSlider,this.speedLabel),e.appendChild(n);for(let t of[1,10,100]){let n=document.createElement(`button`);n.className=`btn mono skip`,n.textContent=`+${t}`,n.title=t===1?`Run a year forward and stop`:`Run ${t} years forward and stop. The world is not drawn while it runs.`,n.addEventListener(`click`,()=>this.game.skipYear(t)),e.appendChild(n),this.skipBtns.push(n)}}buildOverlays(e){for(let t of $r){let n=document.createElement(`button`);n.className=`btn`,n.textContent=t.label,n.addEventListener(`click`,()=>{this.game.renderer.overlay=t.id}),e.appendChild(n),this.overlayButtons.push(n)}}buildBrush(e){let t=document.createElement(`div`);t.className=`brush-modes`;for(let e of[{id:`set`,glyph:`═`,name:`Set`,hint:`Drive the ground to exactly the height below — lifting what is under it, cutting what is over it, and stopping there.`},{id:`raise`,glyph:`▲`,name:`Raise`,hint:`Lift ground up to the height below and no further. Anything already higher is left alone.`},{id:`lower`,glyph:`▼`,name:`Lower`,hint:`Cut ground down to the height below and no further. Anything already lower is left alone.`},{id:`smooth`,glyph:`≈`,name:`Smooth`,hint:`Settle the ground toward its own average. Evens out what the other three left ragged.`}]){let n=document.createElement(`button`);n.className=`brush-mode`,n.innerHTML=`<span class="glyph">${e.glyph}</span><span class="nm">${e.name}</span>`,n.addEventListener(`click`,()=>{let t=this.game;t.brush.on&&t.brush.mode===e.id?t.setBrush(!1):t.setBrushMode(e.id),this.syncBrush()}),n.addEventListener(`mouseenter`,()=>{this.hint.textContent=e.hint}),n.addEventListener(`mouseleave`,()=>this.refreshHint()),t.appendChild(n),this.brushButtons.push(n)}e.appendChild(t);let n=document.createElement(`div`);n.className=`brush-size`,n.title=`How wide the brush — or any armed power — bites`;let r=document.createElement(`button`);r.className=`step`,r.textContent=`−`,r.title=`Narrower  [`;let i=document.createElement(`button`);i.className=`step`,i.textContent=`+`,i.title=`Wider  ]`;let a=e=>()=>{this.game.setBrushRadius(this.game.brush.radius*e),this.syncBrush()};r.addEventListener(`click`,a(1/1.35)),i.addEventListener(`click`,a(1.35)),this.brushSize=document.createElement(`span`),this.brushSize.className=`sz`,n.append(r,this.brushSize,i),e.appendChild(n);let o=document.createElement(`div`);o.className=`brush-size`;let s=document.createElement(`button`);s.className=`step`,s.textContent=`−`,s.title=`Lower the mark  ,`;let c=document.createElement(`button`);c.className=`step`,c.textContent=`+`,c.title=`Raise the mark  .`;let l=e=>()=>{this.game.setBrushTarget(this.game.brush.target+e),this.syncBrush()};s.addEventListener(`click`,l(-.02)),c.addEventListener(`click`,l(.02)),this.brushLevel=document.createElement(`span`),this.brushLevel.className=`sz`,o.append(s,this.brushLevel,c),e.appendChild(o);let u=document.createElement(`div`);u.className=`brush-note`,u.textContent=`B arm · [ ] size · , . level · Alt-click samples · Shift inverts`,u.title=`Size works on whatever is in your hand — the brush or any power.`,e.appendChild(u),this.syncBrush()}syncBrush(){let e=this.game;this.brushButtons.forEach((t,n)=>t.classList.toggle(`on`,e.brush.on&&Va[n]===e.brush.mode)),this.brushSize&&(this.brushSize.textContent=`${e.brush.radius.toFixed(1)} tiles`),this.brushLevel&&(this.brushLevel.textContent=Ha(e.brush.target))}buildToggles(e){let t=document.createElement(`button`);t.className=`btn`,t.textContent=`Night`,t.addEventListener(`click`,()=>{this.game.renderer.showNight=!this.game.renderer.showNight,t.classList.toggle(`on`,this.game.renderer.showNight)}),t.classList.add(`on`),e.appendChild(t);let n=document.createElement(`button`);n.className=`btn on`,n.textContent=`People`,n.addEventListener(`click`,()=>{this.game.renderer.showPeople=!this.game.renderer.showPeople,n.classList.toggle(`on`,this.game.renderer.showPeople)}),e.appendChild(n);let r=document.createElement(`button`);r.className=`btn`,r.textContent=`Walk`,r.title=`Take a body and walk among them (G)`,r.addEventListener(`click`,()=>{this.game.toggleAvatar(),r.classList.toggle(`on`,this.game.sim.avatar>=0),r.textContent=this.game.sim.avatar>=0?`Ascend`:`Walk`}),e.appendChild(r),this.walkBtn=r;let i=document.createElement(`button`);i.className=`btn`,i.textContent=`Unbound`;let a=()=>{i.classList.toggle(`on`,this.game.sim.divinity.unlimited),i.title=this.game.sim.divinity.unlimited?`Miracles cost nothing. Click to restore the faith economy.`:`Miracles are paid for in worship. Click to remove the limit.`};i.addEventListener(`click`,()=>{let e=this.game.sim.divinity;e.unlimited=!e.unlimited,a(),this.refreshHint()}),a(),e.appendChild(i);let o=document.createElement(`label`);o.className=`dial`,o.title=`How strongly kingdoms colour the ground they hold. Past the middle it becomes a political map.`;let s=document.createElement(`span`);s.textContent=`Borders`;let c=document.createElement(`input`);c.type=`range`,c.min=`0`,c.max=`250`,c.step=`1`,c.value=String(Math.round(this.game.renderer.borderStrength*100)),c.addEventListener(`input`,()=>{this.game.renderer.borderStrength=Number(c.value)/100,this.game.renderer.markTerrainDirty()}),o.append(s,c),e.appendChild(o);let l=document.createElement(`div`);l.className=`skies`,l.title=`The light this world stands in`;for(let e of lr){let t=document.createElement(`button`);t.className=`sky`,t.style.background=e.swatch,t.title=e.name,t.setAttribute(`aria-label`,`${e.name} sky`),t.addEventListener(`click`,()=>{this.game.setSky(e.id),this.syncSkies()}),l.appendChild(t),this.skyButtons.push(t)}e.appendChild(l),this.syncSkies();let u=document.createElement(`button`);u.className=`btn`,u.textContent=`Save`,u.title=`Write this world out to a file`,u.addEventListener(`click`,()=>{this.game.saveWorld()}),e.appendChild(u);let d=document.createElement(`input`);d.type=`file`,d.accept=`.godsim,application/json`,d.style.display=`none`,d.addEventListener(`change`,()=>{let e=d.files?.[0];d.value=``,e&&this.game.loadWorld(e).catch(e=>{this.toast(`Could not load: ${e instanceof Error?e.message:String(e)}`)})}),e.appendChild(d);let f=document.createElement(`button`);f.className=`btn`,f.textContent=`Load`,f.title=`Open a saved world`,f.addEventListener(`click`,()=>d.click()),e.appendChild(f);let p=document.createElement(`button`);p.className=`btn`,p.textContent=`New world`,p.title=`A new world under the same sky`,p.addEventListener(`click`,()=>this.game.regenerate()),e.appendChild(p)}syncSkies(){let e=this.game.renderer.sky.id;this.skyButtons.forEach((t,n)=>t.classList.toggle(`on`,lr[n].id===e))}update(){this.root.classList.toggle(`walking`,this.game.renderer.camera.ground),this.syncBrush();let{sim:e,renderer:t,game:n}={sim:this.game.sim,renderer:this.game.renderer,game:this.game},r=e.divinity,i=Math.floor(e.day/360);this.stats.time.textContent=`${i}`,this.stats.day.textContent=Ka(e.day),this.stats.pop.textContent=Ka(e.stats.population),this.stats.towns.textContent=Ka(e.stats.settlements),this.stats.faiths.textContent=Ka(e.stats.faiths),this.stats.mana.textContent=r.unlimited?`∞`:Math.floor(r.mana).toString(),this.stats.mood.textContent=r.temperamentName();let a=r.unlimited?1:Math.max(0,Math.min(1,r.mana/Math.max(1,r.manaMax)));this.manaFill.style.width=`${a*100}%`,this.manaLabel.innerHTML=r.unlimited?`<span>Faith</span><span>unbound · ${Math.floor(r.mana)} believed</span>`:`<span>Faith</span><span>${Math.floor(r.mana)} / ${Math.floor(r.manaMax)}</span>`,this.powerButtons.forEach((e,t)=>{let i=Ai[ki[t]];e.classList.toggle(`active`,n.selectedMiracle===i.kind),e.classList.toggle(`poor`,!r.canAfford(i))});let o=n.sim.avatar>=0;this.walkBtn.classList.toggle(`on`,o);let s=o?`Ascend`:`Walk`;this.walkBtn.textContent!==s&&(this.walkBtn.textContent=s),this.speedButtons[0].classList.toggle(`on`,n.paused);let c=0;for(let e=0;e<go.length;e++)go[e].value<=n.speed&&(c=e);this.speedSlider.value!==String(c)&&(this.speedSlider.value=String(c));let l=n.paused?`paused`:go[c].label;if(this.speedLabel.textContent!==l&&(this.speedLabel.textContent=l),this.speedLabel.classList.toggle(`dim`,n.paused),n.skipping){let e=n.skipYearsLeft;this.skipBtns.forEach((t,n)=>{t.classList.toggle(`on`,n===0),t.textContent=n===0?`${e} yr`:`·`})}else if(this.skipBtns[0].textContent!==`+1`){let e=[`+1`,`+10`,`+100`];this.skipBtns.forEach((t,n)=>{t.classList.remove(`on`),t.textContent=e[n]})}this.overlayButtons.forEach((e,n)=>{e.classList.toggle(`on`,t.overlay===$r[n].id)}),this.syncLegend(),e.chronicle.revision!==this.lastRevision&&(this.lastRevision=e.chronicle.revision,this.renderLog()),this.renderInspector(),this.toastTimer>0&&(this.toastTimer--,this.toastTimer===0&&this.toastEl.classList.remove(`on`))}toast(e){this.toastEl.textContent=e,this.toastEl.classList.add(`on`),this.toastTimer=130}syncLegend(){let e=this.game.renderer,t=ti[e.overlay];if(!t){this.legend.classList.remove(`on`),this.legendFor=null;return}this.legend.classList.add(`on`);let n=e.overlay===`temperature`?`${e.heat.low.toFixed(1)}/${e.heat.mean.toFixed(1)}/${e.heat.high.toFixed(1)}`:``;if(this.legendFor===e.overlay&&this.legendHeat===n)return;this.legendFor=e.overlay,this.legendHeat=n;let r=e=>this.legend.querySelector(e);r(`.lg-title`).textContent=$r.find(t=>t.id===e.overlay)?.label??``,r(`.lg-note`).textContent=t.note,r(`.lg-ticks .lo`).textContent=t.low,r(`.lg-ticks .mid`).textContent=t.mid,r(`.lg-ticks .hi`).textContent=t.high;let i=r(`.lg-bar`),a=[0,.2,.4,.5,.6,.8,1].map(t=>`${xi(e.overlay,t)} ${(t*100).toFixed(0)}%`).join(`, `);i.style.background=`linear-gradient(90deg, ${a})`;let o=r(`.lg-marks`);o.innerHTML=``;let s=r(`.lg-world`);if(e.overlay!==`temperature`||e.heat.land===0){s.textContent=``;return}let c=e=>Math.max(0,Math.min(1,(e- -25)/60))*100,l=(e,t)=>{let n=document.createElement(`div`);return n.className=e,n.setAttribute(`style`,t),o.appendChild(n),n};l(`lg-freeze`,`left:${c(0)}%`).title=`Water freezes`;let u=c(e.heat.low),d=c(e.heat.high);l(`lg-span`,`left:${u}%;width:${Math.max(.6,d-u)}%`),l(`lg-mean`,`left:${c(e.heat.mean)}%`).title=`Average over all land`;let f=e=>`${e>0?`+`:``}${Math.round(e)}°`;s.innerHTML=`<span>This world</span><b>${f(e.heat.low)}</b><span>coldest</span><b>${f(e.heat.mean)}</b><span>average</span><b>${f(e.heat.high)}</b><span>hottest</span>`}refreshHint(){let e=this.game.selectedMiracle,t=this.game.sim.divinity.unlimited;if(this.game.brush.on){let e=this.game.brush;this.hint.textContent=e.mode===`smooth`?`Land brush: settling ground over ${e.radius.toFixed(1)} tiles. Hold and drag.`:e.mode===`set`?`Land brush: ground set to exactly ${Ha(e.target)} over ${e.radius.toFixed(1)} tiles. No higher, no lower, however long you hold.`:`Land brush: ${e.mode} to ${Ha(e.target)} over ${e.radius.toFixed(1)} tiles. It stops there however long you hold.`;return}this.hint.textContent=e===null?t?`Choose a power, then click the world. Nothing is withheld from you.`:`Choose a power, then click the world. Faith is spent; only worship replenishes it.`:`${Ai[e].name} armed over ${this.game.brush.radius.toFixed(1)} tiles — hold on the world, and drag to work it. [ and ] change how wide.`}setHintFromSelection(){this.refreshHint()}renderLog(){let e=this.game.sim.chronicle.recent(90),t=document.createDocumentFragment();for(let n of e){let e=document.createElement(`div`);e.className=`entry w${n.weight} k${n.kind}`,e.innerHTML=`<span class="yr">${Math.floor(n.day/360)}</span>${Q(n.text)}`,n.x>=0?e.addEventListener(`click`,()=>this.game.focusOn(n.x,n.y)):e.style.cursor=`default`,t.appendChild(e)}this.log.replaceChildren(t)}showSkipProgress(e,t,n){this.skipPanel||=$(this.root,`#skipping`),this.skipPanel.classList.add(`on`);let r=Math.floor(n.day/360);this.skipPanel.querySelector(`.sk-years`).textContent=`year ${Ka(r)} · ${e} to go`,this.skipPanel.querySelector(`.sk-fill`).style.width=`${Math.round(t*100)}%`,this.skipPanel.querySelector(`.sk-stats`).textContent=`${Ka(n.stats.population)} souls · ${Ka(n.stats.settlements)} towns · ${n.kingdoms.list.filter(e=>e.alive).length} crowns`,n.chronicle.revision!==this.skipLogRevision&&(this.skipLogRevision=n.chronicle.revision,this.skipPanel.querySelector(`.sk-log`).innerHTML=n.chronicle.recent(6,2).map(e=>`<div><span>${Math.floor(e.day/360)}</span>${Q(e.text)}</div>`).join(``))}hideSkipProgress(){this.skipPanel&&this.skipPanel.classList.remove(`on`)}skipPanel=null;skipLogRevision=-1;renderInspector(){let e=this.game.selection,t=this.game.sim,n=``;if(n=e.kind===`agent`&&t.agents.alive[e.id]?this.agentPanel(e.id):e.kind===`settlement`?this.settlementPanel(e.id):e.kind===`religion`?this.religionPanel(e.id):this.worldPanel(),e.kind!==`none`){let t=this.game.favourites.has(e.kind,e.id);n=n.replace(`<h3>`,`<button class="fav-star${t?` on`:``}" data-fav="${e.kind}:${e.id}" title="${t?`Unpin`:`Pin this so you can find it again`}">${t?`★`:`☆`}</button><h3>`)}n+=this.favouritesList(),this.inspector.innerHTML=n,this.inspector.querySelectorAll(`[data-fav]`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let[n,r]=(e.dataset.fav??``).split(`:`);this.game.favourites.toggle(n,Number(r)),this.renderInspector()})}),this.inspector.querySelectorAll(`[data-go]`).forEach(e=>{e.addEventListener(`click`,()=>{let[t,n]=(e.dataset.go??``).split(`:`);this.game.selection={kind:t,id:Number(n)};let r=this.game.favourites.describe(this.game.sim,{kind:t,id:Number(n)});r.x>=0&&this.game.focusOn(r.x,r.y),this.renderInspector()})}),this.inspector.querySelectorAll(`[data-rel]`).forEach(e=>{e.style.cursor=`pointer`,e.addEventListener(`click`,()=>{this.game.selection={kind:`religion`,id:Number(e.dataset.rel)}})}),this.inspector.querySelectorAll(`[data-goto]`).forEach(e=>{e.addEventListener(`click`,()=>{let[t,n]=e.dataset.goto.split(`,`).map(Number);this.game.focusOn(t,n)})}),this.inspector.querySelectorAll(`[data-agent]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.agent),n=this.game.sim.agents;n.alive[t]&&(this.game.selection={kind:`agent`,id:t},this.game.focusOn(n.x[t],n.y[t]),this.renderInspector())})})}agentPanel(e){let t=this.game.sim,n=t.agents,r=t.settlements.get(n.settlement[e]),i=t.religions.get(n.religion[e]),a=n.partner[e]>=0&&n.alive[n.partner[e]]?t.agentName(n.partner[e]):`—`,o=[];for(let t=0;t<n.high&&o.length<12;t++)n.alive[t]&&(n.mother[t]===e||n.father[t]===e)&&o.push(t);return`
      <h3>${Q(t.agentName(e))}</h3>
      <div class="role">${n.sex[e]?`man`:`woman`} · ${Math.floor(n.age[e])} years · generation ${n.generation[e]}</div>
      <div class="row"><span>Doing</span><b>${ie[n.act[e]]}</b></div>
      <div class="row"><span>Carrying</span><b>${ne[n.tool[e]]}</b></div>
      <div class="row"><span>Home</span><b ${r?`data-goto="${r.x},${r.y}"`:``}>${r?Q(r.name):`wanderer`}</b></div>
      <div class="row"><span>People</span><b>${t.cultureOf(e)?Q(t.cultureOf(e).name):`no people`}</b></div>
      <div class="row"><span>Partner</span><b${n.partner[e]>=0&&n.alive[n.partner[e]]?` class="kin" data-agent="${n.partner[e]}"`:``}>${Q(a)}</b></div>
      <div class="row"><span>Mother</span>${qa(t,n.mother[e])}</div>
      <div class="row"><span>Father</span>${qa(t,n.father[e])}</div>
      <div class="row"><span>Children</span><b>${o.length?o.map(e=>`<span class="kin" data-agent="${e}">${Q(t.agentName(e))}</span>`).join(`, `):`none`}</b></div>
      ${n.pregnancy[e]>0?`<div class="row"><span>Expecting</span><b>in ${Math.ceil(n.pregnancy[e])} days</b></div>`:``}
      <div class="divider"></div>
      ${Z(`Health`,n.health[e],n.health[e]<.4?`warn`:`good`)}
      ${Z(`Hunger`,n.hunger[e],n.hunger[e]>.7?`warn`:``)}
      ${Z(`Thirst`,n.thirst[e],n.thirst[e]>.7?`warn`:``)}
      ${Z(`Weariness`,n.fatigue[e],``)}
      ${Z(`Warm clothing`,n.coat[e],n.coat[e]<.25?`warn`:`good`)}
      <div class="divider"></div>
      <div class="row"><span>Faith</span><b ${i?`data-rel="${i.id}"`:``}>${i?Q(i.name):`none`}</b></div>
      ${Z(`Fervour`,n.fervor[e],`gold`)}
      ${Z(`Awe of you`,n.awe[e],`gold`)}
      ${Z(`Terror of you`,n.fear[e],`warn`)}
      ${i?Z(`Doubt`,n.dissent[e],n.dissent[e]>.6?`warn`:``):``}
      <div class="row"><span>Miracles seen</span><b>${n.witnessCount[e]}</b></div>
      <div class="divider"></div>
      <div class="section-title">Nature</div>
      ${Ga(`Piety`,n.piety[e])}
      ${Ga(`Daring`,n.boldness[e])}
      ${Ga(`Warmth`,n.sociability[e])}
      ${Ga(`Industry`,n.industry[e])}
      ${Ga(`Ferocity`,n.aggression[e])}
    `}settlementPanel(e){let t=this.game.sim,n=t.settlements.get(e);if(!n)return this.worldPanel();let r=t.religions.get(n.religion),i=t.kingdoms.get(n.kingdom),a=Math.floor(n.founded/360),o=n.pop>0?n.food/(n.pop*2.5):1,s=t.cultures.get(n.culture),c=s?.work===`hall`?`Great hall`:s?.work===`pyramid`?`Pyramid`:`Keep`;return`
      <h3>${Q(n.name)}</h3>
      <div class="role">${n.alive?`settlement`:`ruin`} · founded year ${a}${n.alive||n.ruinedOn<0?``:`, emptied year ${Math.floor(n.ruinedOn/360)}`}</div>${n.alive||n.ruinSize<=.02?``:`
      <div class="row"><span>Still standing</span><b>${(()=>{let e=Math.max(0,(t.day-n.ruinedOn)/360),r=n.ruinSize*Math.max(0,1-e/400);return r<.05?`almost nothing`:r<.2?`a few stones`:r<.45?`broken walls`:`walls and a ruined keep`})()}</b></div>`}
      <div class="row"><span>Crown</span>${i?`<button class="fav-star${this.game.favourites.has(`kingdom`,i.id)?` on`:``}" data-fav="kingdom:${i.id}" title="Pin this crown">${this.game.favourites.has(`kingdom`,i.id)?`★`:`☆`}</button>`:``}<b style="${i?`color:rgb(${i.color.join(`,`)})`:``}">${i?Q(i.name)+(i.capital===n.id?` (seat)`:``):`free village`}</b></div>
      <div class="row"><span>People</span><b>${n.pop}</b></div>
      <div class="row"><span>Spoken for by</span><b>${n.headman>=0&&t.agents.alive[n.headman]?Q(t.agentName(n.headman)):`nobody`}</b></div>
      <div class="row"><span>Granary</span><b>${n.food.toFixed(1)}</b></div>
      <div class="row"><span>Fields</span><b>${n.fields.length}</b></div>
      <div class="row"><span>Households</span><b>${Math.round(n.households)}</b></div>
      <div class="row"><span>Timber</span><b>${n.timber.toFixed(0)}</b></div>
      <div class="row"><span>Stone / ore</span><b>${n.stone.toFixed(0)} / ${n.ore.toFixed(0)}</b></div>
      <div class="row"><span>Hides on the rack</span><b>${n.hides.toFixed(1)}</b></div>
      <div class="row"><span>Tools on the rack</span><b>${Le(n)}</b></div>
      <div class="row"><span>Craft</span><b>${[`foragers`,`farmers`,`builders`][Math.min(2,n.tech)]}</b></div>
      <div class="row"><span>Shrine</span><b>${n.shrine<.9?`none`:n.shrine.toFixed(1)}</b></div>
      <div class="row"><span>People</span><b>${s?Q(s.name):`unknown`}</b></div>
      <div class="row"><span>Arms</span><b>${ne[n.favouredWeapon||5]}${n.toolRack[n.favouredWeapon||5]>0?` · ${n.toolRack[n.favouredWeapon||5]} on the rack`:``}</b></div>
      <div class="row"><span>${c}</span><b>${n.castle<=0?`none`:n.castle<1?`${Math.round(n.castle*100)}%`:n.works>1?`${n.works} standing`:n.extraWork>.02?`built · another ${Math.round(n.extraWork*100)}%`:`built`}${n.works>1&&n.extraWork>.02?` · another ${Math.round(n.extraWork*100)}%`:``}</b></div>
      <div class="row"><span>Walls</span><b>${s&&!s.wallers?`not their way`:n.walls<=0?`none`:n.walls>=1?`closed`:`${Math.round(n.walls*100)}%`}</b></div>
      ${Z(`Housed`,Be(n),Be(n)<.6?`warn`:`good`)}
      ${Z(`Food security`,Math.min(1,o),o<.4?`warn`:`good`)}
      ${Z(`Hardship`,Math.min(1,n.hardship),`warn`)}
      <div class="divider"></div>
      <div class="row"><span>Faith</span><b ${r?`data-rel="${r.id}"`:``}>${r?Q(r.name):`none`}</b></div>
      ${r?Wa(r):``}
    `}favouritesList(){let e=this.game.favourites;if(e.size===0)return``;let t=this.game.sim;return`<div class="divider"></div>
      <div class="section-title">Pinned</div>
      <div class="fav-list">${e.all().map(n=>{let r=e.describe(t,n);return`<div class="fav-row${r.gone?` gone`:``}">
        <button class="fav-star on" data-fav="${n.kind}:${n.id}" title="Unpin">★</button>
        <b data-go="${n.kind}:${n.id}" style="${r.colour?`color:${r.colour}`:``}">${Q(r.name)}</b>
        <span>${Q(r.note)}</span>
      </div>`}).join(``)}</div>`}religionPanel(e){let t=this.game.sim,n=t.religions.get(e);if(!n)return this.worldPanel();let r=t.religions.get(n.parent);return`
      <h3 style="color:${`rgb(${n.color[0]},${n.color[1]},${n.color[2]})`}">${Q(n.name)}</h3>
      <div class="role">${n.alive?`living faith`:`extinct`} · founded year ${Math.floor(n.founded/360)}</div>
      <div class="row"><span>Followers</span><b>${n.followers}</b></div>
      <div class="row"><span>Greatest extent</span><b>${n.peak}</b></div>
      <div class="row"><span>Mean fervour</span><b>${n.meanFervor.toFixed(2)}</b></div>
      <div class="row"><span>Holy places</span><b>${n.sacredSites.length}</b></div>
      ${r?`<div class="row"><span>Split from</span><b data-rel="${r.id}">${Q(r.name)}</b></div>`:``}
      <div class="divider"></div>
      <div class="section-title">Doctrine</div>
      ${Wa(n)}
      ${this.kinList(n)}
    `}kinList(e){let t=this.game.sim.religions.list.filter(t=>t.parent===e.id);return t.length?`<div class="divider"></div><div class="section-title">Heresies</div>`+t.map(e=>`<div class="row"><span data-rel="${e.id}">${Q(e.name)}</span><b>${e.followers}</b></div>`).join(``):``}worldPanel(){let e=this.game.sim,t=e.divinity,n=e.religions.living().sort((e,t)=>t.followers-e.followers).slice(0,6),r=e.kingdoms.living().sort((e,t)=>t.towns-e.towns).slice(0,5),i=e.settlements.living().sort((e,t)=>t.pop-e.pop).slice(0,4);return`
      <h3>The World</h3>
      <div class="role">seed ${e.seed} · click anything to inspect it</div>
      <div class="row"><span>Living</span><b>${Ka(e.stats.population)}</b></div>
      <div class="row"><span>Born / died</span><b>${Ka(e.stats.births)} / ${Ka(e.stats.deaths)}</b></div>
      <div class="row"><span>Starved</span><b>${Ka(e.stats.starved)}</b></div>
      <div class="row"><span>Miracles worked</span><b>${t.miraclesCast}</b></div>
      ${Z(`Awe abroad`,e.stats.meanAwe,`gold`)}
      ${Z(`Terror abroad`,e.stats.meanFear,`warn`)}
      <div class="divider"></div>
      <div class="section-title">Kingdoms</div>
      ${r.length?r.map(t=>`<div class="row"><span style="color:rgb(${t.color.join(`,`)})">${Q(t.name)}${t.wars.size?`<span class="at-war" title="At war">⚔</span>`:``}</span><b>${t.king>=0&&e.agents.alive[t.king]?Q(e.agentName(t.king))+` · `:``}${t.towns} towns · ${t.subjects}</b></div>`).join(``):`<div class="row"><span>No crowns have been raised.</span></div>`}
      <div class="divider"></div>
      <div class="section-title">Wars</div>
      ${Ja(e)}
      <div class="divider"></div>
      <div class="section-title">Faiths</div>
      ${n.length?n.map(e=>`<div class="row"><span data-rel="${e.id}" style="color:rgb(${e.color.join(`,`)})">${Q(e.name)}</span><b>${e.followers}</b></div>`).join(``):`<div class="row"><span>No one believes in anything yet.</span></div>`}
      <div class="divider"></div>
      <div class="section-title">Greatest settlements</div>
      ${i.length?i.map(e=>`<div class="row"><span data-goto="${e.x},${e.y}">${Q(e.name)}</span><b>${e.pop}</b></div>`).join(``):`<div class="row"><span>The people are still wandering.</span></div>`}
    `}};function Wa(e){let t=`rgb(${e.color[0]},${e.color[1]},${e.color[2]})`,n=`<div class="tenets">`;for(let r=0;r<Ee.length;r++){let i=e.tenets[r];n+=`<div class="tenet"><span>${Ee[r]}</span><span class="bar"><i style="width:${Math.round(i*100)}%;background:${t}"></i></span><span>${i.toFixed(2)}</span></div>`}return n+`</div>`}function Z(e,t,n){let r=Math.round(Math.max(0,Math.min(1,t))*100);return`<div class="row"><span>${e}</span><b>${r}%</b></div><div class="meter"><i class="${n}" style="width:${r}%"></i></div>`}function Ga(e,t){return`<div class="tenet"><span>${e}</span><span class="bar"><i style="width:${Math.round(t*100)}%;background:var(--dim)"></i></span><span>${t.toFixed(2)}</span></div>`}function Ka(e){return e>=1e4?`${(e/1e3).toFixed(1)}k`:e.toString()}function qa(e,t){let n=e.agents;if(t<0)return`<b>—</b>`;let r=Q(e.agentName(t));return n.alive[t]?`<b class="kin" data-agent="${t}">${r}</b>`:`<b class="gone">${r} (dead)</b>`}function Ja(e){let t=new Set,n=[];for(let r of e.kingdoms.living())for(let[i,a]of r.wars){let o=r.id<i?`${r.id}:${i}`:`${i}:${r.id}`;if(t.has(o))continue;t.add(o);let s=e.kingdoms.get(i);if(!s)continue;let c=Math.max(0,e.day-a),l=e.settlements.living().filter(e=>e.siege>.02&&(e.kingdom===r.id||e.kingdom===i));n.push(`<div class="row war"><span><b style="color:rgb(${r.color.join(`,`)})">${Q(r.name)}</b><span class="vs">vs</span><b style="color:rgb(${s.color.join(`,`)})">${Q(s.name)}</b></span><b>${c}d</b></div>`+(l.length?`<div class="war-sub">${l.map(e=>`<span data-goto="${e.x},${e.y}">${Q(e.name)} ${Math.round(e.siege*100)}%</span>`).join(``)}</div>`:``))}return n.length===0?`<div class="row"><span>The crowns are at peace.</span></div>`:n.join(``)}function Q(e){return e.replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}function $(e,t){let n=e.querySelector(t);if(!n)throw Error(`missing ui element ${t}`);return n}var Ya=`
  <div class="panel" id="brand">
    <h1>GOD SIM</h1>
    <div class="sub">a world that believes in you</div>
  </div>

  <div class="panel" id="topbar">
    <div class="stat"><span class="k">Year</span><span class="v" id="stat-time">0</span></div>
    <div class="stat"><span class="k">Day</span><span class="v" id="stat-day">0</span></div>
    <div class="stat"><span class="k">Souls</span><span class="v" id="stat-pop">0</span></div>
    <div class="stat"><span class="k">Towns</span><span class="v" id="stat-towns">0</span></div>
    <div class="stat"><span class="k">Faiths</span><span class="v" id="stat-faiths">0</span></div>
    <div class="stat"><span class="k">Faith</span><span class="v gold" id="stat-mana">0</span></div>
    <div class="stat"><span class="k">You are</span><span class="v gold" id="stat-mood">Unknown</span></div>
  </div>

  <div class="panel" id="powers">
    <div class="section-title">Divine will</div>
    <div id="mana-wrap">
      <div id="mana-bar"><div id="mana-fill"></div></div>
      <div id="mana-label"></div>
    </div>
    <div id="power-list"></div>
    <div class="section-title brush-title">Land brush</div>
    <div id="brush"></div>
    <div id="power-hint"></div>
    <div id="help">
      <div><kbd>drag</kbd> spin · <kbd>wheel</kbd> zoom · <kbd>space</kbd> pause</div>
      <div><kbd>enter</kbd> turn the planet, or turn the view</div>
      <div><kbd>1</kbd>–<kbd>9</kbd> powers · <kbd>esc</kbd> cancel · <kbd>tab</kbd> overlay</div>
      <div><kbd>g</kbd> walk among them · <kbd>wasd</kbd> move · <kbd>f</kbd> free the view</div>
    </div>
  </div>

  <div class="panel" id="chronicle">
    <div class="section-title">Chronicle</div>
    <div id="log"></div>
  </div>

  <div class="panel" id="inspector"></div>

  <div class="panel" id="legend">
    <div class="lg-head"><span class="lg-title"></span><span class="lg-note"></span></div>
    <div class="lg-bar"><div class="lg-marks"></div></div>
    <div class="lg-ticks"><span class="lo"></span><span class="mid"></span><span class="hi"></span></div>
    <div class="lg-world"></div>
  </div>

  <div class="panel" id="bottom">
    <div class="grp" id="speed-grp"></div>
    <div class="grp" id="overlay-grp"></div>
    <div class="grp" id="toggle-grp"></div>
  </div>


  <div id="skipping">
    <div class="sk-title">Time passes</div>
    <div class="sk-years"></div>
    <div class="sk-bar"><div class="sk-fill"></div></div>
    <div class="sk-stats"></div>
    <div class="sk-log"></div>
  </div>

  <div id="toast"></div>
`,Xa=[{id:`moonlet`,name:`Moonlet`,dayScale:.35,radiusScale:.4,blurb:`Barely a world. A day is gone before you have looked at it, and the ground drops away a short walk from your feet.`},{id:`small`,name:`Small`,dayScale:.6,radiusScale:.66,blurb:`Short days, quick seasons, history in a hurry. A near horizon.`},{id:`normal`,name:`Ordinary`,dayScale:1,radiusScale:1,blurb:`A world of familiar size and pace.`},{id:`large`,name:`Large`,dayScale:1.8,radiusScale:1.5,blurb:`Long days on a wide, slow-curving world. Everything takes its time.`},{id:`giant`,name:`Giant`,dayScale:3.2,radiusScale:2.3,blurb:`Vast and slow. Its people are specks on a plain that hardly curves; generations pass while you watch.`}];function Za(e){return Xa.find(t=>t.id===e)??Xa.find(e=>e.id===`normal`)}function Qa(e){return 288*e.dayScale}function $a(e){let t=Math.round(e),n=Math.floor(t/60),r=t%60;return n>0?`${n}m ${r}s`:`${r}s`}var eo=[{count:0,name:`None`,blurb:`An empty sky at night, and nothing to pull the tides.`},{count:1,name:`One`,blurb:`A single moon, waxing and waning through the month.`},{count:2,name:`Two`,blurb:`Two moons, on their own schedules. They will sometimes meet.`},{count:3,name:`Three`,blurb:`Three of them. Some night every year, all three are up at once.`}],to=[`#b8b2a6`,`#8e887e`,`#cbc6bb`,`#a09384`,`#d6d2ca`];function no(e,t){let n=new Fr(e^3211347),r=[];for(let e=0;e<t;e++){let t=.16+n.f()*.14,i=11+e*7+n.f()*4;r.push({radius:t,distance:i,period:5+(i/11)**1.5*16,phase:n.f()*Math.PI*2,tilt:(n.f()-.5)*.5,colour:to[n.int(0,to.length)]})}return r}var ro=[`#c9a678`,`#a8b6c8`,`#d0b48c`,`#8fa8bd`,`#c08a6a`];function io(e){let t=new Fr(e^10116631);return{radius:3.4+t.f()*1.6,distance:17+t.f()*5,colour:ro[t.int(0,ro.length)],name:[`Thunderer`,`The Great One`,`Oros`,`Hemenmar`,`The Watcher`][t.int(0,5)]}}var ao=[{id:`planet`,name:`A planet`,blurb:`A world of its own, going round its star.`},{id:`moon`,name:`A moon`,blurb:`A moon of a gas giant. It hangs over one hemisphere and never sets — the same face is turned to it forever — so it is seen from off the limb rather than by looking up.`}];function oo(e,t){return new Promise(n=>{let r=t.star??wr(null),i=t.sky??dr(null),a=t.size??Za(null),o=t.orbit??Mr(null),s=t.kind??`planet`,c=t.moons??1,l=t.seed??Math.random()*4294967295>>>0,u=document.createElement(`div`);u.id=`setup`,u.innerHTML=`
      <div class="setup-panel">
        <h1>GOD SIM</h1>
        <div class="setup-sub">Make a world</div>

        <div class="setup-group">
          <div class="setup-label">Star</div>
          <div class="setup-row" id="setup-stars"></div>
          <div class="setup-note" id="setup-star-note"></div>
        </div>

        <div class="setup-group">
          <div class="setup-label">Orbit</div>
          <div class="setup-row" id="setup-orbits"></div>
          <div class="setup-note" id="setup-orbit-note"></div>
        </div>

        <div class="setup-group" id="setup-pulse-group">
          <div class="setup-label">How hard it breathes</div>
          <div class="setup-row" id="setup-pulses"></div>
          <div class="setup-row" id="setup-periods"></div>
          <div class="setup-note" id="setup-pulse-note"></div>
        </div>

        <div class="setup-group">
          <div class="setup-label">Sky</div>
          <div class="setup-row" id="setup-skies"></div>
          <div class="setup-note" id="setup-sky-note"></div>
        </div>

        <div class="setup-group">
          <div class="setup-label">World</div>
          <div class="setup-row" id="setup-sizes"></div>
          <div class="setup-note" id="setup-size-note"></div>
        </div>

        <div class="setup-group">
          <div class="setup-label">Sky above it</div>
          <div class="setup-row" id="setup-kinds"></div>
          <div class="setup-row" id="setup-moons"></div>
          <div class="setup-row" id="setup-rings"></div>
          <div class="setup-row" id="setup-binary"></div>
          <div class="setup-note" id="setup-moon-note"></div>
        </div>

        <div class="setup-group setup-seed">
          <div class="setup-label">Seed</div>
          <input id="setup-seed" type="text" spellcheck="false" />
          <button class="setup-reroll" id="setup-reroll" title="Another world">&#8635;</button>
        </div>

        <button class="setup-go" id="setup-go">Make the world</button>
      </div>
    `,e.appendChild(u);let d=e=>u.querySelector(e),f=d(`#setup-star-note`),p=d(`#setup-orbit-note`),m=d(`#setup-sky-note`),h=d(`#setup-size-note`),g=d(`#setup-moon-note`),_=d(`#setup-go`),v=d(`#setup-seed`);v.value=String(l);let y=d(`#setup-stars`),b=[],x=[`main`,`giant`,`supergiant`,`remnant`],S=new Map;for(let e of mr)S.has(e.kind)||S.set(e.kind,[]),S.get(e.kind).push(e);let C=Math.max(...mr.map(e=>e.size));for(let e of x){let t=S.get(e);if(!t)continue;let n=document.createElement(`div`);n.className=`setup-kind`,n.textContent=fr[e],y.appendChild(n);let i=document.createElement(`div`);i.className=`setup-kind-row`;for(let e of t){let t=document.createElement(`button`);t.className=`setup-star`,t.dataset.star=e.id;let n=Math.round(12+Math.cbrt(e.size/C)*26);t.innerHTML=`<span class="orb" style="width:${n}px;height:${n}px;background:${e.swatch}"></span><span class="nm">${e.name}</span>`,t.addEventListener(`click`,()=>{r=e,N()}),i.appendChild(t),b.push(t)}y.appendChild(i)}let w=d(`#setup-orbits`);w.innerHTML=`<div class="orbit-slider"><span class="end">closer</span><input id="setup-orbit" type="range" min="0" max="1000" step="5" /><span class="end">further</span></div>`;let T=d(`#setup-orbit`),E=t.orbit?kr(t.orbit.warmth):.5;T.value=String(Math.round(E*1e3)),T.addEventListener(`input`,()=>{E=Number(T.value)/1e3,o=Dr(E),N()}),o=Dr(E);let D=d(`#setup-pulse-group`),ee=d(`#setup-pulses`);ee.innerHTML=`<div class="orbit-slider"><span class="end">steady</span><input id="setup-pulse" type="range" min="0" max="100" step="1" /><span class="end">violent</span></div>`;let te=d(`#setup-pulse`),O=t.pulse??1;te.value=String(Math.round(O*100)),te.addEventListener(`input`,()=>{O=Number(te.value)/100,N()});let k=d(`#setup-periods`);k.innerHTML=`<div class="orbit-slider"><span class="end">rapid</span><input id="setup-period" type="range" min="0" max="1000" step="5" /><span class="end">ponderous</span></div>`;let A=d(`#setup-period`),j=Math.log(_r),ne=Math.log(40),M=t.pulseYears??4.5;A.value=String(Math.round((Math.log(M)-j)/(ne-j)*1e3)),A.addEventListener(`input`,()=>{M=Math.exp(j+Number(A.value)/1e3*(ne-j)),N()});let re=d(`#setup-skies`),ie=[];for(let e of lr){let t=document.createElement(`button`);t.className=`setup-swatch`,t.innerHTML=`<span class="orb" style="background:${e.swatch}"></span><span class="nm">${e.name}</span>`,t.addEventListener(`click`,()=>{i=e,N()}),re.appendChild(t),ie.push(t)}let ae=d(`#setup-sizes`),oe=[];for(let e of Xa){let t=document.createElement(`button`);t.className=`setup-size`,t.innerHTML=`<span class="nm">${e.name}</span><span class="len">${$a(Qa(e))}</span>`,t.addEventListener(`click`,()=>{a=e,N()}),ae.appendChild(t),oe.push(t)}let se=d(`#setup-kinds`),ce=[];for(let e of ao){let t=document.createElement(`button`);t.className=`setup-size`,t.innerHTML=`<span class="nm">${e.name}</span>`,t.addEventListener(`click`,()=>{s=e.id,N()}),se.appendChild(t),ce.push(t)}let le=d(`#setup-moons`),ue=[];for(let e of eo){let t=document.createElement(`button`);t.className=`setup-size`,t.innerHTML=`<span class="nm">${e.name}</span><span class="len">${e.count===1?`moon`:`moons`}</span>`,t.addEventListener(`click`,()=>{c=e.count,N()}),le.appendChild(t),ue.push(t)}let de=d(`#setup-rings`),fe=[],pe=t.rings??!1;for(let e of[{on:!1,nm:`Bare sky`},{on:!0,nm:`Ringed`}]){let t=document.createElement(`button`);t.className=`setup-size`,t.innerHTML=`<span class="nm">${e.nm}</span><span class="len">${e.on?`an arch of ice overhead`:`nothing but moons`}</span>`,t.addEventListener(`click`,()=>{pe=e.on,N()}),de.appendChild(t),fe.push(t)}let me=[{id:null,nm:`One sun`,note:`a single star, as most worlds have`},{id:`reddwarf`,nm:`Red companion`,note:`a dim red second sun`},{id:`orange`,nm:`Orange companion`,note:`a small warm second sun`},{id:`white`,nm:`White companion`,note:`a fierce blue-white second sun`}],he=d(`#setup-binary`),ge=[],_e=t.companion??null;for(let e of me){let t=document.createElement(`button`);t.className=`setup-size`,t.innerHTML=`<span class="nm">${e.nm}</span><span class="len">${e.note}</span>`,t.addEventListener(`click`,()=>{_e=e.id?wr(e.id):null,N()}),he.appendChild(t),ge.push(t)}function N(){if(ge.forEach((e,t)=>e.classList.toggle(`on`,me[t].id===null==(_e===null)&&(_e===null||me[t].id===_e.id))),fe[0].classList.toggle(`on`,!pe),fe[1].classList.toggle(`on`,pe),b.forEach(e=>e.classList.toggle(`on`,e.dataset.star===r.id)),D.style.display=r.pulse?``:`none`,r.pulse){let e=(O*r.pulse*32).toFixed(1),t=M<1.2?`${Math.round(M*12)} months`:`${M.toFixed(+(M<10))} years`,n=Nr(r.warmth,o.warmth)+(_e?yr(_e):0),i=n-Number(e),a=n+Number(e),s=`<b class="${jr(i)?`temp-ok`:`temp-bad`}">${Math.round(i)}\u00b0C</b> at its coldest, <b class="${jr(a)?`temp-ok`:`temp-bad`}">${Math.round(a)}\u00b0C</b> at its hottest`;d(`#setup-pulse-note`).innerHTML=O<.02?`Held steady. It will sit there like any other star.`:`${s} — a swing of <b>±${e}\u00b0C</b> every <b>${t}</b>. The ground lags behind the sky, so the worst cold arrives after the light has already come back.`+(Number(e)>20?` <b class="temp-bad">Past what a world can carry:</b> the tropics burn bare at the peak and the ice reaches halfway to the equator at the trough. Whether anybody survives it is the question.`:``)+(M>25?` Longer than most people live: a generation would know the cold years only as something their grandparents survived.`:M<1.5?` Faster than a harvest cycle. Nobody could plan around it.`:``)}ie.forEach((e,t)=>e.classList.toggle(`on`,lr[t].id===i.id)),oe.forEach((e,t)=>e.classList.toggle(`on`,Xa[t].id===a.id));let e=Nr(r.warmth,o.warmth)+(_e?yr(_e):0),t=jr(e);f.textContent=r.blurb,p.innerHTML=`<b class="${t?`temp-ok`:`temp-bad`}">${o.name} — about ${Math.round(e)}\u00b0C on average</b>. ${Pr(e)}`+(t?`.`:Ar(e)?`. <b class="temp-bad">There will be nobody on it.</b> This close in the oceans are gone, the seabeds are open rock and the deep basins are still molten. Make it to look at it.`:e>32?`. <b class="temp-bad">They will cook.</b> Past this the ground is hotter than a body can shed heat into, and no roof or shade is enough — expect them dead within a year or two, and to watch it happen.`:`. <b class="temp-bad">Only if they clothe themselves fast.</b> A people here live or die on how quickly they learn to hunt: hides, and a roof, and the tropics. Most such worlds bury their last band. Some do not.`),_.textContent=t?`Make the world`:`Make it anyway`,m.textContent=`The light the air scatters. Water takes its colour. Changeable later.`,h.textContent=`${a.blurb} A day is ${$a(Qa(a))}.`,ce.forEach((e,t)=>e.classList.toggle(`on`,ao[t].id===s)),ue.forEach((e,t)=>e.classList.toggle(`on`,eo[t].count===c));let n=ao.find(e=>e.id===s).blurb,l=eo.find(e=>e.count===c).blurb;g.textContent=`${n} ${l}`}N(),d(`#setup-reroll`).addEventListener(`click`,()=>{l=Math.random()*4294967295>>>0,v.value=String(l)});let ve=()=>{let e=v.value.trim(),t=l;if(/^\d+$/.test(e))t=Number(e)>>>0;else if(e.length>0){let n=2166136261;for(let t=0;t<e.length;t++)n^=e.charCodeAt(t),n=Math.imul(n,16777619);t=n>>>0}u.remove(),n({seed:t,star:r,sky:i,size:a,orbit:o,kind:s,moons:c,pulse:O,pulseYears:M,rings:pe,companion:_e})};_.addEventListener(`click`,()=>{_.disabled||ve()}),v.addEventListener(`keydown`,e=>{e.key===`Enter`&&!_.disabled&&ve()})})}var so=class{list=[];has(e,t){return this.list.some(n=>n.kind===e&&n.id===t)}toggle(e,t){let n=this.list.findIndex(n=>n.kind===e&&n.id===t);return n>=0?(this.list.splice(n,1),!1):(this.list.push({kind:e,id:t}),!0)}all(){return this.list}get size(){return this.list.length}describe(e,t){switch(t.kind){case`agent`:{let n=!!e.agents.alive[t.id];return{name:n?e.agentName(t.id):`someone who died`,note:n?e.cultureOf(t.id)?.name??`person`:`gone`,gone:!n,x:n?e.agents.x[t.id]:-1,y:n?e.agents.y[t.id]:-1}}case`settlement`:{let n=e.settlements.get(t.id);return{name:n?n.name:`a lost town`,note:!n||!n.alive?`ruin`:`${Math.round(n.pop)} souls`,gone:!n||!n.alive,x:n?n.x:-1,y:n?n.y:-1}}case`kingdom`:{let n=e.kingdoms.get(t.id),r=n?e.settlements.get(n.capital):null;return{name:n?n.name:`a fallen crown`,note:!n||!n.alive?`fallen`:`${n.towns} towns`,gone:!n||!n.alive,x:r?r.x:-1,y:r?r.y:-1,colour:n?`rgb(${n.color.join(`,`)})`:void 0}}default:{let n=e.religions.get(t.id);return{name:n?n.name:`a forgotten faith`,note:n?`${n.followers} faithful`:`forgotten`,gone:!n,x:-1,y:-1}}}}};function co(e,t){return e.given?e.given:t?`YOUR WORLD`:``}var lo=[`first`,`second`,`third`,`fourth`,`fifth`,`sixth`,`seventh`,`eighth`,`ninth`,`tenth`,`eleventh`,`twelfth`];function uo(e){return lo[e]??`${e+1}th`}function fo(e){return e.replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/</g,`&lt;`)}var po=class{root;svg;side;markers=[];labels=[];fields=[];place=()=>0;system=null;open=!1;constructor(e){this.root=document.createElement(`div`),this.root.id=`sysmap`,this.root.innerHTML=`
      <div class="sm-frame">
        <svg viewBox="-104 -104 208 208" preserveAspectRatio="xMidYMid meet"></svg>
      </div>
      <div class="sm-side"></div>
      <div class="sm-close">M or Esc to close</div>
    `,e.appendChild(this.root),this.svg=this.root.querySelector(`svg`),this.side=this.root.querySelector(`.sm-side`)}lastDays=0;build(e,t,n,r){this.system=e;let i=e.planets[e.planets.length-1].radius;this.place=e=>Math.sqrt(e)/Math.sqrt(i)*92;let a=`http://www.w3.org/2000/svg`;this.svg.innerHTML=``,this.markers=[],this.labels=[];let[o,s]=e.habitable,c=this.place(o),l=this.place(s),u=document.createElementNS(a,`path`);u.setAttribute(`d`,`M ${c} 0 A ${c} ${c} 0 1 1 ${-c} 0 A ${c} ${c} 0 1 1 ${c} 0 Z M ${l} 0 A ${l} ${l} 0 1 0 ${-l} 0 A ${l} ${l} 0 1 0 ${l} 0 Z`),u.setAttribute(`fill-rule`,`evenodd`),u.setAttribute(`class`,`sm-hz`),this.svg.appendChild(u);for(let t of e.planets){let e=document.createElementNS(a,`circle`);e.setAttribute(`r`,this.place(t.radius).toFixed(2)),e.setAttribute(`class`,`sm-orbit`),this.svg.appendChild(e)}let d={remnant:2.2,main:4.4,giant:8,supergiant:12.5}[t.kind],f=document.createElementNS(a,`circle`);if(f.setAttribute(`r`,String(d)),f.setAttribute(`class`,`sm-sun`),f.setAttribute(`fill`,t.dark?`#0b0b0b`:t.swatch),this.svg.appendChild(f),t.dark){let e=document.createElementNS(a,`circle`);e.setAttribute(`r`,String(d*1.4)),e.setAttribute(`class`,`sm-accretion`),this.svg.appendChild(e)}e.planets.forEach((t,n)=>{let r=n===e.homeIndex,i=document.createElementNS(a,`g`);if(i.setAttribute(`class`,r?`sm-body home`:`sm-body`),r){let e=document.createElementNS(a,`circle`);e.setAttribute(`r`,`5.6`),e.setAttribute(`class`,`sm-home-ring`),i.appendChild(e)}let o=document.createElementNS(a,`circle`);o.setAttribute(`r`,`8`),o.setAttribute(`class`,`sm-hit`),i.appendChild(o);let s=document.createElementNS(a,`circle`);s.setAttribute(`r`,Math.max(1.1,t.scale*1.4).toFixed(2)),s.setAttribute(`fill`,r?`#6fa8e0`:t.colour),i.appendChild(s);let c=document.createElementNS(a,`text`);c.setAttribute(`y`,`-7.5`),c.textContent=co(t,r),i.appendChild(c),i.addEventListener(`click`,()=>{let e=this.fields[n];e.focus(),e.select()}),this.svg.appendChild(i),this.markers.push(i),this.labels.push(c)});let p=e.planets.map((t,n)=>{let r=n===e.homeIndex,i=t.radius/e.planets[e.homeIndex].radius;return`<div class="sm-row ${r?`home`:``}">
          <span class="sm-dot" style="background:${r?`#6fa8e0`:t.colour}"></span>
          <input class="sm-nm" type="text" spellcheck="false" maxlength="22"
                 data-i="${n}" value="${fo(t.given??``)}"
                 placeholder="${fo(r?`Your world`:`the ${uo(n)} world out`)}" />
          <span class="sm-kd">${r?`where the people are`:t.kind}</span>
          <span class="sm-au">${i.toFixed(2)}×</span>
        </div>`}).join(``);this.side.innerHTML=`
      <div class="sm-title">The system</div>
      <div class="sm-star" style="color:${t.swatch}">${t.name}</div>
      <div class="sm-note">${t.blurb}</div>
      <div class="sm-facts">
        <div><span>Worlds</span><b>${e.planets.length}</b></div>
        <div><span>Your orbit</span><b>${n.name.toLowerCase()}</b></div>
        <div><span>World size</span><b>${r.name}</b></div>
        <div><span>Day</span><b>${$a(Qa(r))}</b></div>
      </div>
      <div class="sm-legend"><span class="sm-hz-key"></span> the band where water stays liquid</div>
      <button class="sm-syzygy" id="sm-syz">When do they line up?</button>
      <div class="sm-syz-note" id="sm-syz-note"></div>
      <div class="sm-rows">${p}</div>
      <div class="sm-scale">Nobody has named any of these. Type a name into any row and it is that world's name from then on; leave it empty and it stays what it is: the third one out. Orbits drawn by the square root of their radius, so every world fits on one page. Distances are given against your own orbit.</div>
    `;let m=this.side.querySelector(`#sm-syz`);m&&m.addEventListener(`click`,()=>{m.textContent=`Looking...`,requestAnimationFrame(()=>{this.showSyzygy(this.lastDays),m.textContent=`When do they line up?`})}),this.fields=[...this.side.querySelectorAll(`.sm-nm`)];for(let t of this.fields){let n=Number(t.dataset.i),r=e.planets[n],i=n===e.homeIndex;t.addEventListener(`input`,()=>{let e=t.value.trim();r.given=e.length>0?e:void 0,this.labels[n].textContent=co(r,i)}),t.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===`Escape`)&&t.blur(),e.stopPropagation()})}}toggle(){this.open=!this.open,this.root.classList.toggle(`on`,this.open)}close(){this.open=!1,this.root.classList.remove(`on`)}showSyzygy(e){if(!this.system)return;let t=this.root.querySelector(`#sm-syz-note`),n=Yr(this.system,e);if(!n){t.textContent=`Three worlds are needed to make a line. This system has fewer.`;return}let r=n.inDays/360,i=r<1?`${Math.round(n.inDays)} days`:r<10?`${r.toFixed(1)} years`:`${Math.round(r)} years`,a=Math.floor((e+n.inDays)/360),o=Math.round(n.spreadDeg);t.innerHTML=n.tight?`<b>In ${i}</b> — year ${a}. Every world inside ${o}\u00b0 of one line, all on the same side of the star.`:`<b>In ${i}</b> — year ${a}. Not a true line: the best they manage is ${o}\u00b0 apart, which is the closest this system comes in four centuries. Their years do not divide into one another.`}update(e){if(!this.open||!this.system)return;this.lastDays=e;let t=e/360;this.system.planets.forEach((e,n)=>{let r=e.phase+t/e.period*Math.PI*2,i=this.place(e.radius);this.markers[n].setAttribute(`transform`,`translate(${(Math.cos(r)*i).toFixed(2)} ${(Math.sin(r)*i).toFixed(2)})`)})}},mo=.11,ho={set:Oi.Flat,raise:Oi.Raise,lower:Oi.Lower,smooth:Oi.Smooth},go=[{value:1,label:`1×`,step:.05,title:`The slowest the world runs`},{value:2,label:`2×`,step:.05},{value:4,label:`4×`,step:.05},{value:8,label:`8×`,step:.05},{value:16,label:`16×`,step:.05},{value:32,label:`32×`,step:.05},{value:64,label:`64×`,step:.05},{value:128,label:`128×`,step:.05},{value:256,label:`256×`,step:.125,title:`Eight steps a day instead of twenty`},{value:512,label:`512×`,step:.125,title:`Eight steps a day instead of twenty`},{value:1024,label:`1024×`,step:.25,title:`Four steps a day instead of twenty`},{value:2048,label:`2048×`,step:.25,title:`Four steps a day instead of twenty`},{value:4096,label:`4096×`,step:.25,title:`Four steps a day instead of twenty`},{value:8192,label:`8192×`,step:.25,title:`Four steps a day instead of twenty. People act in longer strides.`}];function _o(e){let t=0;for(let n=0;n<go.length;n++)go[n].value<=e&&(t=n);return t}function vo(e,t){let n=_o(e)+t;return go[Math.max(0,Math.min(go.length-1,n))].value}var yo=2,bo=48,xo=48,So=class{sim;renderer;hud;systemMap;speed=1;paused=!1;selectedMiracle=null;brush={on:!1,mode:`set`,radius:8,target:.62};selection={kind:`none`};canvas;accumulator=0;clockDays=0;favourites=new so;held=new Set;followAvatar=!1;pointerLocked=!1;lastFrame=performance.now();hover={x:0,y:0,on:!1};dragging=!1;spinPlanet=!1;dragMoved=0;pointerId=-1;lastPointer={x:0,y:0};tickCost=.5;lastHydrology=0;painting=!1;lastPaint=0;strokeStarted=0;brushStroke=`set`;lastPaintScreen=null;constructor(e,t,n,r=wr(null),i=0){this.canvas=e,this.sim=new xa(n,r.warmth+i),this.renderer=new _i(e,this.sim),this.hud=new Ua(t,this),this.systemMap=new po(t),this.renderer.camera.lat=.25,this.renderer.camera.altitude=C,this.renderer.camera.update(),this.bindInput(),window.addEventListener(`resize`,()=>this.renderer.resize())}frame=e=>{let t=e??performance.now(),n=Math.min(.25,(t-this.lastFrame)/1e3);if(this.lastFrame=t,this.skipDays>0)this.runSkip(t);else if(!this.paused){let e=n*this.speed/Je();this.clockDays+=e,this.accumulator+=e;let t=360*Je()/Math.max(.001,this.speed),r=Math.max(0,Math.min(1,(t-14)/40));this.renderer.seasonTilt=r*r*(3-2*r);let i=this.spinPlanet?1:this.renderer.camera.systemBlend;if(i>5e-4){for(this.renderer.camera.lon+=e*Math.PI*2*i;this.renderer.camera.lon>Math.PI;)this.renderer.camera.lon-=Math.PI*2;for(;this.renderer.camera.lon<-Math.PI;)this.renderer.camera.lon+=Math.PI*2;this.renderer.camera.update()}let a=this.speed>=500?34:this.speed>=100?26:this.speed>=50?18:11,o=Ge(),s=Math.max(1,Math.floor(a/Math.max(.05,this.tickCost))),c=Math.floor(this.accumulator/o),l=Math.min(c,xo,s);if(this.accumulator-=l*o,this.accumulator>15&&(this.accumulator=15),l>0){let e=performance.now(),t=l;for(;l-->0;)this.sim.tick();this.tickCost+=((performance.now()-e)/t-this.tickCost)*.1,this.applyImpacts()}}if(this.sim.avatar>=0){let e=0,t=0,r=0,i=0;(this.held.has(`w`)||this.held.has(`arrowup`))&&(r+=1),(this.held.has(`s`)||this.held.has(`arrowdown`))&&--r,(this.held.has(`a`)||this.held.has(`arrowleft`))&&--i,(this.held.has(`d`)||this.held.has(`arrowright`))&&(i+=1);let a=this.renderer.camera;if(a.ground){let n=Math.cos(this.sim.avatarFacing),a=Math.sin(this.sim.avatarFacing);e=r*a+i*n,t=r*n-i*a}else e=i,t=r;if(this.sim.walkAvatar(e,t,n),this.followAvatar){let e=this.sim.agents.x[this.sim.avatar],t=this.sim.agents.y[this.sim.avatar];a.lookAt(e,t),a.groundLift=this.groundLiftAt(e,t),a.ground&&(a.heading=this.sim.avatarFacing),a.update()}}if(this.painting&&this.hover.on&&t-this.lastPaint>55&&this.applyStroke(this.hover.x,this.hover.y),this.sim.needsHydrology&&t-this.lastHydrology>250&&(this.lastHydrology=t,this.sim.recomputeHydrologyNow(),this.renderer.markTerrainDirty()),this.skipQuiet){this.hud.update(),this.hud.showSkipProgress(this.skipYearsLeft,this.skipProgress,this.sim),setTimeout(this.frame,0);return}this.renderer.tickAlpha=this.paused?1:Math.max(0,Math.min(1,this.accumulator/Ge()));let r=this.sim.day+this.sim.dayFraction+this.renderer.tickAlpha*Ge();this.systemMap.update(r),this.renderer.dayPhase=r-Math.floor(r),this.renderer.dayDays=r,this.updateMarkers(),this.renderer.render(t/1e3),this.hud.update(),requestAnimationFrame(this.frame)};applyStroke(e,t){let n=this.brush.on?ho[this.brushStroke]:this.selectedMiracle;if(n===null)return!1;let r=performance.now();(this.strokeStarted===0||r-this.lastPaint>400)&&(this.strokeStarted=r),this.lastPaint=r;let i=Fi(this.sim,n,Math.round(e),Math.round(t),mo,this.brush.radius,this.brushStroke===`smooth`?void 0:this.brush.target,(r-this.strokeStarted)/1e3,this.paused?0:this.speed);return i?(this.renderer.markTerrainDirty(),n===Oi.Lightning&&this.renderer.flash(Math.round(e),Math.round(t))):this.painting=!1,i}paintAlong(e,t){let n=this.lastPaintScreen??{x:e,y:t},i=Math.max(3,this.brush.radius*r*this.renderer.camera.pixelsPerTile*.3),a=Math.hypot(e-n.x,t-n.y),o=Math.min(24,Math.max(1,Math.ceil(a/i)));for(let r=1;r<=o;r++){let i=r/o,a=this.renderer.camera.unproject(n.x+(e-n.x)*i,n.y+(t-n.y)*i);if(a&&!this.applyStroke(a.x,a.y))break}this.lastPaintScreen={x:e,y:t}}brushWouldIdle(){if(!this.hover.on||this.brush.mode===`smooth`)return!1;let e=this.sim.world,t=Math.round(this.hover.y);if(!e.inBounds(t))return!1;let n=e.elevation[e.idx(e.wrapX(Math.round(this.hover.x)),t)],r=this.brush.target;return this.brush.mode===`set`?Math.abs(n-r)<.002:this.brush.mode===`raise`?n>=r-.002:n<=r+.002}updateMarkers(){let e=this.renderer.markers;e.length=0;let t=this.brush.on?ho[this.brush.mode]:this.selectedMiracle;if(t!==null&&this.hover.on){let n=Ai[t],i=this.sim.divinity.mana>=n.cost,a=this.brush.radius*r,o=this.brush.on&&this.brushWouldIdle();e.push({x:this.hover.x,y:this.hover.y,r:a,color:o?[124,132,148]:i?[227,184,105]:[200,101,78],a:o?.45:.75})}let n=this.renderer.camera,i=this.selection;if(!(n.ground&&i.kind===`agent`&&this.sim.isAvatar(i.id))&&i.kind===`agent`&&this.sim.agents.alive[i.id])e.push({x:this.renderer.agentScreenX(i.id),y:this.renderer.agentScreenY(i.id),r:Math.max(1.2,22/n.pixelsPerTile),color:[255,255,255],a:.85});else if(i.kind===`settlement`){let t=this.sim.settlements.get(i.id);t&&e.push({x:t.x,y:t.y,r:Math.max(2.5,40/n.pixelsPerTile),color:[255,255,255],a:.7})}}bindInput(){let e=this.canvas;e.addEventListener(`pointerdown`,t=>{if(e.setPointerCapture(t.pointerId),this.pointerId=t.pointerId,this.dragging=!0,this.dragMoved=0,this.lastPointer={x:t.clientX,y:t.clientY},t.button===2){this.painting=!1;return}if(this.brush.on&&t.altKey){this.pickBrushTarget()&&this.toast(`Brush level set to the ground here`),this.dragging=!1;return}this.brushStroke=this.brush.on&&t.shiftKey&&(this.brush.mode===`raise`||this.brush.mode===`lower`)?this.brush.mode===`raise`?`lower`:`raise`:this.brush.mode,(this.brush.on||this.selectedMiracle!==null)&&(this.painting=!0,this.lastPaint=0,this.lastPaintScreen={x:t.clientX,y:t.clientY})}),e.addEventListener(`pointermove`,t=>{let n=this.renderer.camera.unproject(t.clientX,t.clientY);if(this.hover=n?{x:n.x,y:n.y,on:!0}:{x:0,y:0,on:!1},!this.dragging||t.pointerId!==this.pointerId)return;let r=t.clientX-this.lastPointer.x,i=t.clientY-this.lastPointer.y;this.dragMoved+=Math.abs(r)+Math.abs(i),this.painting?this.paintAlong(t.clientX,t.clientY):this.dragMoved>4&&(e.classList.add(`panning`),this.renderer.camera.rotate(r,i)),this.lastPointer={x:t.clientX,y:t.clientY}});let t=t=>{if(t.pointerId!==this.pointerId)return;let n=this.painting;this.dragging=!1,this.painting=!1,this.lastPaintScreen=null,this.pointerId=-1,e.classList.remove(`panning`),this.dragMoved<=4&&!n&&!this.brush.on&&this.onClick(t.clientX,t.clientY)};e.addEventListener(`pointerup`,t),e.addEventListener(`pointercancel`,t),e.addEventListener(`pointerleave`,()=>{this.hover.on=!1,this.painting=!1}),e.addEventListener(`wheel`,e=>{e.preventDefault();let t=Math.exp(-e.deltaY*.0016);this.renderer.camera.zoomAt(t,e.clientX,e.clientY)},{passive:!1}),e.addEventListener(`contextmenu`,e=>{e.preventDefault(),!(this.dragMoved>4)&&(this.selectMiracle(null),this.setBrush(!1))}),document.addEventListener(`pointerlockchange`,()=>{this.pointerLocked=document.pointerLockElement===e,!this.pointerLocked&&this.sim.avatar>=0&&this.toast(`Click the world to look around again.`)}),e.addEventListener(`mousemove`,e=>{if(!this.pointerLocked||!this.renderer.camera.ground)return;let t=this.renderer.camera;this.sim.turnAvatar(e.movementX*-.0022),t.pitch=Math.max(-.6,Math.min(.22,t.pitch-e.movementY*.0018)),t.heading=this.sim.avatarFacing,t.update()}),window.addEventListener(`keyup`,e=>this.held.delete(e.key.toLowerCase())),window.addEventListener(`blur`,()=>this.held.clear()),window.addEventListener(`keydown`,e=>{if(this.sim.avatar>=0&&this.held.add(e.key.toLowerCase()),e.key===` `)e.preventDefault(),this.togglePause();else if(e.key===`Enter`)e.preventDefault(),this.spinPlanet=!this.spinPlanet,this.toast(this.spinPlanet?`The world turns — the sun holds still, and the ground rolls past`:`The view turns — the world holds still beneath you`);else if(e.key===`g`||e.key===`G`)this.toggleAvatar();else if(e.key===`f`||e.key===`F`)this.sim.avatar>=0&&(this.followAvatar=!this.followAvatar,this.toast(this.followAvatar?`The view follows you.`:`The view is your own again.`));else if(e.key===`0`)this.evolveStar();else if(e.key===`l`||e.key===`L`)this.seedLife();else if(e.key===`Escape`)this.selectMiracle(null),this.setBrush(!1),this.systemMap.close(),this.selection={kind:`none`};else if(e.key===`Tab`){e.preventDefault();let t=$r.findIndex(e=>e.id===this.renderer.overlay);this.renderer.overlay=$r[(t+1)%$r.length].id}else if(e.key>=`1`&&e.key<=`9`){let t=Number(e.key)-1;if(t<ki.length){let e=ki[t];this.selectMiracle(this.selectedMiracle===e?null:e)}}else e.key===`m`||e.key===`M`?this.systemMap.toggle():e.key===`b`||e.key===`B`?this.setBrush(!this.brush.on):e.key===`,`||e.key===`<`?this.setBrushTarget(this.brush.target-.02):e.key===`.`||e.key===`>`?this.setBrushTarget(this.brush.target+.02):e.key===`[`?this.setBrushRadius(this.brush.radius/1.35):e.key===`]`?this.setBrushRadius(this.brush.radius*1.35):e.key===`+`||e.key===`=`?this.setSpeed(vo(this.speed,1)):e.key===`-`&&this.setSpeed(vo(this.speed,-1))})}onClick(e,t){if(this.renderer.camera.ground&&!this.pointerLocked){this.canvas.requestPointerLock?.();return}let n=this.renderer.camera.unproject(e,t);if(!n)return;let r=n.x,i=n.y;if(this.selectedMiracle!==null){Fi(this.sim,this.selectedMiracle,Math.round(r),Math.round(i),1,this.brush.radius)?(this.renderer.markTerrainDirty(),this.selectedMiracle===Oi.Lightning&&this.renderer.flash(Math.round(r),Math.round(i))):this.toast(`Not enough faith. Your people must worship first.`);return}this.pick(r,i)}pick(e,t){let n=this.sim.agents,r=Math.max(1.2,14/this.renderer.camera.pixelsPerTile),i=-1,a=r*r;if(this.sim.index.query(e,t,r,n,r=>{let o=n.d2(r,e,t);o<a&&(a=o,i=r)}),i>=0){this.selection={kind:`agent`,id:i};return}let o=-1,s=Math.max(4,40/this.renderer.camera.pixelsPerTile)**2;for(let n of this.sim.settlements.list){if(!n.alive||!this.renderer.camera.faces(n.x,n.y))continue;let r=this.sim.world.dx(e,n.x),i=n.y-t,a=r*r+i*i;a<s&&(s=a,o=n.id)}this.selection=o>=0?{kind:`settlement`,id:o}:{kind:`none`}}skipDays=0;skipReturn={speed:1,paused:!1};skipTotal=360;skipBusyMs=0;skipSlices=0;skipStartedAt=0;skipYear(e=1){this.skipDays>0||(this.skipReturn={speed:this.speed,paused:this.paused},this.skipTotal=360*e,this.skipBusyMs=0,this.skipSlices=0,this.skipStartedAt=performance.now(),this.skipDays=this.skipTotal,this.paused=!1,We(e>1?1:.25),this.toast(e===1?`Skipping a year...`:`Skipping ${e} years...`))}get skipQuiet(){return this.skipDays>0&&this.skipTotal>540}get skipping(){return this.skipDays>0}get skipProgress(){return this.skipDays>0?1-this.skipDays/Math.max(1,this.skipTotal):1}get skipYearsLeft(){return Math.ceil(this.skipDays/360)}runSkip(e){let t=this.skipTotal>540?100:60,n=Ge(),r=performance.now(),i=0,a=Math.ceil(this.skipDays/n);for(;a-->0&&(this.sim.tick(),i++,!(!(i&7)&&performance.now()-r>=t)););let o=performance.now()-r;if(i>0&&(this.tickCost+=(o/i-this.tickCost)*.1),this.skipBusyMs+=o,this.skipSlices++,this.applyImpacts(),this.skipDays-=i*n,this.clockDays+=i*n,this.skipDays<=0){this.skipDays=0,this.setSpeed(this.skipReturn.speed),this.paused=this.skipReturn.paused,this.hud.hideSkipProgress();let e=Math.round(this.skipTotal/360);this.toast(`${e===1?`A year passes`:`${e} years pass`}. It is year ${Math.floor(this.sim.day/360)}.`)}}setSpeed(e){this.speed=e,this.paused=!1,We(go[_o(e)].step)}async saveWorld(){let e=Ji(this.sim,{star:this.renderer.star.id,sky:this.renderer.sky.id,size:Do(),kind:this.renderer.parent?`moon`:`planet`,moons:this.renderer.moons.length,orbit:this.renderer.orbit.id,planetNames:this.renderer.system?.planets.map(e=>e.given??null)}),t=await Xi(e),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=Qi(e),r.click(),URL.revokeObjectURL(n);let i=(t.size/1048576).toFixed(1);this.toast(`World saved — day ${this.sim.day}, ${i} MB`)}async loadWorld(e){let t=await Zi(e);qe(Qa(Za(t.size)));let n=wr(t.star),r=Mr(t.orbit??null);this.renderer.orbit=r,this.sim=new xa(t.seed,n.warmth+r.warmth);let i=Yi(this.sim,t);this.renderer.star=n,this.renderer.sky=dr(t.sky);let a=Za(t.size);this.renderer.worldRadius=a.radiusScale,this.renderer.moons=no(t.seed,t.moons??1),this.renderer.parent=t.kind===`moon`?io(t.seed):null,this.renderer.buildSystem(t.seed);let o=this.renderer.system;o&&(t.planetNames?.forEach((e,t)=>{o.planets[t]&&e&&(o.planets[t].given=e)}),this.systemMap.build(o,n,r,a)),this.selection={kind:`none`},this.selectedMiracle=null,this.setBrush(!1),this.paused=!0,this.accumulator=0,this.clockDays=this.sim.day+this.sim.dayFraction,this.renderer.markTerrainDirty(),ko(t.seed,this.renderer.sky.id,n.id,Za(t.size).id),this.hud.update(),this.toast(`Loaded day ${i.day} — ${i.population} souls. Paused.`)}get dayLength(){return Je()}togglePause(){this.paused=!this.paused}selectMiracle(e){let t=e!==this.selectedMiracle;this.selectedMiracle=e,e!==null&&(this.brush.on=!1,t&&this.takeNaturalSize(e)),this.hud.setHintFromSelection()}focusOn(e,t){let n=this.renderer.camera;n.lookAt(e,t),n.altitude>.22&&(n.altitude=.22,n.update())}takeNaturalSize(e){this.setBrushRadius(Ai[e].radius)}strikes=new Map;applyImpacts(){let e=this.renderer.impacts;if(e.length===0&&this.strikes.size===0)return;let t=new Set;for(let n of e){t.add(n.name);let e=this.strikes.get(n.name);e?this.sim.impact(e.lon,e.lat,n.angle,n.depth,n.name,!1):(this.strikes.set(n.name,{lon:n.lon,lat:n.lat}),this.sim.impact(n.lon,n.lat,n.angle,n.depth,n.name,!0),this.renderer.markTerrainDirty())}for(let e of[...this.strikes.keys()])t.has(e)||this.strikes.delete(e)}setBrush(e){let t=this.brush.on;this.brush.on=e,e&&(this.selectedMiracle=null,t||this.takeNaturalSize(ho[this.brush.mode])),this.hud.setHintFromSelection()}setBrushMode(e){this.brush.mode=e,this.brushStroke=e,this.setBrush(!0)}setBrushRadius(e){this.brush.radius=Math.max(yo,Math.min(bo,Math.round(e*10)/10)),this.hud.setHintFromSelection()}setBrushTarget(e){this.brush.target=Math.max(0,Math.min(1,e)),this.hud.setHintFromSelection()}pickBrushTarget(){if(!this.hover.on)return!1;let e=this.sim.world,t=e.idx(e.wrapX(Math.round(this.hover.x)),Math.round(this.hover.y));return e.inBounds(Math.round(this.hover.y))?(this.setBrushTarget(e.elevation[t]),!0):!1}setStar(e){e!==this.renderer.star.id&&(ko(wo(),this.renderer.sky.id,wr(e).id,void 0,!0),location.reload())}evolveStar(){if(this.supernovaTimer!==0)return;let e=xr(this.renderer.star.id);if(!e){this.toast(`Nothing left to happen to it. What is up there is already dead.`);return}let t=wr(e.to);if(this.sim.chronicle.add(this.sim.day,P.World,2,`The sky changes: ${e.story}.`),e.change===`supernova`){this.renderer.star=Sr,this.scorchTheWorld(),this.toast(`The star tears itself apart.`),this.supernovaTimer=window.setTimeout(()=>{this.supernovaTimer=0,this.settleUnder(t),this.toast(`What is left is ${Co(t.name)}.`)},3200);return}this.settleUnder(t);let n=e.change===`swell`?`swells`:e.change===`cool`?`cools`:`collapses`;this.toast(`The star ${n}. It is ${Co(t.name)} now.`)}supernovaTimer=0;settleUnder(e){let t=this.sim.world;this.renderer.star=e,t.starWarmth=e.warmth+this.renderer.orbit.warmth,t.settleClimate(),t.classifyBiomes(),t.terrainDirty=!0,this.engulfPlanets(e),this.renderer.system&&this.systemMap.build(this.renderer.system,e,this.renderer.orbit,Za(Do()));let n=Ar(Nr(e.warmth,this.renderer.orbit.warmth));!t.sterile&&n?(t.boilDry(this.sim.heap),this.sim.chronicle.add(this.sim.day,P.Death,2,`The seas go. What is left of them is salt on rock, and then not even that.`)):t.sterile&&!n&&(t.refillOceans(this.sim.heap),this.sim.chronicle.add(this.sim.day,P.World,2,`The sky cools enough to hold water again, and it rains. It goes on raining for longer than anything alive would have measured, and the old sea beds fill to their old shorelines.`),this.toast(`The rain begins. The oceans are coming back.`))}seedLife(){let e=this.sim.world;if(e.sterile){this.toast(`Nothing can live here. The seas boiled away and they are not coming back.`);return}let t=e.meanLandTemp();if(e.thawedLand()<.02){this.toast(`White from pole to pole at ${Math.round(t)}\u00b0C. There is no ground out from under the ice to put anyone on.`);return}let n=this.sim.reseed();if(n<=0){this.toast(`There is nowhere on it worth standing. No water anyone could reach.`);return}let r=!jr(t);this.sim.chronicle.add(this.sim.day,P.Life,2,`Life begins again. ${n} people open their eyes on a world that averages ${Math.round(t)}\u00b0C, under a sky that has changed since the last of them.`+(r?` It is not a world that wants them.`:``)),this.toast(`Life begins again: ${n} people, on a world at ${Math.round(t)}\u00b0C.`+(r?` They will have to be quick.`:``))}engulfPlanets(e){let t=this.renderer.system,n=e.reach??0;if(!t||n<=0)return;let r=t.planets[t.homeIndex],i=t.planets.filter((e,r)=>r!==t.homeIndex&&e.radius<n);if(i.length>0){let e=i.map(e=>Br(t,t.planets.indexOf(e)));t.planets=t.planets.filter((e,r)=>r===t.homeIndex||e.radius>=n),t.homeIndex=t.planets.indexOf(r);let a=e.length===1?e[0]:e.slice(0,-1).join(`, `)+` and `+e[e.length-1],o=e.length===1;this.sim.chronicle.add(this.sim.day,P.World,2,a+(o?` is`:` are`)+` inside the star now`+(o?`. It is gone.`:`. They are gone.`)),this.toast(`The star closes over `+a+`.`)}if(r.radius<n){let e=this.sim.agents,t=0;for(let n=0;n<e.alive.length;n++)e.alive[n]&&(e.kill(n),t++);this.sim.world.sterile||this.sim.world.boilDry(this.sim.heap),this.sim.chronicle.add(this.sim.day,P.Death,2,`The star’s edge passes the world’s orbit. The sky closes, the air goes, and `+t+` people end with it. What is left is a cinder going round inside a star.`),this.toast(`The world is inside the star.`)}}scorchTheWorld(){let e=this.sim.world;for(let t=0;t<e.scorch.length;t++)e.scorch[t]=Math.min(1,e.scorch[t]+.85),e.vegetation[t]*=.15,e.trees[t]*=.05,e.game[t]*=.1;e.terrainDirty=!0;let t=this.sim.agents,n=0;for(let e=0;e<t.alive.length;e++)t.alive[e]&&this.sim.rng.chance(.66)&&(t.kill(e),n++);n>0&&this.sim.chronicle.add(this.sim.day,P.Death,2,`${n} die in the light of it, in the time it takes to look up.`)}toggleAvatar(){if(this.sim.avatar>=0){this.sim.ascend(),this.followAvatar=!1,this.held.clear(),this.renderer.camera.ground=!1,this.renderer.camera.pitch=0,this.renderer.camera.altitude=1.6,this.renderer.camera.update(),document.pointerLockElement&&document.exitPointerLock(),this.toast(`You leave the body behind.`);return}let e=this.renderer.camera,t=e.unproject(this.canvas.clientWidth/2,this.canvas.clientHeight/2),n=this.sim.world,r=t?t.x:n.w/2,i=t?t.y:n.h/2;if(n.isWaterCell(n.idx(n.wrapX(Math.round(r)),Math.max(1,Math.min(n.h-2,Math.round(i)))))){let e=-1,t=1/0;for(let a of this.sim.settlements.living()){let o=n.dist(r,i,a.x,a.y);o<t&&(t=o,e=a.id)}let a=e>=0?this.sim.settlements.get(e):null;a&&(r=a.x,i=a.y)}let a=this.sim.descend(r,i);if(a<0){this.toast(`There is no room in the world for another body.`);return}this.followAvatar=!0,this.selection={kind:`agent`,id:a},e.ground=!0,e.heading=0,e.pitch=0,e.lookAt(this.sim.agents.x[a],this.sim.agents.y[a]),e.altitude=.015,e.groundLift=this.groundLiftAt(this.sim.agents.x[a],this.sim.agents.y[a]),e.update(),this.canvas.requestPointerLock?.(),this.toast(`You walk among them. WASD to move, F to free the view, G to leave.`)}groundLiftAt(e,t){let n=this.sim.world,r=n.idx(n.wrapX(Math.round(e)),Math.max(0,Math.min(n.h-1,Math.round(t))));return Math.max(0,n.elevation[r]-o)*this.renderer.camera.reliefAmplitude}setSky(e){this.renderer.sky=dr(e),ko(wo(),this.renderer.sky.id,this.renderer.star.id)}regenerate(){ko(Math.random()*4294967295>>>0,this.renderer.sky.id,this.renderer.star.id,void 0,!0),location.reload()}toast(e){this.hud.toast(e)}};function Co(e){let t=e.toLowerCase();return`${`aeiou`.includes(t[0])?`an`:`a`} ${t}`}function wo(){let e=/seed=(\d+)/.exec(location.hash);return e?Number(e[1])>>>0:Math.random()*4294967295>>>0}function To(){let e=/sky=([a-z]+)/.exec(location.hash);return dr(e?e[1]:null).id}function Eo(){let e=/star=([a-z]+)/.exec(location.hash);return wr(e?e[1]:null).id}function Do(){let e=/size=([a-z]+)/.exec(location.hash);return Za(e?e[1]:null).id}function Oo(){let e=/orbit=(-?[\d.]+)/.exec(location.hash);if(e)return Or(Number(e[1]));let t=/orbit=([a-z]+)/.exec(location.hash);return Mr(t?t[1]:null)}function ko(e,t,n,r,i=!1,a){let o=r??Do(),s=(a??Oo()).warmth.toFixed(1);location.hash=`seed=${e}&sky=${t}&star=${n}&size=${o}&orbit=${s}${i?`&go=1`:``}`}var Ao=document.getElementById(`stage`),jo=document.getElementById(`ui`);function Mo(e,t,n,r,i,a=`planet`,o=1,s=1,c=!1,l=null,u=4.5){let d=wr(t),f=Za(r);qe(Qa(f));let p=new So(Ao,jo,e,d,i.warmth+(l?yr(l):0));p.renderer.sky=dr(n),p.renderer.star=d,p.sim.star=d,p.sim.pulseStrength=s,p.sim.pulseDays=u*360,p.renderer.rings=c?[1.35,2.45]:[0,0],p.renderer.companion=l,p.renderer.orbit=i,p.renderer.buildSystem(e),p.renderer.moons=no(e,o),p.renderer.parent=a===`moon`?io(e):null,p.renderer.worldRadius=f.radiusScale,p.renderer.system&&p.systemMap.build(p.renderer.system,d,i,f),ko(e,p.renderer.sky.id,d.id,f.id,!1,i);let m=window;m.godsim=p,m.__castMiracle=Fi,requestAnimationFrame(p.frame),p.paused=!1}try{let e=/(?:^|&|#)go=1(?:&|$)/.test(location.hash),t=/seed=(\d+)/.exec(location.hash);e?(Mo(wo(),Eo(),To(),Do(),Oo()),history.replaceState(null,``,location.hash.replace(/&?go=1/,``))):oo(jo,{seed:t?Number(t[1])>>>0:void 0,star:wr(Eo()),sky:dr(To()),size:Za(Do()),orbit:Oo()}).then(e=>Mo(e.seed,e.star.id,e.sky.id,e.size.id,e.orbit,e.kind,e.moons,e.pulse,e.rings,e.companion,e.pulseYears))}catch(e){throw jo.innerHTML=`<div style="position:absolute;inset:0;display:grid;place-items:center;padding:40px;text-align:center;pointer-events:auto">
       <div>
         <h2 style="color:#e3b869;letter-spacing:.2em">GOD SIM FAILED TO WAKE</h2>
         <pre style="color:#8b93a3;white-space:pre-wrap;font-size:12px">${String(e instanceof Error?e.message:e)}</pre>
       </div>
     </div>`,e}