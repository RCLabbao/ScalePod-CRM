const e=new Map;setInterval(()=>{const t=Date.now();for(const[n,o]of e)t>=o.resetAt&&e.delete(n)},6e4).unref();
