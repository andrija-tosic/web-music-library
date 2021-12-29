using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class Artist
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(20)]
        public string Name { get; set; }
        
        [MaxLength(30)]
        public string LastName { get; set; }

        [Required]
        [MaxLength(50)]
        public string ArtistName { get; set; }
        public List<Release> Releases { get; set; }
    }
}