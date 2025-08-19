namespace BackEnd.DTOs
{
    public class Egx30Dto
    {
        public int EgxId { get; set; }
        public TimeSpan Time { get; set; }
        public DateTime BorsaDate { get; set; }
        public double IndexValue { get; set; }

        public static implicit operator Egx30Dto(Egx30Dto v)
        {
            throw new NotImplementedException();
        }
    }
}