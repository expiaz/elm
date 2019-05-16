/*
import {assert} from "../utils"

assert(navigator.camera != null, 'camera missing');
assert(navigator.camera.getPicture != null, 'camera::getPicture missing');

const camera = navigator.camera;
*/

/**
 *
 * @return {Promise<string>}
 */
async function shot() {
    return new Promise((resolve, reject) => {
        navigator.camera.getPicture(
            data => resolve(data),
            err => reject(err),
            {
                quality: 50,
                destinationType: navigator.camera.DestinationType.DATA_URL,
                saveToPhotoAlbum: false,
                targetWidth: 100,
                encodingType: navigator.camera.EncodingType.JPEG
            }
        )
    })
}

export default {
    shot
};