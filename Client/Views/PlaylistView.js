import { AddPlaylistForm } from "./AddPlaylistForm.js";
import { EditPlaylistForm } from "./EditPlaylistForm.js";

export class PlaylistView {
    constructor(musicLibrary, container) {
        this.musicLibrary = musicLibrary;
        this.container = container;
        this.playlistSidebar = null;
        this.playlist = null;
    }

    removePlaylistSidebar() {
        const playlistSidebar = this.container.querySelector(".playlistSidebar");
        if (playlistSidebar)
            playlistSidebar.remove();
    }

    renderSidebarOnly() {
        const playlistSidebar = document.createElement("div");
        playlistSidebar.className = "playlistSidebar";
        this.playlistSidebar = playlistSidebar;
        this.container.appendChild(playlistSidebar);
}

    async renderPlaylistSidebar() {
        let playlistSidebar = this.container.querySelector(".playlistSidebar");

        if (playlistSidebar == null) {
            playlistSidebar = document.createElement("div");
            playlistSidebar.className = "playlistSidebar";
        }

        this.playlistSidebar = playlistSidebar;

        const addPlaylistForm = this.container.querySelector(".addPlaylistForm");
        if (addPlaylistForm) {
            addPlaylistForm.remove();
        }

        const playlistTitle = document.createElement("h1");
        const playlistInfo = document.createElement("h3");
        const paragraph = document.createElement("p");
        paragraph.innerHTML = "Nema opisa";
        const tbody = document.createElement("tbody");

        await this.renderAddTrackForm(playlistSidebar, playlistTitle, paragraph, playlistInfo, tbody);

        let playlistDiv = playlistSidebar.querySelector(".playlistDiv");

        if (playlistDiv)
            playlistDiv.innerHTML = "";
        else {
            playlistDiv = document.createElement("div");
            playlistDiv.className = "playlistDiv";
        }

        this.container.appendChild(playlistSidebar);

        playlistTitle.className = "playlistTitle";
        playlistInfo.className = "playlistInfo";


        this.updatePlaylistInfo(playlistTitle, playlistInfo, paragraph);

        let tracksTable = document.createElement("table");
        tracksTable.className = "tracksTable";

        const header = document.createElement("thead");

        const headerRow = document.createElement("tr");
        header.appendChild(headerRow);

        const headers = ["Redni broj", "Naziv", "Izvodjaci", "Album", "Ocena", "Trajanje"];
        headers.forEach(col => {
            const th = document.createElement("th");
            th.innerHTML = col;
            headerRow.appendChild(th);
        });

        tracksTable.appendChild(header);
        tracksTable.appendChild(tbody);

        let playlistTracks;

        if (!this.playlist || !this.playlist.tracks || this.playlist.tracks.length == 0) {
            playlistTracks = await this.playlist.loadPlaylistTracks();
        }
        else {
            playlistTracks = this.playlist.tracks;
        }

        playlistDiv.appendChild(playlistTitle);
        playlistDiv.appendChild(playlistInfo);
        playlistDiv.appendChild(paragraph);
        playlistDiv.appendChild(tracksTable);
        playlistSidebar.appendChild(playlistDiv);

        for (const track of playlistTracks) {
            await this.appendTrackToPlaylistView(playlistTitle, playlistInfo, paragraph, tbody, track);
        }
    }

    renderAddPlaylistForm(musicLibraryView) {
        const addPlaylistForm = new AddPlaylistForm(this.playlistSidebar, this.musicLibrary, musicLibraryView);
        addPlaylistForm.render();
    }

    renderEditPlaylistForm(playlist, musicLibraryView) {
        const editPlaylistForm = new EditPlaylistForm(this.playlistSidebar, playlist, musicLibraryView);
        editPlaylistForm.render();
    }

    async renderAddTrackForm(playlistSidebar, playlistTitle, paragraph, playlistInfo, tbody) {
        let addTrackForm = playlistSidebar.querySelector(".addTrackForm");

        if (addTrackForm) {
            addTrackForm.remove();
        }

        addTrackForm = document.createElement("form");
        addTrackForm.className = "addTrackForm";

        const addTrackHeader = document.createElement("h3");
        addTrackHeader.innerHTML = "Dodaj pesmu";
        addTrackForm.appendChild(addTrackHeader);

        let artistSelect = document.createElement("select");
        let artistSelectLabel = document.createElement("label");
        artistSelectLabel.innerHTML = "Izvodjac:";

        const artistInput = document.createElement("input");
        artistInput.setAttribute("type", "text");
        artistInput.placeholder = "Umetnicko ime";

        artistInput.addEventListener("keyup", async () => {

            if (artistInput.value == "")
                return;

            artists = await this.musicLibrary.matchArtists(artistInput.value);

            if (artists == null)
                return;

            artistSelect.innerHTML = "";

            if (artists.length != 0) {
                artistSelect.innerHTML = "";
                artists.forEach(artist => {
                    let option = document.createElement("option");
                    option.value = artist.id;
                    option.innerHTML = artist.artistName;
                    artistSelect.appendChild(option);
                });
            }

            artistSelect.dispatchEvent(manualChangeEvent);
        });

        let artists;

        if (this.musicLibrary.artists.length == 0) {
            console.log("Nema izvodjaca u memoriji, mora fetch");
            artists = await this.musicLibrary.getArtists();
        }
        else
            artists = this.musicLibrary.artists;

        let manualChangeEvent;

        const releaseSelect = document.createElement("select");
        const releaseSelectLabel = document.createElement("label");
        releaseSelectLabel.innerHTML = "Album:";

        artistSelect.addEventListener("change", async (e) => {
            if (releaseSelect.value = "")
                return;

            const selectedIndex = artistSelect.selectedIndex;
            if (selectedIndex == -1)
                return;

            const artist = this.musicLibrary.artists.find(a => a.id == artistSelect.options[selectedIndex].value);

            let releases;

            if (artist && artist.releases && artist.releases.length != 0) {
                releases = artist.releases;
            }
            else {
                console.log(`Nema albuma od ${artist.artistName} u memoriji, mora fetch`);
                releases = await this.musicLibrary.getReleasesFromArtist(artistSelect.options[selectedIndex].value);
            }

            if (releases == null)
                return;

            releaseSelect.innerHTML = "";
            trackSelect.innerHTML = "";

            releases.forEach(release => {
                const option = document.createElement("option");
                option.innerHTML = release.name;
                option.value = release.id;
                releaseSelect.appendChild(option);
            });

            manualChangeEvent = new Event('change');
            releaseSelect.dispatchEvent(manualChangeEvent);
        });

        const trackSelect = document.createElement("select");
        trackSelect.multiple = true;
        const trackSelectLabel = document.createElement("label");
        trackSelectLabel.innerHTML = "Pesma:";


        releaseSelect.addEventListener("change", async (e) => {
            const artistSelectedIndex = artistSelect.options.selectedIndex;
            const releaseSelectedIndex = releaseSelect.options.selectedIndex;

            if (artistSelectedIndex == -1 || releaseSelectedIndex == -1)
                return;

            const artistId = artistSelect.options[artistSelectedIndex].value;
            const releaseId = releaseSelect.options[releaseSelectedIndex].value;

            const artist = this.musicLibrary.artists.find(a => a.id == artistId);

            let release;
            if (artist) {
                release = artist.releases.find(r => r.id == releaseId);
            }

            let tracks;

            if (release && release.tracks && release.tracks.length != 0) {
                tracks = release.tracks;
            }
            else {
                console.log(`Nema pesama iz ${release.name} u memoriji, mora fetch`);
                tracks = await this.musicLibrary.getTracksFromRelease(artistId, releaseId);
            }

            if (tracks == null)
                return;

            trackSelect.innerHTML = "";
            tracks.forEach(track => {
                let option = document.createElement("option");
                option.innerHTML = `${track.number} - ${track.name}`;
                option.value = track.id;
                option.selected = true;
                trackSelect.appendChild(option);
            });
        });

        let addTrackBtn = document.createElement("button");
        addTrackBtn.innerHTML = "Dodaj pesme";
        addTrackBtn.className = "addTrackBtn";

        addTrackBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            if (artistInput.value == "" || artistInput.value === null
            || artistInput.value === undefined) {
                alert("Unesite nekog umetnika.");
                return;
            }

            if (trackSelect.selectedOptions.length == 0) {
                alert("Izaberite neku pesmu.");
                return;
            }

            const trackIds = Array.from(trackSelect.selectedOptions)
                .map(option => option.value)

            const trackIdsInt = trackIds.map(id => parseInt(id));

            const duplicateTracks =
                Array.from(new Set(
                    this.playlist.tracks
                        .filter(t => trackIdsInt.includes(t.id))
                        .map(t => t.name)
                ));

            if (duplicateTracks.length != 0) {
                if (!confirm(`Dodati duplikate (${duplicateTracks.join(', ')})?`)) {
                    return;
                }
            }

            const tracksToAppend = await this.onBtnAddTrackClick(trackIds);

            tracksToAppend.forEach(async (track) => {
                await this.appendTrackToPlaylistView(playlistTitle, playlistInfo, paragraph, tbody, track);
            });
        });

        addTrackForm.appendChild(artistSelectLabel);
        addTrackForm.appendChild(artistInput);
        addTrackForm.appendChild(artistSelect);
        addTrackForm.appendChild(releaseSelectLabel);
        addTrackForm.appendChild(releaseSelect);
        addTrackForm.appendChild(trackSelectLabel);
        addTrackForm.appendChild(trackSelect);
        addTrackForm.appendChild(addTrackBtn);
        playlistSidebar.appendChild(addTrackForm);

        manualChangeEvent = new Event('change');
        artistSelect.dispatchEvent(manualChangeEvent);
    }

    async appendTrackToPlaylistView(playlistTitle, playlistInfo, paragraph, tbody, track) {
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
        td.setAttribute("data-label", "Izvodjaci");
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
        tr.appendChild(td);

        tbody.appendChild(tr);
        this.colorRatingCircles(track);

        this.updatePlaylistInfo(playlistTitle, playlistInfo, paragraph);

        removeTrackBtn.addEventListener("click", async () => {
            if (await this.onBtnRemoveTrack(track) == true) {
                tbody.innerHTML = "";

                for (const track of this.playlist.tracks) {
                    await this.appendTrackToPlaylistView(playlistTitle, playlistInfo, paragraph, tbody, track);
                }

                this.updatePlaylistInfo(playlistTitle, playlistInfo, paragraph);
            }
        });
    }

    updatePlaylistInfo(playlistTitle, playlistInfo, paragraph) {
        playlistTitle.innerHTML = `${this.playlist.name}`;
        playlistInfo.innerHTML = `${this.playlist.numberOfTracks} pesme, ukupno ${this.formatTime(this.playlist.length)}`;

        if (this.playlist.description !== null && this.playlist.description !== undefined)
            paragraph.innerHTML = this.playlist.description;
    }

    async appendRatingCircles(track, root) {
        for (let i = 0; i < 5; i++) {
            let ratingCircle = document.createElement("button");
            ratingCircle.id = `${i + 1}`;
            ratingCircle.className = "ratingCircle";

            ratingCircle.addEventListener("click", async (e) => await this.onRatingClick(track, e.target.id));

            root.appendChild(ratingCircle);
        }
    }

    colorRatingCircles(track) {
        const tdRatings = document.body.querySelectorAll(`.tdCircles`);
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

    async onBtnAddTrackClick(trackIds) {
        if (trackIds == undefined) {
            alert("Odaberite pesmu.");
            return;
        }

        const addedTracks = await this.musicLibrary.addTracksToPlaylist(trackIds, this.playlist);
        if (addedTracks != null) {
            return addedTracks;
        }
        else
            return null;
    }

    async onBtnRemoveTrack(track) {
        return await this.playlist.removeTrackFromPlaylist(track);
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
