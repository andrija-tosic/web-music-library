using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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

        public int? NumberOfTracks { get; set; }

        public int? Length { get; set; }

        [JsonIgnore]
        public List<PlaylistTrack> PlaylistTracks { get; set; }
        
        [Required]
        public MusicLibrary MusicLibrary { get; set; }
    }
}