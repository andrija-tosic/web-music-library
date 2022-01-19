using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    public class Playlist
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(30)]
        public string Name { get; set; }

        [MaxLength(300)]
        public string Description { get; set; }

        public string ImagePath { get; set; }

        public int? NumberOfTracks { get; set; }

        public int? Length { get; set; }

        [JsonIgnore]
        public List<PlaylistTrack> PlaylistTracks { get; set; }
        
        [Required]
        [ForeignKey("MusicLibraryId")]
        public int MusicLibraryId { get; set; }
    }
}