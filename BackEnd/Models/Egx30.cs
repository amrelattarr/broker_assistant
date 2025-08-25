using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models
{
    public class Egx30
    {
        [Key]
        public int EgxId { get; set; }
        [Column(TypeName = "time")]
        public TimeSpan Time { get; set; }
        public DateTime BorsaDate { get; set; }
        public decimal IndexValue { get; set; }
    }
}
