import { PlaylistView } from "../Views/PlaylistView.js";
import { AddPlaylistForm } from "./AddPlaylistForm.js";
import { EditPlaylistForm } from "./EditPlaylistForm.js";

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

        const ppp = this.musicLibrary.playlists.slice();
        console.log(ppp, "ppp");

        for (const playlist of this.musicLibrary.playlists) {
            const playlistComponent = document.createElement("button");
            playlistComponent.className = "playlistComponent";

            console.log(playlist.musicLibraryId);

            playlistComponent.addEventListener("click", async () => {
                this.playlistView.playlist = playlist;
                console.log(playlist);

                const playlistComponents = document.querySelectorAll(".playlistComponent");
                playlistComponents.forEach(component => {
                    component.classList.remove("selectedPlaylist");
                });

                playlistComponent.classList.add("selectedPlaylist");

                console.log(playlist.musicLibraryId);

                if (playlist.description === null || playlist.description === undefined) {
                    await playlist.getFullPlaylistInfo();
                }

                this.playlistView.removePlaylistSidebar();
                await this.playlistView.renderPlaylistSidebar();
            });

            console.log(playlist.musicLibraryId);

            const playlistImage = document.createElement("div");
            playlistImage.className = "playlistImage";

            if (playlist.imagePath === null || playlist.imagePath === undefined) {
                playlistImage.style.backgroundImage = `url('./res/placeholder_image.jpg')`;
            }
            else {
                playlistImage.style.backgroundImage = `url('${playlist.imagePath}')`;
            }

            playlistComponent.appendChild(playlistImage);

            const playlistLabel = document.createElement("label");
            playlistLabel.className = "playlistLabel";
            playlistLabel.innerText = playlist.name;

            const playlistEditBtn = document.createElement("button");
            playlistEditBtn.className = "playlistEditBtn";
            playlistEditBtn.innerHTML = "Izmeni";
            playlistEditBtn.addEventListener("click", async (e) => {
                e.stopPropagation();

                console.log(playlist.musicLibraryId);

                const playlistComponents = document.querySelectorAll(".playlistComponent");
                playlistComponents.forEach(component => {
                    component.classList.remove("selectedPlaylist");
                });
                playlistComponent.classList.add("selectedPlaylist");

                console.log(playlist.musicLibraryId);

                if (playlist.description === null || playlist.description === undefined) {
                    await playlist.getFullPlaylistInfo();
                }

                this.playlistView.removePlaylistSidebar();
                this.playlistView.renderSidebarOnly();
                this.playlistView.renderEditPlaylistForm(playlist, this);

                await this.renderPlaylistPicker();
            });

            const playlistDeleteBtn = document.createElement("button");
            playlistDeleteBtn.className = "playlistDeleteBtn";
            playlistDeleteBtn.innerHTML = "Obrisi";
            playlistDeleteBtn.addEventListener("click", e => this.onBtnDeletePlaylistClick(playlist, e.target));


            playlistComponent.appendChild(playlistLabel);
            playlistComponent.appendChild(playlistEditBtn);
            playlistComponent.appendChild(playlistDeleteBtn);
            playlistsContainer.appendChild(playlistComponent);
        }

        const addPlaylistComponent = document.createElement("button");
        addPlaylistComponent.className = "addPlaylistComponent";

        addPlaylistComponent.addEventListener("click", async (e) => {
            e.stopPropagation();

            this.playlistView.removePlaylistSidebar();
            this.playlistView.renderSidebarOnly();
            this.playlistView.renderAddPlaylistForm(this);

            await this.renderPlaylistPicker();
        });

        const addPlaylist = document.createElement("div");
        addPlaylist.className = "addPlaylistImage";
        addPlaylist.innerHTML = "+";
        addPlaylistComponent.appendChild(addPlaylist);

        const playlistLabel = document.createElement("label");
        playlistLabel.className = "addPlaylistLabel";
        playlistLabel.innerText = "Dodaj novu plejlistu";

        addPlaylistComponent.appendChild(playlistLabel);
        playlistsContainer.appendChild(addPlaylistComponent);
    }

    //#endregion

    //#region event handlers

    async onBtnEditPlaylistClick(playlist) {
        if (await playlist.editPlaylist(playlist)) {
            await this.renderPlaylistPicker(this.container);

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
        if (name == null || name === undefined) {
            return false;
        }

        if (name == " " || name == "") {
            alert("Unesite naziv nove plejliste.");
            return false;
        }

        return await this.musicLibrary.addPlaylist(name);
    }


    //#endregion
}