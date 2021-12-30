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

                return Ok(
                    await Context.Artists
                    .Select(a =>
                    new
                    {
                        a.Id,
                        a.ArtistName
                    })
                    .Where(a => a.ArtistName.Contains(match))
                    .ToListAsync()
                );
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}