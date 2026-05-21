export const earthVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vNw;
  varying vec3 vWPos;

  void main() {
    vUv = uv;
    vN = normalize(normalMatrix * normal);
    vNw = normalize(mat3(modelMatrix) * normal);
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWPos = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

export const earthFragmentShader = /* glsl */ `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D cloudMap;
  uniform sampler2D specMap;
  uniform vec3 sunDir;
  uniform vec3 atmColor;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vNw;
  varying vec3 vWPos;

  void main() {
    vec3 n = normalize(vNw);
    vec3 s = normalize(sunDir);
    float d = dot(n, s);
    float dayBlend = smoothstep(-0.12, 0.28, d);

    vec3 day = texture2D(dayMap, vUv).rgb * 1.08;
    vec3 night = texture2D(nightMap, vUv).rgb;
    vec3 col = mix(night * 1.25, day, dayBlend);

    float ocean = 1.0 - texture2D(specMap, vUv).r;
    vec3 viewDir = normalize(cameraPosition - vWPos);
    vec3 h = normalize(s + viewDir);
    float spec = pow(max(dot(n, h), 0.0), 42.0) * ocean * dayBlend;
    col += vec3(1.0, 0.92, 0.75) * spec * 0.65;

    vec2 cUv = vec2(vUv.x + uTime * 0.002, vUv.y);
    float cloud = texture2D(cloudMap, cUv).r;
    vec3 cloudCol = mix(vec3(0.08), vec3(1.15), dayBlend) * cloud;
    col = mix(col, col + cloudCol * 0.9, cloud * 0.88);

    float rim = 1.0 - max(dot(normalize(vN), viewDir), 0.0);
    rim = pow(rim, 2.0);
    col += atmColor * rim * (0.45 + dayBlend * 0.55);

    col = pow(col, vec3(0.92));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const atmoVertexShader = /* glsl */ `
  varying vec3 vN;
  varying vec3 vNw;
  void main() {
    vN = normalize(normalMatrix * normal);
    vNw = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const atmoFragmentShader = /* glsl */ `
  uniform vec3 glowColor;
  uniform float c;
  uniform float p;
  varying vec3 vN;
  void main() {
    float i = pow(c - dot(vN, vec3(0.0, 0.0, 1.0)), p);
    gl_FragColor = vec4(glowColor * i * 1.35, i);
  }
`;
