import { Artist } from "../Models/Artist.js"
import { Playlist } from "../Models/Playlist.js"
import { Release } from "../Models/Release.js"
import { Track } from "../Models/Track.js"


export class MusicLibrary {
    constructor(owner) {
        this.owner = owner;
        this.playlists = [];
    }

    async getPlaylists() {

        const res = await fetch("https://localhost:5001/Playlist/GetPlaylists");

        const data = await res.json();

        this.playlists = [];

        console.log(data);

        data.forEach(playlist => {
            let p = new Playlist(playlist.id, playlist.name, playlist.numberOfTracks, playlist.length);
            this.playlists.push(p);
        });

        return this.playlists;
    }

    async loadPlaylistTracks(id) {
        const res = await fetch(`https://localhost:5001/Playlist/GetTracksFromPlaylist/${id}`);

        const data = await res.json();

        const playlist = this.playlists.filter(p => p.id == id)[0];

        playlist.tracks = [];

        data.forEach(track => {
            console.log(track);
            playlist.tracks.push(new Track(track.id, track.number, track.name, track.artists, track.release, track.rating, track.duration));
        });

        return playlist;
    }

    async addPlaylist(name) {
        const playlist = new Playlist(0, name, 0, 0, null);
        const res = await fetch(`https://localhost:5001/Playlist/AddPlaylist/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playlist)
        });

        return await res.ok;
    }

    async renamePlaylist(id, name) {
        const res = await fetch(`https://localhost:5001/Playlist/RenamePlaylist/${id}/${name}`, {
            method: "PATCH"
        });

        return res.ok;
    }

    async deletePlaylist(id) {
        const res = await fetch(`https://localhost:5001/Playlist/DeletePlaylist/${id}`, {
            method: "DELETE"
        });

        return res.ok;
    }

    async changeTrackRating(trackId, rating) {
        const res = await fetch(`https://localhost:5001/Track/ChangeRating/${trackId}/${rating}`, {
            method: "PATCH"
        });
       
        return res.ok;
    }

    async matchArtists(artistName) {
        const res = await fetch(`https://localhost:5001/Artist/MatchArtists/${artistName}`, {
            method: "GET"
        });

        if (res.ok) {
            let artists = await res.json();
            return artists;
        }
        else
            return null;
    }
}