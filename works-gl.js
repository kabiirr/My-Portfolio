/* ==========================================================================
   WebGL renderer for the works canvas (grid.html)
   Draws every visible shot as a finely subdivided plane so the table can bend
   with drag velocity: shots trail like cloth behind their edges, the whole
   table bulges a little at speed, and colour channels split along the motion.
   The DOM tiles stay underneath (transparent) for hit-testing, focus and a11y.
   Returns null when WebGL2 isn't available, and works.js keeps the DOM images.
   ========================================================================== */
window.createWorksGL = function createWorksGL(canvas) {
    'use strict';

    const gl = canvas.getContext('webgl2', { antialias: true, alpha: true, premultipliedAlpha: true });
    if (!gl) return null;

    const VS = `#version 300 es
    in vec2 a_pos;
    uniform vec4 u_rect;   // x, y, w, h in CSS px
    uniform vec2 u_res;    // viewport in CSS px
    uniform vec2 u_vel;    // camera velocity, px per frame (clamped)
    out vec2 v_uv;

    void main() {
        vec2 p = u_rect.xy + a_pos * u_rect.zw;
        // Cloth bend: the middle of each shot trails behind its edges
        p.x -= sin(a_pos.y * 3.14159265) * u_vel.x * 0.9;
        p.y -= sin(a_pos.x * 3.14159265) * u_vel.y * 0.9;
        vec2 ndc = p / u_res * 2.0 - 1.0;
        // Lens: the table bulges towards the viewer as it speeds up
        float speed = min(length(u_vel), 60.0);
        ndc *= 1.0 + (1.0 - clamp(dot(ndc, ndc), 0.0, 2.0)) * speed * 0.0009;
        gl_Position = vec4(ndc.x, -ndc.y, 0.0, 1.0);
        v_uv = a_pos;
    }`;

    const FS = `#version 300 es
    precision highp float;
    in vec2 v_uv;
    uniform sampler2D u_tex;
    uniform vec4 u_crop;    // uv scale.xy, uv offset.zw (object-fit: cover)
    uniform vec2 u_vel;
    uniform float u_dim;    // 0 = normal, 1 = dimmed by another shot's hover
    uniform float u_reveal; // intro wipe, 0 hidden -> 1 shown (from the bottom)
    out vec4 outColor;

    void main() {
        if (v_uv.y < 1.0 - u_reveal) discard;
        vec2 uv = u_crop.zw + v_uv * u_crop.xy;
        vec2 shift = clamp(u_vel * 0.00025, -0.008, 0.008) * u_crop.xy;
        vec3 c = vec3(
            texture(u_tex, uv - shift).r,
            texture(u_tex, uv).g,
            texture(u_tex, uv + shift).b
        );
        float grey = dot(c, vec3(0.299, 0.587, 0.114));
        c = mix(c, vec3(grey), u_dim * 0.3) * (1.0 - u_dim * 0.4);
        outColor = vec4(c, 1.0);
    }`;

    function compile(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
        return s;
    }

    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);

    const u = {};
    ['u_rect', 'u_res', 'u_vel', 'u_tex', 'u_crop', 'u_dim', 'u_reveal'].forEach((n) => (u[n] = gl.getUniformLocation(program, n)));

    // Unit plane, SEG × SEG quads, so the vertex shader has something to bend
    const SEG = 24;
    const verts = [];
    const idx = [];
    for (let y = 0; y <= SEG; y++) for (let x = 0; x <= SEG; x++) verts.push(x / SEG, y / SEG);
    for (let y = 0; y < SEG; y++) {
        for (let x = 0; x < SEG; x++) {
            const i = y * (SEG + 1) + x;
            idx.push(i, i + 1, i + SEG + 1, i + 1, i + SEG + 2, i + SEG + 1);
        }
    }
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
    const count = idx.length;

    const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
    const MAX_TEX = 1200;
    const textures = new Map(); // src -> { tex, w, h }

    function loadTexture(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.decoding = 'async';
            img.onload = () => {
                // Tiles never draw wider than ~600 CSS px, so cap textures to save GPU memory;
                // the full-size file is still what the case view shows.
                let source = img;
                if (img.naturalWidth > MAX_TEX) {
                    const c = document.createElement('canvas');
                    c.width = MAX_TEX;
                    c.height = Math.round(img.naturalHeight * (MAX_TEX / img.naturalWidth));
                    const ctx = c.getContext('2d');
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(img, 0, 0, c.width, c.height);
                    source = c;
                }
                const tex = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, 8);
                textures.set(src, { tex, w: img.naturalWidth, h: img.naturalHeight });
                resolve();
            };
            img.onerror = () => reject(new Error(`texture failed: ${src}`));
            img.src = src;
        });
    }

    let res = { w: 1, h: 1 };

    return {
        load: (srcs) => Promise.all([...new Set(srcs)].map(loadTexture)),

        resize(w, h) {
            const dpr = Math.min(devicePixelRatio || 1, 2);
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            res = { w, h };
            gl.viewport(0, 0, canvas.width, canvas.height);
        },

        /**
         * items: [{ src, x, y, w, h, focusY, zoom, dim, reveal }] in screen CSS px.
         * focusY picks the vertical crop (0 top, 0.5 centre, 1 bottom), like object-position.
         */
        draw(items, vel) {
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.uniform2f(u.u_res, res.w, res.h);
            gl.uniform2f(u.u_vel, vel.x, vel.y);
            gl.uniform1i(u.u_tex, 0);
            gl.activeTexture(gl.TEXTURE0);

            for (const it of items) {
                const t = textures.get(it.src);
                if (!t) continue;
                const ta = it.w / it.h;
                const ia = t.w / t.h;
                let sx = ia > ta ? ta / ia : 1;
                let sy = ia > ta ? 1 : ia / ta;
                sx /= it.zoom;
                sy /= it.zoom;
                gl.bindTexture(gl.TEXTURE_2D, t.tex);
                gl.uniform4f(u.u_rect, it.x, it.y, it.w, it.h);
                gl.uniform4f(u.u_crop, sx, sy, (1 - sx) * 0.5, (1 - sy) * it.focusY);
                gl.uniform1f(u.u_dim, it.dim);
                gl.uniform1f(u.u_reveal, it.reveal);
                gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
            }
        },
    };
};
