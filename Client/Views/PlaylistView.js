export class PlaylistView {
    constructor(musicLibrary, container) {
        this.musicLibrary = musicLibrary;
        this.container = container;
        this.playlist = null;
    }

    removePlaylistSidebar() {
        let playlistSidebar = this.container.querySelector(".playlistSidebar");
        playlistSidebar.remove();
    }

    async renderPlaylistSidebar() {
        let playlistSidebar = this.container.querySelector(".playlistSidebar");

        if (playlistSidebar != null) {
            playlistSidebar.innerHTML = ""; // removes all children
        }
        else {
            playlistSidebar = document.createElement("div");
            playlistSidebar.className = "playlistSidebar";
        }
        this.container.appendChild(playlistSidebar);

        const addTrackHeader = document.createElement("h3");
        addTrackHeader.innerHTML = "Dodaj pesmu";
        playlistSidebar.appendChild(addTrackHeader);

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

        artistSelect.addEventListener("change", async (e) => {
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

        let trackSelect = document.createElement("select");
        let trackSelectLabel = document.createElement("label");
        trackSelectLabel.innerHTML = "Pesma:";


        releaseSelect.addEventListener("change", async (e) => {
            let artistSelectedIndex = artistSelect.options.selectedIndex;
            let releaseSelectedIndex = releaseSelect.options.selectedIndex;

            let artistId = artistSelect.options[artistSelectedIndex].value;
            let releaseId = releaseSelect.options[releaseSelectedIndex].value;

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

        let addTrackBtn = document.createElement("button");
        addTrackBtn.innerHTML = "Dodaj pesmu";

        addTrackBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const selectedIndex = trackSelect.options.selectedIndex;
            const trackToAppend = await this.onBtnAddTrackClick(trackSelect.options[selectedIndex].value);
            await this.appendTrackToPlaylistView(playlistTitle, tbody, trackToAppend);
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

        playlistTitle.textContent = `${this.playlist.name} (${this.playlist.numberOfTracks} pesama, ukupno ${this.formatTime(this.playlist.length)})`;
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

        const playlistTracks = await this.playlist.loadPlaylistTracks();
        playlistTracks.forEach(async (track) => await this.appendTrackToPlaylistView(playlistTitle, tbody, track));
        playlistSidebar.appendChild(tracksTable);
    }

    async appendTrackToPlaylistView(playlistTitle, tbody, track) {
        const tr = document.createElement("tr");

        let td = document.createElement("td");
        td.innerHTML = track.number;
        td.setAttribute("data-label", "Redni broj");
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = track.name;
        td.setAttribute("data-label", "Pesma");
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = track.artists.join(", ");
        td.setAttribute("data-label", "Izvodjac(i)");
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = track.release;
        td.setAttribute("data-label", "Album");
        tr.appendChild(td);

        td = document.createElement("td");
        td.className = "tdCircles";
        td.id = `${track.id}`;
        await this.appendRatingCircles(track, td);
        td.setAttribute("data-label", "Ocena");
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = this.formatMilitaryTime(track.duration);
        td.setAttribute("data-label", "Trajanje");
        tr.appendChild(td);

        td = document.createElement("td");
        const removeTrackBtn = document.createElement("button");
        removeTrackBtn.innerHTML = "&#x1f5d1"; // unicode trashcan symbol
        removeTrackBtn.className = "removeTrackBtn"
        td.appendChild(removeTrackBtn);
        td.setAttribute("data-label", "Track number");
        tr.appendChild(td);

        tbody.appendChild(tr);
        this.colorRatingCircles(track);

        playlistTitle.innerHTML = `${this.playlist.name} (${this.playlist.numberOfTracks} pesme, ukupno ${this.formatTime(this.playlist.length)})`;

        removeTrackBtn.addEventListener("click", async () => {
            if (await this.onBtnRemoveTrack(track) == true) {
                await this.playlist.loadPlaylistTracks();

                tbody.innerHTML = "";

                if (this.playlist.tracks.length == 0) {
                    playlistTitle.innerHTML = `${playlist.name} (0 pesama, ukupno ${this.formatTime(0)})`;
                }

                this.playlist.tracks.forEach(async (track) => await this.appendTrackToPlaylistView(playlistTitle, tbody, track));
            }
        });
    }

    async appendRatingCircles(track, root) {
        for (let i = 0; i < 5; i++) {

            let ratingCircle = document.createElement("div");
            ratingCircle.id = `${i + 1}`;
            ratingCircle.className = "ratingCircle";

            ratingCircle.addEventListener("click", async (e) => await this.onRatingClick(track, e.target.id));

            root.appendChild(ratingCircle);
        }
    }

    colorRatingCircles(track) {
        let tdRatings = this.container.querySelectorAll(`.tdCircles`);
        tdRatings.forEach(tdRating => {
            if (tdRating.id == track.id) {
                let circles = tdRating.children;
                for (let i = 0; i < 5; i++) {
                    if (i < track.rating)
                        circles[i].className = "ratingCircle";
                    else
                        circles[i].className = "emptyRatingCircle";
                }
            }
        });
    }

    async onRatingClick(track, rating) {
        if (await track.changeTrackRating(rating) == true) {
            this.colorRatingCircles(track);
        }
    }

    async onBtnAddTrackClick(trackId) {
        if (trackId == undefined) {
            alert("Odaberite pesmu.");
            return;
        }

        const addedTrack = await this.musicLibrary.addTrackToPlaylist(trackId, this.playlist);
        if (addedTrack != null) {
            return addedTrack;
        }
        else
            return null;
    }

    async onBtnRemoveTrack(track) {
        return this.playlist.removeTrackFromPlaylist(track);
    }

    formatTime(timeInSeconds) {
        const hours = Math.floor((timeInSeconds / 3600));
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);

        if (hours > 0) {
            return `${hours}h, ${minutes}min`;
        }
        else {
            return `${minutes}min, ${seconds}s`;
        }
    }

    formatMilitaryTime(timeInSeconds) {
        const hours = Math.floor((timeInSeconds / 3600));
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        if (hours > 0) {
            if (seconds === 0)
                return `${hours}:${minutes}:${seconds}`;
        }
        else {
            if (seconds < 10) {
                return `${minutes}:0${seconds}`
            }
            else {
                return `${minutes}:${seconds}`;
            }
        }
    }
}
