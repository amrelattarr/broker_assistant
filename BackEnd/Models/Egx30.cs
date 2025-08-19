using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class Egx30
    {
        [Key]
        public int EgxId { get; set; }
        public TimeSpan Time { get; set; }
        public DateTime BorsaDate { get; set; }
        public decimal IndexValue { get; set; }
    }
}
