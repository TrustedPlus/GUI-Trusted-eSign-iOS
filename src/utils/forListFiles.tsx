export function iconSelection(files, length) {
    let img = [];
    for (let i = 0; i < length; i++) { // какое расширение у файлов
        switch (files[i].extension) {
            case "pdf":
                img[i] = require("../../imgs/general/file_pdf.png"); break;
            case "txt":
                img[i] = require("../../imgs/general/file_txt.png"); break;
            case "zip":
                img[i] = require("../../imgs/general/file_zip.png"); break;
            case "docx":
                img[i] = require("../../imgs/general/file_docx.png"); break;
            case "sig":
                img[i] = require("../../imgs/general/file_sig.png"); break;
            case "enc":
                img[i] = require("../../imgs/general/file_enc.png"); break;
            default:
                break;
        }
    }
    return img;
}