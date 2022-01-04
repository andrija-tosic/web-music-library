import { MusicLibrary } from "./Models/MusicLibrary.js"
import { MusicLibraryView  } from "./Views/MusicLibraryView.js";

const musicLibrary1 = new MusicLibrary('Andrija');
const musicLibraryView1 = new MusicLibraryView(musicLibrary1);

musicLibraryView1.render(document.body);