import { MusicLibraryView } from "../Views/MusicLibraryView.js";
import { Playlist } from "../Models/Playlist.js"

export class PlaylistView {
    constructor(musicLibrary, MusicLibraryView, container) {
        this.musicLibrary = musicLibrary;
        this.MusicLibraryView = MusicLibraryView;
        this.container = container;
        this.playlist = null;
    }

    async renderPlaylistSidebar(root, playlist) {
        let playlistSidebar = this.container.querySelector(".playlistSidebar");

        if (playlistSidebar != null) {
            playlistSidebar.innerHTML = ""; // removes all children
        }
        else {
            playlistSidebar = document.createElement("div");
            playlistSidebar.className = "playlistSidebar";
        }
        this.container.appendChild(playlistSidebar);

        const addTrackForm = document.createElement("form");
        addTrackForm.className = "addTrackForm";

        let artistSelect = document.createElement("select");
        let artistSelectLabel = document.createElement("label");
        artistSelectLabel.innerHTML = "Izvodjac:";

        let artists = await this.musicLibrary.getArtists();
        
        let manualChangeEvent = new Event('change');

        if (artists != null) {
            artistSelect.innerHTML = "";
            artists.forEach(artist => {
                let option = document.createElement("option");
                option.value = artist.id;
                option.innerHTML = artist.artistName;
                artistSelect.appendChild(option);
            });
        }

        let releaseSelect = document.createElement("select");
        let releaseSelectLabel = document.createElement("label");
        releaseSelectLabel.innerHTML = "Album:";

        ["change", "load"].forEach(event => {
            artistSelect.addEventListener(event, async (e) => {
                if (releaseSelect.value = "")
                    return;

                let selectedIndex = artistSelect.selectedIndex;
                let releases = await this.musicLibrary.getReleasesFromArtist(artistSelect.options[selectedIndex].value);

                if (releases == null)
                    return;

                releaseSelect.innerHTML = "";
                trackSelect.innerHTML = "";

                releases.forEach(release => {
                    let option = document.createElement("option");
                    option.innerHTML = release.name;
                    option.value = release.id;
                    releaseSelect.appendChild(option);
                });

                releaseSelect.dispatchEvent(manualChangeEvent);
            });
        });

        let trackSelect = document.createElement("select");
        let trackSelectLabel = document.createElement("label");
        trackSelectLabel.innerHTML = "Pesma:";


        ["change", "load"].forEach(event => {
            releaseSelect.addEventListener(event, async (e) => {
                let artistSelectedIndex = artistSelect.options.selectedIndex;
                let releaseSelectedIndex = releaseSelect.options.selectedIndex;

                let artistId = artistSelect.options[artistSelectedIndex].value;
                let releaseId = releaseSelect.options[releaseSelectedIndex].value;

                console.log(artistSelect, releaseSelect);

                let tracks = await this.musicLibrary.getTracksFromRelease(artistId, releaseId);

                if (tracks == null)
                    return;

                trackSelect.innerHTML = "";
                tracks.forEach(track => {
                    let option = document.createElement("option");
                    option.innerHTML = `${track.number} - ${track.name}`;
                    option.value = track.id;
                    trackSelect.appendChild(option);
                });
            });
        });

        let addTrackBtn = document.createElement("button");
        addTrackBtn.innerHTML = "Dodaj pesmu";

        addTrackBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const selectedIndex = trackSelect.options.selectedIndex;
            const trackToAppend = await this.onBtnAddTrackClick(trackSelect.options[selectedIndex].value, playlist);
            this.appendTrackToPlaylist(playlistTitle, tbody, trackToAppend, playlist);
        });

        addTrackForm.appendChild(artistSelectLabel);
        addTrackForm.appendChild(artistSelect);
        addTrackForm.appendChild(releaseSelectLabel);
        addTrackForm.appendChild(releaseSelect);
        addTrackForm.appendChild(trackSelectLabel);
        addTrackForm.appendChild(trackSelect);
        addTrackForm.appendChild(addTrackBtn);
        playlistSidebar.appendChild(addTrackForm);

        artistSelect.dispatchEvent(manualChangeEvent);

        let playlistTitle = document.createElement("h2");
        playlistTitle.className = "playlistTitle";

        playlistTitle.textContent = `${playlist.name} (${playlist.numberOfTracks} pesama, ${this.MusicLibraryView.formatTime(playlist.length)} ukupno)`;
        playlistSidebar.appendChild(playlistTitle);

        let tracksTable = document.createElement("table");
        tracksTable.className = "tracksTable";

        const header = document.createElement("thead");

        const headerRow = document.createElement("tr");
        header.appendChild(headerRow);

        let headers = ["Redni broj", "Naziv", "Izvodjac(i)", "Album", "Ocena", "Trajanje"];
        headers.forEach(col => {
            let th = document.createElement("th");
            th.innerHTML = col;
            headerRow.appendChild(th);
        });

        tracksTable.appendChild(header);
        
        const tbody = document.createElement("tbody");
        tracksTable.appendChild(tbody);

        const playlistTracks = await playlist.loadPlaylistTracks();
        playlistTracks.forEach(track => this.appendTrackToPlaylist(playlistTitle, tbody, track, playlist));
        playlistSidebar.appendChild(tracksTable);
    }

    appendTrackToPlaylist(playlistTitle, tbody, track, playlist) {
        const tr = document.createElement("tr");

        let td = document.createElement("td");
        td.innerHTML = track.number;
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = track.name;
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = track.artists.join(", ");
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = track.release;
        tr.appendChild(td);

        td = document.createElement("td");
        td.className = "tdCircles";
        td.id = `${track.id}`;
        this.appendRatingCircles(track, td);
        this.colorRatingCircles(track, tbody);
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = this.MusicLibraryView.formatMilitaryTime(track.duration);
        tr.appendChild(td);
        
        td = document.createElement("td");
        const removeTrackBtn = document.createElement("button");
        removeTrackBtn.innerHTML = "Ukloni";
        td.appendChild(removeTrackBtn);
        tr.appendChild(td);
        
        tbody.appendChild(tr);
        playlistTitle.innerHTML = `${playlist.name} (${playlist.numberOfTracks} pesme, ${this.MusicLibraryView.formatTime(playlist.length)} ukupno)`;

        removeTrackBtn.addEventListener("click", async () => {
            if (await this.onBtnRemoveTrack(track, playlist) == true) {
                await playlist.loadPlaylistTracks();

                tbody.innerHTML = "";

                if (playlist.tracks.length == 0) {
                    playlistTitle.innerHTML = `${playlist.name} (0 pesama, ${this.formatTime(0)} ukupno)`;
                }

                playlist.tracks.forEach(track => this.appendTrackToPlaylist(playlistTitle, tbody, track, playlist));
            }
        });
    }

    async appendRatingCircles(track, root) {
        for (let i = 0; i < 5; i++) {

            let ratingCircle = document.createElement("div");
            ratingCircle.id = `${i + 1}`;
            ratingCircle.className = "ratingCircle";

            ratingCircle.addEventListener("click", async (e) => await this.onRatingClick(track, root, e.target.id));

            root.appendChild(ratingCircle);
        }
    }

    colorRatingCircles(track, root) {
        let tdRatings = Array.from(root.querySelectorAll(".tdCircles"));
        tdRatings.forEach(tdRating => {
            if (tdRating.id == track.id) {
                console.log(tdRating);
                let circles = tdRating.children;
                for (let i = 0; i < 5; i++) {
                    if (i < track.rating)
                        circles[i].className = "ratingCircle";
                    else
                        circles[i].className = "emptyRatingCircle";
                }
            }
        })
    }

    async onRatingClick(track, root, rating) {
        if (await track.changeTrackRating(rating)) {
            this.colorRatingCircles(track, root);
        }
    }

    async onBtnAddTrackClick(trackId, playlist) {
        if (trackId == undefined) {
            alert("Odaberite pesmu.");
            return;
        }

        const addedTrack = await this.musicLibrary.addTrackToPlaylist(trackId, playlist);
        if (addedTrack != null) {
            return addedTrack;
        }
        else
            return null;
    }

    async onBtnRemoveTrack(track, playlist) {
        return playlist.removeTrackFromPlaylist(track);
    }

}