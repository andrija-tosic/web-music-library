import { Artist } from "../Models/Artist.js"
import { Playlist } from "../Models/Playlist.js"
import { Release } from "../Models/Release.js"
import { Track } from "../Models/Track.js"


export class MusicLibrary {
    constructor(id, owner) {
        this.id = id;
        this.owner = owner;
        this.playlists = [];
        this.artists = [];
    }

    async getPlaylists() {
        const res = await fetch(`https://localhost:5001/Playlist/GetPlaylists/${this.id}`);

        if (!res.ok)
            return null;

        const data = await res.json();

        this.playlists = [];

        data.forEach(playlist => {
            let p = new Playlist(playlist.id, playlist.name, playlist.numberOfTracks, playlist.length, null, this);
            this.playlists.push(p);
        });

        return this.playlists;
    }

    async addPlaylist(name) {
        const res = await fetch(`https://localhost:5001/Playlist/AddPlaylist/${this.id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(name)
        });

        if (res.ok) {
            const data = await res.json();
            const playlist = new Playlist(data.id, data.name, data.numberOfTracks, data.length, null, this);
            this.playlists.push(playlist);
            return true;
        }
        else {
            return false;
        }
    }

    async deletePlaylist(playlist) {
        const res = await fetch(`https://localhost:5001/Playlist/DeletePlaylist/${this.id}/${playlist.id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            this.playlists.pop(playlist);
            return true;
        }
        else {
            return false;
        }
    }

    async getArtists() {
        const res = await fetch(`https://localhost:5001/Artist/GetArtists`, {
            method: "GET"
        });

        if (res.ok) {
            let data = await res.json();
            this.artists = [];
            data.forEach(artist => {
                this.artists.push(new Artist(artist.id, null, null, artist.artistName, null));
            })
            return this.artists;
        }
        else
            return null;
    }

    async getReleasesFromArtist(artistId) {
        const res = await fetch(`https://localhost:5001/Release/GetReleasesFromArtist/${artistId}`, {
            method: "GET"
        });

        if (res.ok) {
            const data = await res.json();
            
            const artist = this.artists.find(a => a.id == artistId);

            artist.releases = [];
            data.forEach(release => {
                artist.releases.push(new Release(release.id, release.name, null, null, null, null));
            });

            return artist.releases;
        }
        else
            return null;
    }

    async getTracksFromRelease(artistId, releaseId) {
        const res = await fetch(`https://localhost:5001/Track/GetTracksFromRelease/${releaseId}`, {
            method: "GET"
        });

        if (res.ok) {
            let tracks = await res.json();

            const artist = this.artists.find(a => a.id == artistId);
            const release = artist.releases.find(r => r.id == releaseId);

            release.tracks = [];
            tracks.forEach(track => {
                release.tracks.push(new Track(track.id, track.trackNumber, track.name, artist, release, track.rating, track.duration));
            });

            return release.tracks;
        }
        else
            return null;
    }

    async addTracksToPlaylist(trackIds, playlist) {
        const res = await fetch(`https://localhost:5001/Playlist/AddTracksToPlaylist/${playlist.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(trackIds)
        });

        if (res.ok) {
            const tracksData = await res.json();

            const addedTracks = [];

            tracksData.forEach(data => {
                const track = new Track(data.id, data.trackNumber, data.name, data.artists, data.release, data.rating, data.duration);
                
                addedTracks.push(track);
                
                playlist.tracks.push(track);
                playlist.numberOfTracks++;
                playlist.length += track.duration;
            })

            return addedTracks;
        }
        else {
            return null;
        }
    }

}