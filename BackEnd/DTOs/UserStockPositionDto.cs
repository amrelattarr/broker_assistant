namespace BackEnd.DTOs
{
    public class UserStockPositionDto
    {
        public int UserId { get; set; }
        public int StockId { get; set; }
        public string? EnglishName { get; set; }
        public string? Symbol { get; set; }
        public decimal CurrentValue { get; set; }
        public int BuyPrice { get; set; }
        public int SellPrice { get; set; }
        public int ChangeAmount { get; set; }
    }
}


