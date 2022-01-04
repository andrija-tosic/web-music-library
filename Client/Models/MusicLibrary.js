import { Artist } from "../Models/Artist.js"
import { Playlist } from "../Models/Playlist.js"
import { Release } from "../Models/Release.js"
import { Track } from "../Models/Track.js"


export class MusicLibrary {
    constructor(owner) {
        this.owner = owner;
        this.playlists = [];
        this.artists = [];
    }

    async getPlaylists() {
        const res = await fetch("https://localhost:5001/Playlist/GetPlaylists");

        if (!res.ok)
            return null;

        const data = await res.json();

        this.playlists = [];

        data.forEach(playlist => {
            let p = new Playlist(playlist.id, playlist.name, playlist.numberOfTracks, playlist.length);
            this.playlists.push(p);
        });

        return this.playlists;
    }

    async addPlaylist(name) {
        let playlist = new Playlist(0, name, 0, 0, null);
        const res = await fetch(`https://localhost:5001/Playlist/AddPlaylist/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playlist)
        });

        if (res.ok) {
            const data = res.json();
            playlist = new Playlist(data.id, data.name, data.numberOfTracks, data.length, null);
            this.playlists.push(playlist);
            return true;
        }
        else {
            return false;
        }
    }

    async deletePlaylist(playlist) {
        const res = await fetch(`https://localhost:5001/Playlist/DeletePlaylist/${playlist.id}`, {
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

    async getArtists() {
        const res = await fetch(`https://localhost:5001/Artist/GetArtists/`, {
            method: "GET"
        });

        if (res.ok) {
            let data = await res.json();
            this.artists = [];
            data.forEach(artist => {
                this.artists.push(new Artist(artist.id, null, null, artist.artistName));
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
                console.log(track);
                release.tracks.push(new Track(track.id, track.trackNumber, track.name, artist, release, track.rating, track.duration));
            });

            return release.tracks;
        }
        else
            return null;
    }

    async addTrackToPlaylist(trackId, playlist) {
        const res = await fetch(`https://localhost:5001/Playlist/AddTrackToPlaylist/${trackId}/${playlist.id}`, {
            method: "PUT"
        });

        if (res.ok) {
            let data = await res.json();
            const track = new Track(data.id, data.trackNumber, data.name, data.artists, data.release, data.rating, data.duration);
            
            playlist.tracks.push(track);
            playlist.numberOfTracks++;
            playlist.length += track.duration;

            return track;
        }
        else {
            return null;
        }
    }

    async removeTrackFromPlaylist(track, playlist) {
        const res = await fetch(`https://localhost:5001/Playlist/RemoveTrackFromPlaylist/${track.number}/${playlist.id}`, {
            method: "PATCH"
        });

        if (res.ok) {
            playlist.tracks.pop(track);
            return true;
        }
        else {
            return false;
        }
    }
}