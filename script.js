class particle {
    constructor(lifetime, color, size, canvas) {
        this.max_z = 5;
        this.z = Math.random() * Math.floor(this.max_z);
        this.max_life = lifetime;
        this.lifetime = lifetime;
        this.color = color;
        this.r = color[0];
        this.g = color[1];
        this.b = color[2];
        this.a = ([3] * this.z) / this.max_z;
        this.size = size * this.z;
        this.canvas = canvas;
        this.xpos = Math.floor(Math.random() * Math.floor(this.canvas.width + 100) - 50);
        this.fall_vec = (10 + Math.floor(Math.random() * Math.floor(3))) * this.z;
        this.ypos = -this.fall_vec;
        this.ypos_max = this.canvas.height-(this.size/2);
        this.prev_p = this.ypos - this.fall_vec;
    }

    new_pos(){
        if (this.prev_p === this.ypos){
            this.lifetime -= 1;
            this.a = this.a - (this.a * (this.lifetime / this.max_life));
        }
        this.prev_p = this.ypos;
        this.ypos += this.fall_vec;
        if (this.ypos >= this.ypos_max){
            this.ypos = this.ypos_max
        }
    }

    get pos(){
        return [this.xpos, this.ypos];
    }

    get display_color(){
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
    }

    set pos(pos){
        this.xpos = pos[0];
        this.ypos = pos[1];
    }
}


class modifier {
    constructor(particles, parameter, max_value){
        this.particles = particles
        this.parameter = parameter;
        this.value = 0;
        this.max_value = max_value;
    }

    action(){
        let randsign = Math.random();
        if (randsign <= 0.5){
            randsign = -1;
        }
        this.value = randsign * Math.floor(Math.random() * Math.floor(this.max_value))+ Math.floor(Math.random() * Math.floor(3));
        for (let particle of this.particles){
            particle[this.parameter] = particle[this.parameter] + this.value;
        }
    }
}

function filename(max, current){
    let name = "";
    let len = String(max).length + 1;
    let cur_len = String(current).length;
    let diff = len - cur_len;
    for(i=0; i<diff; i++){
        name += "0";
    }
    name += String(current);
    return name;
}

function download(filename){
    var link = document.createElement('a');
    link.download = filename + '.png';
    link.href = document.getElementById('snow_park').toDataURL();
    link.click();
}

let div = document.getElementsByClassName('snow_generator')[0];
let canvas = document.createElement('canvas');
let bgcolor = "#00000000";
canvas.id = "snow_park";
canvas.width  = 1920;
canvas.height = 1080;
div.appendChild(canvas);

let ctx = canvas.getContext("2d");
ctx.fillStyle = bgcolor;
ctx.fillRect(0, 0, canvas.width, canvas.height);

let max_particles = 15000;
let particles = [];
var max_render = 1000;
var cur_render = 0;

function render_particle(){
    /* Cleaning dead particles*/
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = bgcolor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter((el)=>{
        return el.lifetime != 0; 
    });
    if (particles.length < max_particles){
        for(let i=0; i < 100; i++){
            particles.push(new particle(10, [255, 255, 255, 1], 2, canvas));
        }

    }
    let wind = new modifier(particles, "xpos", 10);
    wind.action();
    for (let particle of particles){
        particle.new_pos();
        ctx.fillStyle = 'green';
        ctx.strokeStyle = particle.display_color;
        ctx.fillStyle = particle.display_color;
        ctx.filter = 'blur('+ Math.floor(Math.abs((particle.max_z / 2) - particle.z)) +'px)';
        ctx.beginPath();
        ctx.arc(particle.xpos, particle.ypos, particle.size, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fill();
    }
    let name = filename(max_render, cur_render);
    download(name);

    cur_render += 1;
    if (cur_render >= max_render){
        clearInterval(loop);
    }
}

var loop = setInterval(render_particle,30);