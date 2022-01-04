import { PlaylistView } from "../Views/PlaylistView.js";

export class MusicLibraryView {
    constructor(musicLibrary) {
        this.musicLibrary = musicLibrary;
        this.container = null;
        this.playlistView = new PlaylistView();
    }

    //#region helper functions

    formatTime(timeInSeconds) {
        const hours = Math.floor((timeInSeconds / 3600));
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);

        if (hours > 0) {
            return `${hours}h ${minutes}min`;
        }
        else {
            return `${minutes}min ${seconds}s`;
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
            if (seconds === 0)
                return `${minutes}:00`;
            else
                return `${minutes}:${seconds}`;
        }
    }

    //#endregion

    //#region render functions

    async render(root) {
        root.innerHTML = "";

        const header = document.createElement("h1");
        header.innerHTML = `Muzicka biblioteka ${this.musicLibrary.owner}`;
        root.appendChild(header)

        const musicLibraryContainer = document.createElement("div");
        musicLibraryContainer.className = "musicLibraryContainer";
        this.container = musicLibraryContainer;
        root.appendChild(this.container);

        await this.renderPlaylistPicker();
    }

    async renderPlaylistPicker() {
        const prevContainer = document.querySelector(".playlistsContainer");
        if (prevContainer) {
            prevContainer.remove();
        }

        const playlistsContainer = document.createElement("div");
        playlistsContainer.className = "playlistsContainer";

        this.container.appendChild(playlistsContainer);

        await this.musicLibrary.getPlaylists();

        this.musicLibrary.playlists.forEach(playlist => {

            const playlistComponent = document.createElement("div");
            playlistComponent.className = "playlistComponent";
            playlistComponent.id = playlist.id;

            playlistComponent.addEventListener("click", () => {
                this.renderPlaylistSidebar(this.container, playlist);
            });

            const playlistImage = document.createElement("div");
            playlistImage.className = "playlistImage";
            playlistComponent.appendChild(playlistImage);

            const playlistLabel = document.createElement("label");
            playlistLabel.className = "playlistLabel";
            playlistLabel.innerText = playlist.name;

            const playlistRenameBtn = document.createElement("button");
            playlistRenameBtn.className = "playlistRenameBtn";
            playlistRenameBtn.innerText = "Preimenuj";
            playlistRenameBtn.id = playlist.id;
            playlistRenameBtn.addEventListener("click", e => {
                e.stopPropagation();
                this.renderInputModal(playlist, this.container, "Novi naziv plejliste: ", "Preimenuj");
            });

            const playlistDeleteBtn = document.createElement("button");
            playlistDeleteBtn.className = "playlistDeleteBtn";
            playlistDeleteBtn.innerText = "Obrisi";
            playlistDeleteBtn.id = playlist.id;
            playlistDeleteBtn.addEventListener("click", e => this.onBtnDeletePlaylistClick(playlist, e.target));


            playlistComponent.appendChild(playlistLabel);
            playlistComponent.appendChild(playlistRenameBtn);
            playlistComponent.appendChild(playlistDeleteBtn);
            playlistsContainer.appendChild(playlistComponent);
        });

        const playlistComponent = document.createElement("div");
        playlistComponent.className = "playlistComponent";

        playlistComponent.addEventListener("click", e => {
            e.stopPropagation();
            this.renderInputModal(null, this.container, "Naziv nove plejliste: ", "Dodaj");
        });

        const addPlaylist = document.createElement("div");
        addPlaylist.className = "playlistImage";
        addPlaylist.innerHTML = "+";
        playlistComponent.appendChild(addPlaylist);

        const playlistLabel = document.createElement("label");
        playlistLabel.className = "playlistLabel";
        playlistLabel.innerText = "Dodaj novu plejlistu";

        playlistComponent.appendChild(playlistLabel);
        playlistsContainer.appendChild(playlistComponent);
    }

    async renderInputModal(playlist, root, text, action) {
        let modal = document.createElement("div");
        modal.className = "addPlaylistModal";
        document.body.appendChild(modal);

        let modalContent = document.createElement("div");
        modalContent.className = "modal-content";
        modal.appendChild(modalContent);

        let closeBtn = document.createElement("span");
        closeBtn.className = "close";
        closeBtn.innerHTML = "&times;"
        modalContent.appendChild(closeBtn);

        let modalForm = document.createElement("form");
        modalForm.className = "modalForm";

        let modalText = document.createElement("label");
        modalText.className = "modalText";
        modalText.innerHTML = text;
        modalForm.appendChild(modalText);

        let modalInput = document.createElement("input");
        modalInput.className = "modalInput";
        modalForm.appendChild(modalInput);

        modalInput.focus();

        let btnAction = document.createElement("button");
        btnAction.className = "btnAction";
        btnAction.innerText = action;
        modalForm.appendChild(btnAction);

        closeBtn.addEventListener("click", e => {
            this.closeModal(modal);
        });

        btnAction.addEventListener("click", async (e) => {
            e.preventDefault();
            let actionSucceeded = false;
            if (action === "Dodaj") {
                actionSucceeded = await this.onBtnAddPlaylistClick(modalInput.value);
            }
            else if (action === "Preimenuj") {
                actionSucceeded = await this.onBtnRenamePlaylistClick(playlist, modalInput.value);
            }
            if (actionSucceeded) {
                this.closeModal(modal);
                await this.renderPlaylistPicker(root);
            }
        });

        modalContent.appendChild(modalForm);
    }

    async renderPlaylistSidebar(root, playlist) {
        let playlistSidebar = root.querySelector(".playlistSidebar");

        if (playlistSidebar != null) {
            playlistSidebar.innerHTML = ""; // removes all children
        }
        else {
            playlistSidebar = document.createElement("div");
            playlistSidebar.className = "playlistSidebar";
        }
        root.appendChild(playlistSidebar);

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

        playlistTitle.textContent = `${playlist.name} (${playlist.numberOfTracks} pesama, ${this.formatTime(playlist.length)} ukupno)`;
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
        td.innerHTML = this.formatMilitaryTime(track.duration);
        tr.appendChild(td);
        
        td = document.createElement("td");
        const removeTrackBtn = document.createElement("button");
        removeTrackBtn.innerHTML = "Ukloni";
        td.appendChild(removeTrackBtn);
        tr.appendChild(td);
        
        tbody.appendChild(tr);
        playlistTitle.innerHTML = `${playlist.name} (${playlist.numberOfTracks} pesme, ${this.formatTime(playlist.length)} ukupno)`;

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

    closeModal(modal) {
        modal.remove();
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

    //#endregion

    //#region event handlers

    async onBtnRenamePlaylistClick(playlist, name) {
        if (name == null
            || name === undefined
            || name == " "
            || name == "") {

            alert("Unesite novi naziv plejliste.");
            return false;
        }

        if (name == playlist.name) {
            alert("Unesite drugaciji naziv od postojeceg.");
            return false;
        }

        if (await playlist.renamePlaylist(name)) {
            await this.renderPlaylistPicker(this.container);
            playlist.name = name;
            await this.renderPlaylistSidebar(this.container, playlist);

            return true;
        }
    }

    async onBtnDeletePlaylistClick(playlist, button) {
        event.stopPropagation();
        if (await this.musicLibrary.deletePlaylist(playlist)) {
            const playlistComponent = button.parentElement;
            playlistComponent.remove();
        }
    }

    async onBtnAddPlaylistClick(name) {
        if (name == null
            || name === undefined
            || name == " "
            || name == "") {

            alert("Unesite naziv nove plejliste.");
            return false;
        }

        return await this.musicLibrary.addPlaylist(name);
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

    //#endregion
}