import { Client, client } from "@gradio/client";
// import { createRequire } from 'node:module'
import translate from 'translate';
import fs from 'fs';
// const require = createRequire(import.meta.url);
// global.EventSource = require('eventsource');

/**
 * @param {string} image
 * https://huggingface.co/spaces/ECCV2022/dis-background-removal
 */
export const removeBgGradio = async (image) => {
    const getRemoveBg = await Client.connect("mizukidesuu/dis-background-removal");
    // buffer to blob
    // const blob = new Blob([image], { type: 'image/jpeg' });
    const resultRemoveBg = await getRemoveBg.predict("/predict", {
        image
    });
    // const resultRemoveBg = await getRemoveBg.predict("/predict", [image]);
    return resultRemoveBg;
}

/**
 * @param {string} image
 * https://huggingface.co/spaces/ECCV2022/dis-background-removal
 */
export const removeAnimeBgGradio = async (image) => {
    const getRemoveBg = await Client.connect("skytnt/anime-remove-background");
    const resultRemoveBg = await getRemoveBg.predict("/rmbg_fn", {
        img: image
    });
    return resultRemoveBg;
}

// https://huggingface.co/spaces/amirgame197/Remove-Video-Background
export const removeBgVideoGradio = async (video) => { 
    const getRemoveBg = await client("amirgame197/Remove-Video-Background");

    const blob = new Blob([video], { type: 'video/mp4' });
    const resultRemoveBg = await getRemoveBg.predict('/predict', [blob, "Normal"]);
    
    // resultRemoveBg.on('data', log_result);
    console.log(resultRemoveBg);
    return resultRemoveBg;
}

export const translateText = async (text, to) => {
    translate.engine = 'google';
    translate.from = 'auto';
    return await translate(text, to)
}
