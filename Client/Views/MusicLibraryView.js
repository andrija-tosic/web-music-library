import { PlaylistView } from "../Views/PlaylistView.js";

export class MusicLibraryView {
    constructor(musicLibrary) {
        this.musicLibrary = musicLibrary;
        this.container = null;
        this.playlistView = null;
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

        this.playlistView = new PlaylistView(this.musicLibrary, this, this.container)

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
                this.playlistView.renderPlaylistSidebar(this.container, playlist);
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

    closeModal(modal) {
        modal.remove();
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
            await this.playlistView.renderPlaylistSidebar(this.container, playlist);

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


    //#endregion
}