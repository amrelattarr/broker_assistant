using System.Text.Json.Serialization;

namespace BackEnd.DTOs
{
    public class ChatBotResponseDto
    {
        [JsonPropertyName("question")]
        public string Question { get; set; }
        
        [JsonPropertyName("referenceUsed")]
        public string ReferenceUsed { get; set; }
        
        [JsonPropertyName("adviceGiven")]
        public string AdviceGiven { get; set; }
        
        [JsonPropertyName("answer")]
        public string Answer { get; set; }
        
        [JsonPropertyName("stockId")]
        public int? StockId { get; set; }
    }
}
