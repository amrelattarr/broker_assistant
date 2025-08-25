using System.Text.Json.Serialization;

namespace BackEnd.DTOs
{
    public class CreateEgx30Dto
    {

        [JsonConverter(typeof(FlexibleTimeSpanConverter))]
        public TimeSpan Time { get; set; }
        public DateTime BorsaDate { get; set; }
        public double IndexValue { get; set; }
    }
}