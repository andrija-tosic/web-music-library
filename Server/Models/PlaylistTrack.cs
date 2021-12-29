using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models
{
    public class PlaylistTrack
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int TrackNumber { get; set; }

        [JsonIgnore]
        public Track Track { get; set; }
        
        [JsonIgnore]
        public Playlist Playlist { get; set; }
    }
}