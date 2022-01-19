import { Playlist } from "../Models/Playlist.js";
import { PlaylistView } from "./PlaylistView.js";
import { MusicLibraryView } from "./MusicLibraryView.js";

export class EditPlaylistForm {
    constructor(container, playlist, musicLibraryView) {
        this.container = container;
        this.playlist = playlist;
        this.musicLibraryView = musicLibraryView;
    }

    render() {
        const editPlaylistForm = document.createElement("form");
        editPlaylistForm.className = "editPlaylistForm";

        const header = document.createElement("h2");
        header.innerHTML = "Izmeni plejlistu";

        const playlistNameLabel = document.createElement("label");
        playlistNameLabel.innerHTML = "Naziv";
        const playlistNameInput = document.createElement("input");
        playlistNameInput.setAttribute("type", "text");
        playlistNameInput.value = this.playlist.name;
        playlistNameInput.name = "name";

        const playlistDescriptionLabel = document.createElement("label");
        playlistDescriptionLabel.innerHTML = "Opis";

        const playlistDescriptionInput = document.createElement("textarea");
        playlistDescriptionInput.rows = "4";
        playlistDescriptionInput.cols = "50";
        playlistDescriptionInput.setAttribute("type", "text");
        playlistDescriptionInput.value = this.playlist.description;
        playlistDescriptionInput.name = "description";
        playlistDescriptionInput.placeholder = "Neki opis..."

        const imageInputDiv = document.createElement("div");
        imageInputDiv.className = "imageInputDiv";

        const imageInput = document.createElement("input");
        imageInput.setAttribute("type", "file");
        imageInput.className = "imageInput";

        imageInputDiv.appendChild(imageInput);

        let deleteImageBtn = document.createElement("button");
        deleteImageBtn.innerHTML = "Obrisi sliku";
        deleteImageBtn.className = "playlistDeleteBtn";
        deleteImageBtn.type = "button";

        if (this.playlist.imagePath === null
        || this.playlist.imagePath === undefined
        || this.playlist.imagePath === `./res/placeholder_image.jpg`) {
            deleteImageBtn.style.display = "none";
        }

        let imageDeleted = false;

        deleteImageBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            imageInputDiv.style.backgroundImage = `url('./res/placeholder_image.jpg')`;
            imageDeleted = true;
            deleteImageBtn.style.display = "none";
        });


        const submitBtn = document.createElement("button");
        submitBtn.setAttribute("type", "submit");
        submitBtn.className = "playlistFormBtn";
        submitBtn.innerHTML = "Sacuvaj izmene";


        const endpoint = "upload.php";
        const formData = new FormData();

        if (this.playlist.imagePath === null)
            this.playlist.imagePath = "./res/placeholder_image.jpg"

        imageInputDiv.style.backgroundImage = `url('${this.playlist.imagePath}')`;

        imageInput.addEventListener("change", (e) => {
            let reader = new FileReader();

            reader.onload = (e) => {
                imageInputDiv.style.backgroundImage = `url('${reader.result}')`;
                deleteImageBtn.style.display = "block";
            }
            reader.readAsDataURL(imageInput.files[0]);
        });

        editPlaylistForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (playlistNameInput.value == ""
                || playlistNameInput.value === null
                || playlistNameInput.value === undefined) {
                alert("Unesite naziv.");
                return;
            }

            const file = imageInput.files[0];
            formData.append("imageInput", file);

            if (file && file['type'].split('/')[0] !== 'image') {
                alert("Fajl nije slika!");
            }

            const res = await fetch(endpoint, {
                method: "post",
                body: formData
            });

            if (res.ok) {
                let imagePath;

                if (imageDeleted) {
                    //     const endpoint = `delete.php?imagePath=${this.playlist.imagePath}`;
                    //     const res = await fetch(endpoint, {
                    //         method: "GET"
                    //     });

                    //     if (res.ok) {
                    //         console.log('res ok');
                    // }
                    this.playlist.imagePath = `./res/placeholder_image.jpg`;
                }

                if (file !== undefined) {
                    imagePath = `./images/${file['name']}`
                }
                else {
                    imagePath = this.playlist.imagePath;
                }

                const formData = new FormData(editPlaylistForm);


                formData.append("id", this.playlist.id);
                formData.append("imagePath", imagePath);
                formData.append("musicLibraryId", this.playlist.musicLibraryId);
                formData.append("numberOfTracks", 0);
                formData.append("length", 0);

                for (var [key, value] of formData.entries()) {
                    console.log(key, value);
                }

                console.log(this.playlist.musicLibraryId);

                const res = await this.playlist.editPlaylist(formData);

                if (res.status == 304) {
                    alert("Nije bilo izmene.");
                }
                else if (res.ok) {
                    this.musicLibraryView.playlistView.playlist = this.playlist;
                    await this.musicLibraryView.renderPlaylistPicker();
                    await this.musicLibraryView.playlistView.removePlaylistSidebar();
                    await this.musicLibraryView.playlistView.renderPlaylistSidebar();
                }
            }
        });

        editPlaylistForm.appendChild(header);
        editPlaylistForm.appendChild(playlistNameLabel);
        editPlaylistForm.appendChild(playlistNameInput);
        editPlaylistForm.appendChild(playlistDescriptionLabel);
        editPlaylistForm.appendChild(playlistDescriptionInput);
        editPlaylistForm.appendChild(imageInputDiv);
        editPlaylistForm.appendChild(submitBtn);
        if (deleteImageBtn)
            editPlaylistForm.appendChild(deleteImageBtn);
        this.container.appendChild(editPlaylistForm);
        playlistNameInput.focus();
        playlistNameInput.select();
    }
}