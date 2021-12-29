import { Artist } from "../Models/Artist.js"
import { Playlist } from "../Models/Playlist.js"
import { Release } from "../Models/Release.js"
import { Track } from "../Models/Track.js"
import { MusicLibrary } from "../Models/MusicLibrary.js"

export class MusicLibraryView {
    constructor(musicLibrary) {
        this.musicLibrary = musicLibrary;
    }

    async renderPlaylistPicker(root) {
        const playlistsContainer = document.createElement("div");
        playlistsContainer.className = "playlistsContainer";

        root.appendChild(playlistsContainer);

        let playlists = await this.musicLibrary.getPlaylists();

        playlists.forEach(playlist => {

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

            playlistComponent.appendChild(playlistLabel);
            playlistsContainer.appendChild(playlistComponent);
        });

        const playlistComponent = document.createElement("div");
        playlistComponent.className = "playlistComponent";

        playlistComponent.addEventListener("click", e => this.renderAddPlaylistModal());

        const addPlaylist = document.createElement("div");
        addPlaylist.className = "addPlaylist";
        addPlaylist.innerHTML = "+";
        playlistComponent.appendChild(addPlaylist);

        const playlistLabel = document.createElement("label");
        playlistLabel.className = "playlistLabel";
        playlistLabel.innerText = "Add new playlist";

        playlistComponent.appendChild(playlistLabel);
        playlistsContainer.appendChild(playlistComponent);
    }

    async renderAddPlaylistModal() {
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
        modalText.innerHTML = "Enter new playlist name:";
        modalContent.appendChild(modalText);

        let newPlaylistNameInput = document.createElement("input");
        newPlaylistNameInput.className = "newPlaylistNameInput";
        modalContent.appendChild(newPlaylistNameInput);

        let btnAddPlaylist = document.createElement("button");
        btnAddPlaylist.className = "btnAddPlaylist";
        btnAddPlaylist.innerText = "Add";
        modalContent.appendChild(btnAddPlaylist);

        closeBtn.addEventListener("click", e => this.closeModal(modal));

        btnAddPlaylist.addEventListener("click", e => {
            this.closeModal();
        })
    }

    async closeModal(modal) {
        modal.innerHTML = "";
        modal.remove();
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

        let playlistTitle = document.createElement("h1");
        playlistTitle.className = "playlistTitle";
        playlistTitle.textContent = playlist.name;
        playlistSidebar.appendChild(playlistTitle);

        let playlistTracks = await this.musicLibrary.loadPlaylistTracks(playlist.id);

        let tracksTable = document.createElement("table");

        const headerRow = document.createElement("tr");

        let headers = ["Track number", "Track name", "Artist", "Release", "Rating", "Duration"];
        headers.forEach(col => {
            let th = document.createElement("th");
            th.innerHTML = col;
            headerRow.appendChild(th);
        });

        tracksTable.appendChild(headerRow);

        playlistTracks.forEach(track => {
            const tr = document.createElement("tr");

            Object.keys(track).forEach(key => {
                if (track[key] !== null) {
                    console.log(key, track[key]);
                    const td = document.createElement("td");
                    td.innerHTML = track[key];
                    tr.appendChild(td);
                }
            });

            tracksTable.appendChild(tr);
        });

        playlistSidebar.appendChild(tracksTable);

    }

    async renderPlaylistForm(root) {
        const playlistFormContainer = document.createElement("div");
        playlistFormContainer.className = "playlistFormContainer";
        root.appendChild(playlistFormContainer);


    }

    async render(root) {
        const header = document.createElement("h1");
        header.innerHTML = `${this.musicLibrary.owner}'s Music Library`;
        root.appendChild(header)


        const musicLibraryContainer = document.createElement("div");
        musicLibraryContainer.className = "musicLibraryContainer";
        root.appendChild(musicLibraryContainer);

        this.renderPlaylistPicker(musicLibraryContainer);

    }
}