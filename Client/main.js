import { MusicLibrary } from "./Models/MusicLibrary.js"
import { MusicLibraryView } from "./Views/MusicLibraryView.js";

async function getMusicLibraries() {
    const res = await fetch("https://musiclibrary.azurewebsites.net/MusicLibrary/GetMusicLibraries");

    if (res.ok) {
        const data = await res.json();

        for (const musicLibrary of data) {
            const library = new MusicLibrary(musicLibrary.id, musicLibrary.owner);
            const musicLibraryView = new MusicLibraryView(library);
            await musicLibraryView.initRender(document.body);
        }
    }
}

await getMusicLibraries();