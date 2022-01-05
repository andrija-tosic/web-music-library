using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ArtistController : ControllerBase
    {
        private MusicLibraryContext Context { get; set; }

        public ArtistController(MusicLibraryContext context)
        {
            Context = context;
        }

        [Route("MatchArtists/{match}")]
        [HttpGet]
        public async Task<ActionResult> MatchArtists(string match)
        {
            try
            {
                if (string.IsNullOrEmpty(match) || string.IsNullOrWhiteSpace(match))
                {
                    return BadRequest("String in invalid format");
                }

                var matches = await Context.Artists.Select(a =>
                    new
                    {
                        a.Id,
                        a.ArtistName
                    })
                    .Where(a => a.ArtistName.Contains(match))
                    .ToListAsync();

                if (matches.Count == 0)
                {
                    return NotFound($"No such artists with match: {match}");
                }

                return Ok(matches);
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Route("GetArtists/{id}")]
        [HttpGet]
        public async Task<ActionResult> GetArtists(int id)
        {
            try
            {
                var artists = await Context.Artists
                .Select(a => 
                new
                {
                    a.Id,
                    a.ArtistName
                })
                .ToListAsync();

                if (artists.Count == 0)
                    return NotFound("No artists in database");

                artists.Sort((a1, a2) => a1.ArtistName.CompareTo(a2.ArtistName));
                
                return Ok(artists);
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}