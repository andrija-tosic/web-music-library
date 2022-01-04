export class Playlist {
    constructor(id, name, numberOfTracks, length, tracks) {
        this.id = id;
        this.name = name;
        this.numberOfTracks = numberOfTracks;
        this.length = length;
        this.tracks = tracks;
    }

    async loadPlaylistTracks() {
        const res = await fetch(`https://localhost:5001/Playlist/GetTracksFromPlaylist/${playlist.id}`);

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
}