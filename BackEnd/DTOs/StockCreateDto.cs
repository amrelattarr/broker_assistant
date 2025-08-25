namespace BackEnd.DTOs
{
    
    public class StockCreateDto
    {
        public string? EnglishName { get; set; }
        public decimal Value { get; set; }
        public string? Symbol { get; set; }
        public decimal Open { get; set; }
        public decimal Close { get; set; }
        public decimal Change { get; set; }
    }
}


