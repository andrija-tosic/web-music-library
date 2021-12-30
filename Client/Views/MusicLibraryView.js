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
        const prevContainer = document.querySelector(".playlistsContainer");
        if (prevContainer) {
            prevContainer.remove();
        }

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

            const playlistDeleteBtn = document.createElement("button");
            playlistDeleteBtn.className = "playlistDeleteBtn";
            playlistDeleteBtn.innerText = "Delete";
            playlistDeleteBtn.id = playlist.id;
            playlistDeleteBtn.addEventListener("click", e => this.onBtnDeletePlaylistClick(e.target, root));

            
            playlistComponent.appendChild(playlistLabel);
            playlistComponent.appendChild(playlistDeleteBtn);
            playlistsContainer.appendChild(playlistComponent);
        });

        const playlistComponent = document.createElement("div");
        playlistComponent.className = "playlistComponent";

        playlistComponent.addEventListener("click", e => this.renderAddPlaylistModal(root));

        const addPlaylist = document.createElement("div");
        addPlaylist.className = "playlistImage";
        addPlaylist.innerHTML = "+";
        playlistComponent.appendChild(addPlaylist);

        const playlistLabel = document.createElement("label");
        playlistLabel.className = "playlistLabel";
        playlistLabel.innerText = "Add new playlist";

        playlistComponent.appendChild(playlistLabel);
        playlistsContainer.appendChild(playlistComponent);
    }

    async renderAddPlaylistModal(root) {
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

        newPlaylistNameInput.focus();

        let btnAddPlaylist = document.createElement("button");
        btnAddPlaylist.className = "btnAddPlaylist";
        btnAddPlaylist.innerText = "Add";
        modalContent.appendChild(btnAddPlaylist);

        closeBtn.addEventListener("click", e => this.closeModal(modal));

        btnAddPlaylist.addEventListener("click", e => this.onBtnAddPlaylistClick(newPlaylistNameInput.value, root, modal));
    }

    async onBtnDeletePlaylistClick(target, root) {
        event.stopPropagation();
        await this.musicLibrary.deletePlaylist(target.id);

        console.log(target.parentElement);
        target.parentElement.remove();
    }

    async onBtnAddPlaylistClick(name, root, modal) {
        if (name == null
            || name === undefined
            || name == " "
            || name == "") {

            alert("Enter playlist name.");
            return;
        }

        await this.musicLibrary.addPlaylist(name);

        this.renderPlaylistPicker(root);

        this.closeModal(modal);
    }

    closeModal(modal) {
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
        tracksTable.className = "tracksTable";

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

            Object.keys(track).forEach((key, index) => {
                const td = document.createElement("td");
                td.className = "tdCircles";

                if (track[key] !== null) {
                    if (tracksTable.rows[0].cells[index].innerHTML == "Rating") {
                        const rating = parseInt(track[key]);

                        // TODO
                        td.addEventListener("mouseleave", e => {
                            const circles = Array.from(td.children);

                            let anyCircleClicked = false;

                            circles.forEach(circle => {
                                if (circle.clicked) {
                                    anyCircleClicked = true;
                                }
                            });

                            if (!anyCircleClicked)
                                this.colorRatingCircles(rating, td);

                        });
                        this.renderRatingCircles(track.id, td, rating);
                    }
                    else {
                        td.innerHTML = track[key];
                    }
                }
                tr.appendChild(td);
            });

            tracksTable.appendChild(tr);
        });

        let trAddTrack = document.createElement("tr");

        let td1 = document.createElement("td");
        trAddTrack.appendChild(td1);

        let tdNewTrackName = document.createElement("td");
        let newTrackNameInput = document.createElement("input");
        newTrackNameInput.placeholder = "New track name";
        tdNewTrackName.appendChild(newTrackNameInput);

        let tdArtist = document.createElement("td");
        let tdArtistInput = document.createElement("input");
        tdArtistInput.placeholder = "Artist name";
        tdArtistInput.setAttribute("list", "artists");
        tdArtist.appendChild(tdArtistInput);

        let tdArtistDatalist = document.createElement("datalist");
        tdArtist.appendChild(tdArtistDatalist);


        let tdRelease = document.createElement("td");
        let tdReleaseInput = document.createElement("input");
        tdReleaseInput.placeholder = "Release name";
        tdReleaseInput.setAttribute("list", "releases");
        tdRelease.appendChild(tdReleaseInput);

        let tdReleaseDatalist = document.createElement("datalist");
        tdRelease.appendChild(tdReleaseDatalist);

        let tdDuration = document.createElement("td");
        let tdDurationInput = document.createElement("input");
        tdDuration.appendChild(tdDurationInput);

        let tdRating = document.createElement("td");
        let tdRatingInput = document.createElement("input");
        tdRating.appendChild(tdRatingInput);

        trAddTrack.appendChild(td1);
        trAddTrack.appendChild(tdNewTrackName);
        trAddTrack.appendChild(tdArtist);
        trAddTrack.appendChild(tdRelease);
        trAddTrack.appendChild(tdDuration);
        trAddTrack.appendChild(tdRating);

        tracksTable.appendChild(trAddTrack);

        playlistSidebar.appendChild(tracksTable);
    }

    renderRatingCircles(trackId, root, rating) {
        root.innerHTML = "";
        for (let i = 0; i < 5; i++) {

            let ratingCircle = document.createElement("div");
            ratingCircle.id = `${i + 1}`;
            if (i < rating)
                ratingCircle.className = "ratingCircle";
            else
                ratingCircle.className = "emptyRatingCircle";

            ratingCircle.addEventListener("click", e => {
                e.target.clicked = true;
                this.onRatingClick(trackId, root, e.target.id);
            });

            ratingCircle.addEventListener("mouseover", e => this.colorRatingCircles(e.target.id, root));

            root.appendChild(ratingCircle);
        }
    }

    async onRatingClick(trackId, root, rating) {
        if (this.musicLibrary.changeTrackRating(trackId, rating)) {
            this.colorRatingCircles(rating, root);
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

    // renderPlaylistForm(root) {
    //     const playlistFormContainer = document.createElement("div");
    //     playlistFormContainer.className = "playlistFormContainer";
    //     root.appendChild(playlistFormContainer);
    // }

    render(root) {
        root.innerHTML = "";

        const header = document.createElement("h1");
        header.innerHTML = `${this.musicLibrary.owner}'s Music Library`;
        root.appendChild(header)


        const musicLibraryContainer = document.createElement("div");
        musicLibraryContainer.className = "musicLibraryContainer";
        root.appendChild(musicLibraryContainer);

        this.renderPlaylistPicker(musicLibraryContainer);

    }
}