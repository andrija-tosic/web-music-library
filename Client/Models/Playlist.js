import {Track} from "../Models/Track.js";

export class Playlist {
    constructor(id, name, numberOfTracks, length, tracks, musicLibrary) {
        this.id = id;
        this.name = name;
        this.numberOfTracks = numberOfTracks;
        this.length = length;
        this.tracks = tracks;
        this.musicLibrary = musicLibrary;
    }

    async loadPlaylistTracks() {
        const res = await fetch(`https://localhost:5001/Playlist/GetTracksFromPlaylist/${this.id}`);

        const data = await res.json();

        this.tracks = [];
        this.length = 0;
        this.numberOfTracks = 0;

        data.forEach(track => {
            this.tracks.push(new Track(track.id, track.number, track.name, track.artists, track.release, track.rating, track.duration));
            this.length += track.duration;
            this.numberOfTracks++;
        });

        return this.tracks;
    }

    async renamePlaylist(name) {
        const res = await fetch(`https://localhost:5001/Playlist/RenamePlaylist/${this.id}/${name}`, {
            method: "PATCH"
        });

        if (res.ok) {
            this.name = name;
            return true;
        }
        else {
            return false;
        }
    }

    async removeTrackFromPlaylist(track) {
        const res = await fetch(`https://localhost:5001/Playlist/RemoveTrackFromPlaylist/${track.number}/${this.id}`, {
            method: "PATCH"
        });

        if (res.ok) {
            this.tracks = this.tracks.filter(t => t.number != track.number);

            this.length -= track.duration;
            this.numberOfTracks--;
            this.tracks.map(t => {
                if (t.number > track.number)
                    t.number--;
            });

            return true;
        }
        else {
            return false;
        }
    }

}