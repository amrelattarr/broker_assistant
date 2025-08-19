using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;

namespace BackEnd.Controllers
{
    [ApiController] 
    [Route("api/[controller]")] 
    public class Egx30Controller : ControllerBase
    {
        private readonly AppDbContext _context;

        public Egx30Controller(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Egx30Dto>>> GetEgx30()
        {
            var egx30List = await _context.Egx30s.ToListAsync();
            var egx30DtoList = egx30List.Select(static e => new Egx30Dto
            {
                EgxId = e.EgxId,
                Time = e.Time,
                BorsaDate = e.BorsaDate,
                IndexValue = (double)e.IndexValue
            }).ToList();

            return egx30DtoList;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Egx30Dto>> GetEgx30(int id)
        {
            var egx30 = await _context.Egx30s.FindAsync(id);

            if (egx30 == null)
            {
                return NotFound();
            }

            var egx30Dto = new Egx30Dto
            {
                EgxId = egx30.EgxId,
                Time = egx30.Time,
                BorsaDate = egx30.BorsaDate,
                IndexValue = (double)egx30.IndexValue
            };

            return egx30Dto;
        }

        [HttpPost]
        public async Task<ActionResult<Egx30Dto>> PostEgx30([FromBody] CreateEgx30Dto createEgx30Dto) // Explicit [FromBody]
        {
            
            var egx30 = new Egx30
            {
                Time = createEgx30Dto.Time,
                BorsaDate = createEgx30Dto.BorsaDate,
                IndexValue = (decimal)createEgx30Dto.IndexValue
            };

            _context.Egx30s.Add(egx30);
            await _context.SaveChangesAsync();

           
            var egx30Dto = new Egx30Dto
            {
                EgxId = egx30.EgxId,
                Time = egx30.Time,
                BorsaDate = egx30.BorsaDate,
                IndexValue = (double)egx30.IndexValue
            };

            return CreatedAtAction(nameof(GetEgx30), new { id = egx30.EgxId }, egx30Dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEgx30(int id, [FromBody] Egx30Dto egx30Dto) // Example using DTO for update
        {
            if (id != egx30Dto.EgxId)
            {
                return BadRequest("ID in URL does not match ID in body.");
            }

            var egx30 = await _context.Egx30s.FindAsync(id);
            if (egx30 == null)
            {
                return NotFound();
            }

            egx30.Time = egx30Dto.Time;
            egx30.BorsaDate = egx30Dto.BorsaDate;
            egx30.IndexValue = (decimal)egx30Dto.IndexValue;

            _context.Entry(egx30).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Egx30Exists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEgx30(int id)
        {
            var egx30 = await _context.Egx30s.FindAsync(id);
            if (egx30 == null)
            {
                return NotFound();
            }

            _context.Egx30s.Remove(egx30);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool Egx30Exists(int id)
        {
            return _context.Egx30s.Any(e => e.EgxId == id);
        }
    }
}