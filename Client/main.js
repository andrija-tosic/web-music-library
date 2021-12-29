import { Artist } from "./Models/Artist.js"
import { Playlist } from "./Models/Playlist.js"
import { Release } from "./Models/Release.js"
import { Track } from "./Models/Track.js"
import { MusicLibrary } from "./Models/MusicLibrary.js"
import { MusicLibraryView  } from "./Views/MusicLibraryView.js";

const musicLibrary1 = new MusicLibrary('andrija');
const musicLibraryView1 = new MusicLibraryView(musicLibrary1);

musicLibraryView1.render(document.body);

const musicLibrary2 = new MusicLibrary();
const musicLibraryView2 = new MusicLibraryView(musicLibrary2);

//musicLibraryView2.render();