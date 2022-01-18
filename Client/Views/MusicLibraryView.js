import { PlaylistView } from "../Views/PlaylistView.js";

export class MusicLibraryView {
    constructor(musicLibrary) {
        this.musicLibrary = musicLibrary;
        this.container = null;
        this.playlistView = null;
    }

    async initRender(root) {
        const header = document.createElement("h1");
        header.innerHTML = `Muzicka biblioteka vlasnika ${this.musicLibrary.owner}`;
        root.appendChild(header);

        const musicLibraryContainer = document.createElement("div");
        musicLibraryContainer.className = "musicLibraryContainer";
        musicLibraryContainer.id = this.musicLibrary.id;
        this.container = musicLibraryContainer;
        root.appendChild(this.container);

        this.playlistView = new PlaylistView(this.musicLibrary, this.container);

        await this.renderPlaylistPicker();
    }

    async renderPlaylistPicker() {
        const prevContainer = this.container.querySelector(`.playlistsContainer`);
        if (prevContainer) {
            prevContainer.remove();
        }

        const playlistsContainer = document.createElement("div");
        playlistsContainer.className = "playlistsContainer";

        this.container.appendChild(playlistsContainer);

        const playlistsHeader = document.createElement("h2");
        playlistsHeader.innerHTML = "Plejliste";
        playlistsHeader.className = "playlistsHeader";
        playlistsContainer.appendChild(playlistsHeader);

        // check in memory
        if (!this.musicLibrary.playlists || this.musicLibrary.playlists.length == 0)
            await this.musicLibrary.getPlaylists();

        for (const playlist of this.musicLibrary.playlists) {

            const playlistComponent = document.createElement("button");
            playlistComponent.className = "playlistComponent";
            playlistComponent.id = playlist.id;

            playlistComponent.addEventListener("click", async () => {
                this.playlistView.playlist = playlist;
                await this.playlistView.renderPlaylistSidebar();
            });

            const playlistImage = document.createElement("div");
            playlistImage.className = "playlistImage";
            playlistComponent.appendChild(playlistImage);

            const playlistLabel = document.createElement("label");
            playlistLabel.className = "playlistLabel";
            playlistLabel.innerText = playlist.name;

            const playlistRenameBtn = document.createElement("button");
            playlistRenameBtn.className = "playlistRenameBtn";
            playlistRenameBtn.innerHTML = "Preimenuj";
            playlistRenameBtn.id = playlist.id;
            playlistRenameBtn.addEventListener("click", async(e) => {
                e.stopPropagation();
                let newName;
                do {
                    newName = prompt("Novi naziv plejliste");
                } while (newName != null && newName === "")
                let actionSucceeded = false;
                actionSucceeded = await this.onBtnRenamePlaylistClick(playlist, newName);
                if (actionSucceeded) {
                    await this.renderPlaylistPicker();
                }
            });

            const playlistDeleteBtn = document.createElement("button");
            playlistDeleteBtn.className = "playlistDeleteBtn";
            playlistDeleteBtn.innerHTML = "Obrisi";
            playlistDeleteBtn.id = playlist.id;
            playlistDeleteBtn.addEventListener("click", e => this.onBtnDeletePlaylistClick(playlist, e.target));


            playlistImage.appendChild(playlistLabel);
            playlistComponent.appendChild(playlistRenameBtn);
            playlistComponent.appendChild(playlistDeleteBtn);
            playlistsContainer.appendChild(playlistComponent);
        }

        const playlistComponent = document.createElement("button");
        playlistComponent.className = "playlistComponent";

        playlistComponent.addEventListener("click", async(e) => {
            e.stopPropagation();

            const newPlaylistName = prompt("Naziv nove plejliste:");

            let actionSucceeded = false;
                actionSucceeded = await this.onBtnAddPlaylistClick(newPlaylistName);

            if (actionSucceeded) {
                await this.renderPlaylistPicker();
            }
        });

        const addPlaylist = document.createElement("div");
        addPlaylist.className = "addPlaylistImage";
        addPlaylist.innerHTML = "+";
        playlistComponent.appendChild(addPlaylist);

        const playlistLabel = document.createElement("label");
        playlistLabel.className = "addPlaylistLabel";
        playlistLabel.innerText = "Dodaj novu plejlistu";

        playlistComponent.appendChild(playlistLabel);
        playlistsContainer.appendChild(playlistComponent);
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

            await this.playlistView.renderPlaylistSidebar();

            return true;
        }
    }

    async onBtnDeletePlaylistClick(playlist, button) {
        event.stopPropagation();

        if (!confirm(`Sigurno obrisati "${playlist.name}"?`))
            return;
        
        if (await this.musicLibrary.deletePlaylist(playlist)) {
            const playlistComponent = button.parentElement;
            playlistComponent.remove();
            if (playlist === this.playlistView.playlist) {
                this.playlistView.removePlaylistSidebar();
            }
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