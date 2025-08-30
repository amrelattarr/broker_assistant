namespace BackEnd.DTOs
{
    public class UserStockPositionDto
    {
        public int UserId { get; set; }
        public int StockId { get; set; }
        public string? EnglishName { get; set; }
        public string? Symbol { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal BuyPrice { get; set; }
        public decimal SellPrice { get; set; }
        public decimal ChangeAmount { get; set; }
        public bool IsSellOrderActive { get; set; }
        public decimal? TargetSellPrice { get; set; }
    }
}


