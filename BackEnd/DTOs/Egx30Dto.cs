using BackEnd.Models;

namespace BackEnd.DTOs
{
    public class Egx30Dto
    {
        public int EgxId { get; set; }
        public TimeSpan Time { get; set; }
        public DateTime BorsaDate { get; set; }
        public double IndexValue { get; set; }

        public static implicit operator Egx30Dto(Egx30 v)
        {
            return new Egx30Dto
            {
                EgxId = v.EgxId,
                Time = v.Time,
                BorsaDate = v.BorsaDate,
                IndexValue = (double)v.IndexValue
            };
        }
    }
}