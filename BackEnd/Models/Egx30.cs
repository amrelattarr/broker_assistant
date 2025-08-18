using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class Egx30
    {
        [Key]
        public int EgxId { get; set; }
        public DateTime Time { get; set; }
        public DateTime BorsaDate { get; set; }
        public decimal IndexValue { get; set; }
    }
}
