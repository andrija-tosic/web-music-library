import { Artist } from "../Models/Artist.js"
import { Playlist } from "../Models/Playlist.js"
import { Release } from "../Models/Release.js"
import { Track } from "../Models/Track.js"


export class MusicLibrary {
    constructor(owner) {
        this.owner = owner;
    }

    async getPlaylists() {
        let playlists = [];

        const res = await fetch("https://localhost:5001/Playlist/GetPlaylists");

        const data = await res.json();

        data.forEach(playlist => {
            let p = new Playlist(playlist.id, playlist.name, playlist.tracksNum, playlist.length);
            playlists.push(p);

            console.log(playlists, "fun", playlists.length)
        });

        return playlists;
    }

    async loadPlaylistTracks(id) {
        const res = await fetch(`https://localhost:5001/Playlist/GetTracksFromPlaylist/${id}`);

        const data = await res.json();

        let tracks = [];

        data.forEach(track => {
            console.log(track.duration);
            tracks.push(new Track(track.id, track.number, track.name, track.artists, track.release, track.rating, track.duration));
        });

        console.log(tracks, "loaded playlist tracks");

        return tracks;
    }

    async addPlaylist(name) {
        const res = await fetch("https://localhost:5001/Track")
    }
}