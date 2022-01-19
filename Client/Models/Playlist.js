import {Track} from "../Models/Track.js";

export class Playlist {
    constructor(id, name, description, imagePath, numberOfTracks, length, tracks, musicLibraryId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imagePath = imagePath;
        this.numberOfTracks = numberOfTracks;
        this.length = length;
        this.tracks = tracks;
        this.musicLibraryId = musicLibraryId;
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

    async getFullPlaylistInfo() {
        const res = await fetch(`https://localhost:5001/Playlist/GetFullPlaylistInfo/${this.id}`, {
            method: "GET",
        });

        if (res.ok) {
            const playlist = await res.json();
            this.name = playlist.name;
            this.description = playlist.description;
            this.imagePath = playlist.imagePath;

            if (playlist.length == null)
                this.length = 0;
            else
                this.length = playlist.length;
            
            if (playlist.numberOfTracks == null)
                this.numberOfTracks = 0;
            else
                this.numberOfTracks = playlist.numberOfTracks;
            return true;
        }
        else {
            return false;
        }
    }

    async editPlaylist(formData) {
        console.log(this.musicLibraryId, "before");
        const res = await fetch(`https://localhost:5001/Playlist/EditPlaylist/`, {
            method: "PUT",
            body: formData
        });

        this.name = formData.get("name");
        this.description = formData.get("description");
        this.imagePath = formData.get("imagePath");

        console.log(this.musicLibraryId, "after");

        return res;
    }

    async removeTrackFromPlaylist(track) {
        const res = await fetch(`https://localhost:5001/PlaylistTrack/RemoveTrackFromPlaylist/${track.number}/${this.id}`, {
            method: "DELETE"
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