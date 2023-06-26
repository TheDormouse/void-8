// fragment shader
#version 330 core
out vec4 FragColor;

in vec2 TexCoord;
in vec3 pos;

uniform float time;

void main()
{
    // create a holographic color effect
    float r = 0.5 * (1.0 + sin(pos.x + time));
    float g = 0.5 * (1.0 + sin(pos.y + 2.0 * time / 3.0));
    float b = 0.5 * (1.0 + cos(pos.z + time / 4.0));

    // use the colors to create a holographic interference pattern
    vec3 color = vec3(r, g, b);
    float brightness = abs(sin(length(pos) + time));
    color *= brightness;

    // output the final color
    FragColor = vec4(color, 1.0);
}