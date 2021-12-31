import { Artist } from "../Models/Artist.js"
import { Playlist } from "../Models/Playlist.js"
import { Release } from "../Models/Release.js"
import { Track } from "../Models/Track.js"
import { MusicLibrary } from "../Models/MusicLibrary.js"

export class MusicLibraryView {
    constructor(musicLibrary) {
        this.musicLibrary = musicLibrary;
        this.container = null;
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
        header.innerHTML = `muzicka biblioteka ${this.musicLibrary.owner}`;
        root.appendChild(header)

        const musicLibraryContainer = document.createElement("div");
        musicLibraryContainer.className = "musicLibraryContainer";
        this.container = musicLibraryContainer;
        root.appendChild(this.container);

        await this.renderPlaylistPicker(this.container);
    }

    async renderPlaylistPicker(root) {
        const prevContainer = document.querySelector(".playlistsContainer");
        if (prevContainer) {
            prevContainer.remove();
        }

        const playlistsContainer = document.createElement("div");
        playlistsContainer.className = "playlistsContainer";

        root.appendChild(playlistsContainer);

        await this.musicLibrary.getPlaylists();

        this.musicLibrary.playlists.forEach(playlist => {

            const playlistComponent = document.createElement("div");
            playlistComponent.className = "playlistComponent";
            playlistComponent.id = playlist.id;

            playlistComponent.addEventListener("click", e => this.renderPlaylistSidebar(root, playlist));

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
                this.renderInputModal(playlist, root, "Novi naziv plejliste: ", "Preimenuj");
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
            this.renderInputModal(null, root, "Naziv nove plejliste: ", "Dodaj");
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

        let modalText = document.createElement("label");
        modalText.className = "modalText";
        modalText.innerHTML = text;
        modalContent.appendChild(modalText);

        let modalInput = document.createElement("input");
        modalInput.className = "modalInput";
        modalContent.appendChild(modalInput);

        modalInput.focus();

        let btnAction = document.createElement("button");
        btnAction.className = "btnAction";
        btnAction.innerText = action;
        modalContent.appendChild(btnAction);

        closeBtn.addEventListener("click", e => this.closeModal(modal));

        btnAction.addEventListener("click", async (e) => {
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
    }

    async renderPlaylistSidebar(root, playlist) {
        let playlistSidebar = document.querySelector(".playlistSidebar");

        if (playlistSidebar) {
            playlistSidebar.innerHTML = ""; // removes all children
        }
        else {
            playlistSidebar = document.createElement("div");
            playlistSidebar.className = "playlistSidebar";
        }
        root.appendChild(playlistSidebar);

        let newTrackNameInput = document.createElement("input");
        newTrackNameInput.placeholder = "Pesma...";

        let artistInput = document.createElement("input");
        artistInput.placeholder = "Izvodjac...";
        artistInput.setAttribute("list", "artists");
        let artistDatalist = document.createElement("datalist");
        artistDatalist.id = "artists";

        artistInput.addEventListener("keyup", async (e) => {
            if (artistInput.value == "")
                return;
            
            let artists = Array.from(await this.artistInputHandler(artistInput.value));
            artistDatalist.innerHTML = "";
            artists.forEach(artist => {
                let option = document.createElement("option");
                option.value = artist.artistName;
                artistDatalist.appendChild(option);
            })
        })


        let releaseInput = document.createElement("input");
        releaseInput.placeholder = "Album...";
        releaseInput.setAttribute("list", "releases");

        let ratingInput = document.createElement("input");
        ratingInput.placeholder = "Ocena";        

        playlistSidebar.appendChild(artistInput);
        playlistSidebar.appendChild(artistDatalist);
        playlistSidebar.appendChild(releaseInput);
        playlistSidebar.appendChild(newTrackNameInput);
        playlistSidebar.appendChild(ratingInput);

        let playlistTitle = document.createElement("h1");
        playlistTitle.className = "playlistTitle";

        const lengthAsString = this.formatTime(playlist.length);
        playlistTitle.textContent = `${playlist.name} (${playlist.numberOfTracks} pesme, ${lengthAsString} ukupno)`;
        playlistSidebar.appendChild(playlistTitle);

        let tracksTable = document.createElement("table");
        tracksTable.className = "tracksTable";

        const headerRow = document.createElement("tr");

        let headers = ["Redni broj", "Naziv", "Izvodjac(i)", "Album", "Ocena", "Trajanje"];
        headers.forEach(col => {
            let th = document.createElement("th");
            th.innerHTML = col;
            headerRow.appendChild(th);
        });

        tracksTable.appendChild(headerRow);


        playlist = await this.musicLibrary.loadPlaylistTracks(playlist.id);
        const playlistTracks = playlist.tracks;
        playlistTracks.forEach(track => {
            const tr = document.createElement("tr");

            let td = document.createElement("td");
            td.innerHTML = track.number;
            tr.appendChild(td);

            td = document.createElement("td");
            td.innerHTML = track.name;
            tr.appendChild(td);

            td = document.createElement("td");
            td.innerHTML = track.artists;
            tr.appendChild(td);

            td = document.createElement("td");
            td.innerHTML = track.release;
            tr.appendChild(td);

            td = document.createElement("td");
            td.className = "tdCircles";
            this.appendRatingCircles(track.id, td);
            this.colorRatingCircles(track.rating, td);
            tr.appendChild(td);

            td = document.createElement("td");
            td.innerHTML = this.formatMilitaryTime(track.duration);
            tr.appendChild(td);

            tracksTable.appendChild(tr);
        });
        playlistSidebar.appendChild(tracksTable);
    }

    closeModal(modal) {
        modal.remove();
    }

    appendRatingCircles(trackId, root) {
        for (let i = 0; i < 5; i++) {

            let ratingCircle = document.createElement("div");
            ratingCircle.id = `${i + 1}`;

            ratingCircle.addEventListener("click", e => {
                e.target.clicked = true;
                this.onRatingClick(trackId, root, e.target.id);
            });

            root.appendChild(ratingCircle);
        }
    }

    colorRatingCircles(rating, root) {
        let circles = root.children;
        for (let i = 0; i < 5; i++) {
            if (i < rating)
                circles[i].className = "ratingCircle";
            else
                circles[i].className = "emptyRatingCircle";
        }
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

        if (await this.musicLibrary.renamePlaylist(playlist.id, name)) {
            await this.renderPlaylistPicker(this.container);
            playlist.name = name;
            await this.renderPlaylistSidebar(this.container, playlist);

            return true;
        }
    }

    async onBtnDeletePlaylistClick(playlist, target) {
        event.stopPropagation();
        if (await this.musicLibrary.deletePlaylist(playlist.id)) {
            console.log(target.parentElement);
            const playlistComponent = target.parentElement;
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

    async onRatingClick(trackId, root, rating) {
        if (this.musicLibrary.changeTrackRating(trackId, rating)) {
            this.colorRatingCircles(rating, root);
        }
    }

    async artistInputHandler(artistName) {
        let artists = await this.musicLibrary.matchArtists(artistName) 

        if (artists != null) {
            return artists;
        }
    }

    //#endregion
}